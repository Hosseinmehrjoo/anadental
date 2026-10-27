#!/bin/sh
set -eu
ROOT="$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# فقط کلیدهای ASCII ادمین را بخوان (SITE_NAME فارسی نباید source شود)
if [ -f .env ]; then
  ADMIN_USER=$(grep -E '^ADMIN_USER=' .env | cut -d= -f2- || true)
  ADMIN_PASS=$(grep -E '^ADMIN_PASS=' .env | cut -d= -f2- || true)
fi

USER_NAME="${ADMIN_USER:-admin}"
PASS="${ADMIN_PASS:-}"
if [ -z "$PASS" ]; then
  echo "ADMIN_PASS را در .env تنظیم کنید یا محیط پاس دهید." >&2
  exit 1
fi

docker compose exec -T \
  -e ADMIN_USER="$USER_NAME" \
  -e ADMIN_PASS="$PASS" \
  php php -r '
require "/var/www/html/backend/lib/db.php";
require "/var/www/html/backend/lib/users.php";
ad_users_ensure_schema();
$u = getenv("ADMIN_USER") ?: "admin";
$p = getenv("ADMIN_PASS") ?: "";
$db = ad_db();
$st = $db->prepare("SELECT id FROM users WHERE username = ? LIMIT 1");
$st->execute([$u]);
if ($st->fetch()) {
    echo "admin already exists: {$u}\n";
    exit(0);
}
$hash = password_hash($p, PASSWORD_DEFAULT);
$db->prepare("INSERT INTO users (username, email, display_name, password_hash, role, is_active) VALUES (?, ?, ?, ?, \"admin\", 1)")
   ->execute([$u, $u . "@local", $u, $hash]);
echo "admin created: {$u}\n";
'
