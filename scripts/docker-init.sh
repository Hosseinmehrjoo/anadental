#!/bin/sh
# ایجاد مدیر اولیه — فقط یک‌بار پس از بالا آمدن دیتابیس اجرا شود
set -eu

php -r '
require "/var/www/html/backend/lib/db.php";
require "/var/www/html/backend/lib/users.php";
ad_users_ensure_schema();
$user = getenv("ADMIN_USER") ?: "admin";
$pass = getenv("ADMIN_PASS") ?: "";
if ($pass === "") { fwrite(STDERR, "ADMIN_PASS required\n"); exit(1); }
$db = ad_db();
$stmt = $db->prepare("SELECT id FROM users WHERE username = ? LIMIT 1");
$stmt->execute([$user]);
if ($stmt->fetch()) {
  echo "admin exists: {$user}\n";
  exit(0);
}
$hash = password_hash($pass, PASSWORD_DEFAULT);
$ins = $db->prepare("INSERT INTO users (username, email, display_name, password_hash, role, is_active) VALUES (?, ?, ?, ?, \"admin\", 1)");
$ins->execute([$user, $user . "@local", $user, $hash]);
echo "admin created: {$user}\n";
'
