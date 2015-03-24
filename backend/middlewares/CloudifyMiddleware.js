'use strict';

/**
 * @module CloudifyMiddleware
 * @description
 * responsible for initializing a cloudify client and put it on request
 * @type {function(): Client|exports}
 */

var CloudifyClient = require('cloudify-js');
var services = require('../services');




module.exports = function (req, res, next) {
    var creds = req.session.cloudifyCredentials;
    req.cloudifyClient = new CloudifyClient({
        endpoint : services.conf.cloudifyManagerEndpoint,
        cloudifyAuth: {
            'user' : creds.username,
            'pass' : creds.password
        }
    });
    next();

};
