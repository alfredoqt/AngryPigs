/**
 * Util for storing and editing data
 * 
 */

// Dependencies
const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');

const lib = {};

lib.baseDir = path.join(__dirname, '/../.data/');

lib.create = (dir, file, data) => {
    return new Promise((resolve, reject) => {
        fs.open(lib.baseDir + dir + '/' + file + '.json', 'wx', (error, fileDescriptor) => {
            if (!error && fileDescriptor) {
                // Conver data to string
                const stringData = JSON.stringify(data);
    
                // Write to file, and close it
                fs.writeFile(fileDescriptor, stringData, (error) => {
                    if (!error) {
                        fs.close(fileDescriptor, (error) => {
                            if (!error) {
                                resolve();
                            } else {
                                reject({ message: 'Error closing file.' });
                            }
                        });
                    } else {
                        reject({ message: 'Error writing to new file.' });
                    }
                });
            } else {
                reject({ message: 'Could not create new file, it may already exist' });                
            }
        });
    });
};

lib.read = (dir, file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(lib.baseDir + dir + '/' + file + '.json', { encoding: 'utf-8' }, (error, data) => {
            if (!error && data) {
                resolve(helpers.parseJSONToObject(data));
            } else {
                reject(error);
            }
        });
    });
};

// Not safe to use
lib.readAll = (dir) => {
    return new Promise((resolve, reject) => {
        fs.readdir(lib.baseDir + dir, async (error, files) => {
            if (!error) {
                const filesRead = files.map(el => lib.read(dir, el.replace('.json', '')));
                const [error, response] = await helpers.toAll(filesRead);
                if (!error) {
                    resolve(response);
                } else {
                    reject(error);
                }
            } else {
                reject(error);
            }
        });
    });
};

lib.update = (dir, file, data) => {
    return new Promise((resolve, reject) => {
        // Open file for writing
        fs.open(lib.baseDir + dir + '/' + file + '.json', 'r+', (error, fileDescriptor) => {
            if (!error && fileDescriptor) {
                // Basically remove everything from that file before updating
                fs.ftruncate(fileDescriptor, (error) => {
                    if (!error) {
                        const stringData = JSON.stringify(data);
                        // Write to file, and close it
                        fs.writeFile(fileDescriptor, stringData, (error) => {
                            if (!error) {
                                fs.close(fileDescriptor, (error) => {
                                    if (!error) {
                                        resolve();
                                    } else {
                                        reject({ message: 'Error closing file.' });
                                    }
                                });
                            } else {
                                reject({ message: 'Error writing to existing file.' });
                            }
                        });
                    } else {
                        reject({ message: 'Error truncating file.' });
                    }
                });
            } else {
                reject({ message: 'Could not open file for reading, it may not exist' });
            }
        });
    });
};

lib.delete = (dir, file) => {
    return new Promise((resolve, reject) => {
        // Unlink file to remove from file system
        fs.unlink(lib.baseDir + dir + '/' + file + '.json', (error) => {
            if (!error) {
                resolve();
            } else {
                reject({ message: 'Error deleting file' });
            }
        });
    });
};

module.exports = lib;
