'use strict';
var expect = require('expect.js');
var sinon = require('sinon');




describe('CloudifyMiddleware', function () {
    var middlewares;
    var ClientMock;
    var clientConf = null;
    beforeEach(function () {

        // override cloudify-js
        var module = require('module');

        require('cloudify-js');
        clientConf = null;
        var conf = require('../../../../../backend/appConf');
        conf.cloudifyManagerEndpoint = 'http://cloudify-endpoint';
        //console.log(conf);
        ClientMock = module._cache[require.resolve('cloudify-js')].exports = sinon.spy(function( conf ){
            clientConf = conf;
            console.log('in client', conf);
            return {};
        });





        middlewares = require('../../../../../backend/middlewares');
        //require('cloudify-js') = function(){
        //    console.log('in clouidyf-js');
        //};
    });


    it('should put authentication details if exist on session', function () {
        var req = { 'session' : { 'cloudifyCredentials' : { 'username' : 'foo', 'password' : 'bar'} } };
        middlewares.cloudifyAuthentication(req, {}, function () {
        });

        expect(req.cloudifyAuthHeader).to.be('Basic Zm9vOmJhcg==');
    });


});




