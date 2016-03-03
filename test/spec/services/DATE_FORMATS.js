'use strict';

describe('Service: DATE_FORMATS', function () {

    // load the service's module
    beforeEach(module('cosmoUiApp'));

    // instantiate service
    var mDATE_FORMATS;

    beforeEach(inject(function (DATE_FORMATS) {
        mDATE_FORMATS = DATE_FORMATS;
    }));

    it('should check date formats', function () {
        expect(mDATE_FORMATS).toEqual({
            short: 'yyyy-MM-dd HH:mm:ss',
            long: 'yyyy-MM-dd HH:mm:ss.sss'
        });
    });
});
