#!/usr/bin/env bash
# Daily essential backup (DB + code + image uploads; no videos). Saves locally and emails.
set -euo pipefail

ROOT_DIR="${ANA_DENTAL_ROOT:-/var/www/ana-dental}"
BACKUP_ROOT="${BACKUP_ROOT:-/var/backups/ana-dental}"
LOCK_FILE="/tmp/ana-dental-backup.lock"
COMPOSE_FILE="${ROOT_DIR}/docker-compose.yml"
TIMESTAMP="$(date +%Y-%m-%d_%H%M)"
DAY_STAMP="$(date +%Y-%m-%d)"
WORKDIR="${BACKUP_ROOT}/${DAY_STAMP}_${TIMESTAMP}"
MAIL_ENV="/etc/ana-dental/backup-mail.env"
MAX_ATTACH_MB="${BACKUP_EMAIL_MAX_ATTACH_MB:-18}"

log() { printf '[%s] %s\n' "$(date '+%F %T')" "$*"; }

# Read one key from .env without shell-eval (handles spaces and special chars).
env_get() {
  local file="$1" key="$2"
  python3 - "${file}" "${key}" <<'PY'
import sys
from pathlib import Path
path, key = Path(sys.argv[1]), sys.argv[2]
if not path.is_file():
    sys.exit(0)
for raw in path.read_text(encoding="utf-8", errors="replace").splitlines():
    line = raw.strip()
    if not line or line.startswith("#") or "=" not in line:
        continue
    k, v = line.split("=", 1)
    if k.strip() != key:
        continue
    v = v.strip()
    if len(v) >= 2 and v[0] == v[-1] and v[0] in "\"'":
        v = v[1:-1]
    sys.stdout.write(v)
    break
PY
}

mail_get() {
  local key="$1" val=""
  if [[ -f "${MAIL_ENV}" ]]; then
    val="$(env_get "${MAIL_ENV}" "${key}")"
  fi
  if [[ -z "${val}" && -f "${ROOT_DIR}/.env" ]]; then
    val="$(env_get "${ROOT_DIR}/.env" "${key}")"
  fi
  printf '%s' "${val}"
}

if [[ ! -f "${ROOT_DIR}/.env" ]]; then
  log "ERROR: missing ${ROOT_DIR}/.env"
  exit 1
fi

exec 9>"${LOCK_FILE}"
if ! flock -n 9; then
  log "Another backup is running; exit."
  exit 0
fi

mkdir -p "${WORKDIR}"
cd "${ROOT_DIR}"

DB_NAME="$(env_get "${ROOT_DIR}/.env" DB_NAME)"
DB_NAME="${DB_NAME:-ana_dental}"
DB_ROOT_PASSWORD="$(env_get "${ROOT_DIR}/.env" DB_ROOT_PASSWORD)"
if [[ -z "${DB_ROOT_PASSWORD}" ]]; then
  log "ERROR: DB_ROOT_PASSWORD missing in .env"
  exit 1
fi
BACKUP_EMAIL_TO="$(mail_get BACKUP_EMAIL_TO)"
BACKUP_EMAIL_FROM="$(mail_get BACKUP_EMAIL_FROM)"
BACKUP_SMTP_HOST="$(mail_get BACKUP_SMTP_HOST)"
BACKUP_SMTP_PORT="$(mail_get BACKUP_SMTP_PORT)"
BACKUP_SMTP_USER="$(mail_get BACKUP_SMTP_USER)"
BACKUP_SMTP_PASS="$(mail_get BACKUP_SMTP_PASS)"
BACKUP_SMTP_PASS_FILE="$(mail_get BACKUP_SMTP_PASS_FILE)"
BACKUP_SMTP_TLS="$(mail_get BACKUP_SMTP_TLS)"
SITE_URL="$(env_get "${ROOT_DIR}/.env" SITE_URL)"
MAX_ATTACH_MB="$(mail_get BACKUP_EMAIL_MAX_ATTACH_MB)"
MAX_ATTACH_MB="${MAX_ATTACH_MB:-18}"
BACKUP_SMTP_PORT="${BACKUP_SMTP_PORT:-587}"
BACKUP_SMTP_TLS="${BACKUP_SMTP_TLS:-1}"

log "Dumping database…"
docker compose -f "${COMPOSE_FILE}" exec -T -e MYSQL_PWD="${DB_ROOT_PASSWORD}" db \
  mysqldump -uroot --single-transaction --routines --triggers "${DB_NAME}" \
  | gzip -9 > "${WORKDIR}/database.sql.gz"

log "Archiving uploads (images only; videos excluded)…"
UPLOADS_VOL_NAME="$(docker volume ls -q --filter name=uploads_data | head -1)"
UPLOADS_VOL=""
if [[ -n "${UPLOADS_VOL_NAME}" ]]; then
  UPLOADS_VOL="$(docker volume inspect "${UPLOADS_VOL_NAME}" --format '{{ .Mountpoint }}' 2>/dev/null || true)"
fi
if [[ -n "${UPLOADS_VOL}" && -d "${UPLOADS_VOL}" ]]; then
  tar -czf "${WORKDIR}/uploads-images.tar.gz" -C "${UPLOADS_VOL}" \
    --exclude='./videos' \
    --exclude='./videos/*' \
    --exclude='videos' \
    --exclude='videos/*' \
    --exclude='*.mp4' \
    --exclude='*.mov' \
    --exclude='*.webm' \
    --exclude='*.m4v' \
    --exclude='*.mkv' \
    --exclude='*.avi' \
    --exclude='*.MP4' \
    --exclude='*.MOV' \
    .
else
  log "WARN: uploads volume not found; skipping uploads-images.tar.gz"
fi

log "Archiving site code (frontend + backend + deploy)…"
tar -czf "${WORKDIR}/site-code.tar.gz" \
  --exclude='frontend/site/assets/images/uploads/*' \
  --exclude='.git' \
  --exclude='node_modules' \
  frontend/site backend deploy docker-compose.yml .env.example scripts/backup

if [[ -f "${ROOT_DIR}/.env" ]]; then
  cp -a "${ROOT_DIR}/.env" "${WORKDIR}/env.server.txt"
fi

ESSENTIAL_ARCHIVE="${BACKUP_ROOT}/ana-dental-essential_${DAY_STAMP}.tar.gz"
log "Creating essential archive ${ESSENTIAL_ARCHIVE}…"
tar -czf "${ESSENTIAL_ARCHIVE}" -C "${BACKUP_ROOT}" "$(basename "${WORKDIR}")"

ESSENTIAL_SIZE="$(du -h "${ESSENTIAL_ARCHIVE}" | awk '{print $1}')"
DB_SIZE="$(du -h "${WORKDIR}/database.sql.gz" | awk '{print $1}')"
UPLOADS_SIZE="—"
if [[ -f "${WORKDIR}/uploads-images.tar.gz" ]]; then
  UPLOADS_SIZE="$(du -h "${WORKDIR}/uploads-images.tar.gz" | awk '{print $1}')"
fi
CODE_SIZE="$(du -h "${WORKDIR}/site-code.tar.gz" | awk '{print $1}')"

SITE_URL="${SITE_URL:-https://ana-dental.ir}"
ATTACHMENTS="${ESSENTIAL_ARCHIVE}"
ESSENTIAL_BYTES="$(stat -c%s "${ESSENTIAL_ARCHIVE}" 2>/dev/null || echo 0)"
MAX_BYTES="$(python3 - <<PY
print(int(float("${MAX_ATTACH_MB}") * 1024 * 1024))
PY
)"

BODY="$(cat <<EOF
بکاپ دوره‌ای (ضروری) — آنادنت

تاریخ: ${DAY_STAMP}
آدرس سایت: ${SITE_URL}

خلاصه حجم:
- دیتابیس: ${DB_SIZE}
- تصاویر آپلود (بدون ویدیو): ${UPLOADS_SIZE}
- کد سایت: ${CODE_SIZE}
- آرشیو یک‌جا: ${ESSENTIAL_ARCHIVE} (${ESSENTIAL_SIZE})

شامل می‌شود:
- دیتابیس MySQL
- تصاویر و فایل‌های سبک آپلود (پوستر، کاور بلاگ و …)
- کد frontend/site، backend، deploy و docker-compose
- فایل env سرور (داخل آرشیو)

عمداً شامل نمی‌شود: فایل‌های ویدیو (.mp4, .mov, .webm و پوشه videos)

— اسکریپت backup خودکار ana-dental
EOF
)"

if [[ "${ESSENTIAL_BYTES}" -gt "${MAX_BYTES}" ]]; then
  ATTACHMENTS="${WORKDIR}/database.sql.gz"
  BODY="${BODY}

پیوست ایمیل: فقط database.sql.gz — آرشیو ضروری ${ESSENTIAL_SIZE} از سقف ${MAX_ATTACH_MB}MB بیشتر است؛ نسخه کامل روی سرور در مسیر بالا است."
else
  BODY="${BODY}

پیوست ایمیل: آرشیو ضروری یک‌جا (${ESSENTIAL_SIZE})."
fi

if [[ -z "${BACKUP_EMAIL_TO:-}" ]]; then
  log "ERROR: BACKUP_EMAIL_TO not set (${MAIL_ENV})"
  exit 1
fi

export BACKUP_EMAIL_TO BACKUP_EMAIL_FROM BACKUP_SMTP_HOST BACKUP_SMTP_PORT
export BACKUP_SMTP_USER BACKUP_SMTP_PASS BACKUP_SMTP_PASS_FILE BACKUP_SMTP_TLS
export BACKUP_EMAIL_BODY="${BODY}"
export BACKUP_EMAIL_SUBJECT="بکاپ آنادنت — ${DAY_STAMP}"
export BACKUP_EMAIL_ATTACHMENTS="${ATTACHMENTS}"
export BACKUP_EMAIL_MAX_ATTACH_MB="${MAX_ATTACH_MB}"

log "Sending email to ${BACKUP_EMAIL_TO} via local MTA…"
if ! python3 "${ROOT_DIR}/scripts/backup/send-backup-email.py"; then
  log "ERROR: email failed; backup kept at ${ESSENTIAL_ARCHIVE}"
  exit 1
fi

sleep 3
if command -v postqueue >/dev/null 2>&1; then
  if postqueue -p 2>/dev/null | grep -qE '^[A-F0-9]'; then
    log "ERROR: Postfix queue not empty (delivery not completed); backup kept."
    postqueue -p 2>/dev/null | tail -5
    exit 1
  fi
fi

rm -rf "${WORKDIR}"
rm -f "${ESSENTIAL_ARCHIVE}"
log "Email accepted and queue empty; local backup files removed."
log "Done."
