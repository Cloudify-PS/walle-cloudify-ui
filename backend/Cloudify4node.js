'use strict';

/**
 * @module cloudifyRestClient
 * @description
 * implements cloudify REST client in nodejs
 */

var ajax = require('http'); // todo - what will happen if we get https instead? support https required.
var fs = require('fs'); // todo - this class should not write directly to files.. at most should write to stream.
var conf = require('../backend/appConf'); // todo: this class should not read directly from configuration
var log4js = require('log4js');
log4js.configure(conf.log4js); // todo: no need for this here..
var logger = log4js.getLogger('cloudify4node');
var path = require('path');  // todo: this class should not refer to FS paths.. lets remove it
var targz = require('tar.gz'); // todo: this class should have nothing todo with tar.gz files directly.
var browseBlueprint = require('./services/BrowseBlueprintService'); // todo: no need for this here.. this is a ui feature, not cloudify client related.
var monitoring = require('./services/MonitoringService');  // todo: what does this have anything to do with cloudify4node?
var querystring = require('querystring');

/**
 * @typedef Cloudify4node
 * @name Cloudify4node
 * @class Cloudify4node
 * @namespace Cloudify4node
 * @constructor
 */
function Cloudify4node() {}
module.exports = Cloudify4node;

// Enable/Disable logs
if(conf.cosmoLogs === true) {
    logger.setLevel('ALL');
} else {
    logger.setLevel('OFF');
}



// todo - perhaps its time to remove a lot of code (80 lines) that "prepares" a bunch of stuff I doubt we need,
// todo - and start using a 3rd-party to do that..
function createRequest(requestData, callback) {
    var _callback = function(res) {
        var data = '';
        var result = '';

        if (res.errno !== undefined || res.statusCode === undefined) {
            callback(500, null);
            return;
        }

        logger.trace('STATUS: ' + res.statusCode);

        res.on('data', function (chunk) {
            result += chunk;
        });

        res.on('end', function () {
            var jsonStr = JSON.stringify(result);
            data = JSON.parse(jsonStr);

            logger.trace(['Request done, data: ',data]);

            callback(null, data);
        });
    };

    var onError = function(e) {
        logger.info('problem with request: ' + e.message);
        _callback(e, null);
    };

    logger.info(['dispatching request ', requestData.options]);
    var req = ajax.request(requestData.options, _callback);
    req.on('error', onError);

    if (requestData.post_data !== undefined) {
        req.write(JSON.stringify(requestData.post_data));
    }

    req.end();
}

function createRequestData(options) {
    logger.info(options);
    var requestData = {};

    if (options !== undefined) {
        requestData.options = {
            hostname: options.hostname !== undefined ? options.hostname : conf.cosmoServer,
//            path: options.path,
            method: options.method
        };

        if (options.path !== undefined) {
            requestData.options.path = options.path;
        }

        if (options.port !== undefined) {
            requestData.options.port = options.port;
        } else if (requestData.options.hostname === conf.cosmoServer) {
            requestData.options.port = conf.cosmoPort;
        }
    }

    if (options.data !== undefined) {
        requestData.post_data = options.data;
    }

    if (options.headers !== undefined) {
        requestData.options.headers = options.headers;
    }

    return requestData;
}

// todo - Cloudify4node should be an instance.. why are we using static function declaration?
Cloudify4node.getBlueprints = function(callback) {
    var requestData = createRequestData({
        path: '/blueprints',
        method: 'GET'
    });

    createRequest(requestData, callback);
};

// todo - Cloudify4node should be an instance.. why are we using static function declaration?
Cloudify4node.addBlueprint = function(application_archive, blueprint_id, callback) {
    if (blueprint_id === undefined) {
        callback(400, {
            'status': 400,
            'message': '400: Invalid blueprint name',
            'error_code': 'Blueprint name required'
        });
        return;
    }
    var myFile = application_archive;
    var path = '/blueprints' + (blueprint_id === undefined ? '' : '/' + blueprint_id);
    var options = {
        hostname: conf.cosmoServer,
        port: conf.cosmoPort,
        path: path,
        method: blueprint_id === undefined ? 'POST' : 'PUT',
        headers: {
            'Content-Type': 'application/octet-stream',
            'Transfer-Encoding': 'chunked'
        }
    };

    var req = ajax.request(options, function(res) {
        var responseMessage = '';
        logger.info('statusCode: ' + res.statusCode);
        res.on('data', function (chunk) {
            responseMessage += chunk.toString();
            logger.debug('chunk: ' + chunk.toString());
        });

        res.on('end', function() {
            if (res.statusCode === 200){
                callback(null, res.statusCode);
            } else {
                callback(responseMessage, res.statusCode);
            }
        });
    });

    req.on('error', function(e) {
        logger.info('problem with request: ' + e.message);
    });

    fs.readFile(myFile.path, function(err, data) {
        if (err) {
            throw err;
        }

        req.write(data);
        req.end();
    });
};

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
Cloudify4node.uploadBlueprint = function(streamReader, opts, callback) {
    logger.debug('uploading blueprint', opts);
    if (!opts || !opts.blueprint_id || !opts.params.application_file_name) {
        var errJSON = {
            'status': 400,
            'message': '',
            'error_code': 'Blueprint name required'
        };
        // todo : are we sure that this is the format we want? does not match other scenarios in this function. it is not a nodejs standard..
        if (!opts.blueprint_id) {
            errJSON.message = '400: Invalid blueprint name';
            errJSON.error_code = 'Blueprint name required';
        } else if (!opts.params.application_file_name) {
            errJSON.message = '400: Invalid blueprint filename';
            errJSON.error_code = 'Blueprint filename required';
        }
        callback(400, errJSON);
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

        res.on('end', function() {
            if (res.statusCode === 200) {
                callback(null, res.statusCode);
            } else {
                console.log('responseMessage', responseMessage);
                callback(JSON.parse(responseMessage), res.statusCode);
            }
        });
    }

    var requestOptions = {
        hostname: conf.cosmoServer, // todo: remove this.. get configuration as parameter to constructor
        port: conf.cosmoPort, // todo:remove this.. get configuration as parameter to constructor
        path: '/blueprints/' + opts.blueprint_id + '?' + querystring.stringify(opts.params),
        method: 'PUT',
        headers: {
            'Content-Type': 'application/octet-stream',
            'Transfer-Encoding': 'chunked'
        }
    };
    logger.info('sending request', requestOptions);
    var req = ajax.request(requestOptions, handleResponse);

    req.on('error', function(e) {
        logger.error('[uploadBlueprint] problem with request: ',e);
        callback(e); // todo: this does not match the error format we use above.
        return;
    });

    streamReader
        .on('readable', function () {
            logger.info('stream is readable');

            var chunk;
            while (null !== (chunk = streamReader.read())) {
                logger.info('writing chunk', chunk);
                req.write(chunk);
            }
            logger.info('chunk not writeable', chunk);
        }).on('end', function () {
            logger.info('stream end');
            req.end();
        });
};


// todo - Cloudify4node should be an instance.. why are we using static function declaration?
Cloudify4node.getBlueprintById = function(blueprint_id, callback) {
    var requestData = createRequestData({
        path: '/blueprints/' + blueprint_id,
        method: 'GET'
    });

    createRequest(requestData, callback );
};

// todo - Cloudify4node should be an instance.. why are we using static function declaration?
Cloudify4node.validateBlueprint = function(blueprint_id, callback) {
    var requestData = createRequestData({
        hostname: conf.cosmoServer,
        port: conf.cosmoPort,
        path: '/blueprints/' + blueprint_id + '/validate',
        method: 'GET'
    });

    createRequest(requestData, callback );
};

// todo - Cloudify4node should be an instance.. why are we using static function declaration?
Cloudify4node.deleteBlueprint = function(blueprint_id, callback) {
    var requestData = createRequestData({
        path: '/blueprints/' + blueprint_id,
        method: 'DELETE'
    });

    browseBlueprint.deleteBlueprint(blueprint_id, function(err){
        if (err) {
            callback(err, null);
        }
        else {
            createRequest(requestData, callback);
        }
    });
};

// todo - Cloudify4node should be an instance.. why are we using static function declaration?
// todo - cloudify rest API does not include anything about archiving, why is this here?
Cloudify4node.archiveBlueprint = function(blueprint_id, callback) {
    var requestData = {
        hostname: conf.cosmoServer,
        port: conf.cosmoPort,
        path: '/blueprints/' + blueprint_id + '/archive',
        method: 'GET'
    };

    function alreadyExists( name ){
        return function(e) {
            logger.debug('folder' + name + ' already exist :: ', e);
        };
    }

    fs.exists(conf.browseBlueprint.path, function (exists) {
        if (!exists) {
            var pathParts = conf.browseBlueprint.path.split('/');
            var pathToCreate = '';
            for (var i = 0; i < pathParts.length; i++) {
                pathToCreate += pathParts[i] + '/';
                fs.mkdir(pathToCreate, alreadyExists(pathParts[i]));
            }
        }
        var filepath = path.join(conf.browseBlueprint.path, blueprint_id + '.tar.gz');
        var file = fs.createWriteStream(filepath);

        var req = ajax.get(requestData, function(response) {
            response
                .on('data', function (data) {
                    file.write(data);
                })
                .on('end', function () {
                    file.on('close', function(){
                        new targz().extract(filepath, path.join(conf.browseBlueprint.path, blueprint_id), function(err){
                            if(err) {
                                console.log('problem with extract: ' + err);
                            }
                            else {
                                console.log('The extraction has ended!');
                                callback(null, null);
                            }
                        });
                    });
                    file.end();
                });
        });

        req.on('error', function(e) {
            console.log('problem with request: ' + e.message);
            callback(e.message, null);
        });
    });
};

// todo - Cloudify4node should be an instance.. why are we using static function declaration?
// todo - cloudify rest api has nothing to do with "browse" on blueprint. why is this here?
Cloudify4node.browseBlueprint = function(blueprint_id, callback) {
    browseBlueprint.isBlueprintExist(blueprint_id, function(err, isExist){
        if(!isExist) {
            Cloudify4node.archiveBlueprint(blueprint_id, function(err){
                if(err) {
                    console.log('Error!', err);
                }
                browseBlueprint.browseBlueprint(blueprint_id, callback);
            });
        }
        else {
            browseBlueprint.browseBlueprint(blueprint_id, callback);
        }
    });
};

// todo - Cloudify4node should be an instance.. why are we using static function declaration?
// todo - cloudify rest api does not have a "browse" feature. why is this here?
Cloudify4node.browseBlueprintFile = function(blueprint_id, relativePath, callback) {
    browseBlueprint.fileGetContent(blueprint_id, relativePath, callback);
};

// todo - Cloudify4node should be an instance.. why are we using static function declaration?
Cloudify4node.getExecutionById = function(execution_id, callback) {
    var requestData = createRequestData({
        path: '/executions/' + execution_id,
        method: 'GET'
    });

    createRequest(requestData, callback);
};

// todo - Cloudify4node should be an instance.. why are we using static function declaration?
Cloudify4node.updateExecutionState = function(execution_id, new_state, callback) {
    var data = {
        'action': new_state
    };
    var requestData = createRequestData({
        path: '/executions/' + execution_id,
        data: data,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': JSON.stringify(data).length
        }
    });

    createRequest(requestData, callback);
};

// todo - Cloudify4node should be an instance.. why are we using static function declaration?
Cloudify4node.getDeployments = function(callback) {
    var requestData = createRequestData({
        path: '/deployments',
        method: 'GET'
    });

    createRequest(requestData, callback);
};

// todo - Cloudify4node should be an instance.. why are we using static function declaration?
Cloudify4node.addDeployment = function(requestBody, callback) {
    var data = {
        'blueprint_id': requestBody.blueprint_id,
        'inputs': requestBody.inputs
    };
    var requestData = createRequestData({
        path: '/deployments/' + requestBody.deployment_id,
        data: data,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': JSON.stringify(data).length
        }
    });

    createRequest(requestData, callback);
};

// todo - Cloudify4node should be an instance.. why are we using static function declaration?
Cloudify4node.getDeploymentById = function(deployment_id, callback) {
    var requestData = createRequestData({
        path: '/deployments/' + deployment_id,
        method: 'GET'
    });

    createRequest(requestData, callback);
};

// todo - Cloudify4node should be an instance.. why are we using static function declaration?
Cloudify4node.deleteDeploymentById = function(deployment_id, ignore_live_nodes, callback) {
    var requestData = createRequestData({
        path: '/deployments/' + deployment_id + '?ignore_live_nodes=' + !!ignore_live_nodes,
        method: 'DELETE'
    });

    createRequest(requestData, callback);
};

// todo - Cloudify4node should be an instance.. why are we using static function declaration?
Cloudify4node.getDeploymentNodes = function(deployment_id, state, callback) {
    var requestData = createRequestData({
        path: '/node-instances?deployment_id=' + deployment_id,
        method: 'GET'
    });

    createRequest(requestData, callback);
};

// todo - Cloudify4node should be an instance.. why are we using static function declaration?
Cloudify4node.getNodeInstances = function(callback) {

    var requestData = createRequestData({
        path: '/node-instances',
        method: 'GET'
    });

    createRequest(requestData, callback);
};

// todo - Cloudify4node should be an instance.. why are we using static function declaration?
Cloudify4node.getNodeInstancesByDeploymentId = function(queryParams, callback) {
    var queryStr = '';
    if (queryParams !== null) {
        queryStr = '?';
        for (var param in queryParams) {
            queryStr += param + '=' + queryParams[param];
        }
    }
    var requestData = createRequestData({
        path: '/node-instances' + queryStr,
        method: 'GET'
    });

    createRequest(requestData, callback);
};

// todo - Cloudify4node should be an instance.. why are we using static function declaration?
Cloudify4node.getDeploymentExecutions = function(deployment_id, callback) {
    var requestData = createRequestData({
        path: '/executions?deployment_id=' + deployment_id + '&statuses=true',
        method: 'GET'
    });

    createRequest(requestData, callback);
};

// todo - Cloudify4node should be an instance.. why are we using static function declaration?
Cloudify4node.executeDeployment = function(requestBody, callback) {
    var data = {
        'workflow_id': requestBody.workflow_id,
        'deployment_id': requestBody.deployment_id
    };
    if (requestBody.parameters !== undefined) {
        data.parameters = requestBody.parameters;
    }
    var requestData = createRequestData({
        path: '/executions',
        data: data,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': JSON.stringify(data).length
        }
    });

    createRequest(requestData, callback);
};

// todo - Cloudify4node should be an instance.. why are we using static function declaration?
// todo - shouldn't this  be deprecated?
Cloudify4node.getProviderContext = function(callback) {
    var requestData = createRequestData({
        path: '/provider/context',
        method: 'GET'
    });

    createRequest(requestData, callback);
};

// todo - Cloudify4node should be an instance.. why are we using static function declaration?
Cloudify4node.getEvents = function(query, callback) {
    var data = query;
    var requestData = createRequestData({
        path: '/events',
        data: data,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': JSON.stringify(data).length,
            'Connection': 'close'
        }
    });

    createRequest(requestData, callback);
};

// todo - Cloudify4node should be an instance.. why are we using static function declaration?
Cloudify4node.getWorkflows = function(deployment_id, callback) {
    var requestData = createRequestData({
        path: '/deployments/' + deployment_id + '/workflows',
        method: 'GET'
    });

    createRequest(requestData, callback);
};

// todo - Cloudify4node should be an instance.. why are we using static function declaration?
Cloudify4node.getNode = function(node_id, queryParams, callback) {
    var queryStr = '';
    if (queryParams !== null) {
        queryStr = '?';
        for (var param in queryParams) {
            queryStr += param + '=' + queryParams[param] + '&';
        }
    }
    var requestData = createRequestData({
        path: '/nodes/' + node_id + queryStr,
        method: 'GET'
    });

    createRequest(requestData, callback);
};

// todo - Cloudify4node should be an instance.. why are we using static function declaration?
Cloudify4node.getNodes = function(queryParams, callback) {
    var queryStr = '';
    if (queryParams !== null) {
        queryStr = '?';
        for (var param in queryParams) {
            queryStr += param + '=' + queryParams[param] + '&';
        }
    }
    var requestData = createRequestData({
        path: '/nodes' + queryStr,
        method: 'GET'
    });

    createRequest(requestData, callback);
};

/////   todo - WHY IS THIS HERE??????? WHAT DOES IT HAVE TO DO WITH CLOUDIFY REST API????
Cloudify4node.getPackageJson = function(callback) {
    return callback(null, require('../package.json'));
};

// todo - Cloudify4node should be an instance.. why are we using static function declaration?
Cloudify4node.getManagerVersion = function(callback) {
    var requestData = createRequestData({
        path: '/version',
        method: 'GET'
    });

    createRequest(requestData, callback);
    //return callback(null, require('./mock/managerVersion.json'));
};

// todo: why is this API writing directly to response? need to change it!
// todo: we can "writeHead" outside, and then declare we get "streamWriter" here.. which is an API, which is good.
Cloudify4node.getLogsExportFile = function(response, callback) {
    var filePath = path.join(conf.logs.folder, conf.logs.file);
    new targz().compress(conf.logs.folder, filePath, function(err){
        fs.exists(filePath, function (exists) {
            if (exists) {
                var stat = fs.statSync(filePath);
                response.writeHead(200, {
                    'Content-Type': 'application/x-gzip',
                    'Content-Length': stat.size
                });
                var readStream = fs.createReadStream(filePath);
                readStream.pipe(response);
            }
            else {
                callback(err, null);
            }
        });
    });
};

// todo: these functions seem to be in the wrong place. they are not related to cloudify4node.

Cloudify4node.getDashboardSeries = function(query, callback) {
    monitoring.getDashboardSeries(query, callback);
};

Cloudify4node.getDeploymentDashboards = function(query, callback) {
    monitoring.getDeploymentDashboard(query, callback);
};

Cloudify4node.getDashboardSeriesList = function(query, callback) {
    monitoring.getDashboardSeriesList(query, callback);
};



