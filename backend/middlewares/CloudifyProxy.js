'use strict';
var proxy = require('express-http-proxy');
var logger = require('log4js').getLogger('CloudifyProxy');
module.exports = function (conf) {
    return function (req, res, next) {

        // guy - we cannot use decorate request here, because decorate does not pass express request object
        // and we need express request object because we placed cloudifyAuthHeader on it..
        try {
            if(req.cloudifyAuthHeader) {
                req.headers.authorization = req.cloudifyAuthHeader;
            }
            var urlArgs = require('url').parse(conf.cloudifyManagerEndpoint);
            var host = urlArgs.protocol + '//' + urlArgs.host;
            proxy( host , {
                intercept: function (rsp, data, req, res, callback) {
                    res.removeHeader('www-authenticate'); // we want a login page!
                    callback(null, data);
                },
                forwardPath: function( req ){
                    var endpoint = require('url').parse(conf.cloudifyManagerEndpoint);
                    var res = require('url').resolve(endpoint.path, require('url').parse(req.url).path.substring(1));
                    logger.trace('this is forward', res);
                    return res;
                }
            })(req, res, next);
        } catch (e) {
            logger.error('unable to proxy', e);
            next(e);
        }
    };
};
