/* eslint-env browser */

(function (window, document) {
    var content = document.querySelector('.gh-content');
    var toc = document.getElementById('aa-post-toc');
    var tocList = document.getElementById('aa-post-toc-list');

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

    function buildToc() {
        if (!toc || !tocList) {
            return;
        }

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

            var item = document.createElement('li');
            item.className = 'aa-post-toc-item aa-post-toc-item-' + heading.tagName.toLowerCase();

            var link = document.createElement('a');
            link.className = 'aa-post-toc-link';
            link.href = '#' + uniqueId;
            link.textContent = heading.dataset.tocText || heading.textContent.trim();

            item.appendChild(link);
            tocList.appendChild(item);
        });

        if (tocList.children.length) {
            enhanceHeadings(headings);
            toc.hidden = false;
        }
    }

    function activateTocOnScroll() {
        if (!toc || toc.hidden || !tocList.children.length) {
            return;
        }

        var links = tocList.querySelectorAll('.aa-post-toc-link');
        var headings = getHeadings().filter(function (heading) {
            return Boolean(heading.id);
        });

        if (!headings.length) {
            return;
        }

        function setActive(id) {
            links.forEach(function (link) {
                link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
            });
        }

        if (window.IntersectionObserver) {
            var visibleHeadings = new Map();

            var observer = new window.IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        visibleHeadings.set(entry.target.id, entry.target.offsetTop);
                    } else {
                        visibleHeadings.delete(entry.target.id);
                    }
                });

                if (visibleHeadings.size) {
                    var activeId = Array.from(visibleHeadings.entries())
                        .sort(function (a, b) {
                            return a[1] - b[1];
                        })[0][0];

                    setActive(activeId);
                }
            }, {
                rootMargin: '-20% 0px -65% 0px',
                threshold: 0
            });

            headings.forEach(function (heading) {
                observer.observe(heading);
            });
        } else {
            function updateActiveOnScroll() {
                var activeId = headings[0].id;

                headings.forEach(function (heading) {
                    if (heading.getBoundingClientRect().top <= 140) {
                        activeId = heading.id;
                    }
                });

                setActive(activeId);
            }

            window.addEventListener('scroll', updateActiveOnScroll, {passive: true});
            updateActiveOnScroll();
        }
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
    buildToc();
    activateTocOnScroll();
    updateProgress();
})(window, document);
