'use strict';

describe('Controller: LogsCtrl', function () {
    var LogsCtrl, scope;

    beforeEach(module('cosmoUiApp', 'ngMock'));

    describe('Test setup', function() {
        it ('', inject(function ($controller, $rootScope, $httpBackend, $q, CloudifyService) {

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
                        filterRemove: function() {},
                        filter: function() {},
                        execute: function() {}
                    };
                }
            };

            CloudifyService.blueprints.list = function() {
                var deferred = $q.defer();
                var blueprints = [
                    {
                        "id": "blueprint1",
                        "deployments": [
                            {
                                "blueprint_id": "blueprint1",
                                "id": "firstDep"
                            },
                            {
                                "blueprint_id": "blueprint1",
                                "id": "secondDep"
                            }
                        ]
                    },
                    {
                        "id": "blueprint2",
                        "deployments": [
                            {
                                "blueprint_id": "blueprint2",
                                "id": "onlyOneDeployment"
                            }
                        ]
                    }
                ];
                deferred.resolve(blueprints);
                return deferred.promise;
            };

            CloudifyService.deployments.getDeploymentExecutions = function() {
                var deferred = $q.defer();
                deferred.resolve([]);
                return deferred.promise;
            };

            LogsCtrl = $controller('LogsCtrl', {
                $scope: scope,
                EventsService: EventsService,
                CloudifyService: CloudifyService
            });

            scope.$digest();
        }));
    });

    describe('Controller tests', function() {

        it('should create a controller', function () {
            expect(LogsCtrl).not.toBeUndefined();
        });

        it('should select all blueprints and show their events from the last 5 minutes on first page entry', function() {
            scope.$apply();

            waitsFor(function() {
                return scope.eventsFilter.blueprints.length > 0;
            }, "The eventsFilter of blueprints should be incremented", 1000);

            runs(function() {
                expect(JSON.stringify(scope.eventsFilter.blueprints)).toBe(JSON.stringify(scope.blueprintsList));
            });
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
