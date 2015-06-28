'use strict';
var proxy = require('express-http-proxy');
module.exports = function (conf) {
    return function (req, res, next) {


        // guy - we cannot use decorate request here, because decorate does not pass express request object
        // and we need express request object because we placed cloudifyAuthHeader on it..
        try {
            req.headers.authorization = req.cloudifyAuthHeader;
            console.log('proxying request');
            proxy(function () {
                return conf.cosmoServer;
            }, {
                intercept: function (rsp, data, req, res, callback) {
                    res.removeHeader('www-authenticate'); // we want a login page!
                    console.log('res headers is', res.headers, data, rsp.headers);
                    callback(null, data);
                }
            })(req, res, next);
        } catch (e) {
            console.log('unable to proxy', e);
            next(e);
        }
    };
};
