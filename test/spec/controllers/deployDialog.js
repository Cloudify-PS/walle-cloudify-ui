'use strict';

describe('Controller: DeploydialogCtrl', function () {
    var DeployDialogCtrl, scope;
    var _deployment = {
        "inputs": {
            "webserver_port": 8080,
            "image_name": "image_name",
            "agent_user": "agent_user",
            "flavor_name": "flavor_name"
        },
        "blueprint_id": "blueprint1",
        "id": "deployment1",
        "outputs": {
            "http_endpoint": {
                "description": "HTTP web server endpoint.",
                "value": {
                    "get_attribute": ["vm", "ip"]
                }
            }
        }
    };

    var _error = {
        "message": "Required input 'image_name' was not specified - expected inputs: [u'webserver_port', u'image_name', u'flavor_name', u'agent_user']",
        "error_code": "missing_required_deployment_input_error"
    };

    beforeEach(module('cosmoUiApp', 'ngMock', 'templates-main'));

    describe('Test setup', function() {
        it ('', inject(function ($controller, $rootScope, $httpBackend, $q, RestService) {
            $httpBackend.whenGET("/backend/configuration?access=all").respond(200);
            $httpBackend.whenGET("/backend/versions/ui").respond(200);
            $httpBackend.whenGET("/backend/versions/manager").respond(200);
            $httpBackend.whenGET("/backend/version/latest?version=00").respond('300');

            scope = $rootScope.$new();

            RestService.deployBlueprint = function(params) {
                var deferred = $q.defer();

                deferred.resolve(params.inputs.image_name === undefined ? _error : _deployment);

                return deferred.promise;
            };

            scope.redirectToDeployment = function(deployment_id, blueprintId) {};

            DeployDialogCtrl = $controller('DeployDialogCtrl', {
                $scope: scope,
                RestService: RestService
            });

            scope.$digest();
        }));
    });

    describe('Controller tests', function() {
        it('should create a controller', function () {
            expect(DeployDialogCtrl).not.toBeUndefined();
        });

        it('should disable blueprint deploy option if deployment name is not provided', function() {
            scope.deployment_id = null;

            expect(scope.isDeployEnabled()).toBe(false);
        });

        it('should enable blueprint deploy option if deployment name is not provided', function() {
            scope.deployment_id = 'deployment1';

            expect(scope.isDeployEnabled()).toBe(true);
        });

        it('should show error message if inputs parameters are not provided', function() {
            scope.inputs = {};

            scope.deployBlueprint('blueprint1');
            scope.$apply();

            waitsFor(function() {
                return scope.inProcess === false;
            });
            runs(function() {
                expect(scope.deployErrorMessage).toBe(_error.message);
                expect(scope.deployError).toBe(true);
            });
        });

        it('should pass all params provided to RestService on deployment creation', function() {
            scope.inputs = {
                "agent_user": "agent_user",
                "flavor_name": "flavor_name",
                "image_name": "image_name",
                "webserver_port":" webserver_port"
            };
            spyOn(scope, 'redirectToDeployment').andCallThrough();

            scope.deployBlueprint('blueprint1');
            scope.$apply();

            waitsFor(function() {
                return scope.inProcess === false;
            });
            runs(function() {
                expect(scope.redirectToDeployment).toHaveBeenCalledWith('deployment1', 'blueprint1');
            });
        });
    });
});
