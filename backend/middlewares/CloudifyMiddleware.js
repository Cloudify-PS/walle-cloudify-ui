var CloudifyClient = require('cloudify-js');
var express = require('express');
var app = express();

app.use('/', new CloudifyClient(), function (req, res, next) {
    next();
});