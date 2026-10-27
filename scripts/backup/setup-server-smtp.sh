#!/usr/bin/env bash
# تنظیم بکاپ ایمیل روی سرور — ارسال از Postfix محلی (مقصد جداگانه)
set -euo pipefail

ROOT="${ANA_DENTAL_ROOT:-/var/www/ana-dental}"
MAIL_DIR="/etc/ana-dental"
MAIL_ENV="${MAIL_DIR}/backup-mail.env"
PASS_FILE="${MAIL_DIR}/backup-smtp.pass"
TO_ADDR="${BACKUP_EMAIL_TO:-hosseinmehrjoo1@gmail.com}"
FROM_ADDR="${BACKUP_EMAIL_FROM:-backup@ana-dental.ir}"

mkdir -p "${MAIL_DIR}"
chmod 700 "${MAIL_DIR}"

cat > "${MAIL_ENV}" <<EOF
# مقصد بکاپ (مثلاً Gmail شخصی)
BACKUP_EMAIL_TO=${TO_ADDR}
# فرستنده روی دامنه سایت (Postfix محلی)
BACKUP_EMAIL_FROM=${FROM_ADDR}
# تزریق به MTA همین سرور
BACKUP_SMTP_HOST=127.0.0.1
BACKUP_SMTP_PORT=25
BACKUP_SMTP_TLS=0
BACKUP_SMTP_USER=
BACKUP_EMAIL_MAX_ATTACH_MB=18
# اختیاری: اگر هاست ایمیل SMTP رله را برای IP سرور باز کردید:
# BACKUP_RELAYHOST=[mail.ana-dental.ir]:587
# BACKUP_RELAY_USER=backup@ana-dental.ir
EOF
chmod 600 "${MAIL_ENV}"

if [[ ! -f "${PASS_FILE}" ]]; then
  install -m 600 /dev/null "${PASS_FILE}"
fi

chmod +x "${ROOT}/deploy/backup/configure-postfix-local.sh"
"${ROOT}/deploy/backup/configure-postfix-local.sh"

echo "Wrote ${MAIL_ENV}"
echo "ارسال: Postfix روی این سرور → ${FROM_ADDR}"
echo "مقصد: ${TO_ADDR}"
