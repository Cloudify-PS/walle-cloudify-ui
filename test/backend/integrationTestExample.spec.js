'use strict';

describe('Integration: method name', function () {
    var requiredComponent = require('pathToComponent');

    it('should do something', function() {
        expect(/* Something that was tested */).toBe(/* Test result expectation */);
    });

    it('should do another thing', function() {

        logger.info('Write some log data');
        waitsFor(function () {
            return requiredComponent !== undefined;    // waiting for data to be available
        }, "waiting for upload result", 10000);

        runs(function () {
            // Do something when data is available

            expect(/* Something that was tested */).toBe(/* Test result expectation */);
        });
    });
});
