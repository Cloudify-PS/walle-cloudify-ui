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

function createRequest(requestData) {
    var callback = function(res) {
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

            requestData.response.send(data);
        });
    };

    var onError = function(e) {
        console.log(e);
        console.log('problem with request: ' + e.message);
        requestData.response.send(500);
    };

    logger.info(['dispatching request ', requestData.options]);
    var req = ajax.request(requestData.options, callback);
    req.on('error', onError);

    if (requestData.post_data !== undefined) {
        req.write(requestData.post_data);
    }

    req.write(JSON.stringify(requestData.request.body));
    req.end();
}

function createRequestData(request, response, options) {
    var requestData = {};

    if (request !== undefined) {
        requestData.request = request;
    }

    if (response !== undefined) {
        requestData.response = response;
    }

    if (options !== undefined) {
        requestData.options = {
            hostname: conf.cosmoServer,
            port: conf.cosmoPort,
            path: options.path,
            method: options.method
        };
    }

    if (options.headers !== undefined) {
        requestData.options.headers = options.headers;
    }

    return requestData;
}

Cloudify4node.getBlueprints = function(request, response) {
    var requestData = createRequestData(request, response, {
        path: '/blueprints',
        method: 'GET'
    });

    createRequest(requestData);
}

Cloudify4node.addBlueprint = function(request, response) {
    var myFile = request.files.application_archive;
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
                response.send(200);
            });
        });

        req.on('error', function(e) {
            console.log('problem with request: ' + e.message);
        });

        req.write(data);
        req.end();
    });
}

Cloudify4node.getBlueprintById = function(request, response) {
    var requestData = createRequestData(request, response, {
        path: '/blueprints/' + request.query.id,
        method: 'GET'
    });

    createRequest(requestData);
}

Cloudify4node.validateBlueprint = function(request, response) {
    var requestData = createRequestData(request, response, {
        hostname: conf.cosmoServer,
        port: conf.cosmoPort,
        path: '/blueprints/' + request.query.id + '/validate',
        method: 'GET'
    });

    createRequest(requestData);
}

Cloudify4node.getExecutionById = function(request, response) {
    var requestData = createRequestData(request, response, {
        path: '/executions/' + request.query.executionId,
        method: 'GET'
    });

    createRequest(requestData);
}

Cloudify4node.getDeployments = function(request, response) {
    var requestData = createRequestData(request, response, {
        path: '/deployments',
        method: 'GET'
    });

    createRequest(requestData);
}

Cloudify4node.addDeployment = function(request, response) {
    var requestData = createRequestData(request, response, {
        path: '/deployments',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': JSON.stringify(requestData.request.body).length
        }
    });

    createRequest(requestData);
}

Cloudify4node.getDeploymentById = function(request, response) {
    var requestData = createRequestData(request, response, {
        path: '/deployments/' + request.query.deploymentId,
        method: 'GET'
    });

    createRequest(requestData);
}

Cloudify4node.getDeploymentExecutions = function(request, response) {
    var requestData = createRequestData(request, response, {
        path: '/deployments/' + request.body.deploymentId + '/executions',
        method: 'GET'
    });

    createRequest(requestData);
}

Cloudify4node.executeDeployment = function(request, response) {
    var requestData = createRequestData(request, response, {
        path: '/deployments/' + request.body.deploymentId + '/executions',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': JSON.stringify(request.body).length
        }
    });

    createRequest(requestData);
}

Cloudify4node.getDeploymentEvents = function(request, response) {
    var requestData = createRequestData(request, response, {
        path: '/deployments/' + request.body.deploymentId + '/events?from=' + request.body.from,
        method: 'GET'
    });

    createRequest(requestData);
}