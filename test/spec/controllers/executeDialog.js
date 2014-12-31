'use strict';

describe('Controller: ExecuteDialogCtrl', function () {
    /*jshint camelcase: false */
    var ExecuteDialogCtrl, _cloudifyService, scope;
    var _workflow = {
        'data': {
            'value': 'execute_operation',
            'label': 'execute_operation',
            'deployment': 'deployment1',
            'parameters': {
                'operation_kwargs': {'default': {}},
                'node_ids': {'default': []},
                'node_instance_ids': {'default': []},
                'run_by_dependency_order': {'default': false},
                'operation': {},
                'type_names': {
                    'default': []
                }
            }
        }
    };
    var _executionError = {
        'error_code': '1',
        'message': 'Error'
    };
    var _execution = {};

    beforeEach(module('cosmoUiApp', 'ngMock', 'templates-main'));

    describe('Test setup', function () {
        it('', inject(function ($controller, $rootScope, $httpBackend, $q, CloudifyService) {
            $httpBackend.whenGET('/backend/configuration?access=all').respond(200);
            $httpBackend.whenGET('/backend/versions/ui').respond(200);
            $httpBackend.whenGET('/backend/versions/manager').respond(200);
            $httpBackend.whenGET('/backend/version/latest?version=00').respond('300');

            scope = $rootScope.$new();

            _cloudifyService = CloudifyService;
            _cloudifyService.deployments.execute = function (executionData) {
                var deferred = $q.defer();

                deferred.resolve(executionData.inputs === undefined || JSON.stringify(executionData.inputs) === '{}' ? _executionError : _execution);

                return deferred.promise;
            };

            _cloudifyService.deployments.updateExecutionState = function (execution_id) {
                var deferred = $q.defer();

                deferred.resolve(execution_id);

                return deferred.promise;
            };

            ExecuteDialogCtrl = $controller('ExecuteDialogCtrl', {
                $scope: scope,
                CloudifyService: _cloudifyService
            });

            scope.$digest();
        }));
    });

    describe('Controller tests', function () {
        beforeEach(function () {
            scope.inputs = {
                'webserver_port': 8080,
                'image_name': 'image_name',
                'agent_user': 'agent_user',
                'flavor_name': 'flavor_name',
                'bool_variable': false,
                'str_variable': 'some string'
            };
        });

        it('should create a controller', function () {
            expect(ExecuteDialogCtrl).not.toBeUndefined();
        });

        it('should update input JSON object when one of the parameters is updated', function () {
            scope.selectedWorkflow = _workflow;
            scope.inputs.image_name = 'new value';
            scope.inputsState = 'raw';

            scope.updateInputs();

            expect(JSON.parse(scope.rawString).image_name).toBe('new value');
        });

        it('should keep input type when converting to JSON object', function () {
            scope.selectedWorkflow = _workflow;
            scope.inputsState = 'raw';

            scope.updateInputs();

            expect(typeof(JSON.parse(scope.rawString).str_variable)).toBe('string');
            expect(typeof(JSON.parse(scope.rawString).webserver_port)).toBe('number');
            expect(typeof(JSON.parse(scope.rawString).bool_variable)).toBe('boolean');
        });

        it('should show error message if required parameters are not provided', function () {
            scope.rawString = '{}';
            scope.inputs = {};
            scope.toggleConfirmationDialog = function () {
            };
            scope.isExecuteEnabled = function () {
                return true;
            };

            scope.executeWorkflow();
            scope.$apply();

            waitsFor(function () {
                return scope.executeErrorMessage !== false;
            });
            runs(function () {
                expect(scope.executeErrorMessage).toBe(_executionError.message);
            });
        });

        it('should cancel execution by its id', function () {
            spyOn(_cloudifyService.deployments, 'updateExecutionState').andCallThrough();

            scope.cancelWorkflow('123');

            expect(_cloudifyService.deployments.updateExecutionState).toHaveBeenCalledWith({ execution_id: '123', state: 'cancel' });
        });
    });
});
