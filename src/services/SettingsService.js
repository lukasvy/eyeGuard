import _ from 'underscore';
const Store = require('electron-store');
const store = new Store();

let defaultSettings = [
    {
        name             : 'small',
        timeoutSeconds   : 60 * 10,
        displayForSeconds: 30,
        text             : `Time to rest your eyes`,
        icon             : 'chronometer.png'
    },
    {
        name             : 'big',
        timeoutSeconds   : 60 * 60,
        displayForSeconds: 60 * 5,
        text             : `Time for 5 minute break`,
        icon             : 'chronometer.png'
    }
];

let settings = JSON.parse(JSON.stringify(defaultSettings));

if (!store.get('userSettings')) {
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
 * @returns {undefined|*}
 */
function get(key) {
    if (!key)
    {
        return cloneSettings();
    }
    return _.find(cloneSettings(), (setting) => setting.name === key);
}

/**
 * @param type
 * @param key
 * @param value
 * @return {Object}
 */
function set(type, key, value) {
    if (key === 'timeoutSeconds' && (value < 1 || value > 3600)) {
        return get();
    }
    if (key === 'displayForSeconds' && (value < 1 || value > 3600)) {
        return get();
    }
    if (key === 'timeoutSeconds' || key === 'displayForSeconds') {
        value = Number(value);
    }
    settings = store.get('userSettings') || settings;
    const setting = _.find(settings, (setting) => setting.name === type);
    if (setting && setting[key])
    {
        setting[key] = value;
    }
    store.set('userSettings', settings);
    return get();
}

/**
 * @returns {*}
 */
function reset()
{
    settings = JSON.parse(JSON.stringify(defaultSettings));
    store.set('userSettings', settings);
    return get();
}

function isNotDefault()
{
    return JSON.stringify(defaultSettings) !== JSON.stringify(get());
}

export const SettingsService = {
    get,
    set,
    reset,
    isNotDefault,
};