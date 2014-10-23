'use strict';

describe('Directive: deploymentLayout', function () {

    var element, scope;

    beforeEach(module('cosmoUiApp', 'ngMock', 'templates-main'));

    describe('Test setup', function() {
        it ('', inject(function ($compile, $rootScope, $httpBackend, $q, CloudifyService) {
            $httpBackend.whenGET("/backend/configuration?access=all").respond(200);
            $httpBackend.whenGET("/backend/versions/ui").respond(200);
            $httpBackend.whenGET("/backend/versions/manager").respond(200);
            $httpBackend.whenGET("/backend/version/latest?version=00").respond('300');
            $httpBackend.whenGET("/backend/deployments/executions/get").respond(200);
            $httpBackend.whenPOST("/backend/deployments/get").respond(200);
            $httpBackend.whenPOST("/backend/nodes").respond(200);

            scope = $rootScope.$new();
            element = $compile(angular.element('<div deployment-layout></div>'))(scope);

            CloudifyService.deployments.getDeploymentById = function() {
                var deferred = $q.defer();
                var deployment = {
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

                deferred.resolve(deployment);

                return deferred.promise;
            };

            scope.$digest();
        }));
    });

    describe('Directive tests', function() {
        it('should create an element with isExecuteEnabled function', function() {
            expect(typeof(element.children().scope().isExecuteEnabled)).toBe('function');
        });

        it('should define the url to blueprint topology in the breadcrumbs', function() {
            scope.$apply();

            waitsFor(function() {
                return element.children().scope().breadcrumb.length > 0;
            });
            runs(function() {
                console.log('test href', element.children().scope().breadcrumb);
                expect(element.children().scope().breadcrumb[0].href).toBe('#/blueprint/blueprint1/topology');
            });

        });
    });

});
