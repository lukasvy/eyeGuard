import * as _ from 'underscore';

let timers = [];

/**
 * Set new timer
 * @param seconds
 * @param call
 * @param repeat
 */
function setTimer(seconds, call, repeat) {
    if (repeat)
    {
        let t = {
            timerStart: new Date().getTime(),
            seconds   : seconds * 1000,
            repeat    : repeat,
            call      : call,
            callBack  : () => {
                let time = Math.floor((new Date().getTime() - t.timerStart) / 1000);
                call(time);
                if (time > 10000)
                {
                    t.timerStart = new Date().getTime();
                }
            }
        };
        t.timer = setInterval(t.callBack, seconds * 1000);
        timers.push(t);
        return t.timer;
    } else
    {
        return setTimeout(call, seconds * 1000)
    }
}

/**
 * Resets all timers
 */
function reset() {
    _.each(timers, function (t) {
        clearInterval(t.timer);
    });
    timers = [];
}

/**
 * @param call
 */
function removeTimer(call) {
    const index = _.findIndex(timers, (part) => part.call === call);
    if (index > -1)
    {
        clearInterval(timers[index].timer);
        timers.splice(index, 1);
    }
}

export const TimerService = {
    setTimer,
    removeTimer,
    reset,
};