<?php

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';

/** @var list<string> */
const AD_USER_ROLES = ['user', 'author', 'admin'];

function ad_users_ensure_schema(): void
{
    static $done = false;
    if ($done) {
        return;
    }
    $db = ad_db();
    $db->exec(
        "CREATE TABLE IF NOT EXISTS `users` (
          `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
          `username` VARCHAR(64) NOT NULL,
          `email` VARCHAR(180) NOT NULL DEFAULT '',
          `display_name` VARCHAR(120) NOT NULL DEFAULT '',
          `password_hash` VARCHAR(255) NOT NULL,
          `role` ENUM('user','author','admin') NOT NULL DEFAULT 'user',
          `is_active` TINYINT(1) NOT NULL DEFAULT 1,
          `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          `updated_at` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (`id`),
          UNIQUE KEY `uq_users_username` (`username`),
          KEY `idx_users_email` (`email`),
          KEY `idx_users_role` (`role`, `is_active`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );

    // One-time migrate legacy admins → users
    try {
        $adminTable = $db->query("SHOW TABLES LIKE 'admins'")->fetch();
        if ($adminTable) {
            $userCount = (int) $db->query('SELECT COUNT(*) FROM users')->fetchColumn();
            if ($userCount === 0) {
                $admins = $db->query('SELECT username, password_hash, created_at FROM admins')->fetchAll();
                $ins = $db->prepare(
                    'INSERT INTO users (username, email, display_name, password_hash, role, is_active, created_at)
                     VALUES (?, ?, ?, ?, \'admin\', 1, ?)'
                );
                foreach ($admins as $a) {
                    $uname = (string) ($a['username'] ?? '');
                    if ($uname === '') {
                        continue;
                    }
                    $ins->execute([
                        $uname,
                        '',
                        $uname,
                        (string) ($a['password_hash'] ?? ''),
                        $a['created_at'] ?? date('Y-m-d H:i:s'),
                    ]);
                }
            }
        }
    } catch (Throwable $e) {
        // ignore migration errors on fresh installs
    }

    $done = true;
}

function ad_role_label(string $role): string
{
    if ($role === 'admin') {
        return 'مدیر کل';
    }
    if ($role === 'author') {
        return 'نویسنده';
    }
    return 'کاربر عادی';
}

function ad_role_is_valid(string $role): bool
{
    return in_array($role, AD_USER_ROLES, true);
}

function ad_role_is_staff(string $role): bool
{
    return $role === 'admin' || $role === 'author';
}

/**
 * Capabilities by role.
 *
 * @return list<string>
 */
function ad_role_capabilities(string $role): array
{
    if ($role === 'admin') {
        return ['*'];
    }
    if ($role === 'author') {
        return ['dashboard', 'media', 'blog', 'comments'];
    }
    return ['account'];
}

function ad_role_can(string $role, string $capability): bool
{
    $caps = ad_role_capabilities($role);
    return in_array('*', $caps, true) || in_array($capability, $caps, true);
}

/**
 * @return array<string, mixed>|null
 */
function ad_users_get(int $id): ?array
{
    ad_users_ensure_schema();
    if ($id < 1) {
        return null;
    }
    $stmt = ad_db()->prepare('SELECT * FROM users WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    return $row ?: null;
}

/**
 * @return array<string, mixed>|null
 */
function ad_users_find_by_username(string $username): ?array
{
    ad_users_ensure_schema();
    $username = trim($username);
    if ($username === '') {
        return null;
    }
    $stmt = ad_db()->prepare('SELECT * FROM users WHERE username = ? LIMIT 1');
    $stmt->execute([$username]);
    $row = $stmt->fetch();
    return $row ?: null;
}

/**
 * @return array<string, mixed>|null
 */
function ad_users_find_by_login(string $login): ?array
{
    ad_users_ensure_schema();
    $login = trim($login);
    if ($login === '') {
        return null;
    }
    $stmt = ad_db()->prepare(
        'SELECT * FROM users WHERE username = ? OR (email != \'\' AND email = ?) LIMIT 1'
    );
    $stmt->execute([$login, $login]);
    $row = $stmt->fetch();
    return $row ?: null;
}

/**
 * @return list<array<string, mixed>>
 */
function ad_users_list(string $role = ''): array
{
    ad_users_ensure_schema();
    if ($role !== '' && ad_role_is_valid($role)) {
        $stmt = ad_db()->prepare(
            'SELECT id, username, email, display_name, role, is_active, created_at
             FROM users WHERE role = ? ORDER BY created_at DESC, id DESC LIMIT 500'
        );
        $stmt->execute([$role]);
        return $stmt->fetchAll();
    }
    return ad_db()->query(
        'SELECT id, username, email, display_name, role, is_active, created_at
         FROM users ORDER BY created_at DESC, id DESC LIMIT 500'
    )->fetchAll();
}

function ad_users_count_by_role(string $role = ''): int
{
    ad_users_ensure_schema();
    if ($role !== '' && ad_role_is_valid($role)) {
        $stmt = ad_db()->prepare('SELECT COUNT(*) FROM users WHERE role = ?');
        $stmt->execute([$role]);
        return (int) $stmt->fetchColumn();
    }
    return (int) ad_db()->query('SELECT COUNT(*) FROM users')->fetchColumn();
}

/**
 * @return array<string, mixed>
 */
function ad_users_create(
    string $username,
    string $password,
    string $email = '',
    string $displayName = '',
    string $role = 'user'
): array {
    ad_users_ensure_schema();
    $username = trim($username);
    $email = trim($email);
    $displayName = trim($displayName);
    if ($displayName === '') {
        $displayName = $username;
    }
    if (!ad_role_is_valid($role)) {
        $role = 'user';
    }
    if ($username === '' || mb_strlen($username) < 3 || mb_strlen($username) > 64) {
        throw new RuntimeException('نام کاربری باید بین ۳ تا ۶۴ کاراکتر باشد.');
    }
    if (!preg_match('/^[a-zA-Z0-9_\-\.]+$/u', $username)) {
        throw new RuntimeException('نام کاربری فقط می‌تواند شامل حروف انگلیسی، عدد، خط تیره و نقطه باشد.');
    }
    if (mb_strlen($password) < 6) {
        throw new RuntimeException('رمز عبور حداقل ۶ کاراکتر باشد.');
    }
    if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new RuntimeException('ایمیل معتبر نیست.');
    }
    if (mb_strlen($email) > 180 || mb_strlen($displayName) > 120) {
        throw new RuntimeException('طول فیلدها بیش از حد مجاز است.');
    }
    if (ad_users_find_by_username($username)) {
        throw new RuntimeException('این نام کاربری قبلاً ثبت شده است.');
    }
    if ($email !== '') {
        $stmt = ad_db()->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            throw new RuntimeException('این ایمیل قبلاً ثبت شده است.');
        }
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);
    $ins = ad_db()->prepare(
        'INSERT INTO users (username, email, display_name, password_hash, role, is_active)
         VALUES (?, ?, ?, ?, ?, 1)'
    );
    $ins->execute([$username, $email, $displayName, $hash, $role]);
    $id = (int) ad_db()->lastInsertId();
    $row = ad_users_get($id);
    if (!$row) {
        throw new RuntimeException('ایجاد کاربر ممکن نشد.');
    }
    return $row;
}

function ad_users_update(
    int $id,
    string $email,
    string $displayName,
    string $role,
    bool $isActive,
    string $newPassword = ''
): void {
    ad_users_ensure_schema();
    $existing = ad_users_get($id);
    if (!$existing) {
        throw new RuntimeException('کاربر یافت نشد.');
    }
    $email = trim($email);
    $displayName = trim($displayName);
    if ($displayName === '') {
        $displayName = (string) $existing['username'];
    }
    if (!ad_role_is_valid($role)) {
        throw new RuntimeException('نقش نامعتبر است.');
    }
    if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new RuntimeException('ایمیل معتبر نیست.');
    }
    if ($email !== '') {
        $stmt = ad_db()->prepare('SELECT id FROM users WHERE email = ? AND id != ? LIMIT 1');
        $stmt->execute([$email, $id]);
        if ($stmt->fetch()) {
            throw new RuntimeException('این ایمیل قبلاً ثبت شده است.');
        }
    }

    // Prevent removing the last admin
    if ((string) $existing['role'] === 'admin' && ($role !== 'admin' || !$isActive)) {
        $admins = ad_users_count_by_role('admin');
        if ($admins <= 1) {
            throw new RuntimeException('حداقل یک مدیر کل فعال باید باقی بماند.');
        }
    }

    if ($newPassword !== '') {
        if (mb_strlen($newPassword) < 6) {
            throw new RuntimeException('رمز عبور حداقل ۶ کاراکتر باشد.');
        }
        $hash = password_hash($newPassword, PASSWORD_DEFAULT);
        $stmt = ad_db()->prepare(
            'UPDATE users SET email=?, display_name=?, role=?, is_active=?, password_hash=? WHERE id=?'
        );
        $stmt->execute([$email, $displayName, $role, $isActive ? 1 : 0, $hash, $id]);
    } else {
        $stmt = ad_db()->prepare(
            'UPDATE users SET email=?, display_name=?, role=?, is_active=? WHERE id=?'
        );
        $stmt->execute([$email, $displayName, $role, $isActive ? 1 : 0, $id]);
    }
}

function ad_users_delete(int $id, int $actorId = 0): void
{
    ad_users_ensure_schema();
    if ($id < 1) {
        return;
    }
    if ($actorId > 0 && $actorId === $id) {
        throw new RuntimeException('نمی‌توانید حساب خودتان را حذف کنید.');
    }
    $existing = ad_users_get($id);
    if (!$existing) {
        return;
    }
    if ((string) $existing['role'] === 'admin') {
        $admins = ad_users_count_by_role('admin');
        if ($admins <= 1) {
            throw new RuntimeException('حداقل یک مدیر کل باید باقی بماند.');
        }
    }
    ad_db()->prepare('DELETE FROM users WHERE id = ?')->execute([$id]);
}

/**
 * @param array<string, mixed> $row
 * @return array<string, mixed>
 */
function ad_users_public(array $row): array
{
    return [
        'id' => (int) ($row['id'] ?? 0),
        'username' => (string) ($row['username'] ?? ''),
        'email' => (string) ($row['email'] ?? ''),
        'display_name' => (string) ($row['display_name'] ?? ''),
        'role' => (string) ($row['role'] ?? 'user'),
        'role_label' => ad_role_label((string) ($row['role'] ?? 'user')),
        'is_staff' => ad_role_is_staff((string) ($row['role'] ?? 'user')),
    ];
}
