'use strict';

describe('Controller: LogsCtrl', function () {
    var LogsCtrl, scope;

    beforeEach(module('cosmoUiApp', 'ngMock'));

    describe('Test setup', function() {
        it ('', inject(function ($controller, $rootScope, $httpBackend) {

            $httpBackend.whenGET("/backend/configuration?access=all").respond(200);
            $httpBackend.whenGET("/backend/versions/ui").respond(200);
            $httpBackend.whenGET("/backend/versions/manager").respond(200);
            $httpBackend.whenGET("/backend/version/latest?version=00").respond('300');
            $httpBackend.whenGET("/backend/blueprints").respond(200);

            scope = $rootScope.$new();

            var EventsService = {
                newInstance: function() {
                    return {
                        filterRange: function() {},
                        filter: function() {}
                    };
                }
            };

            LogsCtrl = $controller('LogsCtrl', {
                $scope: scope,
                EventsService: EventsService
            });

            scope.$digest();
        }));
    });

    describe('Controller tests', function() {

        it('should create a controller', function () {
            expect(LogsCtrl).not.toBeUndefined();
        });

        it('should set isSearchDisabled flag to true if no blueprints were selected', function() {
            scope.isSearchDisabled = false;
            scope.eventsFilter.blueprints = [];

            scope.$apply();

            expect(scope.isSearchDisabled).toBe(true);
        });

        it('should set isSearchDisabled flag to false if blueprints were selected', function() {
            scope.isSearchDisabled = true;
            scope.eventsFilter.blueprints = [{
                name: 'blueprint1'
            }];

            scope.$apply();

            expect(scope.isSearchDisabled).toBe(false);
        });
    });
});
