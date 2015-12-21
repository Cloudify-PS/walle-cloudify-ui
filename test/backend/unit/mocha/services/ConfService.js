'use strict';
console.log('starting task');
var expect = require('expect.js');
var sinon = require('sinon');
//var logger = require('log4js').getLogger('ConfServiceTest');

var mockRequire = require('mock-require');


var conf;
function loadService(){
    conf = require('../../../../../backend/appConf');
}

function unloadService(){
    delete require.cache[require.resolve('../../../../../backend/appConf')];
}


describe('ConfService',function(){

    beforeEach(unloadService);
    it('should call timeout if all urls returns error CFY-3576', sinon.test(function(){
        mockRequire('request', function( opts , callback ){
            callback('error');
        });
        global.setTimeout = this.spy();
        loadService();
        expect( global.setTimeout.callCount).to.be(1);
    }));

    it('should set the successful protocol', sinon.test(function(){

        var successProtocol = 'https://';
        var rawEndpoint = conf.cloudifyManagerEndpoint.replace('http://', '').replace('https://', '');
        mockRequire('request', function( opts , callback ){
            if ( opts.url.indexOf(successProtocol) === 0){
                var request = {uri: {href: successProtocol + rawEndpoint +'blueprints'}};
                callback(null, {
                    statusCode: 200,
                    toJSON: function () {
                        return JSON.stringify({'key': 'mock_JSON', 'request': request});
                    },
                    'request': request
                });
            }else {
                callback('error');
            }
        });
        loadService();
        console.log('this is endpoint',conf.cloudifyManagerEndpoint);
        expect(conf.cloudifyManagerEndpoint.indexOf(successProtocol)).to.be(0);
        unloadService();
        successProtocol = 'http://';
        loadService();
        expect(conf.cloudifyManagerEndpoint.indexOf(successProtocol)).to.be(0);

    }));
});

