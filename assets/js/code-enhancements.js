/* eslint-env browser */

(function (window, document) {
    if (!window.hljs) {
        return;
    }

    var codeBlocks = document.querySelectorAll('.gh-content pre code');

    if (!codeBlocks.length) {
        return;
    }

    function getLanguageLabel(codeBlock) {
        var classes = Array.from(codeBlock.classList);
        var languageClass = classes.find(function (className) {
            return className.indexOf('language-') === 0 || className.indexOf('lang-') === 0;
        });

        if (!languageClass) {
            return '';
        }

        return languageClass
            .replace(/^language-/, '')
            .replace(/^lang-/, '')
            .replace(/[-_]/g, ' ');
    }

    codeBlocks.forEach(function (codeBlock) {
        var pre = codeBlock.parentElement;

        if (!pre) {
            return;
        }

        pre.classList.add('aa-code-block');
        window.hljs.highlightElement(codeBlock);

        var language = getLanguageLabel(codeBlock);

        if (language) {
            var label = document.createElement('span');
            label.className = 'aa-code-language';
            label.textContent = language;
            pre.appendChild(label);
        }

        var copyButton = document.createElement('button');
        copyButton.className = 'aa-code-copy';
        copyButton.type = 'button';
        copyButton.textContent = 'Copia';

        copyButton.addEventListener('click', function () {
            var text = codeBlock.innerText;

            if (!navigator.clipboard) {
                return;
            }

            navigator.clipboard.writeText(text).then(function () {
                copyButton.textContent = 'Copiato';

                window.setTimeout(function () {
                    copyButton.textContent = 'Copia';
                }, 1800);
            });
        });

        pre.appendChild(copyButton);
    });
})(window, document);
