# قرارداد API

پایه: `/backend/api`  
پاسخ‌ها JSON با UTF-8. خطاها معمولاً `{ "ok": false, "error": "..." }` و کد HTTP مناسب.

## تماس

`POST /contact.php`

```json
{
  "name": "نام",
  "phone": "0912...",
  "email": "optional@mail.com",
  "subject": "موضوع",
  "message": "متن",
  "website": ""
}
```

`website` هانی‌پات است؛ اگر پر باشد پاسخ موفق جعلی برمی‌گردد.

موفق: `{ "ok": true, "message": "..." }`  
محدودیت نرخ: حدود ۱۰ درخواست / ۱۰ دقیقه / IP

## وبلاگ

`GET /blog.php` → فهرست  
`GET /blog.php?slug=NAMAK` → جزئیات  
`GET /blog.php?category=SLUG` → فیلتر دسته

## نظرات

`GET /comments.php?slug=NAMAK`  
`POST /comments.php` با `{ "slug", "name", "email?", "body", "website?" }`

## اقساط

`GET /installments.php?action=config`  
`GET /installments.php?action=quote&brandId=ID&quantity=N`  
`GET /installments.php?action=captcha`  
`POST /installments.php` (FormData یا JSON): `name, phone, brand_id, quantity, months, captcha_token, captcha_answer`

پاسخ ثبت لید (سازگار با مودال کلون):

```json
{ "success": true, "data": { "message": "..." } }
```
