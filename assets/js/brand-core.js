/* eslint-env browser */

(function (window, document) {
    var head = document.getElementById('gh-head');
    var backTop = document.getElementById('aa-back-top');
    var burger = document.querySelector('.gh-burger');
    var hasCover = document.body.classList.contains('has-cover');
    var root = document.documentElement;

    if (burger) {
        burger.addEventListener('click', function () {
            var isOpen = document.body.classList.toggle('gh-head-open');
            burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth >= 992 && document.body.classList.contains('gh-head-open')) {
                document.body.classList.remove('gh-head-open');
                burger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    function toggleHeader() {
        if (!head) {
            return;
        }

        head.classList.toggle('is-scrolled', window.scrollY > 50);
    }

    if (head) {
        if (hasCover) {
            var cover = document.querySelector('.site-header-content');

            if (cover && window.IntersectionObserver) {
                var observer = new window.IntersectionObserver(function (entries) {
                    head.classList.toggle('is-scrolled', !entries[0].isIntersecting);
                }, {threshold: 0});

                observer.observe(cover);
            } else {
                window.addEventListener('scroll', toggleHeader, {passive: true});
                toggleHeader();
            }
        } else {
            window.addEventListener('scroll', toggleHeader, {passive: true});
            toggleHeader();
        }
    }

    if (backTop) {
        window.addEventListener('scroll', function () {
            backTop.classList.toggle('is-visible', window.scrollY > 500);
        }, {passive: true});

        backTop.addEventListener('click', function () {
            window.scrollTo({top: 0, behavior: 'smooth'});
        });
    }

    function applyThemePreference(theme) {
        root.classList.remove('dark-mode', 'auto-color');

        if (theme === 'dark') {
            root.classList.add('dark-mode');
        } else if (theme === 'auto') {
            root.classList.add('auto-color');
        }

        root.dataset.activeColorScheme = theme;
    }

    function getInitialThemePreference() {
        var stored = null;

        try {
            stored = window.localStorage.getItem('aa-theme-preference');
        } catch (error) {}

        if (stored && ['light', 'dark', 'auto'].indexOf(stored) !== -1) {
            return stored;
        }

        return root.dataset.defaultColorScheme || 'light';
    }

    function initThemeSwitcher() {
        var switcher = document.querySelector('[data-theme-switcher]');

        if (!switcher) {
            return;
        }

        var options = switcher.querySelectorAll('[data-theme-option]');
        var currentTheme = getInitialThemePreference();

        function syncButtons(theme) {
            options.forEach(function (button) {
                var isActive = button.getAttribute('data-theme-option') === theme;

                button.classList.toggle('is-active', isActive);
                button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            });
        }

        applyThemePreference(currentTheme);
        syncButtons(currentTheme);

        options.forEach(function (button) {
            button.addEventListener('click', function () {
                var theme = button.getAttribute('data-theme-option');

                applyThemePreference(theme);
                syncButtons(theme);

                try {
                    window.localStorage.setItem('aa-theme-preference', theme);
                } catch (error) {}
            });
        });
    }

    initThemeSwitcher();

    function normalizePath(href) {
        if (!href) {
            return '';
        }

        try {
            return new window.URL(href, window.location.origin).pathname.replace(/\/+$/, '') || '/';
        } catch (error) {
            return href.replace(window.location.origin, '').replace(/\/+$/, '') || '/';
        }
    }

    function dedupeHomeFeed() {
        var featuredSections = document.querySelectorAll('.aa-home-clusters, .aa-home-photos');
        var feed = document.querySelector('.post-feed');

        if (!featuredSections.length || !feed) {
            return;
        }

        var featuredPaths = new Set();

        document.querySelectorAll('.aa-home-clusters .post-card .post-card-content-link, .aa-home-photos .aa-home-photo-thumb-link').forEach(function (link) {
            var path = normalizePath(link.getAttribute('href'));

            if (path) {
                featuredPaths.add(path);
            }
        });

        if (!featuredPaths.size) {
            return;
        }

        feed.querySelectorAll('.post-card').forEach(function (card) {
            var link = card.querySelector('.post-card-content-link, .post-card-image-link');
            var path = link ? normalizePath(link.getAttribute('href')) : '';

            if (path && featuredPaths.has(path)) {
                card.remove();
            }
        });
    }

    dedupeHomeFeed();

    var postFeed = document.querySelector('.post-feed');

    if (postFeed && document.querySelector('.aa-home-clusters, .aa-home-photos') && window.MutationObserver) {
        var feedObserver = new window.MutationObserver(function () {
            dedupeHomeFeed();
        });

        feedObserver.observe(postFeed, {childList: true});
    }
})(window, document);
