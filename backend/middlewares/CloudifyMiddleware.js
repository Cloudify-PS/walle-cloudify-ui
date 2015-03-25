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
    var clientConf = {
        endpoint : services.conf.cloudifyManagerEndpoint
    };
    if (creds) {
        clientConf.cloudifyAuth= {
            'user' : creds.username,
            'pass' : creds.password
        };
    }
    req.cloudifyClient = new CloudifyClient(clientConf);
    next();
};
