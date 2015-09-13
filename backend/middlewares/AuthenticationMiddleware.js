'use strict';

/**
 * @module CloudifyMiddleware
 * @description
 * responsible for initializing a cloudify client and put it on request
 * @type {function(): Client|exports}
 */

//var services = require('../services');

module.exports = function (req, res, next) {
    var creds = req.session.cloudifyCredentials;

    if (creds) {
        req.cloudifyAuthHeader = 'Basic ' + new Buffer(creds.username + ':' + creds.password).toString('base64');
    }

    next();
};
