<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/lib/db.php';
require_once dirname(__DIR__) . '/lib/helpers.php';
require_once dirname(__DIR__) . '/lib/auth.php';
require_once dirname(__DIR__) . '/lib/users.php';

ad_cors_public();
ad_users_ensure_schema();
ad_session_start();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$action = trim((string) ($_GET['action'] ?? ''));

if ($method === 'GET' && ($action === 'me' || $action === '')) {
    $user = ad_current_user();
    if (!$user) {
        ad_json(['ok' => true, 'logged_in' => false, 'user' => null]);
    }
    ad_json([
        'ok' => true,
        'logged_in' => true,
        'user' => [
            'id' => $user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'display_name' => $user['display_name'],
            'role' => $user['role'],
            'role_label' => $user['role_label'],
            'is_staff' => ad_role_is_staff($user['role']),
            'panel_url' => ad_role_is_staff($user['role']) ? 'backend/admin/index.php' : null,
        ],
    ]);
}

if ($method === 'POST') {
    $input = ad_read_json_body();
    if (!$input) {
        $input = $_POST;
    }
    $action = trim((string) ($input['action'] ?? $action));

    if ($action === 'logout') {
        ad_logout();
        ad_json(['ok' => true, 'message' => 'خروج انجام شد.']);
    }

    if ($action === 'login') {
        $login = trim((string) ($input['username'] ?? $input['login'] ?? ''));
        $password = (string) ($input['password'] ?? '');
        if ($login === '' || $password === '') {
            ad_json(['ok' => false, 'error' => 'نام کاربری و رمز عبور الزامی است.'], 422);
        }
        // Rate-ish: simple delay not needed; verify
        if (!ad_login($login, $password)) {
            ad_json(['ok' => false, 'error' => 'نام کاربری/ایمیل یا رمز عبور اشتباه است.'], 401);
        }
        $user = ad_current_user();
        ad_json([
            'ok' => true,
            'message' => 'ورود موفق بود.',
            'user' => $user ? [
                'id' => $user['id'],
                'username' => $user['username'],
                'display_name' => $user['display_name'],
                'role' => $user['role'],
                'role_label' => $user['role_label'],
                'is_staff' => ad_role_is_staff($user['role']),
                'panel_url' => ad_role_is_staff($user['role']) ? 'backend/admin/index.php' : null,
            ] : null,
        ]);
    }

    if ($action === 'register') {
        $username = (string) ($input['username'] ?? '');
        $password = (string) ($input['password'] ?? '');
        $password2 = (string) ($input['password_confirm'] ?? $input['password2'] ?? '');
        $email = (string) ($input['email'] ?? '');
        $displayName = (string) ($input['display_name'] ?? $input['name'] ?? '');
        $honeypot = trim((string) ($input['website'] ?? ''));
        if ($honeypot !== '') {
            ad_json(['ok' => true, 'message' => 'ثبت‌نام با موفقیت انجام شد.']);
        }
        if ($password2 !== '' && $password !== $password2) {
            ad_json(['ok' => false, 'error' => 'تکرار رمز عبور مطابقت ندارد.'], 422);
        }
        try {
            // Public registration is always regular user
            $row = ad_users_create($username, $password, $email, $displayName, 'user');
            ad_login_as_user($row);
            ad_json([
                'ok' => true,
                'message' => 'ثبت‌نام با موفقیت انجام شد.',
                'user' => ad_users_public($row),
            ]);
        } catch (RuntimeException $e) {
            ad_json(['ok' => false, 'error' => $e->getMessage()], 422);
        } catch (Throwable $e) {
            ad_json(['ok' => false, 'error' => 'خطای سرور در ثبت‌نام'], 500);
        }
    }
}

ad_json(['ok' => false, 'error' => 'Method not allowed'], 405);
