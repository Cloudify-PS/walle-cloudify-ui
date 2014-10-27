'use strict';

describe('Directive: header', function () {

    var element, scope;
    beforeEach(module('cosmoUiApp', 'ngMock', 'templates-main'));

    function compileDirective(opts) {
        inject(function($compile, $rootScope, $httpBackend) {
            $httpBackend.whenGET("/backend/configuration?access=all").respond(200);
            $httpBackend.whenGET("/backend/versions/ui").respond(200);
            $httpBackend.whenGET("/backend/versions/manager").respond(200);
            $httpBackend.whenGET("/backend/version/latest?version=00").respond('300');

            if (!opts || !opts.scope) {
                scope = $rootScope.$new();
            } else {
                scope = opts.scope;
            }
            element = $compile(angular.element('<div header></div>'))(scope);

            scope.$digest();
        });
    }

    function updateLatestVersion(valid) {
        inject(function($q, CloudifyService) {
            CloudifyService.getLatestVersion = function() {
                var deferred = $q.defer();
                var _version = valid ? '100' : 'invalid result';

                deferred.resolve(_version);

                return deferred.promise;
            };
        });
    }

    describe('Directive tests', function() {

        it('should create an element with searchCloudify function', function() {
            compileDirective();
            expect(typeof(scope.searchCloudify)).toBe('function');
        });

        it('should have a version div', function() {
            compileDirective();
            expect(element.find('div.version-check').length).toBe(1);
        });

        it('should have a version div with 2 sub divs', function() {
            compileDirective();
            expect(element.find('div.version-check div').length).toBe(1);
        });

        it('should show an update available message div when updateVersion variable is true', inject(function($rootScope) {
            var _scope = $rootScope.$new();
            _scope.updateVersion = true;

            compileDirective({scope: _scope});

            expect(element.find('div#needUpdate').hasClass('ng-hide')).toBe(false);
        }));

        it('should not show update message when valid version result returns', inject(function($rootScope) {
            var _scope = $rootScope.$new();
            _scope.updateVersion = false;

            updateLatestVersion(true);
            compileDirective({scope: _scope});

            waitsFor(function() {
                return _scope.updateVersion !== false;
            });
            runs(function() {
                expect(_scope.updateVersion).toBe(true);
            });
        }));

        it('should not show update message when invalid version result returns', inject(function($rootScope) {
            var _scope = $rootScope.$new();
            _scope.updateVersion = true;

            updateLatestVersion(false);
            compileDirective({scope: _scope});

            waitsFor(function() {
                return _scope.updateVersion !== true;
            });
            runs(function() {
                expect(_scope.updateVersion).toBe(false);
            });
        }));
    });
});
