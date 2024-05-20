 
// ==UserScript==
// @name         ComicStudio DOOM
// @namespace    csmc.DOOM
// @version      1
// @description  DOOM in Comic Studio
// @author       AuLeStub, Bang1338 and TheoBruh of CSMC
// @match        *://*.comic.studio
// @icon         https://www.google.com/s2/favicons?sz=64&domain=comic.studio
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';
    console.log("DOOM in Comic Studio by AuLeStub, Bang1338 and TheoBruh\nComic Studio Modding Council '24\n\nDOOM by id Software.\nhttps://www.idsoftware.com")

    // load js-dos script
    const jsDosScript = document.createElement('script');
    jsDosScript.src = 'https://v8.js-dos.com/latest/js-dos.js';
    document.head.appendChild(jsDosScript);

    jsDosScript.onload = () => {
        function loadDOOM() {
            const existingCanvas = document.getElementById('comic');
            if (existingCanvas) {

                // canvas 2 div
                const divReplacement = document.createElement('div');
                divReplacement.id = 'comic';

                // maintain previous size.
                divReplacement.style.width = existingCanvas.style.width;
                divReplacement.style.height = existingCanvas.style.height;

                // replace
                existingCanvas.parentNode.replaceChild(divReplacement, existingCanvas);

                const corsProxy = 'https://cors-anywhere.herokuapp.com/';                 // CORS
                const jsDosUrl = corsProxy + 'https://earth.is-f.lat/scr/a497asoz.jsdos'; // replace this with own one. check dos.zone/studio

                Dos(divReplacement, { // Dos it.
                    url: jsDosUrl
                });

                setTimeout(() => {
                    removeElements(); // remove useless elements
                }, 1250);
            } else {
                console.error('element "comic" not found, HOW?');
            }
        }

        function removeElements() {
            // remove useless classes
            const classesToRemove = [
                'flex flex-row mb-4 -mt-4 items-center',
                'text-center mt-8',
                'sidebar'
            ];

            classesToRemove.forEach(className => {
                const elements = document.getElementsByClassName(className);
                while (elements.length > 0) {
                    elements[0].parentNode.removeChild(elements[0]);
                }
            });

            // remove useless element
            const loginElement = document.getElementById('login');
            if (loginElement) {
                loginElement.parentNode.removeChild(loginElement);
            }
        }

        function addDOOMButton() {
            // button
            const enableButton = document.createElement('button');
            enableButton.id = 'enable-DOOM';
            enableButton.textContent = 'DOOM';

            // listener
            enableButton.addEventListener('click', loadDOOM);

            // append
            const targetContainer = document.querySelector('.column.top-buttons');
            if (targetContainer) {
                targetContainer.appendChild(enableButton);
            } else {
                console.error('Target container not found');
            }
        }

        // let it load pls
        window.addEventListener('load', addDOOMButton);
    };
})();
