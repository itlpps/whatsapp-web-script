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

        document.getElementsByTagName('footer')[0].children[0].children[2].click();
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
    var sideBar = document.getElementById('side');
    if (sideBar == null)
        return;
    sideBar.oninput = function () {
        editRepeatButton();
    };
    var repeatButton = document.createElement('button');
    repeatButton.setAttribute("id", "repeatButton");
    repeatButton.innerHTML = 'Start Repeat';
    repeatButton.style.fontSize = '25px';
    repeatButton.style.padding = '20px';
    sideBar.append(repeatButton);
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
