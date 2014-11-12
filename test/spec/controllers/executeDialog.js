'use strict';

describe('Controller: ExecuteDialogCtrl', function () {
    var ExecuteDialogCtrl, scope;
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
    var _workflow = {
        "data": {
            "value":"execute_operation",
            "label":"execute_operation",
            "deployment":"deployment1",
            "parameters": {
                "operation_kwargs":{"default":{}},
                "node_ids":{"default":[]},
                "node_instance_ids":{"default":[]},
                "run_by_dependency_order":{"default":false},
                "operation":{},
                "type_names":{"default":[]}}
        }
    };

    beforeEach(module('cosmoUiApp', 'ngMock', 'templates-main'));

    describe('Test setup', function() {
        it ('', inject(function ($controller, $rootScope, $httpBackend, $q, CloudifyService) {
            $httpBackend.whenGET("/backend/configuration?access=all").respond(200);
            $httpBackend.whenGET("/backend/versions/ui").respond(200);
            $httpBackend.whenGET("/backend/versions/manager").respond(200);
            $httpBackend.whenGET("/backend/version/latest?version=00").respond('300');

            scope = $rootScope.$new();

            ExecuteDialogCtrl = $controller('ExecuteDialogCtrl', {
                $scope: scope,
                CloudifyService: CloudifyService
            });

            scope.$digest();
        }));
    });

    describe('Controller tests', function() {
        it('should create a controller', function () {
            expect(ExecuteDialogCtrl).not.toBeUndefined();
        });

        it('should update input JSON object when one of the parameters is updated', function() {
            scope.selectedWorkflow = _workflow;
            scope.inputs = _deployment.inputs;
            scope.inputs['image_name'] = 'new value';

            scope.updateInputs();
            scope.$apply();

            expect(JSON.parse(scope.rawString)['image_name']).toBe('new value');
        });
    });
});
