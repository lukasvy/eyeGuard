import {TimerService} from "./TimerService";
import _ from 'underscore';
import {SettingsService} from "./SettingsService";

const {BrowserWindow} = require('electron');
const {ipcMain} = require('electron');

let notificationWindow;
let notifications = {
    'hideBig'  : [],
    'hideSmall': [],
};
let timePassed = 0;
const tweenTime = 400;

/**
 * Init Windows
 * @param parent
 */
function init(parent) {
    if (notificationWindow)
    {
        return;
    }
    const [winWidth, winHeight] = [500, 250];
    const windowOptions = {
        width         : winWidth,
        height        : winHeight,
        show          : false,
        movable       : false,
        closable      : false,
        skipTaskbar   : true,
        frame         : false,
        alwaysOnTop   : true,
        opacity       : 0,
        hasShadow     : false,
        transparent   : true,
        titleBarStyle : 'hidden',
        modal         : true,
        parent        : parent,
        webPreferences: {
            nodeIntegration: true
        }
    };

    const small = new BrowserWindow(windowOptions);
    const big = small;

    small.on('show', function () {
        small.setBounds({width    : winWidth,
                            height: winHeight
                        });
    });
    small.on('closed', (event) => {
        event.preventDefault();
    });
    small.setIgnoreMouseEvents(true);
    small.removeMenu();
    small.loadFile('notification-window.html');

    small.on('show', () => {
        setTimeout(() => {
            small.setOpacity(1);
        }, 200);
    });
    small.on('hide', () => {
        small.setOpacity(0);
    });

    // small.openDevTools();
    notificationWindow = {
        small: {
            window: small,
            shown : false,
            name  : 'small',
        },
        big  : {
            window: big,
            shown : false,
            name  : 'big',
        }
    };
}

/**
 * Sends notification to all subscribers
 * @param what
 * @param window
 */
function notify(what, window) {
    let key = what + (window.name.charAt(0).toUpperCase() + window.name.slice(1));
    if (notifications[key])
    {
        _.each(notifications[key], call => call());
    }
}

/**
 * @param toShow
 * @param seconds
 */
function showWindow(toShow, seconds) {
    notify('beforeShow', toShow);
    toShow.window.webContents.send('show-data', SettingsService.get(toShow.name));
    toShow.window.show();
    toShow.shown = true;
    notify('show', toShow);
    seconds = SettingsService.get(toShow.name).displayForSeconds || seconds || 10;
    TimerService.setTimer(seconds, function () {
        toShow.window.webContents.send('before-hide', SettingsService.get(toShow.name));
    });
    TimerService.setTimer(seconds + 1, function () {
        hideWindow(toShow);
    });
}

/**
 * Checks whenever window is shown
 */
function isWindowShown() {
    return _.find(notificationWindow, instance => instance.shown);
}

/**
 * @param toShow
 * @param secondsPassed
 */
function shouldShowWindow(toShow, secondsPassed) {
    if (isWindowShown() || !secondsPassed)
    {
        return false;
    }
    const timeoutSeconds = SettingsService.get(toShow.name).timeoutSeconds;
    console.log(Number(secondsPassed), timeoutSeconds);
    return (Number(secondsPassed) % Number(timeoutSeconds)) === 0;
}

/**
 * @param secondsPassed
 */
function showNotificationWindow(secondsPassed) {
    if (!notificationWindow)
    {
        init();
    }
    if (!isWindowShown())
    {
        timePassed++;
    }
    if (shouldShowWindow(notificationWindow.big, timePassed))
    {
        showWindow(notificationWindow.big);
    } else if (shouldShowWindow(notificationWindow.small, timePassed))
    {
        showWindow(notificationWindow.small);
    }
}

/**
 * Hide all windows
 */
function hideAll() {
    _.forEach(notificationWindow, function (instance) {
        if (instance.shown)
        {
            hideWindow(instance);
        }
    });
}

/**
 * @param instance
 */
function hideWindow(instance) {
    notify('beforeHide', instance);
    instance.window.webContents.send('hide');
    instance.window.hide();
    instance.shown = false;
    notify('hide', instance);
}

/**
 * Notification subscriber
 * @param notification
 * @param call
 */
function on(notification, call) {
    if (!notifications)
    {
        notifications = {};
    }
    if (!notifications[notification])
    {
        notifications[notification] = [];
    }
    if (notifications[notification].lastIndexOf(call) < 0)
    {
        notifications[notification].push(call);
    }
}

/**
 * Resets seconds
 */
function reset() {
    timePassed = 0;
}

export const ShowWindowService = {
    init,
    hideAll,
    reset,
    showNotificationWindow,
    on
};