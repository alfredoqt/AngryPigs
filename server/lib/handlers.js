/**
 * Request handlers
 * 
 */

// Dependencies
const _data = require('./data');
const helpers = require('./helpers');

let handlers = {};

// Containers for users methods

handlers._levels = {};

handlers._levels.post = (data, callback) => {
    // Check that all fields are filled out
    const firstName =
        typeof(data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0
            ? data.payload.firstName.trim() : false;
    const lastName =
        typeof(data.payload.lastName) === 'string' && data.payload.lastName.trim().length > 0
            ? data.payload.lastName.trim() : false;
    const phone =
        typeof(data.payload.phone) === 'string' && data.payload.phone.trim().length === 10
            ? data.payload.phone.trim() : false;
    const password =
        typeof(data.payload.password) === 'string' && data.payload.password.trim().length > 0
            ? data.payload.password.trim() : false;
    const tosAgreement =
        typeof(data.payload.tosAgreement) === 'boolean' && data.payload.tosAgreement;

    if (firstName && lastName && phone && tosAgreement && password) {
        // Try to read
        _data.read('users', phone, (error, data) => {
            if (error) {
                // Hash the password
                const hashedPassword = helpers.hash(password);
                if (hashedPassword) {
                    const userObject = {
                        firstName,
                        lastName,
                        hashedPassword,
                        phone,
                        tosAgreement,
                    };
                    // Save the user
                    _data.create('users', phone, userObject, (error) => {
                        if (!error) {
                            callback(200);
                        } else {
                            callback(500, 'Could not create the new user');
                        }
                    });
                } else {
                    callback(500, { message: 'Could not hash the user\'s password' });
                }
            } else {
                // User already exists
                callback(400, { message: 'User with that phone number already exists' });
            }
        });
    } else {
        callback(400, { message: 'Missing required fields' });
    }
}

// Required: phone
// Optional: none
// TODO: Only let auth user access their object
handlers._levels.get = (data, callback) => {
    const phone =
        typeof(data.queryStringObject.phone) === 'string' && data.queryStringObject.phone.trim().length === 10
            ? data.queryStringObject.phone.trim() : false;
    if (phone) {
        _data.read('users', phone, (error, data) => {
            if (!error && data) {
                const { hashedPassword, ...userNoPassword } = data;
                callback(200, userNoPassword);
            } else {
                callback(404);
            }
        })
    } else {
        callback(400, { message: 'Missing required field' });
    }
}

// Required: phone
// Optional: firstName, lastName, password - at least one must be specified
// TODO: Only let auth user update their own object
handlers._levels.put = (data, callback) => {
    // Check for the required field
    const firstName =
        typeof(data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0
            ? data.payload.firstName.trim() : false;
    const lastName =
        typeof(data.payload.lastName) === 'string' && data.payload.lastName.trim().length > 0
            ? data.payload.lastName.trim() : false;
    const phone =
        typeof(data.payload.phone) === 'string' && data.payload.phone.trim().length === 10
            ? data.payload.phone.trim() : false;
    const password =
        typeof(data.payload.password) === 'string' && data.payload.password.trim().length > 0
            ? data.payload.password.trim() : false;
    
    if (phone) {
        // If there is at least one of the others
        if (firstName || lastName || password) {
            // Lookup the user
            _data.read('users', phone, (error, data) => {
                if (!error && data) {
                    if (firstName) {
                        data.firstName = firstName;
                    }
                    if (lastName) {
                        data.lastName = lastName;
                    }
                    if (password) {
                        const hashedPassword = helpers.hash(password);
                        if (hashedPassword) {
                            data.hashedPassword = hashedPassword;
                        } else {
                            callback(500, { message: 'Error hashing updated user\'s password' });
                        }
                    }
                    _data.update('users', phone, data, (error) => {
                        if (!error) {
                            callback(200);
                        } else {
                            callback(500, { message: 'Error updating user' });
                        }
                    });
                } else {
                    callback(400, { message: 'Specified user does not exist' });
                }
            })
        } else {
            callback(400, { message: 'Missing fields to update' });
        }
    } else {
        callback(400, { message: 'Missing required field' });
    }
}

// Required: phone
// TODO: Only let auth user delete their object
// TODO: Delete associated files
handlers._levels.delete = (data, callback) => {
    // Check for phone number validity
    const phone =
        typeof(data.queryStringObject.phone) === 'string' && data.queryStringObject.phone.trim().length === 10
            ? data.queryStringObject.phone.trim() : false;
    if (phone) {
        _data.delete('users', phone, (error) => {
            if (!error) {
                callback(200);
            } else {
                callback(500, { message: 'Could not delete specified user' });
            }
        })
    } else {
        callback(400, { message: 'Missing required field' });
    }
}

handlers.levels = (data, callback) => {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.includes(data.method)) {
        handlers._levels[data.method](data, callback);
    } else {
        // Method not allowed
        callback(405);
    }
};

handlers.ping = (data, callback) => {
    // Callback a http status code and payload
    callback(200);
};

// Not found handler
handlers.notFound = (data, callback) => {
    callback(404);
};

module.exports = handlers;
