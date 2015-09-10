'use strict';
var proxy = require('express-http-proxy');
module.exports = function (conf) {
    return function (req, res, next) {



        // guy - we cannot use decorate request here, because decorate does not pass express request object
        // and we need express request object because we placed cloudifyAuthHeader on it..
        try {
            if(req.cloudifyAuthHeader) {
                req.headers.authorization = req.cloudifyAuthHeader;
            }
            proxy(function () {
                return require('url').parse(conf.cloudifyManagerEndpoint).hostname; // recommended by express-proxy see code
            }, {
                intercept: function (rsp, data, req, res, callback) {
                    res.removeHeader('www-authenticate'); // we want a login page!
                    callback(null, data);
                },
                forwardPath: function( req ){
                    var endpoint = require('url').parse(conf.cloudifyManagerEndpoint);
                    var res = require('url').resolve(endpoint.path, require('url').parse(req.url).path.substring(1));
                    console.log('this is forward', res);
                    return res;
                }
            })(req, res, next);
        } catch (e) {
            console.log('unable to proxy', e);
            next(e);
        }
    };
};
