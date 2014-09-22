var ajax = require("http");
var fs = require('fs');
var conf = require("../backend/appConf");
var log4js = require('log4js');
log4js.configure(conf.log4js);
var logger = log4js.getLogger('cloudify4node');
var path = require('path');
var targz = require('tar.gz');
var browseBlueprint = require('./services/BrowseBluerprintService');
var influx = require('influx');

module.exports = Cloudify4node;

// Enable/Disable logs
if(conf.cosmoLogs === true) {
    logger.setLevel('ALL');
} else {
    logger.setLevel('OFF');
}

function Cloudify4node(options) {}

function createRequest(requestData, callback) {
    var _callback = function(res) {
        var data = '';
        var result = '';

        if (res.errno !== undefined || res.statusCode === undefined) {
            callback(500, null);
            return;
        }

        logger.info('STATUS: ' + res.statusCode);

        res.on('data', function (chunk) {
            result += chunk;
        });

        res.on('end', function () {
            var jsonStr = JSON.stringify(result);
            data = JSON.parse(jsonStr);

            logger.info(['Request done, data: ',data]);

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
    else {
        req.write(JSON.stringify(requestData));
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

Cloudify4node.getBlueprints = function(callback) {
    var requestData = createRequestData({
        path: '/blueprints',
        method: 'GET'
    });

    createRequest(requestData, callback);
}

Cloudify4node.addBlueprint = function(application_archive, blueprint_id, callback) {
    if (blueprint_id === undefined) {
        callback(400, {
            "status": 400,
            "message": "400: Invalid blueprint name",
            "error_code": "Blueprint name required"
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
        var responseMessage = "";
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
        if (err) throw err;

        req.write(data);
        req.end();
    });
}

Cloudify4node.getBlueprintById = function(blueprint_id, callback) {
    var requestData = createRequestData({
        path: '/blueprints/' + blueprint_id,
        method: 'GET'
    });

    createRequest(requestData, callback );
}

Cloudify4node.validateBlueprint = function(blueprint_id, callback) {
    var requestData = createRequestData({
        hostname: conf.cosmoServer,
        port: conf.cosmoPort,
        path: '/blueprints/' + blueprint_id + '/validate',
        method: 'GET'
    });

    createRequest(requestData, callback );
}

Cloudify4node.deleteBlueprint = function(blueprint_id, callback) {
    var requestData = createRequestData({
        path: '/blueprints/' + blueprint_id,
        method: 'DELETE'
    });

    createRequest(requestData, callback );
}

Cloudify4node.archiveBlueprint = function(blueprint_id, callback) {
    var requestData = {
        hostname: conf.cosmoServer,
        port: conf.cosmoPort,
        path: '/blueprints/' + blueprint_id + '/archive',
        method: 'GET'
    };

    fs.exists(conf.browseBlueprint.path, function (exists) {
        if (!exists) {
            var pathParts = conf.browseBlueprint.path.split('/');
            var pathToCreate = '';
            for (var i = 0; i < pathParts.length; i++) {
                pathToCreate += pathParts[i] + '/';
                fs.mkdir(pathToCreate, function(e) {
                    console.log('folder' + pathParts[i] + ' already exist :: ' + e);
                });
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
                        var compress = new targz().extract(filepath, path.join(conf.browseBlueprint.path, blueprint_id), function(err){
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
}

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
    })
}

Cloudify4node.browseBlueprintFile = function(blueprint_id, relativePath, callback) {
    browseBlueprint.fileGetContent(blueprint_id, relativePath, callback);
}

Cloudify4node.getExecutionById = function(execution_id, callback) {
    var requestData = createRequestData({
        path: '/executions/' + execution_id,
        method: 'GET'
    });

    createRequest(requestData, callback);
}

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
}

Cloudify4node.getDeployments = function(callback) {
    var requestData = createRequestData({
        path: '/deployments',
        method: 'GET'
    });

    createRequest(requestData, callback);
}

Cloudify4node.addDeployment = function(requestBody, callback) {
    var data = {
        'blueprint_id': requestBody.blueprint_id
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
}

Cloudify4node.getDeploymentById = function(deployment_id, callback) {
    var requestData = createRequestData({
        path: '/deployments/' + deployment_id,
        method: 'GET'
    });

    createRequest(requestData, callback);
}

Cloudify4node.deleteDeploymentById = function(deployment_id, ignore_live_nodes, callback) {
    var requestData = createRequestData({
        path: '/deployments/' + deployment_id + '?ignore_live_nodes=' + !!ignore_live_nodes,
        method: 'DELETE'
    });

    createRequest(requestData, callback);
}

Cloudify4node.getDeploymentNodes = function(deployment_id, state, callback) {
    var requestData = createRequestData({
        path: '/node-instances?deployment_id=' + deployment_id,
        method: 'GET'
    });

    createRequest(requestData, callback);
}

Cloudify4node.getNodeInstances = function(callback) {

    var requestData = createRequestData({
        path: '/node-instances',
        method: 'GET'
    });

    createRequest(requestData, callback);
}

Cloudify4node.getNodeInstancesByDeploymentId = function(queryParams, callback) {
    var queryStr = '';
    if (queryParams !== null) {
        queryStr = '?'
        for (var param in queryParams) {
            queryStr += param + '=' + queryParams[param];
        }
    }
    var requestData = createRequestData({
        path: '/node-instances' + queryStr,
        method: 'GET'
    });

    createRequest(requestData, callback);
}

Cloudify4node.getDeploymentExecutions = function(deployment_id, callback) {
    var requestData = createRequestData({
        path: '/deployments/' + deployment_id + '/executions?statuses=true',
        method: 'GET'
    });

    createRequest(requestData, callback);
}

Cloudify4node.executeDeployment = function(requestBody, callback) {
    var data = {
        'workflow_id': requestBody.workflow_id
    };
    var requestData = createRequestData({
        path: '/deployments/' + requestBody.deployment_id + '/executions',
        data: data,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': JSON.stringify(data).length
        }
    });

    createRequest(requestData, callback);
}

Cloudify4node.getProviderContext = function(callback) {
    var requestData = createRequestData({
        path: '/provider/context',
        method: 'GET'
    });

    createRequest(requestData, callback);
}

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
}

Cloudify4node.getWorkflows = function(deployment_id, callback) {
    var requestData = createRequestData({
        path: '/deployments/' + deployment_id + '/workflows',
        method: 'GET'
    });

    createRequest(requestData, callback);
}

Cloudify4node.getNode = function(node_id, queryParams, callback) {
    var queryStr = '';
    if (queryParams !== null) {
        queryStr = '?'
        for (var param in queryParams) {
            queryStr += param + '=' + queryParams[param] + '&';
        }
    }
    var requestData = createRequestData({
        path: '/nodes/' + node_id + queryStr,
        method: 'GET'
    });

    createRequest(requestData, callback);
}

Cloudify4node.getNodes = function(queryParams, callback) {
    var queryStr = '';
    if (queryParams !== null) {
        queryStr = '?'
        for (var param in queryParams) {
            queryStr += param + '=' + queryParams[param] + '&';
        }
    }
    var requestData = createRequestData({
        path: '/nodes' + queryStr,
        method: 'GET'
    });

    createRequest(requestData, callback);
}

Cloudify4node.getPackageJson = function(callback) {
    return callback(null, require('../package.json'));
};

Cloudify4node.getManagerVersion = function(callback) {
    var requestData = createRequestData({
        path: '/version',
        method: 'GET'
    });

    createRequest(requestData, callback);
    //return callback(null, require('./mock/managerVersion.json'));
};

Cloudify4node.influxRequest = function(query, callback) {

    console.log('influxRequest', query);

    var influxClient = influx({
        host: conf.influx.host,
        username : conf.influx.user,
        password : conf.influx.pass,
        database : conf.influx.dbname
    });

    influxClient.request.get({
        url: influxClient.url('db/' + influxClient.options.database + '/series', query),
        json: true
    }, influxClient._parseCallback(callback));
}

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
}
