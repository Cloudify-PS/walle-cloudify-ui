'use strict';

describe('Filter: limitRange', function () {
    var limitRange;

    describe('Test setup', function () {
        it('Injecting required data & initializing a new instance', function () {
            // load the filter's module
            module('cosmoUiApp', 'ngMock', 'backend-mock');

            // initialize a new instance of the filter
            inject(function ($filter, $httpBackend) {
                $httpBackend.whenGET('/backend/configuration?access=all').respond(200);
                $httpBackend.whenGET('/backend/versions/ui').respond(200);
                $httpBackend.whenGET('/backend/versions/manager').respond(200);
                $httpBackend.whenGET('/backend/version/latest?version=00').respond('300');

                limitRange = $filter('limitRange');
            });
        });
    });

    describe('Unit tests', function () {
        it('has a limitRange filter', function () {
            expect(limitRange).not.toBeUndefined();
        });

        it('should return a sliced data according to parameters', function () {
            var text = 'fulltext';
            var result = limitRange(text, 4, text.length);

            expect(result).toBe('text');
        });
    });
});
