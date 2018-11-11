/**
 * Helpers for various tasks
 * 
 */

// Dependencies

const helpers = {};

// Parse JSON to object, try/catch
helpers.parseJSONToObject = (str) => {
    try {
        const object = JSON.parse(str);
        return object;
    } catch (e) {
        return {};
    }
};

helpers.to = (promise) => {
    return promise
        .then(data => [null, data])
        .catch(error => [error, null]);
};

helpers.toAll = (promises) => {
    return Promise.all(promises)
        .then(data => [null, data])
        .catch(error => [error, null]);
};

module.exports = helpers;
