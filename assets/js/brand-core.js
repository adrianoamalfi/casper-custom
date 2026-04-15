/* eslint-env browser */

(function (window, document) {
    var head = document.getElementById('gh-head');
    var backTop = document.getElementById('aa-back-top');
    var burger = document.querySelector('.gh-burger');
    var hasCover = document.body.classList.contains('has-cover');
    var root = document.documentElement;

    // B3: debounce resize handler — evita firing a ogni pixel
    if (burger) {
        burger.addEventListener('click', function () {
            var isOpen = document.body.classList.toggle('gh-head-open');
            burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        var resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                if (window.innerWidth >= 992 && document.body.classList.contains('gh-head-open')) {
                    document.body.classList.remove('gh-head-open');
                    burger.setAttribute('aria-expanded', 'false');
                }
            }, 100);
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

    // B5: normalizePath robusta — ignora URL cross-origin, nessun fallback fragile
    function normalizePath(href) {
        if (!href) {
            return '';
        }

        try {
            var url = new window.URL(href, window.location.origin);
            if (url.origin !== window.location.origin) {
                return '';
            }
            return url.pathname.replace(/\/+$/, '') || '/';
        } catch (error) {
            return '';
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

    // B4: disconnect MutationObserver durante la pulizia — evita loop su card.remove()
    if (postFeed && document.querySelector('.aa-home-clusters, .aa-home-photos') && window.MutationObserver) {
        var feedObserver = new window.MutationObserver(function () {
            feedObserver.disconnect();
            dedupeHomeFeed();
            feedObserver.observe(postFeed, {childList: true});
        });

        feedObserver.observe(postFeed, {childList: true});
    }

    function initScratchpadCarousel() {
        var carousel = document.querySelector('[data-scratchpad-carousel]');
        var controls = document.querySelector('[data-scratchpad-carousel-controls]');

        if (!carousel || !controls) {
            return;
        }

        var slides = Array.prototype.slice.call(carousel.children);
        var prev = controls.querySelector('[data-scratchpad-prev]');
        var next = controls.querySelector('[data-scratchpad-next]');
        var dotsRoot = controls.querySelector('[data-scratchpad-dots]');
        var currentIndex = 0;
        var autoAdvance = null;

        // B2: rileva prefers-reduced-motion una sola volta
        var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // B1: cache del passo del carousel — evita layout thrashing a ogni scroll
        var cachedStep = 0;

        function updateCachedStep() {
            var first = slides[0];
            if (!first) {
                cachedStep = 0;
                return;
            }

            var style = window.getComputedStyle(carousel);
            var gap = parseFloat(style.columnGap || style.gap || 0);
            cachedStep = first.getBoundingClientRect().width + gap;
        }

        updateCachedStep();

        if (window.ResizeObserver) {
            new window.ResizeObserver(updateCachedStep).observe(carousel);
        } else {
            window.addEventListener('resize', updateCachedStep, {passive: true});
        }

        function setActiveDot(index) {
            Array.prototype.forEach.call(dotsRoot.children, function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
                dot.setAttribute('aria-pressed', dotIndex === index ? 'true' : 'false');
            });
        }

        // B2: rispetta prefers-reduced-motion nel comportamento di scroll
        function scrollToIndex(index, behavior) {
            if (!slides.length) {
                return;
            }

            currentIndex = (index + slides.length) % slides.length;

            carousel.scrollTo({
                left: cachedStep * currentIndex,
                behavior: prefersReduced ? 'instant' : (behavior || 'smooth')
            });

            setActiveDot(currentIndex);
        }

        // B2: non avviare auto-advance se l'utente preferisce meno movimento
        function restartAutoAdvance() {
            window.clearInterval(autoAdvance);
            if (prefersReduced) {
                return;
            }
            autoAdvance = window.setInterval(function () {
                scrollToIndex(currentIndex + 1, 'smooth');
            }, 4200);
        }

        // B6: legge l'etichetta dei dot dal template via data-attribute
        var dotLabel = (dotsRoot.dataset.dotLabel || 'Go to slide') + ' ';

        slides.forEach(function (_, index) {
            var dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'aa-scratchpad-carousel-dot' + (index === 0 ? ' is-active' : '');
            dot.setAttribute('aria-label', dotLabel + (index + 1));
            dot.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');
            dot.addEventListener('click', function () {
                scrollToIndex(index, 'smooth');
                restartAutoAdvance();
            });
            dotsRoot.appendChild(dot);
        });

        prev.addEventListener('click', function () {
            scrollToIndex(currentIndex - 1, 'smooth');
            restartAutoAdvance();
        });

        next.addEventListener('click', function () {
            scrollToIndex(currentIndex + 1, 'smooth');
            restartAutoAdvance();
        });

        // B1: usa cachedStep invece di ricalcolare getStep() a ogni scroll event
        carousel.addEventListener('scroll', function () {
            if (!cachedStep) {
                return;
            }

            currentIndex = Math.round(carousel.scrollLeft / cachedStep);
            setActiveDot(Math.max(0, Math.min(currentIndex, slides.length - 1)));
        }, {passive: true});

        carousel.addEventListener('mouseenter', function () {
            window.clearInterval(autoAdvance);
        });

        carousel.addEventListener('mouseleave', function () {
            restartAutoAdvance();
        });

        restartAutoAdvance();
    }

    initScratchpadCarousel();
})(window, document);
