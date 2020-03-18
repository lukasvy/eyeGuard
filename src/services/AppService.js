import {TimerService} from "./TimerService";
import {ShowWindowService} from "./ShowWindowService";

let app;

/**
 *
 */
function stop()
{
    TimerService.reset();
    ShowWindowService.reset();
    ShowWindowService.hideAll();
}

/**
 * Reset display windows
 */
function onHideBig()
{
    stop();
    restart();
}


function restart()
{
    stop();
    TimerService.setTimer(1, ShowWindowService.showNotificationWindow, true);
}

/**
 * @param electronApp
 * @param window
 */
function start(electronApp, window)
{
    if (app) {
        return restart();
    }
    app = app || electronApp;
    ShowWindowService.init(window);
    TimerService.setTimer(1, ShowWindowService.showNotificationWindow, true);
    // reset service once big notification was displayed
    ShowWindowService.on('finishedBig', onHideBig);
}

export const AppService = {
    start,
    stop
};