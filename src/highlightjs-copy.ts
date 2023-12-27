/**
 * modified from https://github.com/arronhunt/highlightjs-copy/issues/11
 */


/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/ban-types */

class CopyButtonPlugin {

    hook!: Function | undefined;
    callback!: Function | undefined;

    /**
     * Create a new CopyButtonPlugin class instance
     * @param {Object} [options] - Functions that will be called when a copy event fires
     * @param {CopyCallback} [options.callback]
     * @param {Hook} [options.hook]
     */
    constructor({ hook, callback }: { hook?: Function | undefined, callback?: Function | undefined } = {}) {
        this.hook = hook;
        this.callback = callback;
    }
    "after:highlightElement"({ el, text }: { el: Element, text: string }) {
        // Create the copy button and append it to the codeblock.
        const button = Object.assign(document.createElement("button"), {
            innerHTML: "Copy",
            className: "hljs-copy-button animate-pulse",
        });
        button.dataset.copied = 'false';
        el.parentElement!.classList.add("hljs-copy-wrapper");
        el.parentElement!.appendChild(button);

        // Add a custom proprety to the code block so that the copy button can reference and match its background-color value.
        el.parentElement!.style.setProperty(
            "--hljs-theme-background",
            window.getComputedStyle(el).backgroundColor
        );

        button.onclick = function () {
            if (!navigator.clipboard) return;

            let newText = text;

            navigator.clipboard
                .writeText(newText)
                .then(function () {
                    button.innerHTML = "Copied!";
                    button.className = "hljs-copy-button",
                    button.dataset.copied = 'true';

                    let alert: HTMLDivElement | null = Object.assign(document.createElement("div"), {
                        role: "status",
                        className: "hljs-copy-alert",
                        innerHTML: "Copied to clipboard",
                    });
                    el.parentElement!.appendChild(alert);

                    setTimeout(() => {
                        if (alert) {
                            button.innerHTML = "Copy";
                            button.className = "hljs-copy-button animate-pulse";
                            button.dataset.copied = "false";
                            el.parentElement!.removeChild(alert);
                            alert = null;
                        }
                    }, 1500);
                });
        };
    }
}

/**
 * @typedef {function} CopyCallback
 * @param {string} text - The raw text copied to the clipboard.
 * @param {HTMLElement} el - The code block element that was copied from.
 * @returns {undefined}
 */
/**
 * @typedef {function} Hook
 * @param {string} text - The raw text copied to the clipboard.
 * @param {HTMLElement} el - The code block element that was copied from.
 * @returns {string|undefined}
 */


export default CopyButtonPlugin;
