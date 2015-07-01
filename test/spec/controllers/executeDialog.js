'use strict';

describe('Controller: ExecuteDialogCtrl', function () {
    /*jshint camelcase: false */
    var ExecuteDialogCtrl, scope;
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
        'data': {
            'error_code': '1',
            'message': 'Error'
        }
    };
    var _execution = {};

    beforeEach(module('cosmoUiApp', 'ngMock', 'templates-main', 'backend-mock'));

    beforeEach(inject(function ($controller, $rootScope, $httpBackend, $q, CloudifyService) {
        scope = $rootScope.$new();

        CloudifyService.deployments.execute = function (executionData) {
            var deferred = $q.defer();

            if (executionData.inputs === undefined || JSON.stringify(executionData.inputs) === '{}') {
                deferred.reject(_executionError);
            } else {
                deferred.resolve(_execution);
            }

            return deferred.promise;
        };

        CloudifyService.deployments.updateExecutionState = function (execution_id) {
            var deferred = $q.defer();

            if (execution_id) {
                deferred.reject(_executionError);
            } else {
                deferred.resolve(execution_id);
            }

            return deferred.promise;
        };

        ExecuteDialogCtrl = $controller('ExecuteDialogCtrl', {
            $scope: scope,
            CloudifyService: CloudifyService
        });

    }));

    describe('Controller tests', function () {
        beforeEach(function() {
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

        it('should show error message if required parameters are not provided', inject(function (CloudifyService) {
            var executeParams = null;
            spyOn(CloudifyService.deployments, 'execute').andCallFake(function (params) {
                executeParams = params;
                return {
                    then: function(success, error) {
                        error({'data': {'message': 'foo'}});
                    }
                };
            });

            scope.toggleConfirmationDialog = function () {
            };

            spyOn(scope, 'isExecuteEnabled').andCallFake(function () {
                return true;
            });

            scope.rawString = '{}';
            scope.inputs = {};
            scope.executeErrorMessage = '';
            scope.selectedWorkflow = {
                data: {

                }
            };

            scope.executeWorkflow();

            expect(scope.executeErrorMessage).toBe('foo');
            expect(scope.showError).toBe(true);
        }));

        it('should cancel execution by its id', inject(function (CloudifyService) {
            spyOn(CloudifyService.deployments, 'updateExecutionState').andCallThrough();

            scope.cancelWorkflow('123');

            expect(CloudifyService.deployments.updateExecutionState).toHaveBeenCalledWith({
                execution_id: '123',
                state: 'cancel'
            });
        }));

        it('should show error message if cancel execution fails', inject(function (CloudifyService) {
            var executeParams = null;
            spyOn(CloudifyService.deployments, 'updateExecutionState').andCallFake(function (params) {
                executeParams = params;
                return {
                    then: function(success, error) {
                        error({'data': {'message': 'foo'}});
                    }
                };
            });

            scope.toggleConfirmationDialog = function () {
            };

            spyOn(scope, 'isExecuteEnabled').andCallFake(function () {
                return true;
            });

            scope.executeErrorMessage = '';

            scope.cancelWorkflow();

            expect(scope.executeErrorMessage).toBe('foo');
            expect(scope.showError).toBe(true);
        }));

        it('should close dialog when pressing the cancel button', inject(function(ngDialog, $timeout) {
            scope.selectedWorkflow = _workflow;
            var id = ngDialog.open({
                template: 'views/dialogs/confirm.html',
                controller: 'ExecuteDialogCtrl',
                scope: scope,
                className: 'confirm-dialog'
            }).id;
            $timeout.flush();


            var elemsQuery = '#' + id + ' .confirmationButtons [ng-click="closeThisDialog()"]';
            var elems = $(elemsQuery);
            expect(elems.length).toBe(2);


            elems.remove();
            ngDialog.closeAll(); //https://github.com/likeastore/ngDialog/issues/263
            expect($(elemsQuery).length).toBe(0);
        }));

        it('should have a scrollbar if overflow', inject(function(ngDialog, $timeout) {
            scope.selectedWorkflow = _workflow;

            var dialogId = ngDialog.open({
                template: 'views/dialogs/confirm.html',
                controller: 'ExecuteDialogCtrl',
                scope: scope,
                className: 'confirm-dialog'
            }).id;
            $timeout.flush();
            var inputParameters = $('#'+dialogId+' .inputsParameters ul')[0];

            function hasScrollbar (element){
                return element.scrollHeight > element.clientHeight;
            }
            var elementHasScrollbar = hasScrollbar(inputParameters);
            inputParameters = null;
            ngDialog.closeAll();

            expect(elementHasScrollbar).toBe(true);
        }));

        it('should not have a scrollbar if does not overflow', inject(function(ngDialog, $timeout) {
            scope.selectedWorkflow = angular.copy(_workflow);
            scope.selectedWorkflow.data.parameters = {1:[],2:[],3:[]};
            var dialogId = ngDialog.open({
                template: 'views/dialogs/confirm.html',
                controller: 'ExecuteDialogCtrl',
                scope: scope,
                className: 'confirm-dialog'
            }).id;
            $timeout.flush();
            var inputParameters = $('#'+dialogId+' .inputsParameters ul')[0];

            function hasScrollbar (element){
                return element.scrollHeight > element.clientHeight;
            }
            var elementHasScrollbar = hasScrollbar(inputParameters);
            inputParameters = null;
            ngDialog.closeAll();

            expect(elementHasScrollbar).toBe(false);
        }));
    });
});
