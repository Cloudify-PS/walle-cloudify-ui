'use strict';
var expect = require('expect.js');

/*jshint camelcase: false */
describe('BlueprintsController', function(){

    var BlueprintsController = require('../../../../../backend/controllers/BlueprintsController');
    var sinon = require('sinon');
    var logger = require('log4js').getLogger('testBlueprintsController');
    var fs = require('fs');
    var services = require('../../../../../backend/services');

    var req;
    var res;
    var sandbox;

    var _json = {
        invalidURL: {'type' : 'url', 'opts' : '{"params": {"blueprint_archive_url": "invalid url value"}}'},
        validURL: {'type' : 'url', 'opts' : '{"params": {"blueprint_archive_url": "http://some.url.com"}}'},
        emptyOpts: {'type' : 'url'}
    };

    beforeEach(function(){
        sandbox = sinon.sandbox.create();
        req = { };

        logger.info('cloudify4node exists on services', !!services.cloudify4node);


        res = { status: sinon.spy(function(){
            return res;
        }), send: sinon.spy() };
    });

    afterEach(function(){
        sandbox.restore();
    });

    describe('#upload', function(){

        beforeEach(function(){
            sandbox.stub(fs,'createReadStream');
        });

        afterEach(function(){
            sandbox.restore();
        });


        it('should send status 400 if no body on req', function(){
            BlueprintsController.upload(req, res);
            expect(res.status.calledWith(400)).to.be(true);
        });

        it('should send status 400 if upload type is invliad', function(){
            req.body = { type:'unknown'};
            BlueprintsController.upload(req,res);
            expect(res.status.calledWith(400)).to.be(true);
        });

        it('should open file stream if uploading file', function(){
            req.body = {};
            req.cloudifyClientConf = { 'endpoint' : 'http://localhost'};
            req.body.opts = '{}';
            req.files = { application_archive: 'guy.blueprint.archive', path: '/mock/path' };

            BlueprintsController.upload(req,res);
            expect(fs.createReadStream.called).to.be(true);
        });

        it('should send back error if got one from manager', function(){
            req.body = { };
            req.body.opts = '{}';
            req.files = { application_archive: 'guy.blueprint.archive' };
            sandbox.stub(services.cloudify4node, 'uploadBlueprint', sinon.spy( function( cloudifyConf, stream, opts, callback ){
                callback('error');
            }));


            BlueprintsController.upload(req,res);
            expect(res.send.calledWith('error')).to.be(true);
        });

        it('should send back data if got one from manager', function(){
            req.body = { };
            req.body.opts = '{}';
            req.files = { application_archive: 'guy.blueprint.archive' };

            sandbox.stub(services.cloudify4node,'uploadBlueprint', sinon.spy( function( cloudifyConf, stream, opts, callback ){
                callback(null, 'data');
            }));

            BlueprintsController.upload(req,res);
            expect(res.send.calledWith('data')).to.be(true);
        });

        it('should return code 400 if type is url but url not specified', function(){
            req.body = _json.emptyOpts;

            BlueprintsController.upload(req,res);
            expect(res.status.calledWith(400)).to.be(true);
        });

        it('should return error if url value is invalid', function(){
            req.body = _json.invalidURL;

            BlueprintsController.upload(req,res);
            expect(res.status.calledWith(500)).to.be(true);
        });

        it('should handle errors from getUrls', function(){
            req.body = _json.validURL;

            sandbox.stub(services.httpUtils,'getUrl', sinon.spy(function( url, callback ){
                console.log('inside stub');
                callback(new Error('this is an error'));
            }));
            BlueprintsController.upload(req,res);

            expect(res.status.calledWith(500)).to.be(true);
        });

        it('should handle errors if throws from getUrls', function(){
            req.body = _json.validURL;
            sandbox.stub(services.httpUtils,'getUrl', sinon.spy(function( ){
                throw new Error('unexpected');
            }));
            BlueprintsController.upload(req,res);

            expect(res.status.calledWith(500)).to.be(true);
        });

        it('should upload blueprint from url', function(){
            req.body = _json.validURL;
            req.cloudifyClient = {
                blueprints: {
                    publish_archive: function(){}
                }
            };
            sandbox.stub(req.cloudifyClient.blueprints, 'publish_archive', sinon.spy( function( cloudifyConf, stream, opts, callback ){
                callback(null, 'data');
            }));
            BlueprintsController.upload(req,res);
            expect(res.send.calledWith('data')).to.be(true);
        });


    });
});
