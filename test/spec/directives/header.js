'use strict';

describe('Directive: header', function () {

    var element, scope;
    beforeEach(module('cosmoUiApp', 'ngMock', 'templates-main'));

    describe('Test setup', function() {
        it ('', inject(function ($compile, $rootScope, $httpBackend, $q, CloudifyService) {
            $httpBackend.whenGET("/backend/configuration?access=all").respond(200);
            $httpBackend.whenGET("/backend/versions/ui").respond(200);
            $httpBackend.whenGET("/backend/versions/manager").respond(200);
            $httpBackend.whenGET("/backend/version/latest?version=00").respond('300');

            CloudifyService.getLatestVersion = function() {
                var deferred = $q.defer();
                var _version = 'invalid result';

                deferred.resolve(_version);

                return deferred.promise;
            };

            scope = $rootScope.$new();
            element = $compile(angular.element('<div header></div>'))(scope);

            scope.$digest();
        }));
    });

    describe('Directive tests', function() {

        it('should create an element with searchCloudify function', function() {
            expect(typeof(scope.searchCloudify)).toBe('function');
        });

        it('should have a version div', function() {
            expect(element.find('div.version-check').length).toBe(1);
        });

        it('should have a version div with 2 sub divs', function() {
            expect(element.find('div.version-check div').length).toBe(1);
        });

        it('should show an update available message div when updateVersion variable is true', function() {
            scope.updateVersion = true;
            scope.$digest();

            expect(element.find('div#notUpdated').hasClass('ng-hide')).toBe(false);
        });

        it('should not show update message when valid version result returns', function() {
            scope.updateVersion = false;
            scope.$digest();

            waitsFor(function() {
                return scope.updateVersion !== null;
            });
            runs(function() {
                expect(scope.updateVersion).toBe(true);
            });
        });

        it('should not show update message when invalid version result returns', function() {
            scope.updateVersion = false;
            scope.$digest();

            waitsFor(function() {
                return scope.updateVersion !== true;
            });
            runs(function() {
                expect(scope.updateVersion).toBe(false);
            });
        });
    });
});
