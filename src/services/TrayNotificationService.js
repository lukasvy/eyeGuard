const nativeImage = require('electron').nativeImage;
import {ShowWindowService} from "./ShowWindowService";
const path = require("path");

let tray;
let timing = false;
let notif = false
let downloadTimer = undefined;

ShowWindowService.on('countdown', (time) => {
    if (!downloadTimer && time < 10)
    {
        let timeleft = 10;
        downloadTimer = setInterval(function () {
            if (timeleft <= 0)
            {
                setNormal();
                stopIntervalTimer();
            }
            notif ? setNormal() : setNotif();
            timeleft -= 1;
        }, 1000);
    }
})

function stopIntervalTimer() {
    if (downloadTimer)
    {
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
    if (tray)
    {
        start();
        return;
    }
    tray = t;
}

function setNotif() {
    if (!tray)
    {
        return;
    }
    tray.setImage(nativeImage.createFromPath(path.join(__dirname, '..', 'public', 'icons', 'chronometer-notif256x256.png')));
    notif = true;
}

function setNormal() {
    if (!tray)
    {
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