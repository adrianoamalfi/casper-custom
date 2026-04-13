function openPhotoSwipe(items, index) {
    var pswpElement = document.querySelectorAll('.pswp')[0];

    var options = {
        bgOpacity: 0.9,
        closeOnScroll: true,
        fullscreenEl: false,
        history: false,
        index: index,
        shareEl: false,
        zoomEl: false,
        getThumbBoundsFn: function (itemIndex) {
            var thumbnail = items[itemIndex].el;
            var pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
            var rect = thumbnail.getBoundingClientRect();

            return {x: rect.left, y: rect.top + pageYScroll, w: rect.width};
        }
    };

    var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.init();
}

function getItemFromImage(image) {
    return {
        src: image.dataset.pswpSrc || image.getAttribute('src'),
        msrc: image.getAttribute('src'),
        w: image.naturalWidth || image.getAttribute('width') || image.width,
        h: image.naturalHeight || image.getAttribute('height') || image.height,
        el: image
    };
}

function lightbox(trigger) {
    var onThumbnailsClick = function (e) {
        e.preventDefault();

        var items = [];
        var index = 0;
        var target = e.target;
        var parentCard = target.closest('.kg-card');

        var prevSibling = parentCard.previousElementSibling;

        while (prevSibling && (prevSibling.classList.contains('kg-image-card') || prevSibling.classList.contains('kg-gallery-card'))) {
            var prevItems = [];

            prevSibling.querySelectorAll('img').forEach(function (item) {
                prevItems.push(getItemFromImage(item));
                index += 1;
            });
            prevSibling = prevSibling.previousElementSibling;

            items = prevItems.concat(items);
        }

        if (target.classList.contains('kg-image')) {
            items.push(getItemFromImage(target));
        } else {
            var reachedCurrentItem = false;

            target.closest('.kg-gallery-card').querySelectorAll('img').forEach(function (item) {
                items.push(getItemFromImage(item));

                if (!reachedCurrentItem && item !== target) {
                    index += 1;
                } else {
                    reachedCurrentItem = true;
                }
            });
        }

        var nextSibling = parentCard.nextElementSibling;

        while (nextSibling && (nextSibling.classList.contains('kg-image-card') || nextSibling.classList.contains('kg-gallery-card'))) {
            nextSibling.querySelectorAll('img').forEach(function (item) {
                items.push(getItemFromImage(item));
            });
            nextSibling = nextSibling.nextElementSibling;
        }

        openPhotoSwipe(items, index);
        return false;
    };

    document.querySelectorAll(trigger).forEach(function (trig) {
        trig.addEventListener('click', function (e) {
            onThumbnailsClick(e);
        });
    });
}

function standaloneLightbox(trigger) {
    document.querySelectorAll(trigger).forEach(function (image) {
        image.addEventListener('click', function (e) {
            e.preventDefault();
            openPhotoSwipe([getItemFromImage(image)], 0);
        });
    });
}

(function () {
    lightbox('.kg-image-card > .kg-image[width][height], .kg-gallery-image > img');
    standaloneLightbox('.aa-lightbox-trigger');
})();
