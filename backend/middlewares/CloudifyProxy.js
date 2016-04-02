'use strict';
var proxy = require('express-http-proxy');
var logger = require('log4js').getLogger('CloudifyProxy');
module.exports = function (conf) {
    return function (req, res, next) {

        // guy - we cannot use decorate request here, because decorate does not pass express request object
        // and we need express request object because we placed cloudifyAuthHeader on it..
        try {
            if (req.cloudifyAuthHeader) {
                req.headers.authorization = req.cloudifyAuthHeader;
            }
            var urlArgs = require('url').parse(conf.cloudifyManagerEndpoint);
            var host = urlArgs.protocol + '//' + urlArgs.host;
            proxy(host, {
                intercept: function (rsp, data, req, res, callback) {
                    res.removeHeader('www-authenticate'); // we want a login page!

                    try {
                        var _data = JSON.parse(data.toString());
                        //console.log('this is error_code', _data.error_code );
                        if (_data.error_code === 'unauthorized_error' && !req.session.cloudifyCredentials) { // user is not authenticated
                            //console.log('modifying error_code to unauthenticated');
                            _data.error_code = 'unauthenticated_error';
                            data = JSON.stringify(_data);
                        }
                    } catch (e) { /*console.log(e); */
                    }

                    callback(null, data);
                },
                forwardPath: function (req) {
                    var endpoint = require('url').parse(conf.cloudifyManagerEndpoint);
                    var res = require('url').resolve(endpoint.path, require('url').parse(req.url).path.substring(1));
                    logger.trace('this is forward', res);
                    return res;
                },
                //1mb by default
                limit: '120mb'
            })(req, res, next);
        } catch (e) {
            logger.error('unable to proxy', e);
            next(e);
        }
    };
};
