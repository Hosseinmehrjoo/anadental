<?php

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/users.php';

function ad_session_start(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    session_name('ad_user_sess');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}

function ad_is_logged_in(): bool
{
    ad_session_start();
    return !empty($_SESSION['user_id']);
}

/**
 * @return array<string, mixed>|null
 */
function ad_current_user(): ?array
{
    if (!ad_is_logged_in()) {
        return null;
    }
    return [
        'id' => (int) ($_SESSION['user_id'] ?? 0),
        'username' => (string) ($_SESSION['user_username'] ?? ''),
        'email' => (string) ($_SESSION['user_email'] ?? ''),
        'display_name' => (string) ($_SESSION['user_display_name'] ?? ''),
        'role' => (string) ($_SESSION['user_role'] ?? 'user'),
        'role_label' => ad_role_label((string) ($_SESSION['user_role'] ?? 'user')),
    ];
}

/** @deprecated use ad_current_user */
function ad_current_admin(): ?array
{
    $user = ad_current_user();
    if (!$user) {
        return null;
    }
    // Keep old shape expected by layouts
    $user['username'] = $user['display_name'] !== '' ? $user['display_name'] : $user['username'];
    return $user;
}

function ad_user_role(): string
{
    $user = ad_current_user();
    return $user ? (string) $user['role'] : '';
}

function ad_user_can(string $capability): bool
{
    $role = ad_user_role();
    if ($role === '') {
        return false;
    }
    return ad_role_can($role, $capability);
}

function ad_require_login(): void
{
    ad_users_ensure_schema();
    if (!ad_is_logged_in()) {
        header('Location: login.php');
        exit;
    }
}

/** Staff = author or admin (panel access). */
function ad_require_staff(): void
{
    ad_require_login();
    $role = ad_user_role();
    if (!ad_role_is_staff($role)) {
        ad_flash_set('err', 'شما به پنل مدیریت دسترسی ندارید.');
        header('Location: ../../account.html');
        exit;
    }
}

/**
 * @param list<string> $roles
 */
function ad_require_role(array $roles): void
{
    ad_require_login();
    $role = ad_user_role();
    if (!in_array($role, $roles, true)) {
        http_response_code(403);
        ad_flash_set('err', 'سطح دسترسی کافی نیست.');
        header('Location: index.php');
        exit;
    }
}

function ad_require_capability(string $capability): void
{
    ad_require_staff();
    if (!ad_user_can($capability)) {
        http_response_code(403);
        ad_flash_set('err', 'سطح دسترسی کافی نیست.');
        header('Location: index.php');
        exit;
    }
}

/**
 * @param array<string, mixed> $row
 */
function ad_login_as_user(array $row): void
{
    ad_session_start();
    session_regenerate_id(true);
    $_SESSION['user_id'] = (int) $row['id'];
    $_SESSION['user_username'] = (string) $row['username'];
    $_SESSION['user_email'] = (string) ($row['email'] ?? '');
    $_SESSION['user_display_name'] = (string) ($row['display_name'] ?? $row['username']);
    $_SESSION['user_role'] = (string) ($row['role'] ?? 'user');
    // Backward-compatible keys
    $_SESSION['admin_id'] = (int) $row['id'];
    $_SESSION['admin_username'] = (string) ($row['display_name'] ?? $row['username']);
}

function ad_login(string $username, string $password): bool
{
    ad_users_ensure_schema();
    $row = ad_users_find_by_login($username);
    if (!$row || !password_verify($password, (string) $row['password_hash'])) {
        return false;
    }
    if (!(int) ($row['is_active'] ?? 0)) {
        return false;
    }
    ad_login_as_user($row);
    return true;
}

function ad_logout(): void
{
    ad_session_start();
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $p = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'] ?? '', (bool) ($p['secure'] ?? false), (bool) ($p['httponly'] ?? true));
    }
    session_destroy();
}
