var ajax = require("http");
var fs = require('fs');
var conf = require("../backend/appConf");
var log4js = require('log4js');
log4js.configure({
    appenders: [
        { type: 'console' },
        { type: 'file', filename: 'logs/gsui.log', category: 'gsui' }
    ]
});
var logger = log4js.getLogger('server');

module.exports = Cloudify4node;

function Cloudify4node(options) {}

function createRequest(requestData, callback) {
    var _callback = function(res) {
        var data = '';
        var result = '';

        console.log('STATUS: ' + res.statusCode);

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
        console.log(e);
        console.log('problem with request: ' + e.message);
        _callback(e, null);
    };

    logger.info(['dispatching request ', requestData.options]);
    var req = ajax.request(requestData.options, _callback);
    req.on('error', onError);


    if (requestData.post_data !== undefined) {
        req.write(JSON.stringify(requestData.post_data));
    }

    req.write(JSON.stringify(requestData));
    req.end();
}

function createRequestData(options) {
    var requestData = {};

    if (options !== undefined) {
        requestData.options = {
            hostname: conf.cosmoServer,
            port: conf.cosmoPort,
            path: options.path,
            method: options.method
        };
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

Cloudify4node.addBlueprint = function(application_archive, callback) {
    var myFile = application_archive;
    var host = 'http://' + conf.cosmoServer + ':' + conf.cosmoPort + "/blueprints";

    fs.readFile(myFile.path, function(err, data) {
        if (err) throw err;
        var path = '/blueprints';
        var options = {
            hostname: conf.cosmoServer,
            port: conf.cosmoPort,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/octet-stream',
                'Transfer-Encoding': 'chunked'
            }
        };

        var req = ajax.request(options, function(res) {
            res.on('data', function (chunk) {
                logger.debug('chunk: ' + JSON.stringify(data));
            });

            res.on('end', function() {
                logger.debug('data: ' + JSON.stringify(data));
                callback(200);
            });
        });

        req.on('error', function(e) {
            console.log('problem with request: ' + e.message);
        });

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

Cloudify4node.getExecutionById = function(execution_id, callback) {
    var requestData = createRequestData({
        path: '/executions/' + execution_id,
        method: 'GET'
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
    var requestData = createRequestData({
        path: '/deployments',
        data: requestBody,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': JSON.stringify(requestBody).length
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

Cloudify4node.getDeploymentExecutions = function(deployment_id, callback) {
    var requestData = createRequestData({
        path: '/deployments/' + deployment_id + '/executions',
        method: 'GET'
    });

    createRequest(requestData, callback);
}

Cloudify4node.executeDeployment = function(requestBody, callback) {
    var requestData = createRequestData({
        path: '/deployments/' + requestBody.deploymentId + '/executions',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': JSON.stringify(requestBody).length
        }
    });

    createRequest(requestData, callback);
}

Cloudify4node.getDeploymentEvents = function(deployment_id, from, callback) {
    var requestData = createRequestData({
        path: '/deployments/' + deployment_id + '/events?from=' + from,
        method: 'GET'
    });

    createRequest(requestData, callabck);
}