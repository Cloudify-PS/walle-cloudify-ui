'use strict';
var expect = require('expect.js');

describe('GsHttpUtils', function(){

    var GsHttpUtils = require('../../../../../backend/services/GsHttpUtils');
    var sinon = require('sinon');
    var logger = require('log4js').getLogger('testGsHttpUtils');
    var http = require('http');
    var https = require('https');
    var sandbox;
    var getResponse = null;

    beforeEach(function(){
        sandbox = sinon.sandbox.create();
        getResponse = {
            statusCode: 200,
            headers : {},
            extra: 'this is test response'
        };

        function returnTestResponse( url, callback ){
            if ( url.indexOf('noredirect') > 0){
                callback( {
                    statusCode:301

                });
                return;
            }
            else if ( url.indexOf('redirect') > 0 ){
                callback({
                    statusCode: 301,
                    headers: { 'location' : 'http://some.other.url' }
                });
                return;
            }else{
                return callback(getResponse);
            }

        }

        sandbox.stub(http,'get', returnTestResponse);
        sandbox.stub(https,'get', returnTestResponse);

    });

    afterEach(function(){
        getResponse = null;
        sandbox.restore();
    });

    describe('getUrl', function( ){
        it('should return error if url is empty',function(){
            GsHttpUtils.getUrl(null, function(err){
                expect(!!err).to.be(true);
            });
        });

        it('should return error if request does not start with http or https', function(){
            GsHttpUtils.getUrl('my url', function(err){
                expect(!!err).to.be(true);
            });
        });


        var callback =  function(err){
            if ( !!err ){
                logger.error('should not get this', err);
            }
        };

        it('should invoke get on https', function(){
            var httpsValidUrl = 'https://this.is.valid';

            GsHttpUtils.getUrl(httpsValidUrl, callback );
            expect(https.get.calledWith(httpsValidUrl)).to.be(true);
        });
        it('should invoke get on http', function(){
            var httpValidUrl = 'http://this.is.valid';

            GsHttpUtils.getUrl(httpValidUrl ,callback);
            expect(http.get.calledWith(httpValidUrl)).to.be(true);

        });

        it('should return response untouched', function(){
            GsHttpUtils.getUrl('http://valid.com', function( err, res){
                expect(!!err).to.be(false);
                expect(res.extra).to.be('this is test response');
            });
        });

        it('should follow redirects if location is on header', function(){

            GsHttpUtils.getUrl('http://do.redirect.com', function(){
                expect(http.get.calledWith('http://some.other.url')).to.be(true);
            });
        });

        it('should fail if return code not 200 and no redirect details specified on response', function(){
            GsHttpUtils.getUrl('http://do.noredirect.com', function( err ){
                expect(!!err).to.be(true);
            });
        });

    });


});