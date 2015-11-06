'use strict';

/**
 * @module cloudifyRestClient
 * @description
 * implements cloudify REST client in nodejs
 */


var conf = require('../appConf'); // todo: this class should not read directly from configuration
var log4js = require('log4js');
log4js.configure(conf.log4js); // todo: no need for this here..
var logger = log4js.getLogger('cloudify4node');
var querystring = require('querystring');



/**
 *
 * @memberOf Cloudify4node
 * @description
 * This function gets a readStream to read a blueprint and writes it to a request to upload blueprint with cloudify manager
 *
 * @see  http://codewinds.com/blog/2013-08-04-nodejs-readable-streams.html
 * @see http://stackoverflow.com/questions/6926721/event-loop-for-large-files
 *
 * @param {ReadStream} streamReader
 * @param {object} opts
 * @param {string} opts.blueprint_id the blueprint's ID.
 * @param {object} opts.params
 * @param {string} opts.params.application_file_name name of yaml file to look for in the tar.
 * @param {function} callback function(err,data)
 */
// todo - Cloudify4node should be an instance.. why are we using static function declaration?
exports.uploadBlueprint = function( cloudifyConf, streamReader, opts, callback) {
    var ajax = require('http');
    var endpoint = require('url').parse(conf.cloudifyManagerEndpoint);

    if ( endpoint.protocol && endpoint.protocol.indexOf('https') >= 0 ){
        ajax = require('https');

    }

    opts = JSON.parse(opts);    // must parse opts from string to JSON, the FormData does not pass JSON objects, only as string
    logger.debug('uploading blueprint', opts);

    if (!opts || !opts.blueprint_id) {
        // todo : are we sure that this is the format we want? does not match other scenarios in this function. it is not a nodejs standard..
        callback(400, {
            'status': 400,
            'message': '400: Invalid blueprint name',
            'error_code': ' Blueprint name required'
        });
        return;
    }

    querystring.stringify(opts.params);

    function handleResponse(res){
        var responseMessage = '';
        logger.debug('[uploadBlueprint] got response.  statusCode: ' + res.statusCode);

        res.on('data', function (chunk) {
            responseMessage += chunk.toString();
            logger.debug('chunk: ' + chunk.toString());
        });

        res.on('end', function () {
            try {
                callback(null, JSON.parse(responseMessage), res.statusCode);
            } catch (e) { // responseMessage might not be a JSON (nginx sometimes returns html)
                callback(null, {'message': responseMessage}, res.statusCode);
            }
        });
    }


    var querystr = querystring.stringify(opts.params);

    var requestOptions = {
        hostname: endpoint.hostname,
        port: endpoint.port,
        path: require('url').resolve(endpoint.path, 'blueprints/' + opts.blueprint_id + ( querystr ? '?' + querystr : '' )),
        method: 'PUT',
        headers: {
            'Content-Type': 'application/octet-stream',
            'Transfer-Encoding': 'chunked'
        }
    };

    console.log('this is requestOptions', requestOptions);


    if (  cloudifyConf.authHeader  ){
        console.log('auth header is', cloudifyConf.authHeader);
        requestOptions.headers.Authorization = cloudifyConf.authHeader;
    }

    //logger.info('sending request', requestOptions);
    var req = ajax.request(requestOptions, handleResponse);

    req.on('error', function(e) {
        logger.error('[uploadBlueprint] problem with request: ',e);
        callback(e); // todo: this does not match the error format we use above.
        return;
    });

    streamReader
        .on('readable', function () {
            //logger.info('stream is readable');

            var chunk;
            while (null !== (chunk = streamReader.read())) {
                //logger.info('writing chunk', chunk);
                req.write(chunk);
            }
            //logger.info('chunk not writeable', chunk);
        }).on('end', function () {
            logger.info('stream end');
            req.end();
        });
};




