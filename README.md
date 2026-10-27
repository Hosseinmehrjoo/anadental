# سایت دندانپزشکی — استقرار با Docker

فرانت‌اند کلون‌شده (HTML/CSS/JS) + بک‌اند سبک PHP/MySQL برای مدیریت محتوا، نظرات، فرم تماس و محاسبه‌گر اقساط.

## پیش‌نیاز سرور (Ubuntu 26)

```bash
sudo apt update
sudo apt install -y ca-certificates curl git
# نصب Docker رسمی:
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker "$USER"
# خروج و ورود مجدد برای اعمال گروه docker
docker --version
docker compose version
```

## تنظیم محیط

```bash
cp .env.example .env
nano .env   # رمزها، SITE_URL، نام سایت
```

متغیرهای مهم:

| متغیر | توضیح |
|--------|--------|
| `DB_PASS` / `DB_ROOT_PASSWORD` | رمز دیتابیس (قوی) |
| `SITE_URL` | آدرس عمومی مثل `https://example.com` |
| `ALLOWED_ORIGINS` | مبدأهای CORS اضافی (اختیاری) |
| `HTTP_PORT` | پورت منتشرشده روی میزبان (پیش‌فرض ۸۰۸۰) |
| `ADMIN_USER` / `ADMIN_PASS` | برای ساخت مدیر اولیه |

## راه‌اندازی

```bash
./scripts/fix-perms.sh
docker compose build
docker compose up -d
```

اگر پورت `8080` اشغال بود، در `.env` مقدار `HTTP_PORT` را عوض کنید (مثلاً `8088`).


Migration اسکیما در **اولین** بالا آمدن MySQL از `backend/install.sql` اجرا می‌شود.

### ساخت مدیر اولیه

```bash
./scripts/create-admin.sh
```

پنل: `http://SERVER:8080/backend/admin/`

## بررسی سلامت

```bash
docker compose ps
curl -I http://127.0.0.1:8080/
curl -s http://127.0.0.1:8080/backend/api/installments.php?action=config | head
curl -s -X POST http://127.0.0.1:8080/backend/api/contact.php \
  -H 'Content-Type: application/json' \
  -d '{"name":"تست","phone":"09121234567","message":"سلام"}'
```

## لاگ، Restart، Rebuild

```bash
docker compose logs -f --tail=200
docker compose restart
docker compose up -d --build
```

## بکاپ و بازیابی

```bash
# دیتابیس
docker compose exec -T db mysqldump -u root -p"$DB_ROOT_PASSWORD" ana_dental > backup-$(date +%F).sql

# رسانه‌ها
docker run --rm -v ana-dental_uploads_data:/data -v "$PWD":/backup alpine \
  tar czf /backup/uploads-$(date +%F).tar.gz -C /data .

# بازیابی DB
docker compose exec -T db mysql -u root -p"$DB_ROOT_PASSWORD" ana_dental < backup-YYYY-MM-DD.sql
```

نام volume را با `docker volume ls | grep uploads` تأیید کنید.

## دامنه و CDN پارس‌پک

1. DNS دامنه را به سرور یا CDN بدهید.
2. در پارس‌پک، Origin را روی IP سرور و پورت HTTP (یا پروکسی داخلی) تنظیم کنید.
3. HTTPS را روی CDN فعال کنید؛ به اپلیکیشن HTTP داخلی کافی است مگر اینکه TLS روی خود سرور بخواهید.
4. `SITE_URL` را روی `https://your-domain` بگذارید و stack را restart کنید.
5. صفحات عمومی (`/`, `/blog.php`, استاتیک) برای CDN قابل کش هستند.
6. مسیرهای `/backend/admin/` و `/backend/api/` را **بدون کش عمومی** نگه دارید (هدر `Cache-Control: no-store` در nginx تنظیم شده).
7. اگر CDN هدر `X-Forwarded-For` می‌فرستد، فقط به IPهای پارس‌پک اعتماد کنید (در nginx `set_real_ip_from`).

## به‌روزرسانی امن Production

```bash
git pull   # یا کپی نسخه جدید
docker compose build
docker compose up -d
# اسکیمای جدید در صورت نیاز با اسکریپت migrate جداگانه؛ install.sql فقط روی DB تازه اجرا می‌شود
docker compose exec php php -r 'require "/var/www/html/backend/lib/installments.php"; ad_installments_ensure_schema(); echo "ok\n";'
```

## ساختار سرویس‌ها

| سرویس | نقش | پورت میزبان |
|--------|------|-------------|
| `nginx` | استاتیک + reverse proxy | `HTTP_PORT` → ۸۰ |
| `php` | PHP-FPM | داخلی ۹۰۰۰ |
| `db` | MySQL 8 | **منتشر نمی‌شود** |

## قرارداد API (خلاصه)

مستندات بیشتر: `backend/README.md` و `docs/API.md`.
