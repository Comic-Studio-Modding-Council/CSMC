// ==UserScript==
// @name         PGPA
// @namespace    csmc.PGPA
// @version      1.11
// @description  Encrypt message using PGP.
// @author       Bang1338, xMaxtris, WL^DBT
// @match        *://comic.studio/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=comic.studio
// @require      https://unpkg.com/openpgp@5.11.1/dist/openpgp.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log("PGPA by Bang1338, xMaxtris and WL^DBT\nComic Studio Modding Council '24\n\nUsed OpenPGP.js 5.11.1 - https://openpgpjs.org");

    let publicKey = null;

    // Helper functions to handle cookies
    function setCookie(name, value, days) {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
    }

    function getCookie(name) {
        return document.cookie.split('; ').reduce((r, v) => {
            const parts = v.split('=');
            return parts[0] === name ? decodeURIComponent(parts[1]) : r
        }, '');
    }

    window.importPGPfromText = async function(keyText) {
        try {
            const publicKeyArmored = await openpgp.readKey({ armoredKey: keyText });
            handleKeyImport(publicKeyArmored);
        } catch (e) {
            console.error("Error importing PGP key:", e);
        }
    };

    window.importPGPfromLink = async function(url) {
        try {
            const response = await fetch(url);
            const keyText = await response.text();
            await window.importPGPfromText(keyText);
        } catch (err) {
            console.error("Failed to fetch PGP key from URL:", err);
        }
    };

    function handleKeyImport(key) {
        if (key.isPrivate()) {
            console.clear(); // nah i'd blind
            alert("You're giving private key, the key is now converted to public key.");
            key = key.toPublic();
        }
        const algorithm = key.getAlgorithmInfo().algorithm;
        console.log("Key type: " + algorithm);
        if (algorithm !== "ecdsa" && algorithm !== "eddsa") { // EdDSA also a thing.
            console.warn("Key other than ECDSA or EdDSA will give bigger data, please use ECDSA or EdDSA key.");
        }
        publicKey = key;
        setCookie('pgp_public_key', key.armor(), 365);
        console.log("Public key imported successfully.");
    }

    async function encryptMessage(message, callback) {
        if (!publicKey) { // well... you know.
            alert("Public key missing.");
            return;
        }
        // TODO: If public key is not public key (aka not PGP key but other else), throw error

        try {
            const encrypted = await openpgp.encrypt({
                message: await openpgp.createMessage({ text: message }),
                encryptionKeys: publicKey
            });
            callback(encrypted);
        } catch (err) {
            alert("Encryption failed:", err);
        }
    }

    // for adding the button.
    function addEncryptButton() {
        const replyForm = document.querySelector('form[action="/messages/send"]');
        if (replyForm && !document.getElementById('encrypt')) {
            const encryptButton = document.createElement('button');
            encryptButton.className = 'btn btn-primary';
            encryptButton.id = 'encrypt';
            encryptButton.type = 'button';
            encryptButton.innerText = 'Encrypt';
            replyForm.appendChild(encryptButton);

            encryptButton.addEventListener('click', async () => {
                const messageTextarea = replyForm.querySelector('textarea[name="body"]');
                const message = messageTextarea.value;

                await encryptMessage(message, (encryptedMessage) => {
                    messageTextarea.value = encryptedMessage;
                    console.log("Message encrypted.");
                });
            });
        }
    }

    // get it from cookie
    const storedKey = getCookie('pgp_public_key');
    if (storedKey) {
        importPGPfromText(storedKey);
    }

    // screw smooth reload
    const observer = new MutationObserver(addEncryptButton);
    observer.observe(document.body, { childList: true, subtree: true });

    // just adding it
    addEncryptButton();
})();
