</main>
<footer id="colophon" class="site-footer AnaDentalFooter">
<?php readfile(__DIR__ . '/footer.ana.html'); ?>
</footer>
<?php
$modalPath = __DIR__ . '/installment-modal.fragment.html';
if (is_file($modalPath)) {
    readfile($modalPath);
}
?>
<script src="/assets/vendor/jquery.min.js?ver=3.7.1" defer></script>
<script src="/assets/bundles/ds-bundle-js-409edc9553bebdaf.js?ver=20261021i" defer></script>
<script src="/assets/js/api.js" defer></script>
<script src="/assets/js/site.js" defer></script>
</body>
</html>
