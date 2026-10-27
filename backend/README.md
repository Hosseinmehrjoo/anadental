# بک‌اند CMS سایت دندانپزشکی

PHP + MySQL — سبک‌شده از CMS آنادنت.

## فعال

- مقالات، دسته‌ها، نظرات
- رسانه
- پیام‌های تماس
- محاسبه‌گر اقساط + لید مشاوره
- کاربران/ادمین، ریدایرکت، تنظیمات SEO پایه

## غیرفعال (API → 410)

- portfolio / team / services / cookies

## API عمومی

| مسیر | توضیح |
|------|--------|
| `GET/POST /backend/api/contact.php` | فرم تماس |
| `GET /backend/api/blog.php` | فهرست/جزئیات مقاله |
| `GET/POST /backend/api/comments.php` | نظرات |
| `GET /backend/api/installments.php?action=config\|quote\|captcha` | اقساط |
| `POST /backend/api/installments.php` | ثبت لید اقساط (پاسخ شبیه WP ajax) |

پنل: `/backend/admin/`
