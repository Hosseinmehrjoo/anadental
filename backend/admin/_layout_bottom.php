<?php
$currentScript = basename($_SERVER['SCRIPT_NAME'] ?? '');
$isLogin = $currentScript === 'login.php';
?>
<?php if (!$isLogin && ad_is_logged_in()): ?>
    </div><!-- .wrap -->
  </div><!-- #wpcontent -->
</div><!-- .admin-shell -->
<script src="media-picker.js?ver=20261014blocks" defer></script>
<script src="media-fields.js?ver=20261014blocks" defer></script>
<script src="admin-modal.js?ver=20261017zindex" defer></script>
<?php else: ?>
    </div><!-- .wrap -->
<?php endif; ?>
</body>
</html>
