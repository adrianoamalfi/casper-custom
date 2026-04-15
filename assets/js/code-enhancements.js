/* eslint-env browser */

(function (window, document) {
    if (!window.hljs) {
        return;
    }

    var codeBlocks = document.querySelectorAll('.gh-content pre code');

    if (!codeBlocks.length) {
        return;
    }

    // Fix 3: testo del copy button letto da data-attribute nel body (impostato dal template)
    // invece di hardcoded in italiano — permette traduzioni senza toccare il JS
    var copyLabel = document.body.dataset.copyLabel || 'Copy';
    var copyDoneLabel = document.body.dataset.copyDoneLabel || 'Copied';

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
        copyButton.textContent = copyLabel;
        // Fix 3: aria-label contestuale (cosa si copia e da quale blocco)
        copyButton.setAttribute('aria-label', copyLabel + (language ? ' ' + language : '') + ' codice');

        copyButton.addEventListener('click', function () {
            var text = codeBlock.innerText;

            if (!navigator.clipboard) {
                return;
            }

            navigator.clipboard.writeText(text).then(function () {
                copyButton.textContent = copyDoneLabel;
                copyButton.setAttribute('aria-label', copyDoneLabel);

                window.setTimeout(function () {
                    copyButton.textContent = copyLabel;
                    copyButton.setAttribute('aria-label', copyLabel + (language ? ' ' + language : '') + ' codice');
                }, 1800);
            // Fix 3: catch esplicito — evita unhandled rejection se clipboard è negata o HTTP
            }).catch(function () {});
        });

        pre.appendChild(copyButton);
    });
})(window, document);
