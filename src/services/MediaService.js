function importAll(r) {
    let images = {};
    r.keys().map((item, index) => {
        images[item.replace('./', '')] = r(item);
    });
    return images;
}

const images = importAll(require.context('../../public/icons', false, /\.(png|jpe?g|svg)$/));

/**
 * @param name
 * @return {*}
 */
function getImage(name) {
    return images[name];
}

export const MediaService = {
   getImage
};