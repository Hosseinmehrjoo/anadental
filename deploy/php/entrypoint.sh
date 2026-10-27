#!/bin/sh
set -eu

CONFIG_PATH="${CONFIG_PATH:-/var/www/html/backend/config.php}"
UPLOAD_DIR="${SITE_ROOT:-/var/www/html}/assets/images/uploads"

mkdir -p "$UPLOAD_DIR"
chown -R www-data:www-data "$UPLOAD_DIR" 2>/dev/null || true

if [ ! -f "$CONFIG_PATH" ]; then
  php -r '
    $cfg = [
      "db_host" => getenv("DB_HOST") ?: "db",
      "db_port" => (int) (getenv("DB_PORT") ?: 3306),
      "db_name" => getenv("DB_NAME") ?: "ana_dental",
      "db_user" => getenv("DB_USER") ?: "ana_dental",
      "db_pass" => getenv("DB_PASS") ?: "",
      "db_charset" => "utf8mb4",
      "site_root" => getenv("SITE_ROOT") ?: "/var/www/html",
      "upload_url_prefix" => "assets/images/uploads/",
      "upload_dir" => rtrim(getenv("SITE_ROOT") ?: "/var/www/html", "/") . "/assets/images/uploads/",
      "site_name" => getenv("SITE_NAME") ?: "آنادنت",
      "site_url" => rtrim((string) (getenv("SITE_URL") ?: ""), "/"),
      "allowed_origins" => array_values(array_filter(array_map("trim", explode(",", (string) (getenv("ALLOWED_ORIGINS") ?: ""))))),
      "timezone" => getenv("TZ") ?: "Asia/Tehran",
      "trusted_proxies" => array_values(array_filter(array_map("trim", explode(",", (string) (getenv("TRUSTED_PROXIES") ?: ""))))),
    ];
    $path = getenv("CONFIG_PATH") ?: "/var/www/html/backend/config.php";
    file_put_contents($path, "<?php\nreturn " . var_export($cfg, true) . ";\n");
  '
fi

exec docker-php-entrypoint "$@"
