#!/usr/bin/env bash
# نصب cron بکاپ هر ۳ روز روی سرور
set -euo pipefail
ROOT="${ANA_DENTAL_ROOT:-/var/www/ana-dental}"
# روزهای ۱، ۴، ۷، … ماه — ساعت ۰۳:۱۵
CRON_LINE="15 3 */3 * * ${ROOT}/scripts/backup/ana-dental-backup.sh >> /var/log/ana-dental-backup.log 2>&1"
chmod +x "${ROOT}/scripts/backup/ana-dental-backup.sh" "${ROOT}/scripts/backup/send-backup-email.py"
chmod +x "${ROOT}/deploy/backup/setup-server-smtp.sh" 2>/dev/null || true
mkdir -p /var/backups/ana-dental /var/log
touch /var/log/ana-dental-backup.log
( crontab -l 2>/dev/null | grep -v 'ana-dental-backup.sh' || true; echo "${CRON_LINE}" ) | crontab -
echo "Cron installed: ${CRON_LINE}"
