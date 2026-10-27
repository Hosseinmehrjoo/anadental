#!/bin/sh
# Nginx برای پیمایش دایرکتوری به بیت execute نیاز دارد
set -eu
ROOT="$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)"
chmod -R a+rX "$ROOT/frontend/site" "$ROOT/backend" || true
mkdir -p "$ROOT/frontend/site/backend" "$ROOT/frontend/site/assets/images/uploads"
echo "permissions ok"
