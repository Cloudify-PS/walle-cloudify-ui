'use strict';

describe('Service: Debounce', function () {

    // load the service's module
    beforeEach(module('cosmoUiApp'));

    // instantiate service
    var Debounce;
    beforeEach(inject(function (_Debounce_) {
        Debounce = _Debounce_;
    }));

    it('should debounce function', function () {
        var num = 0;
        var addOne = new Debounce(function(){
            num ++;
        },100);

        jasmine.Clock.useMock();
        addOne();
        addOne();
        addOne();
        jasmine.Clock.tick(100);
        addOne();
        addOne();
        addOne();
        jasmine.Clock.tick(100);
        expect(num).toBe(2);
    });
});
