/**
 * Create and export configuration variables
 * 
 */

const environments = {};

// Staging
environments.staging = {
    httpPort: 3000,
    httpsPort: 3001,
    envName: 'staging',
    hashingSecret: 'iJSOISJDAS',
};

// Production
environments.production = {
    httpPort: 5000,
    httpsPort: 5001,
    envName: 'production',
    hashingSecret: 'iJSOISJDAS',
};

// Determine which one should be exported
const currentEnvironment = typeof(process.env.NODE_ENV) === 'string'
    ? process.env.NODE_ENV.toLowerCase() : 'production';

// Check that it is on the environments list
const environmentToExport = typeof(environments[currentEnvironment]) === 'object'
    ? environments[currentEnvironment] : environments.staging;

module.exports = environmentToExport;
