<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/lib/db.php';
require_once dirname(__DIR__) . '/lib/helpers.php';
require_once dirname(__DIR__) . '/lib/comments.php';

ad_cors_public();
ad_comments_ensure_schema();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $postId = isset($_GET['post_id']) ? (int) $_GET['post_id'] : 0;
    $slug = trim((string) ($_GET['slug'] ?? ''));

    try {
        if ($postId < 1 && $slug !== '') {
            $stmt = ad_db()->prepare(
                "SELECT id FROM blog_posts WHERE status = 'published' AND slug = ? LIMIT 1"
            );
            $stmt->execute([$slug]);
            $row = $stmt->fetch();
            $postId = $row ? (int) $row['id'] : 0;
        }
        if ($postId < 1) {
            ad_json(['ok' => false, 'error' => 'مطلب مشخص نشده است.'], 422);
        }

        $tree = ad_comments_tree_approved_for_post($postId);
        ad_json([
            'ok' => true,
            'post_id' => $postId,
            'count' => ad_comments_count_approved($postId),
            'data' => $tree,
        ]);
    } catch (Throwable $e) {
        ad_json(['ok' => false, 'error' => 'خطای سرور'], 500);
    }
}

if ($method === 'POST') {
    $input = ad_read_json_body();
    if (!$input) {
        $input = $_POST;
    }

    // Honeypot — bots fill this; humans leave it empty
    $honeypot = trim((string) ($input['website'] ?? $input['url'] ?? ''));
    if ($honeypot !== '') {
        ad_json(['ok' => true, 'message' => 'نظر شما ثبت شد و پس از تایید نمایش داده می‌شود.']);
    }

    $postId = (int) ($input['post_id'] ?? 0);
    $slug = trim((string) ($input['slug'] ?? ''));
    $parentId = (int) ($input['parent_id'] ?? $input['reply_to'] ?? 0);
    $name = (string) ($input['name'] ?? $input['author_name'] ?? '');
    $email = (string) ($input['email'] ?? $input['author_email'] ?? '');
    $body = (string) ($input['body'] ?? $input['comment'] ?? $input['message'] ?? '');

    try {
        if ($postId < 1 && $slug !== '') {
            $stmt = ad_db()->prepare(
                "SELECT id FROM blog_posts WHERE status = 'published' AND slug = ? LIMIT 1"
            );
            $stmt->execute([$slug]);
            $row = $stmt->fetch();
            $postId = $row ? (int) $row['id'] : 0;
        }
        $created = ad_comments_create($postId, $name, $email, $body, $parentId, false, false);
        $msg = $parentId > 0
            ? 'پاسخ شما ثبت شد و پس از تایید نمایش داده می‌شود.'
            : 'نظر شما ثبت شد و پس از تایید نمایش داده می‌شود.';
        ad_json([
            'ok' => true,
            'id' => $created['id'],
            'status' => $created['status'],
            'message' => $msg,
        ]);
    } catch (RuntimeException $e) {
        ad_json(['ok' => false, 'error' => $e->getMessage()], 422);
    } catch (Throwable $e) {
        ad_json(['ok' => false, 'error' => 'خطای سرور در ذخیره نظر'], 500);
    }
}

ad_json(['ok' => false, 'error' => 'Method not allowed'], 405);
