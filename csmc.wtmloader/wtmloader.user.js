// ==UserScript==
// @name         ComicStudio Watermark Loader
// @namespace    wtmloader
// @version      1
// @description  Change Watermark of Comic
// @author       Bang1338, xMaxtris of CSMC
// @match        *://*.comic.studio
// @icon         https://www.google.com/s2/favicons?sz=64&domain=comic.studio
// ==/UserScript==

(function() {
    'use strict';

    console.log("wtmloader by Bang1338, xMaxtris\nComic Studio Modding Council '24");

    // let it load pls
    window.addEventListener('load', function() {
        // finding...
        const tabs = document.querySelector('#tabs');

        if (tabs) {
            // textbox
            const textbox = document.createElement('input');
            textbox.type = 'text';
            textbox.id = 'wtmloaderTB';
            textbox.placeholder = 'Watermark';
            textbox.style.display = 'block'; // Ensure it's on a new line

            // button
            const button = document.createElement('button');
            button.id = 'wtmloaderBT';
            button.innerText = 'Submit';
            button.style.position = 'absolute';
            button.style.right = '0';

            // insert
            tabs.parentNode.insertBefore(textbox, tabs.nextSibling);

            // eek
            const parent = textbox.parentNode;
            parent.style.position = 'relative';
            parent.appendChild(button);

            // optional lol
            textbox.style.marginTop = '10px';
            button.style.marginLeft = '10px';

            // Add event listener to the button
            button.addEventListener('click', function() {
                const inputValue = textbox.value;
                if (inputValue) {

                    wtmloader(inputValue);
                } else {
                    console.log('Enter the text pls, but still doing it anyway');
                    wtmloader(inputValue);
                }
            });

            // Function to execute script based on the input value
            function wtmloader(wtm){
                console.log('Changed to ' + wtm);
                cc.watermark = wtm;
            }
        }
    });
})();