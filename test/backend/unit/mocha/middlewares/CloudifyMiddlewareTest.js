'use strict';
var expect = require('expect.js');
var sinon = require('sinon');




describe('CloudifyMiddleware', function () {
    var middleware;
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





        middleware = require('../../../../../backend/middlewares/CloudifyMiddleware');
        //require('cloudify-js') = function(){
        //    console.log('in clouidyf-js');
        //};
    });

    it('should put cloudify client on request', function () {
        var req = {session: {}};
        middleware(req, {}, function () {
        });
        expect(!!req.cloudifyClient).to.be(true);
        expect(!!req.cloudifyClientConf).to.be(true);
        expect(req.cloudifyClientConf.endpoint).to.be('http://cloudify-endpoint');
        expect(req.cloudifyClientConf.cloudifyAuth).to.be(undefined);
    });

    it('should put authentication details if exist on session', function () {
        var req = { 'session' : { 'cloudifyCredentials' : { 'username' : 'foo', 'password' : 'bar'} } };
        middleware(req, {}, function () {
        });

        expect(req.cloudifyClientConf.cloudifyAuth.user).to.be('foo');
        expect(req.cloudifyClientConf.cloudifyAuth.pass).to.be('bar');
    });


});




