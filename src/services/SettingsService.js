import _ from 'underscore';

const settings = {
    small: {
        timeoutSeconds   : 60 * 10,
        displayForSeconds: 10
    },
    big : {
        timeoutSeconds   : 60 * 60,
        displayForSeconds: 60 * 10
    }
};

/**
 * @param key
 * @returns {undefined|*}
 */
function get(key) {
    if (!_.isUndefined(settings[key])) {
        return Object.assign({}, settings[key]);
    }
    return undefined;
}

export const SettingsService = {
    get,
};