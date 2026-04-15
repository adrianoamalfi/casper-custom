/* eslint-env browser */

(function (window, document) {
    var content = document.querySelector('.gh-content');

    if (!content) {
        return;
    }

    // Fix 2: slugify unicode-safe — normalizza NFD prima di rimuovere i diacritici
    // evita che accenti italiani (à è é ì ò ù) producano ID vuoti o doppi trattini
    function slugify(text) {
        return text
            .toLowerCase()
            .trim()
            .normalize('NFD')                  // decomponi: è → e + combining grave
            .replace(/[\u0300-\u036f]/g, '')   // rimuovi i combining marks (accenti)
            .replace(/[^\w\s-]/g, '')          // rimuovi simboli residui
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    }

    function getHeadings() {
        return Array.prototype.filter.call(content.children, function (child) {
            return child.tagName === 'H2' || child.tagName === 'H3';
        });
    }

    // Fix 5: legge l'etichetta aria dal template via data-attribute invece di hardcoded
    var anchorLabel = (document.body.dataset.anchorLabel || 'Link to') + ' ';

    function enhanceHeadings(headings) {
        headings.forEach(function (heading) {
            if (heading.querySelector('.aa-heading-anchor')) {
                return;
            }

            var label = heading.textContent.trim();

            if (!label) {
                return;
            }

            heading.dataset.tocText = label;

            var anchor = document.createElement('a');
            anchor.className = 'aa-heading-anchor';
            anchor.href = '#' + heading.id;
            anchor.setAttribute('aria-label', anchorLabel + label);
            anchor.textContent = '#';

            heading.appendChild(anchor);
        });
    }

    function enhanceContentHeadings() {
        var headings = getHeadings();

        if (!headings.length) {
            return;
        }

        var usedIds = {};

        headings.forEach(function (heading) {
            var baseId = heading.id || slugify(heading.textContent);

            if (!baseId) {
                return;
            }

            var uniqueId = baseId;
            var suffix = 2;

            while (usedIds[uniqueId] || (document.getElementById(uniqueId) && document.getElementById(uniqueId) !== heading)) {
                uniqueId = baseId + '-' + suffix;
                suffix += 1;
            }

            usedIds[uniqueId] = true;
            heading.id = uniqueId;
        });

        enhanceHeadings(headings);
    }

    var progressBar = document.createElement('div');
    progressBar.id = 'aa-reading-progress';
    document.body.prepend(progressBar);

    // Fix 1: calcola scrollRange una volta sola — evita layout read (offsetTop/offsetHeight)
    // a ogni scroll event. Si ricalcola solo su resize (con debounce).
    var scrollRange = content.offsetTop + content.offsetHeight - window.innerHeight;

    function updateProgress() {
        var scrollTop = window.scrollY || window.pageYOffset;
        var progress = Math.min(Math.max(scrollTop / Math.max(scrollRange, 1), 0), 1);
        progressBar.style.width = (progress * 100) + '%';
    }

    // Fix 1: requestAnimationFrame per batching — una sola write di layout per frame
    var rafPending = false;

    function scheduleProgress() {
        if (rafPending) {
            return;
        }
        rafPending = true;
        window.requestAnimationFrame(function () {
            rafPending = false;
            updateProgress();
        });
    }

    // Fix 1: resize con debounce — ricalcola scrollRange solo quando il resize si ferma
    var resizeTimer;

    function onResize() {
        scrollRange = content.offsetTop + content.offsetHeight - window.innerHeight;
        updateProgress();
    }

    window.addEventListener('scroll', scheduleProgress, {passive: true});
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(onResize, 100);
    }, {passive: true});

    enhanceContentHeadings();
    updateProgress();
})(window, document);
