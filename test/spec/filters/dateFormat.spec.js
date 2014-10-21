'use strict';

describe('Filter: dateFormat', function () {
    var dateFormat;

    describe('Test setup', function() {
        it('Injecting required data & initializing a new instance', function() {
            // load the filter's module
            module('cosmoUiApp', 'ngMock');

            // initialize a new instance of the filter
            inject(function ($filter, $httpBackend) {
                $httpBackend.whenGET("/backend/configuration?access=all").respond(200);
                $httpBackend.whenGET("/backend/versions/ui").respond(200);
                $httpBackend.whenGET("/backend/versions/manager").respond(200);
                $httpBackend.whenGET("/backend/version/latest?version=00").respond('300');

                dateFormat = $filter('dateFormat');
            });
        });
    });

    describe('Unit tests', function() {
        it('has a dateFormat filter', function(){
            expect(dateFormat).not.toBeUndefined();
        });

        it('should return the input by requested yyyy-MM-dd HH:mm:ss format', function() {
            var text = '2011-11-24T07:00:00+0000';
            var format = 'yyyy-MM-dd HH:mm:ss';

            expect(dateFormat(text, format)).toBe('2011-11-24 07:00:00');
        });

        it('should accept only valid format', function() {
            var text = '20111124T090027';
            var timeFormat = 'HH:mm:ss';

            expect(dateFormat(text, timeFormat)).toBe('NaN:NaN:NaN');
        });
    });
});
