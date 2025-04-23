// Simple prefetch for internal links to speed up navigation

document.addEventListener('DOMContentLoaded', function () {
    // Prefetch internal pages on hover/touchstart
    function prefetch(url) {
        if (!url || url.startsWith('#') || url.startsWith('mailto:') || url.startsWith('tel:')) return;
        if (document.querySelector('link[rel="prefetch"][href="' + url + '"]')) return;
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        link.as = 'document';
        document.head.appendChild(link);
    }

    document.body.addEventListener('mouseover', function (e) {
        const a = e.target.closest('a');
        if (a && a.hostname === window.location.hostname && !a.target && !a.hasAttribute('download')) {
            prefetch(a.href);
        }
    });

    document.body.addEventListener('touchstart', function (e) {
        const a = e.target.closest('a');
        if (a && a.hostname === window.location.hostname && !a.target && !a.hasAttribute('download')) {
            prefetch(a.href);
        }
    });
});
