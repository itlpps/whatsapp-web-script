// ==UserScript==
// @name         WhatsApp Web Repeater
// @namespace    none
// @version      1.0
// @description  Repeat what they tell you. - Based on https://greasyfork.org/de/scripts/36066-whatsapp-web-spammer
// @author       Italo Peruchi
// @match        https://web.whatsapp.com/*
// @grant        none
// ==/UserScript==

var lastMessageSend = '';
var message = '';
var timer = null;
var isRunning = false;

document.onclick = function () {
    createRepeatButton()
};

function doRepeat() {
    isRunning = !isRunning;
    if (isRunning) {
        lastMessageSend = message = getLastMessage();
        run();
    } else {
        window.clearInterval(timer);
    }

    changeLabelRepeatButton();
}

function run() {
    timer = window.setInterval(function () {

        var evt = new Event('input', {
            bubbles: true
        });

        var input = document.getElementsByClassName('pluggable-input-body')[0];
        message = getLastMessage()

        if (lastMessageSend == message) {
            return;
        }

        lastMessageSend = message;

        input.innerHTML = message;
        input.dispatchEvent(evt);

        document.getElementsByClassName('compose-btn-send')[0].click();
    }, 500);
}

function getLastMessage() {
    var receiveds = document.getElementsByClassName('message-in')
    var lastReceived = receiveds[receiveds.length - 1];
    return lastReceived.getElementsByClassName('selectable-text')[0].innerText;
}

function createRepeatButton() {
    if (document.getElementById('repeatButton') != null)
        return;
    var composeBar = document.getElementsByClassName('block-compose')[0];
    if (composeBar == null)
        return;
    composeBar.oninput = function () {
        editRepeatButton();
    };
    var repeatButton = document.createElement('button');
    repeatButton.setAttribute("id", "repeatButton");
    repeatButton.innerHTML = 'Start Repeat';
    repeatButton.style.fontSize = '100%';
    repeatButton.style.padding = '0px 0px 10px 10px';
    composeBar.append(repeatButton);
    editRepeatButton();
}

function editRepeatButton() {
    var repeatButton = document.getElementById('repeatButton');
    var input = document.getElementsByClassName('pluggable-input-body')[0];
    repeatButton.style.cursor = 'pointer';
    repeatButton.style.color = '#039be5';
    repeatButton.onclick = function () {
        doRepeat();
    };
}

function changeLabelRepeatButton() {
    var repeatButton = document.getElementById('repeatButton');
    repeatButton.innerHTML = isRunning ? 'Stop Repeat' : 'Start Repeat';
}
