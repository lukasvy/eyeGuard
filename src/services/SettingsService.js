import _ from 'underscore';

const Store = require('electron-store');
const store = new Store();

let defaultSettings = [
    {
        name             : 'small',
        timeoutSeconds   : 60 * 15,
        displayForSeconds: 30,
        text             : `Time to rest your eyes`,
        icon             : 'chronometer.png',
        allowPausing     : false
    },
    {
        name             : 'big',
        timeoutSeconds   : 60 * 60,
        displayForSeconds: 60 * 5,
        text             : `Time for 5 minute break`,
        icon             : 'chronometer.png',
        allowPausing     : true
    }
];

let settings = JSON.parse(JSON.stringify(defaultSettings));

if (!store.get('userSettings'))
{
    store.set('userSettings', settings);
}

/**
 * @returns {any}
 */
function cloneSettings() {
    settings = store.get('userSettings') || settings;
    return JSON.parse(JSON.stringify(settings));
}

/**
 * @param key
 * @return {undefined|any}
 */
function get(key) {
    if (!key)
    {
        return cloneSettings();
    }
    return _.find(cloneSettings(), (setting) => setting.name === key);
}

/**
 * @param key
 * @returns {undefined|*}
 */
function getHumanReadable(key) {
    let settings = {};
    if (!key)
    {
        settings = cloneSettings();
        _.each(settings, (setting, key) => {
            settings[key].displayForSeconds = setHumanReadableTimeSettings(setting.displayForSeconds);
            settings[key].timeoutSeconds = setHumanReadableTimeSettings(setting.timeoutSeconds);
        });
        return settings;
    }
    settings = _.find(cloneSettings(), (setting) => setting.name === key);
    settings.timeoutSeconds = setHumanReadableTimeSettings(settings.timeoutSeconds);
    settings.displayForSeconds = setHumanReadableTimeSettings(settings.displayForSeconds);
    return settings;
}

/**
 * @param value
 * @return {String}
 */
function setHumanReadableTimeSettings(value) {
    if (value < 61) {
        return value+'s';
    }
    const minutes = parseInt(value / 60);
    const seconds = value - minutes * 60;

    return minutes+'m'+(seconds <= 0 ? '' : ' '+seconds+'s');
}

/**
 * @param type
 * @param key
 * @param value
 * @return {Object}
 */
function set(type, key, value) {
    if (key === 'timeoutSeconds' || key === 'displayForSeconds')
    {
        try
        {
            value = convertFromHumanReadableTime(value);
        } catch (e)
        {
            return getHumanReadable();
        }
        if (value < 10 || value > 3600)
        {
            return getHumanReadable();
        }
    }

    settings = store.get('userSettings') || settings;
    const setting = _.find(settings, (setting) => setting.name === type);
    if (setting)
    {
        if (key === 'allowPausing')
        {
            value = !setting.allowPausing;
        }

        setting[key] = value;
    }
    store.set('userSettings', settings);
    return getHumanReadable();
}

/**
 * @param value
 * @return {number}
 * @throws Error
 */
function convertFromHumanReadableTime(value) {
    const matches = value.match(/^\s*?(?:(\d+)\s*?(m|s))?\s*?(?:(\d+)\s*?(s))?\s*?$/i);
    let seconds = 0;
    if (matches && matches[1] && matches[2]) {
        if (matches[1] && matches[2]) {
            if (matches[2].toLowerCase() === 'm' && matches[1] < 61) {
                seconds += parseInt(matches[1]) * 60;
            }
            if (matches[2].toLowerCase() === 's' && matches[1] < 61) {
                seconds += parseInt(matches[1]);
            }
        }
        if (matches[3] && matches[4]) {
            if (matches[4].toLowerCase() === 's' && matches[3] < 61) {
                if(matches[2].toLowerCase() !== 's') {
                    seconds += parseInt(matches[3]);
                }
            }
        }
        if (seconds > 0) {
            return seconds;
        }
    }
    throw new Error('Could not find a valid time to convert to.');
}


/**
 * @returns {*}
 */
function reset() {
    settings = JSON.parse(JSON.stringify(defaultSettings));
    store.set('userSettings', settings);
    return get();
}

function isNotDefault() {
    return JSON.stringify(defaultSettings) !== JSON.stringify(get());
}

export const SettingsService = {
    get,
    getHumanReadable,
    set,
    reset,
    isNotDefault,
};