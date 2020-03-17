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
let pauseMessageShown = false;
let pauseSeconds = 0;
let hideWinTimeout;

ipcMain.once('pause', () => {
    if (pauseMessageShown) {
        return;
    }
    hideWindow(getShownWindow());
    // 5 minutes
    pauseSeconds =  5 * 60;
    pauseMessageShown = true;
    if (hideWinTimeout) {
        clearInterval(hideWinTimeout);
        hideWinTimeout = undefined;
    }
});
/**
 * Init Windows
 * @param parent
 */
function init(parent) {
    if (notificationWindow)
    {
        return;
    }
    const [winWidth, winHeight] = [500, 190];
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
    // small.openDevTools();
    small.on('show', function () {
        small.setBounds({
                            width : winWidth,
                            height: winHeight
                        });
    });
    small.on('closed', (event) => {
        event.preventDefault();
    });
    small.setIgnoreMouseEvents(false);
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
            window    : small,
            shown     : false,
            name      : 'small',
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
    const settings = SettingsService.get(toShow.name);
    toShow.window.webContents.send('show-data', {
        ...settings,
        showPause: !pauseMessageShown && settings.allowPausing
    });
    toShow.window.show();
    toShow.shown = true;

    notify('show', toShow);

    seconds = SettingsService.get(toShow.name).displayForSeconds || seconds || 10;
    hideWinTimeout = TimerService.setTimer(seconds, () => hideWindow(toShow));
}

/**
 * Checks whenever window is shown
 */
function isWindowShown() {
    return !!getShownWindow();
}

/**
 * @returns {undefined}
 */
function getShownWindow() {
    return _.find(notificationWindow, instance => instance.shown);
}

/**
 * @param toShow
 * @param secondsPassed
 */
function shouldShowWindow(toShow, secondsPassed) {
    if (isWindowShown() || !secondsPassed || isPaused())
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
    if (isPaused()) {
        processPauseTick();
    }
    if (!isWindowShown() && !isPaused())
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
 *
 */
function processPauseTick()
{
    if (isPaused())
    {
        pauseSeconds--;
        if (pauseSeconds === 0)
        {
            timePassed -= 1;
        }
    }
}

/**
 * @returns {boolean}
 */
function isPaused()
{
    return pauseSeconds > 0;
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
    if (isPaused() || getShownWindow() !== instance) {
        return;
    }
    notify('beforeHide', instance);
    instance.window.webContents.send('before-hide');
    instance.shown = false;
    TimerService.setTimer(1, () => {
        instance.window.webContents.send('hide');
        instance.window.hide();
        notify('hide', instance);
    });
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
    pauseMessageShown = false;
    pauseSeconds = 0;
}

export const ShowWindowService = {
    init,
    hideAll,
    reset,
    showNotificationWindow,
    on
};