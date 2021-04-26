const nativeImage = require('electron').nativeImage;
import {ShowWindowService} from "./ShowWindowService";

const path = require("path");

let tray;
let timing = false;
let notif = false
let downloadTimer = undefined;

function humanReadableTime(seconds) {
    const d = Number(seconds);
    const h = Math.floor(d / 3600);
    const m = Math.floor(d % 3600 / 60);
    const s = Math.floor(d % 3600 % 60);

    const hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    const mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    const sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay;

}

ShowWindowService.on('countdown', (time) => {
    tray.setToolTip('Eye Guard' + (time ? ' ( ' +  humanReadableTime(time) + ' left to break ) ' : ''));
    if (!downloadTimer && time < 10) {
        let timeleft = 10;
        downloadTimer = setInterval(function () {
            if (timeleft <= 0) {
                setNormal();
                stopIntervalTimer();
            }
            notif ? setNormal() : setNotif();
            timeleft -= 1;
        }, 1000);
    }
})

function stopIntervalTimer() {
    if (downloadTimer) {
        clearInterval(downloadTimer);
        downloadTimer = undefined;
    }
}

ShowWindowService.on('show', () => {
    timing = false;
    stopIntervalTimer();
    setNotif();
})
ShowWindowService.on('finished', () => {
    timing = false;
    stopIntervalTimer();
    setNormal();
});

function init(t) {
    if (tray) {
        start();
        return;
    }
    tray = t;
}

function setNotif() {
    if (!tray) {
        return;
    }
    tray.setImage(nativeImage.createFromPath(path.join(__dirname, '..', 'public', 'icons', 'chronometer-notif256x256.png')));
    notif = true;
}

function setNormal() {
    if (!tray) {
        return;
    }
    stopIntervalTimer();
    tray.setImage(nativeImage.createFromPath(path.join(__dirname, '..', 'public', 'icons', 'chronometer256x256.png')));
    notif = false;
}

export const TrayNotificationService = {
    init,
    stop : setNormal,
    start: setNormal,
};
