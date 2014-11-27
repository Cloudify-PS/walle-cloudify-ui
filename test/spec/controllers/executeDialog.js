'use strict';

describe('Controller: ExecuteDialogCtrl', function () {
    var ExecuteDialogCtrl, scope;
    var _deployment = {
        "inputs": {
            "webserver_port": 8080,
            "image_name": "image_name",
            "agent_user": "agent_user",
            "flavor_name": "flavor_name",
            "bool_input": false
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
        beforeEach(function() {
            scope.inputs = {
                "webserver_port": 8080,
                "image_name": "image_name",
                "agent_user": "agent_user",
                "flavor_name": "flavor_name",
                "bool_variable": false,
                "str_variable": "some string"
            };
        });

        it('should create a controller', function () {
            expect(ExecuteDialogCtrl).not.toBeUndefined();
        });

        it('should update input JSON object when one of the parameters is updated', function() {
            scope.selectedWorkflow = _workflow;
            scope.inputs['image_name'] = 'new value';
            scope.inputsState = 'raw';

            scope.updateInputs();

            expect(JSON.parse(scope.rawString)['image_name']).toBe('new value');
        });

        it('should keep input type when converting to JSON object', function() {
            scope.selectedWorkflow = _workflow;
            scope.inputsState = 'raw';

            scope.updateInputs();

            expect(typeof(JSON.parse(scope.rawString)['str_variable'])).toBe('string');
            expect(typeof(JSON.parse(scope.rawString)['webserver_port'])).toBe('number');
            expect(typeof(JSON.parse(scope.rawString)['bool_variable'])).toBe('boolean');
        });
    });
});
