'use strict';

/*
 * Express Dependencies
 */

function isLocalhost(){
    return process.env.GS_UI_NODE_ENV === 'localhost';
}

if ( isLocalhost() ){
    console.log('running in localhost');
}

var express = require('express');
var _ = require('lodash');
var app = express();
var port = 9001;
var gsSettings = require('./backend/gsSettings');
var conf = require('./backend/appConf');
var cloudify4node;
var log4js = require('log4js');
var logger = log4js.getLogger('server');
var influx = require('influx');


if (conf.useMock) {
    cloudify4node = require('./backend/Cloudify4node-mock');
} else {
    cloudify4node = require('./backend/Cloudify4node');
}

logger.debug(JSON.stringify(conf));

if (conf.cloudifyLicense !== 'tempLicense') {
    throw new Error('invalid license');
}

app.enable('jsonp callback');

// app.use(express.favicon());
app.use(express.cookieParser(/* 'some secret key to sign cookies' */ 'keyboardcat' ));
app.use(express.bodyParser());
app.use(express.compress());
app.use(express.methodOverride());

/*
 * Set app settings depending on environment mode.
 * Express automatically sets the environment to 'development'
 */
if (process.env.NODE_ENV === 'production' || process.argv[2] === 'production') {
    logger.debug('Setting production env variable');
    app.set('env', 'production');

    // this 'dev' variable is available to Jade templates
    app.locals.dev = false;
} else {
    app.locals.dev = true;
}


/*
 * Config
 */

if (app.get('env') === 'development') {
    app.use(express.static(__dirname + '/.tmp'));
    app.use(express.static(__dirname + '/app'));
} else {
    app.use(express.static(__dirname));
}

// cosmo REST APIs

app.get('/backend/blueprints', function(request, response/*, next*/) {
    cloudify4node.getBlueprints(function(err, data) {
        response.send(err !== null ? err : data);
    });
});

app.post('/backend/blueprints/add', function(request, response){
    cloudify4node.addBlueprint(request.files.application_archive, request.body.blueprint_id, function(err, data) {
        response.send(err !== null ? err : data, err !== null ? data : 200);
    });
});

app.get('/backend/blueprints/get', function(request, response) {
    cloudify4node.getBlueprintById(request.query.id, function(err, data) {
        response.send(err !== null ? err : data);
    });
});

app.post('/backend/blueprints/source', function(request, response) {
    cloudify4node.getBlueprintSource(request.body.blueprint_id, function(err, data) {
        response.send(err !== null ? err : data);
    });
});

app.get('/backend/blueprints/validate', function(request, response) {
    cloudify4node.validateBlueprint(request.body.id ,function(err, data) {
        response.send(err !== null ? err : data);
    });
});

app.get('/backend/blueprints/browse', function(request, response) {
    cloudify4node.browseBlueprint(request.query.id ,function(err, data) {
        response.send(err !== null ? err : data);
    });
});

app.get('/backend/blueprints/browse/file', function(request, response) {
    cloudify4node.browseBlueprintFile(request.query.id, request.query.path ,function(err, data) {
        response.send(err !== null ? err : data);
    });
});

app.get('/backend/executions', function(request, response) {
    cloudify4node.getExecutionById(request.query.executionId, function(err, data) {
        response.send(err !== null ? err : data);
    });
});

app.post('/backend/executions/update', function(request, response) {
    cloudify4node.updateExecutionState(request.body.executionId, request.body.state, function(err, data) {
        response.send(err !== null ? err : data);
    });
});

app.get('/backend/deployments', function(request, response) {
    cloudify4node.getDeployments(function(err, data) {
        response.send(err !== null ? err : data);
    });
});

app.post('/backend/deployments/create', function(request, response) {
    cloudify4node.addDeployment(request.body, function(err, data) {
        response.send(err !== null ? err : data);
    });
});

app.post('/backend/deployments/get', function(request, response) {
    cloudify4node.getDeploymentById(request.body.deployment_id, function(err, data) {
        response.send(err !== null ? err : data);
    });
});

app.post('/backend/deployments/delete', function(request, response) {
    cloudify4node.deleteDeploymentById(request.body.deployment_id, request.body.ignoreLiveNodes, function(err, data) {
        response.send(err !== null ? err : data);
    });
});

app.post('/backend/deployments/nodes', function(request, response) {
    cloudify4node.getDeploymentNodes(request.body.deployment_id, request.body.state, function(err, data) {
        response.send(err !== null ? err : data);
    });
});

app.get('/backend/node-instances', function(request, response) {
    cloudify4node.getNodeInstances(function(err, data) {
        response.send(err !== null ? err : data);
    });
});

app.post('/backend/deployments/executions/get', function(request, response) {
    cloudify4node.getDeploymentExecutions(request.body.deployment_id, function(err, data) {

        response.send(err !== null ? err : data);
    });
});

app.post('/backend/deployments/execute', function(request, response) {
    cloudify4node.executeDeployment(request.body, function(err, data) {
        response.send(err !== null ? err : data);
    });
});

app.get('/backend/provider/context', function(request, response) {
    cloudify4node.getProviderContext(function(err, data) {
        response.send(err !== null ? err : data);
    });
});

app.post('/backend/events/_search', function(request, response) {
    cloudify4node.getEvents(request.body, function(err, data) {
        response.send(err !== null ? err : data);
    });
});

app.post('/backend/deployments/workflows/get', function(request, response) {
    cloudify4node.getWorkflows(request.body.deployment_id, function(err, data) {
        response.send(err !== null ? err : data);
    });
});

app.get('/backend/node-instances', function(request, response) {
    cloudify4node.getNodeInstances(request.query.deployment_id, function(err, data) {
        response.send(err !== null ? err : data);
    });
});

app.post('/backend/node/get', function(request, response) {
    var queryParams = {};
    if (request.body.state !== undefined) {
        queryParams.state = request.body.state;
    }
    if (request.body.state !== undefined) {
        queryParams.runtime = request.body.runtime;
    }
    cloudify4node.getNode(request.body.nodeId, queryParams, function(err, data) {
        response.send(err !== null ? err : data);
    });
});

app.post('/backend/influx', function(request, response) {

    var influxClient = influx({
        host: conf.influx.host,
        username : conf.influx.user,
        password : conf.influx.pass,
        database : conf.influx.dbname
    });

    influxClient.query(request.body.query, function(err, data){
        response.send(err !== null ? err : data);
    });

});

app.get('/backend/monitor/graphs', function(request, response) {
    cloudify4node.getMonitorGraphs(function(err, data) {
        response.send(err !== null ? err : data);
    });
});

app.get('/backend/monitor/cpu', function(request, response) {
    cloudify4node.getMonitorCpu(function(err, data) {
        response.send(err !== null ? err : data);
    });
});

app.get('/backend/monitor/memory', function(request, response) {
    cloudify4node.getMonitorMemory(function(err, data) {
        response.send(err !== null ? err : data);
    });
});

// ui settings REST APIs

app.post('/backend/settings', function(request, response) {
    conf.applyConfiguration(request.body.settings);
    response.send(200);
});

app.get('/backend/settings', function(request, response) {
    response.send(gsSettings.read());
});

app.get('/backend/homepage', function(request, response) {
    var fileExists = gsSettings.read() !== undefined;
    response.send('function isSettingsExists(){return ' + fileExists + ';}');
});

app.get('/backend/configuration', function (request, response) {
    var access = request.query.access,
        dto = {};
    if (access === 'public') {
        _.extend(dto, conf.getPublicConfiguration());
    } else if (access === 'private') {
        _.extend(dto, conf.getPrivateConfiguration());
    } else if (access === 'all') {
        _.extend(dto, conf.getPrivateConfiguration(), conf.getPublicConfiguration());
    }
    response.json(dto);
});


// our custom 'verbose errors' setting
// which we can use in the templates
// via settings['verbose errors']
app.enable('verbose errors');

// disable them in production
// use $ NODE_ENV=production node server.js
if (app.get('env') === 'production') {
    app.disable('verbose errors');
}


// 'app.router' positions our routes
// above the middleware defined below,
// this means that Express will attempt
// to match & call routes _before_ continuing
// on, at which point we assume it's a 404 because
// no route has handled the request.
app.use(app.router);


// host dev files if in dev mode
if (app.get('env') === 'development') {
    app.use(express.static('.tmp'));
    app.use(express.static('app'));
} else {
    app.use(express.static('.'));
}

// Since this is the last non-error-handling
// middleware use()d, we assume 404, as nothing else
// responded.

app.use(function(req, res) {
    res.status(404);

    // respond with html page
    if (req.accepts('html')) {
        res.render('404', { url: req.url });
        return;
    }

    // respond with json
    if (req.accepts('json')) {
        res.send({ error: 'Not found' });
        return;
    }

    // default to plain-text. send()
    res.type('txt').send('Not found');
});

// error-handling middleware, take the same form
// as regular middleware, however they require an
// arity of 4, aka the signature (err, req, res, next).
// when connect has an error, it will invoke ONLY error-handling
// middleware.

// If we were to next() here any remaining non-error-handling
// middleware would then be executed, or if we next(err) to
// continue passing the error, only error-handling middleware
// would remain being executed, however here
// we simply respond with an error page.

app.use(function(err, req, res) {
    // we may use properties of the error object
    // here and next(err) appropriately, or if
    // we possibly recovered from the error, simply next().
    res.status(err.status || (err.status = 500));

    logger.debug('Server error catch-all says: ', err);

    // prevent users from seeing specific error messages in production
    if (app.get('env') !== 'development') {
        var newErr = new Error('Something went wrong. Sorry!');
        newErr.status = err.status;
        err = newErr;
    }

    // respond with json
    if (req.accepts('json')) {
        res.send({
            data: err,
            message: err.message
        });

        return;
    }

    if (req.accepts('html')) {
        res.render('errors', {
            data: err,
            message: err.message
        });

        return;
    }

    // default to plain-text. send()
    res.type('txt').send('Error ' + err.status);
});

/*
 * Status Code pages
 */
app.get('/404', function(req, res, next){
    // trigger a 404 since no other middleware
    // will match /404 after this one, and we're not
    // responding here
    next();
});

app.get('/403', function(req, res, next){
    // trigger a 403 error
    var err = new Error('not allowed!');
    err.status = 403;
    next(err);
});
// todo: do we need this?
app.get('/500', function(req, res, next){
    // trigger a generic (500) error
    next(new Error('keyboard cat!'));
});

// todo: do we need this?
app.get('/', function(/*req, res, next*/){

});


app.listen(port);
logger.debug('Express started on port ' + port);
