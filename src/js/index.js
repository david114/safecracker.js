import 'regenerator-runtime/runtime';
import music from '../sound/music/*.AIF';
import sounds from '../sound/effects/*.mp3';
import images from '../img/*.png';

const soundButton = document.getElementById('sound-button');
const handle = document.getElementById('handle');
const switches = document.getElementsByClassName('switch');
const leds = document.getElementsByClassName('led');
const winNotice = document.getElementById('win-notice');

let switchOrder = [];
const switchOrderSolution = [0, 2, 4, 6, 1, 3, 5, 7];
const switchSound = new Audio(sounds.switch);
const safeClosedSound = new Audio(sounds.handleOff);
const safeOpenSound = new Audio(sounds.safeOpen);
const musicKeys = Object.keys(music);
const activeMusic = new Audio(music[musicKeys[Object.keys(music).length * Math.random() << 0]]);

function delay(ms, pos) {
    return new Promise((resolve) => {
        setTimeout(() => {
            switchSound.cloneNode(true).play();
            switches[pos].style.transform = 'rotate(0deg)';
            leds[pos].style.color = '#FF0000';
            leds[pos].style.textShadow = '2px 2px 20px #FF0000';
            resolve();
       }, ms);
    });
}

async function resetSwitches() {
    for (let i = switchOrder.length - 1; i >= 0; i--) {
        await delay(300, switchOrder[i]);
    }
    switchOrder = [];
}

function checkSwitchOrder() {
    for (let i = 0; i < switchOrder.length; ++i) {
        if (switchOrder[i] !== switchOrderSolution[i]) {
            resetSwitches();
        }
    }
}

for (let i = 0; i < switches.length; ++i) {
    switches[i].onclick = () => {
        if (switchOrder.includes(i) === false) {
            switchSound.cloneNode(true).play();
            switchOrder.push(i);
            switches[i].style.transform = 'rotate(180deg)';
            leds[i].style.color = '#00FF00';
            leds[i].style.textShadow = '2px 2px 20px #00FF00';
        }
        checkSwitchOrder();
    };
}

handle.onclick = () => {
    if (JSON.stringify(switchOrder) === JSON.stringify(switchOrderSolution)) {
        safeOpenSound.play();
        handle.classList.toggle('rotated225');
        setTimeout(() => {
            winNotice.style.display = 'block';
        }, 900);
    } else {
        safeClosedSound.play();
        handle.classList.toggle('rotated10');
        setTimeout(() => {
            handle.classList.toggle('rotated10');
        }, 500);
    }
};

soundButton.onclick = () => {
    if (soundButton.src.includes('Off')) {
        activeMusic.loop = true;
        activeMusic.volume = 0.05;
        activeMusic.play();
        soundButton.src = images.soundOn;
    } else {
        activeMusic.pause();
        soundButton.src = images.soundOff;
    }
};
