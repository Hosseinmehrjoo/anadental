<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/lib/db.php';
require_once dirname(__DIR__) . '/lib/helpers.php';

ad_cors_public();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    ad_json(['ok' => false, 'error' => 'Method not allowed'], 405);
}

if (!ad_rate_limit('contact', 10, 600)) {
    ad_json(['ok' => false, 'error' => 'تعداد درخواست‌ها زیاد است. کمی بعد دوباره تلاش کنید.'], 429);
}

$input = ad_read_json_body();
if (!$input) {
    $input = $_POST;
}

// Honeypot
if (trim((string) ($input['website'] ?? $input['url'] ?? '')) !== '') {
    ad_json(['ok' => true, 'message' => 'پیام شما با موفقیت ثبت شد.']);
}

$name = trim((string) ($input['name'] ?? ''));
$email = trim((string) ($input['email'] ?? ''));
$phone = trim((string) ($input['phone'] ?? ''));
$subject = trim((string) ($input['subject'] ?? ''));
$message = trim((string) ($input['message'] ?? ''));

if ($name === '' || mb_strlen($name) > 120) {
    ad_json(['ok' => false, 'error' => 'نام معتبر نیست.'], 422);
}
// Appointment form on homepage may send phone-only without a long message body.
if ($message === '') {
    $message = $subject !== '' ? $subject : 'درخواست رزرو نوبت / مشاوره از فرم سایت';
}
if (mb_strlen($message) > 5000) {
    ad_json(['ok' => false, 'error' => 'متن پیام معتبر نیست.'], 422);
}
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    ad_json(['ok' => false, 'error' => 'ایمیل معتبر نیست.'], 422);
}
if ($email === '' && $phone === '') {
    ad_json(['ok' => false, 'error' => 'حداقل یکی از ایمیل یا تلفن را وارد کنید.'], 422);
}
if (mb_strlen($phone) > 40 || mb_strlen($subject) > 200 || mb_strlen($email) > 180) {
    ad_json(['ok' => false, 'error' => 'طول فیلدها بیش از حد مجاز است.'], 422);
}

try {
    $stmt = ad_db()->prepare(
        'INSERT INTO contact_messages (name, email, phone, subject, message)
         VALUES (?, ?, ?, ?, ?)'
    );
    $stmt->execute([$name, $email, $phone, $subject, $message]);
    ad_json(['ok' => true, 'message' => 'پیام شما با موفقیت ثبت شد.']);
} catch (Throwable $e) {
    ad_json(['ok' => false, 'error' => 'خطای سرور در ذخیره پیام'], 500);
}
