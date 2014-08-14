'use strict';

describe('Controller: PlansCtrl', function () {

    var PlansCtrl, scope;

    // load the controller's module
    beforeEach(module('cosmoUiApp', 'ngMock'));

    describe('Test setup', function() {
        it ('', inject(function ($controller, $rootScope, $httpBackend, $q, RestService) {
            $httpBackend.whenGET("/backend/configuration?access=all").respond(200);
            $httpBackend.whenGET("/backend/versions/ui").respond(200);
            $httpBackend.whenGET("/backend/versions/manager").respond(200);
            $httpBackend.whenGET("/backend/version/latest?version=00").respond('300');
            $httpBackend.whenGET("/backend/blueprints/browse").respond(200);
            $httpBackend.whenGET("/backend/provider/context").respond(200);

            scope = $rootScope.$new();

            RestService.getBlueprintById = function() {
                var deferred = $q.defer();
                var blueprint = {
                    "id": "blueprint1",
                    "plan": {
                        "nodes": [
                            {
                                "name": "app_module",
                                "type_hierarchy": ["cloudify.types.base", "cloudify.types.app_module", "cloudify.types.puppet.app_module"],
                                "id": "app_module",
                                "host_id": "apache_web_vm",
                                "type": "cloudify.types.puppet.app_module"
                            },
                            {
                                "name": "web_server",
                                "type_hierarchy": ["cloudify.types.base", "cloudify.types.middleware_server", "cloudify.types.web_server", "cloudify.types.puppet.web_server"],
                                "id": "web_server",
                                "host_id": "apache_web_vm",
                                "type": "cloudify.types.puppet.web_server"
                            }
                        ]
                    }
                };

                deferred.resolve(blueprint);

                return deferred.promise;
            };

            PlansCtrl = $controller('PlansCtrl', {
                $scope: scope,
                RestService: RestService
            });

            scope.$digest();
        }));
    });

    describe('Controller tests', function() {

        it('should create a controller', function () {
            expect(PlansCtrl).not.toBeUndefined();
        });

        it('should recognize app modules by its type hierarchy', function () {
            waitsFor(function() {
                return scope.nodesTree.length > 0;
            });

            runs(function() {
                var appNode;
                var webServerNode;
                for(var i = 0; i < scope.nodesTree.length; i++) {
                    if (scope.nodesTree[i].name === 'app_module') {
                        appNode = scope.nodesTree[i];
                    } else {
                        webServerNode = scope.nodesTree[i];
                    }
                }
                expect(appNode.isApp).toBe(true);
                expect(webServerNode.isApp).toBe(false);
            });
        });

    });
});
