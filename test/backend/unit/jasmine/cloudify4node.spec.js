'use strict';
/*jshint camelcase: false */
var logger = require('log4js').getLogger('cloudify4node.spec');
var cloudify4node = require('../../../../backend/Cloudify4node');

describe('cloudify4node', function () {
    describe('get blueprints', function () {
        it('should not write data', function () {
            var http = require('http'); // guy -todo - add https support for this test..
            var writeIsInvoked = false;

            var old_request = http.request;
            http.request = function () {
                console.log('write is invoked in http');
                var result = old_request.apply(this, arguments);

                var old_write = result.write;

                result.write = function () {
                    logger.info('write is invoked');
                    writeIsInvoked = true;
                    old_write.apply(this, arguments);
                };

                return result;
            };

            var gotBlueprints = false;

            cloudify4node.getBlueprints(function () {
                gotBlueprints = true;

            });

            waitsFor(function () {
                return gotBlueprints;
            }, 'waiting for gotBlueprints', 5000);

            runs(function () {
                expect(writeIsInvoked).toBe(false);
            });

        });
    });
});
