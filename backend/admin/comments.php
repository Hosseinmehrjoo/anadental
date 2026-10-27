<?php
declare(strict_types=1);

require_once __DIR__ . '/_init.php';
require_once dirname(__DIR__) . '/lib/comments.php';
ad_require_capability('comments');
ad_comments_ensure_schema();

$statusFilter = trim((string) ($_GET['status'] ?? ''));
if (!in_array($statusFilter, ['', 'pending', 'approved', 'spam'], true)) {
    $statusFilter = '';
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!ad_csrf_check($_POST['csrf'] ?? null)) {
        ad_flash_set('err', 'نشست نامعتبر است.');
        header('Location: comments.php' . ($statusFilter !== '' ? '?status=' . rawurlencode($statusFilter) : ''));
        exit;
    }
    $action = (string) ($_POST['action'] ?? '');
    $id = (int) ($_POST['id'] ?? 0);
    $returnStatus = trim((string) ($_POST['return_status'] ?? $statusFilter));
    $redirect = 'comments.php' . ($returnStatus !== '' ? '?status=' . rawurlencode($returnStatus) : '');
    if ($id > 0 && isset($_POST['view']) && $_POST['view'] === '1') {
        $redirect .= (strpos($redirect, '?') === false ? '?' : '&') . 'id=' . $id;
    }

    try {
        if ($action === 'approve' && $id > 0) {
            ad_comments_set_status($id, 'approved');
            ad_flash_set('ok', 'نظر تایید شد.');
        } elseif ($action === 'pending' && $id > 0) {
            ad_comments_set_status($id, 'pending');
            ad_flash_set('ok', 'نظر به حالت در انتظار برگشت.');
        } elseif ($action === 'spam' && $id > 0) {
            ad_comments_set_status($id, 'spam');
            ad_flash_set('ok', 'نظر به‌عنوان اسپم علامت خورد.');
        } elseif ($action === 'delete' && $id > 0) {
            ad_comments_delete($id);
            ad_flash_set('ok', 'نظر حذف شد.');
            $redirect = 'comments.php' . ($returnStatus !== '' ? '?status=' . rawurlencode($returnStatus) : '');
        } elseif ($action === 'reply' && $id > 0) {
            $body = trim((string) ($_POST['reply_body'] ?? ''));
            $admin = ad_current_admin();
            $staffName = 'مدیر سایت';
            if ($admin && !empty($admin['username'])) {
                $staffName = 'مدیر · ' . (string) $admin['username'];
            }
            $created = ad_comments_create_staff_reply($id, $body, $staffName);
            ad_flash_set('ok', 'پاسخ مدیر ثبت و منتشر شد.');
            $redirect = 'comments.php?id=' . (int) $id . ($returnStatus !== '' ? '&status=' . rawurlencode($returnStatus) : '');
            unset($created);
        }
    } catch (RuntimeException $e) {
        ad_flash_set('err', $e->getMessage());
        if ($id > 0) {
            $redirect = 'comments.php?id=' . $id . ($returnStatus !== '' ? '&status=' . rawurlencode($returnStatus) : '');
        }
    } catch (Throwable $e) {
        ad_flash_set('err', 'عملیات انجام نشد.');
    }
    header('Location: ' . $redirect);
    exit;
}

$viewId = isset($_GET['id']) ? (int) $_GET['id'] : 0;
$view = $viewId > 0 ? ad_comments_get($viewId) : null;
$viewReplies = [];
$viewParent = null;
if ($view) {
    $stmt = ad_db()->prepare('SELECT title, slug FROM blog_posts WHERE id = ? LIMIT 1');
    $stmt->execute([(int) $view['post_id']]);
    $post = $stmt->fetch() ?: null;
    $view['post_title'] = $post['title'] ?? '';
    $view['post_slug'] = $post['slug'] ?? '';
    if (!empty($view['parent_id'])) {
        $viewParent = ad_comments_get((int) $view['parent_id']);
    }
    $viewReplies = ad_comments_replies_admin((int) $view['id']);
}

$rows = ad_comments_admin_list($statusFilter);
$counts = [
    'all' => ad_comments_count_by_status(''),
    'pending' => ad_comments_count_by_status('pending'),
    'approved' => ad_comments_count_by_status('approved'),
    'spam' => ad_comments_count_by_status('spam'),
];

$pageTitle = 'نظرات';
require __DIR__ . '/_layout_top.php';

function ad_comment_status_label(string $status): string
{
    if ($status === 'approved') {
        return 'تاییدشده';
    }
    if ($status === 'spam') {
        return 'اسپم';
    }
    return 'در انتظار';
}
?>
<div class="page-toolbar">
  <div>
    <h1>نظرات و پاسخ‌ها</h1>
    <p class="muted" style="margin:0.35rem 0 0">کاربران می‌توانند پاسخ بدهند؛ پاسخ مدیر بلافاصله منتشر می‌شود.</p>
  </div>
</div>

<nav class="subsubsub" style="margin:0 0 1rem;display:flex;flex-wrap:wrap;gap:0.75rem;font-size:13px">
  <a href="comments.php"<?= $statusFilter === '' ? ' style="font-weight:700"' : '' ?>>همه (<?= (int) $counts['all'] ?>)</a>
  <a href="comments.php?status=pending"<?= $statusFilter === 'pending' ? ' style="font-weight:700"' : '' ?>>در انتظار (<?= (int) $counts['pending'] ?>)</a>
  <a href="comments.php?status=approved"<?= $statusFilter === 'approved' ? ' style="font-weight:700"' : '' ?>>تاییدشده (<?= (int) $counts['approved'] ?>)</a>
  <a href="comments.php?status=spam"<?= $statusFilter === 'spam' ? ' style="font-weight:700"' : '' ?>>اسپم (<?= (int) $counts['spam'] ?>)</a>
</nav>

<?php if ($view): ?>
<div class="card">
  <h2>
    <?= !empty($view['parent_id']) ? 'جزئیات پاسخ' : 'جزئیات نظر' ?>
    #<?= (int) $view['id'] ?>
    <?php if (!empty($view['is_staff'])): ?>
      <span class="badge" style="background:#e7f5ef;color:#0f7b3a">پاسخ مدیر</span>
    <?php endif; ?>
  </h2>
  <?php if ($viewParent): ?>
    <p><strong>در پاسخ به:</strong>
      <a href="comments.php?id=<?= (int) $viewParent['id'] ?><?= $statusFilter !== '' ? '&status=' . rawurlencode($statusFilter) : '' ?>">
        #<?= (int) $viewParent['id'] ?> — <?= ad_e((string) $viewParent['author_name']) ?>
      </a>
    </p>
  <?php endif; ?>
  <p><strong>نام:</strong> <?= ad_e((string) $view['author_name']) ?></p>
  <p><strong>ایمیل:</strong> <?= ad_e((string) ($view['author_email'] ?: '—')) ?></p>
  <p><strong>مطلب:</strong>
    <?php if (!empty($view['post_slug'])): ?>
      <a href="../../post/<?= rawurlencode((string) $view['post_slug']) ?>" target="_blank" rel="noopener"><?= ad_e((string) ($view['post_title'] ?: $view['post_slug'])) ?></a>
    <?php else: ?>
      <?= ad_e((string) ($view['post_title'] ?: '—')) ?>
    <?php endif; ?>
  </p>
  <p><strong>وضعیت:</strong> <?= ad_e(ad_comment_status_label((string) $view['status'])) ?></p>
  <p><strong>تاریخ:</strong> <?= ad_e((string) $view['created_at']) ?></p>
  <p style="white-space:pre-wrap;background:#f6f7f7;border:1px solid #dcdcde;padding:12px;border-radius:4px"><?= ad_e((string) $view['body']) ?></p>
  <div class="actions">
    <a class="btn btn-secondary" href="comments.php<?= $statusFilter !== '' ? '?status=' . rawurlencode($statusFilter) : '' ?>">بازگشت</a>
    <?php if (($view['status'] ?? '') !== 'approved'): ?>
      <form method="post" style="display:inline">
        <input type="hidden" name="csrf" value="<?= ad_e(ad_csrf_token()) ?>" />
        <input type="hidden" name="id" value="<?= (int) $view['id'] ?>" />
        <input type="hidden" name="action" value="approve" />
        <input type="hidden" name="return_status" value="<?= ad_e($statusFilter) ?>" />
        <input type="hidden" name="view" value="1" />
        <button class="btn" type="submit">تایید</button>
      </form>
    <?php endif; ?>
    <?php if (($view['status'] ?? '') !== 'pending'): ?>
      <form method="post" style="display:inline">
        <input type="hidden" name="csrf" value="<?= ad_e(ad_csrf_token()) ?>" />
        <input type="hidden" name="id" value="<?= (int) $view['id'] ?>" />
        <input type="hidden" name="action" value="pending" />
        <input type="hidden" name="return_status" value="<?= ad_e($statusFilter) ?>" />
        <input type="hidden" name="view" value="1" />
        <button class="btn btn-secondary" type="submit">برگرد به انتظار</button>
      </form>
    <?php endif; ?>
    <?php if (($view['status'] ?? '') !== 'spam'): ?>
      <form method="post" style="display:inline">
        <input type="hidden" name="csrf" value="<?= ad_e(ad_csrf_token()) ?>" />
        <input type="hidden" name="id" value="<?= (int) $view['id'] ?>" />
        <input type="hidden" name="action" value="spam" />
        <input type="hidden" name="return_status" value="<?= ad_e($statusFilter) ?>" />
        <input type="hidden" name="view" value="1" />
        <button class="btn btn-secondary" type="submit">اسپم</button>
      </form>
    <?php endif; ?>
    <form method="post" style="display:inline" onsubmit="return confirm('این نظر و پاسخ‌هایش حذف شوند؟');">
      <input type="hidden" name="csrf" value="<?= ad_e(ad_csrf_token()) ?>" />
      <input type="hidden" name="id" value="<?= (int) $view['id'] ?>" />
      <input type="hidden" name="action" value="delete" />
      <input type="hidden" name="return_status" value="<?= ad_e($statusFilter) ?>" />
      <button class="btn btn-danger" type="submit">حذف</button>
    </form>
  </div>
</div>

<div class="card">
  <h2>پاسخ مدیر</h2>
  <p class="muted">پاسخ شما بلافاصله در سایت منتشر می‌شود.</p>
  <form method="post">
    <input type="hidden" name="csrf" value="<?= ad_e(ad_csrf_token()) ?>" />
    <input type="hidden" name="id" value="<?= (int) $view['id'] ?>" />
    <input type="hidden" name="action" value="reply" />
    <input type="hidden" name="return_status" value="<?= ad_e($statusFilter) ?>" />
    <div class="field">
      <label for="reply_body">متن پاسخ</label>
      <textarea id="reply_body" name="reply_body" rows="4" required maxlength="2000" placeholder="پاسخ خود را بنویسید..."></textarea>
    </div>
    <div class="actions">
      <button class="btn" type="submit">ارسال پاسخ</button>
    </div>
  </form>
</div>

<?php if ($viewReplies): ?>
<div class="card">
  <h2>پاسخ‌های این نظر (<?= count($viewReplies) ?>)</h2>
  <table>
    <thead>
      <tr><th>وضعیت</th><th>نویسنده</th><th>متن</th><th>تاریخ</th><th></th></tr>
    </thead>
    <tbody>
    <?php foreach ($viewReplies as $reply):
        $rStatus = (string) ($reply['status'] ?? 'pending');
        $rExcerpt = (string) ($reply['body'] ?? '');
        if (mb_strlen($rExcerpt) > 100) {
            $rExcerpt = mb_substr($rExcerpt, 0, 99) . '…';
        }
        ?>
      <tr>
        <td>
          <?php if (!empty($reply['is_staff'])): ?>
            <span class="badge" style="background:#e7f5ef;color:#0f7b3a">مدیر</span>
          <?php endif; ?>
          <?php if ($rStatus === 'approved'): ?>
            <span class="badge">تاییدشده</span>
          <?php elseif ($rStatus === 'spam'): ?>
            <span class="badge" style="background:#fcf0f1;color:#b32d2e">اسپم</span>
          <?php else: ?>
            <span class="badge badge-unread">در انتظار</span>
          <?php endif; ?>
        </td>
        <td><?= ad_e((string) $reply['author_name']) ?></td>
        <td><?= ad_e($rExcerpt) ?></td>
        <td><?= ad_e((string) $reply['created_at']) ?></td>
        <td class="row-actions">
          <a href="comments.php?id=<?= (int) $reply['id'] ?><?= $statusFilter !== '' ? '&status=' . rawurlencode($statusFilter) : '' ?>">مشاهده</a>
        </td>
      </tr>
    <?php endforeach; ?>
    </tbody>
  </table>
</div>
<?php endif; ?>
<?php endif; ?>

<div class="card">
  <h2>لیست نظرات</h2>
  <table>
    <thead>
      <tr>
        <th>وضعیت</th>
        <th>نویسنده</th>
        <th>مطلب</th>
        <th>خلاصه</th>
        <th>تاریخ</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
    <?php if (!$rows): ?>
      <tr><td colspan="6" class="muted">نظری ثبت نشده است.</td></tr>
    <?php endif; ?>
    <?php foreach ($rows as $row):
        $status = (string) ($row['status'] ?? 'pending');
        $excerpt = (string) ($row['body'] ?? '');
        if (mb_strlen($excerpt) > 80) {
            $excerpt = mb_substr($excerpt, 0, 79) . '…';
        }
        $isReply = !empty($row['parent_id']);
        ?>
      <tr>
        <td>
          <?php if (!empty($row['is_staff'])): ?>
            <span class="badge" style="background:#e7f5ef;color:#0f7b3a">مدیر</span>
          <?php endif; ?>
          <?php if ($isReply): ?>
            <span class="badge" style="background:#f0f6fc;color:#135e96">پاسخ</span>
          <?php endif; ?>
          <?php if ($status === 'approved'): ?>
            <span class="badge">تاییدشده</span>
          <?php elseif ($status === 'spam'): ?>
            <span class="badge" style="background:#fcf0f1;color:#b32d2e">اسپم</span>
          <?php else: ?>
            <span class="badge badge-unread">در انتظار</span>
          <?php endif; ?>
        </td>
        <td>
          <strong><?= ad_e((string) $row['author_name']) ?></strong>
          <?php if ($isReply && !empty($row['parent_author'])): ?>
            <div class="muted" style="font-size:12px">↳ پاسخ به <?= ad_e((string) $row['parent_author']) ?></div>
          <?php endif; ?>
          <?php if (!empty($row['author_email'])): ?>
            <div class="muted" style="font-size:12px"><?= ad_e((string) $row['author_email']) ?></div>
          <?php endif; ?>
        </td>
        <td><?= ad_e((string) ($row['post_title'] ?: '—')) ?></td>
        <td><?= ad_e($excerpt) ?></td>
        <td><?= ad_e((string) $row['created_at']) ?></td>
        <td class="row-actions">
          <a href="comments.php?id=<?= (int) $row['id'] ?><?= $statusFilter !== '' ? '&status=' . rawurlencode($statusFilter) : '' ?>">مشاهده</a>
          <?php if ($status !== 'approved'): ?>
            <form method="post" style="display:inline">
              <input type="hidden" name="csrf" value="<?= ad_e(ad_csrf_token()) ?>" />
              <input type="hidden" name="id" value="<?= (int) $row['id'] ?>" />
              <input type="hidden" name="action" value="approve" />
              <input type="hidden" name="return_status" value="<?= ad_e($statusFilter) ?>" />
              <button type="submit">تایید</button>
            </form>
          <?php endif; ?>
          <form method="post" style="display:inline" onsubmit="return confirm('حذف شود؟');">
            <input type="hidden" name="csrf" value="<?= ad_e(ad_csrf_token()) ?>" />
            <input type="hidden" name="id" value="<?= (int) $row['id'] ?>" />
            <input type="hidden" name="action" value="delete" />
            <input type="hidden" name="return_status" value="<?= ad_e($statusFilter) ?>" />
            <button type="submit">حذف</button>
          </form>
        </td>
      </tr>
    <?php endforeach; ?>
    </tbody>
  </table>
</div>
<?php require __DIR__ . '/_layout_bottom.php'; ?>
