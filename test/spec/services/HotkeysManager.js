'use strict';

describe('Service: HotkeysManager', function () {

    // load the service's module
    beforeEach(module('cosmoUiApp'));

    // instantiate service
    var mHotkeysManager;
    beforeEach(inject(function (HotkeysManager) {
        mHotkeysManager = HotkeysManager;
    }));

    it('should do something', function () {
        expect(!!mHotkeysManager).toBe(true);
    });

});
