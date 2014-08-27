'use strict';

describe('Controller: BlueprintsIndexCtrl', function () {

    var BlueprintsIndexCtrl, scope, restService;

    // load the controller's module
    beforeEach(module('cosmoUiApp', 'ngMock'));

    describe('Test setup', function() {
        it ('', inject(function ($controller, $rootScope, $httpBackend, $q, RestService) {
            $httpBackend.whenGET("/backend/configuration?access=all").respond(200);
            $httpBackend.whenGET("/backend/versions/ui").respond(200);
            $httpBackend.whenGET("/backend/versions/manager").respond(200);
            $httpBackend.whenGET("/backend/version/latest?version=00").respond('300');

            scope = $rootScope.$new();
            restService = RestService;

            restService.loadBlueprints = function() {
                var deferred = $q.defer();
                var blueprints = [
                    {
                        "updated_at": "2014-08- 21 00:54:04.878540",
                        "created_at": "2014-08-21 00:54:04.878540",
                        "id": "blueprint1",
                        "deployments": []
                    }, {
                        "updated_at": "2014-08-17 01:13:10.905309",
                        "created_at": "2014-08-17 01:13:10.905309",
                        "id": "blueprint2",
                        "deployments": [{
                            "workflows": [{
                                "created_at": null,
                                "name": "install",
                                "parameters": []
                            }, {
                                "created_at": null,
                                "name": "uninstall",
                                "parameters": []
                            }],
                            "created_at": "2014-08-17 04:07:46.933729",
                            "blueprint_id": "nodecellar",
                            "id": "deployment1",
                            "updated_at": "2014-08-17 04:07:46.933729"
                        }
                    ]
                }];

                deferred.resolve(blueprints);

                return deferred.promise;
            };

            restService.deleteBlueprint = function() {
                var deferred = $q.defer();
                var blueprint = {
                        "id": "blueprint1"
                    };

                deferred.resolve(blueprint);

                return deferred.promise;
            };

            BlueprintsIndexCtrl = $controller('BlueprintsIndexCtrl', {
                $scope: scope,
                RestService: restService
            });

            scope.$digest();
        }));
    });

    describe('Controller tests', function() {
        it('should create a controller', function () {
            expect(BlueprintsIndexCtrl).not.toBeUndefined();
        });

        it('should load blueprints list', function() {
            waitsFor(function() {
                return scope.blueprints !== null;
            });

            runs(function() {
                expect(scope.blueprints.length).toBe(2);
            });
        });

        it('should toggle delete confirmation dialog when deleteBlueprint function is triggered', function() {
            var blueprintToDelete = scope.blueprints[0];
            spyOn(scope, 'toggleDeleteDialog').andCallThrough();

            scope.deleteBlueprint(blueprintToDelete);

            expect(scope.delBlueprintName).toBe(blueprintToDelete.id);
            expect(scope.toggleDeleteDialog).toHaveBeenCalled();
        });

        it('should delete a blueprint by calling method to refresh blueprints list', function() {
            spyOn(restService, 'deleteBlueprint').andCallThrough();

            scope.confirmDeleteBlueprint();

            waitsFor(function() {
                return scope.deleteInProcess === true;
            });

            runs(function() {
                expect(restService.deleteBlueprint).toHaveBeenCalled();
            });
        });
    });
});
