/* eslint-env browser */

(function (window, document) {
    var content = document.querySelector('.gh-content');

    if (!content) {
        return;
    }

    function slugify(text) {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    }

    function getHeadings() {
        return Array.prototype.filter.call(content.children, function (child) {
            return child.tagName === 'H2' || child.tagName === 'H3';
        });
    }

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
            anchor.setAttribute('aria-label', 'Link diretto a ' + label);
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

            while (usedIds[uniqueId] || document.getElementById(uniqueId) && document.getElementById(uniqueId) !== heading) {
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

    function updateProgress() {
        var scrollTop = window.scrollY || window.pageYOffset;
        var scrollRange = content.offsetTop + content.offsetHeight - window.innerHeight;
        var progress = Math.min(Math.max(scrollTop / Math.max(scrollRange, 1), 0), 1);

        progressBar.style.width = (progress * 100) + '%';
    }

    window.addEventListener('scroll', updateProgress, {passive: true});
    window.addEventListener('resize', updateProgress, {passive: true});
    enhanceContentHeadings();
    updateProgress();
})(window, document);
