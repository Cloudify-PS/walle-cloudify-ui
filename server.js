'use strict';

/*
 * Express Dependencies
 */

function isLocalhost(){
    return process.env.GS_UI_NODE_ENV == "localhost";
}

var express = require('express');
var ajax = require("http");
var app = express();
var port = 9001;
var gsSettings = require("./backend/gsSettings");
var gsWhitelabel = require("./backend/gsWhitelabel");
var conf = require("./backend/appConf");
var cloudify4node;

if (conf.useMock) {
    cloudify4node = require("./backend/Cloudify4node-mock");
} else {
    cloudify4node = require("./backend/Cloudify4node");
}

console.log(JSON.stringify(conf));

if (conf.cloudifyLicense !== 'tempLicense') {
    throw new Error('invalid license');
}

app.enable("jsonp callback");

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
    console.log('Setting production env variable');
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

app.get('/backend/blueprints', function(request, response, next) {
    cloudify4node.getBlueprints(function(err, data) {
        response.send(err !== null ? err : data);
    });
});

app.post('/backend/blueprints/add', function(request, response){
    cloudify4node.addBlueprint(request.files.application_archive, function(err, data) {
        response.send(err !== null ? err : data);
    });
});

app.get('/backend/blueprints/get', function(request, response) {
    cloudify4node.getBlueprintById(request.query.id, function(err, data) {
        response.send(err !== null ? err : data);
    });
});

app.get('/backend/blueprints/validate', function(request, response) {
    cloudify4node.validateBlueprint(request.body.id ,function(err, data) {
        response.send(err !== null ? err : data);
    });
});

app.get('/backend/executions', function(request, response) {
    cloudify4node.getExecutionById(request.query.executionId, function(err, data) {
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

app.get('/backend/deployments/get', function(request, response) {
    cloudify4node.getDeploymentById(request.query.deploymentId, function(err, data) {
        response.send(err !== null ? err : data);
    });
});

app.get('/backend/deployments/executions/get', function(request, response) {
    cloudify4node.getDeploymentExecutions(request.body.deploymentId, function(err, data) {
        response.send(err !== null ? err : data);
    });
});

app.post('/backend/deployments/execute', function(request, response) {
    cloudify4node.executeDeployment(request.body, function(err, data) {
        response.send(err !== null ? err : data);
    });
});

app.post('/backend/events', function(request, response, next) {
    cloudify4node.getDeploymentEvents(request.body.deploymentId, request.body.from, function(err, data) {
        response.send(err !== null ? err : data);
    });
});


// ui settings REST APIs

app.post('/backend/settings', function(request, response) {
    conf.applyConfiguration(request.body.settings);
});

app.get('/backend/settings', function(request, response) {
    response.send(gsSettings.read());
});

app.get('/backend/homepage', function(request, response) {
    var fileExists = gsSettings.read() !== undefined;
    response.send("function isSettingsExists(){return " + fileExists + ";}");
});


// whitelabeling REST APIs

app.get('/backend/whitelabel', function(request, response) {
    // jsonp is allowed by calling '/backend/whitelabel?callback=myFunction'
    response.json(gsWhitelabel.read());
});


// our custom "verbose errors" setting
// which we can use in the templates
// via settings['verbose errors']
app.enable('verbose errors');

// disable them in production
// use $ NODE_ENV=production node server.js
if (app.get('env') === 'production') {
    app.disable('verbose errors');
}


// "app.router" positions our routes
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

app.use(function(req, res, next) {
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

app.use(function(err, req, res, next) {
    // we may use properties of the error object
    // here and next(err) appropriately, or if
    // we possibly recovered from the error, simply next().
    res.status(err.status || (err.status = 500));

    console.error('Server error catch-all says: ', err);

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

app.get('/500', function(req, res, next){
    // trigger a generic (500) error
    next(new Error('keyboard cat!'));
});

app.get('/', function(req, res, next){

});


app.listen(port);
console.log('Express started on port ' + port);