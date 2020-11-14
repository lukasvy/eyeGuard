import {TimerService} from "./TimerService";
import {ShowWindowService} from "./ShowWindowService";
import {TrayNotificationService} from "./TrayNotificationService";

let app;

/**
 *
 */
function stop() {
    TimerService.reset();
    TrayNotificationService.stop();
    ShowWindowService.reset();
    ShowWindowService.hideAll();
}

/**
 * Reset display windows
 */
function onHideBig() {
    stop();
    restart();
}


function restart() {
    stop();
    TrayNotificationService.start();
    TimerService.setTimer(1, ShowWindowService.showNotificationWindow, true);
}

/**
 * @param electronApp
 * @param window
 */
function start(electronApp, window, t) {
    if (app)
    {
        return restart();
    }
    app = app || electronApp;
    TrayNotificationService.init(t);
    ShowWindowService.init(window);
    TimerService.setTimer(1, ShowWindowService.showNotificationWindow, true);
    // reset service once big notification was displayed
    ShowWindowService.on('finishedBig', onHideBig);
}


export const AppService = {
    start,
    stop
};