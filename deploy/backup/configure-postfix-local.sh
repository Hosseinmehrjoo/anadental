#!/usr/bin/env bash
# Postfix محلی: ارسال از backup@ana-dental.ir — بدون Gmail
set -euo pipefail

MAIL_ENV="/etc/ana-dental/backup-mail.env"
PASS_FILE="/etc/ana-dental/backup-smtp.pass"
DOMAIN="ana-dental.ir"
FROM_ADDR="backup@${DOMAIN}"

echo "${DOMAIN}" > /etc/mailname

postconf -e "myhostname = ${DOMAIN}"
postconf -e "myorigin = ${DOMAIN}"
postconf -e "inet_interfaces = loopback-only"
postconf -e "inet_protocols = ipv4"
postconf -e "mydestination = localhost"
postconf -e "relayhost ="
postconf -e "smtp_generic_maps = hash:/etc/postfix/generic"
postconf -e "smtp_tls_security_level = may"

cat > /etc/postfix/generic <<EOF
root@${DOMAIN} ${FROM_ADDR}
root@ana-dental.novalocal ${FROM_ADDR}
root@localhost ${FROM_ADDR}
@ana-dental.novalocal ${FROM_ADDR}
@localhost ${FROM_ADDR}
EOF
postmap /etc/postfix/generic

RELAYHOST=""
RELAY_USER=""
if [[ -f "${MAIL_ENV}" ]]; then
  RELAYHOST="$(grep -E '^BACKUP_RELAYHOST=' "${MAIL_ENV}" | cut -d= -f2- | tr -d '"' || true)"
  RELAY_USER="$(grep -E '^BACKUP_RELAY_USER=' "${MAIL_ENV}" | cut -d= -f2- | tr -d '"' || true)"
fi

if [[ -n "${RELAYHOST}" && -s "${PASS_FILE}" ]]; then
  postconf -e "relayhost = ${RELAYHOST}"
  postconf -e "smtp_sasl_auth_enable = yes"
  postconf -e "smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd"
  postconf -e "smtp_sasl_security_options = noanonymous"
  postconf -e "smtp_tls_security_level = encrypt"
  # shellcheck disable=SC2086
  printf '%s %s\n' "${RELAYHOST}" "${RELAY_USER}:$(cat "${PASS_FILE}")" > /etc/postfix/sasl_passwd
  postmap /etc/postfix/sasl_passwd
  chmod 600 /etc/postfix/sasl_passwd /etc/postfix/sasl_passwd.db
  echo "Relay enabled: ${RELAYHOST} as ${RELAY_USER}"
else
  postconf -e "smtp_sasl_auth_enable = no"
  echo "Direct delivery (MX port 25). Optional relay: set BACKUP_RELAYHOST + mailbox password in ${PASS_FILE}"
fi

systemctl enable postfix >/dev/null 2>&1 || true
systemctl restart postfix
echo "Postfix ready (inject mail at 127.0.0.1:25)."
