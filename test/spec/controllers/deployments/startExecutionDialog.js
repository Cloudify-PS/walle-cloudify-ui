'use strict';

describe('Controller: StartExecutionDialogCtrl', function () {
    /*jshint camelcase: false */
    var StartExecutionDialogCtrl, cloudifyClient;
    var scope;

    beforeEach(module('cosmoUiApp', 'ngMock', 'templates-main', 'backend-mock'));

    beforeEach(inject(function(_cloudifyClient_, $rootScope) {
        cloudifyClient = _cloudifyClient_;
        spyOn(cloudifyClient.deployments, 'get').and.returnValue(window.mockPromise());
        spyOn(cloudifyClient.nodes, 'list').and.returnValue(window.mockPromise());
        spyOn(cloudifyClient.executions, 'start').and.returnValue(window.mockPromise());
        scope = $rootScope.$new();
        scope.deployment = {workflows: [], id: 'dep1'};
    }));

    var init = inject(function($controller){
        StartExecutionDialogCtrl = $controller('StartExecutionDialogCtrl', {
            $scope: scope
        });
    });

    it('should create a controller', function () {
        init();

        expect(StartExecutionDialogCtrl).not.toBeUndefined();
    });

    describe('#isExecuteEnabled', function () {
        it('should return true if inputsValid is true and workflow exists', function () {
            init();

            scope.inputsValid = false;
            expect(scope.isExecuteEnabled()).toBe(false);

            scope.inputsValid = true;
            expect(scope.isExecuteEnabled()).toBe(false);

            scope.workflow = 'foo';
            expect(scope.isExecuteEnabled()).toBe(true);
        });
    });

    describe('executeWorkflow', function () {
        beforeEach(function () {
            init();

            scope.workflow = {'name': 'bar'};
            scope.rawString = '{}';
        });
        it('should call cloudifyclient.executions.start', function () {

            scope.executeWorkflow();
            expect(scope.inProcess).toBe(true);
            expect(cloudifyClient.executions.start).toHaveBeenCalled();
        });

        it('should setErrorMessage on failure', function () {
            cloudifyClient.executions.start.and.returnValue(window.mockPromise({data: {message: 'foo'}}));
            spyOn(scope, 'setErrorMessage');
            scope.executeWorkflow();
            expect(scope.inProcess).toBe(false);
            expect(scope.setErrorMessage).toHaveBeenCalledWith('foo');
        });

        it('should close dialog on success', function () {
            cloudifyClient.executions.start.and.returnValue(window.mockPromise({data: {}}));
            scope.closeThisDialog = jasmine.createSpy('closeThisDialog');
            scope.onBegin = jasmine.createSpy('onBegin');
            scope.executeWorkflow();
            expect(scope.closeThisDialog).toHaveBeenCalled();
            expect(scope.onBegin).toHaveBeenCalled();
        });

        it('should put error message if success result has message property', function () {
            cloudifyClient.executions.start.and.returnValue(window.mockPromise({data: {message: 'foo'}}));
            spyOn(scope, 'setErrorMessage');
            scope.executeWorkflow();
            expect(scope.inProcess).toBe(false);
            expect(scope.setErrorMessage).toHaveBeenCalledWith('foo');
        });
    });

    describe('buttons', function () {
        var newConfirmDialog = null;

        beforeEach(inject(function (ngDialog, $timeout) {
            init();

            newConfirmDialog = function () {
                var dialogId = ngDialog.open({
                    template: 'views/deployment/startExecutionDialog.html',
                    controller: 'StartExecutionDialogCtrl',
                    scope: scope,
                    className: 'confirm-dialog'
                }).id;
                $timeout.flush();
                return dialogId;
            };

        }));

        it('to have 1 cancel button to closeThisDialog', function () {
            scope.workflow = {};
            var dialogId = newConfirmDialog();
            var elemsQuery = '#' + dialogId + ' .confirmationButtons [ng-click="closeThisDialog()"]';
            var elems = $(elemsQuery);
            expect(elems.length).toBe(1);
            $('#' + dialogId).remove();
            expect($(elemsQuery).length).toBe(0);
        });

    });

    describe('scale execution', function(){
        describe('#getScalingResources', function(){
            beforeEach(function(){
                var nodesResponse = {
                    data: {
                        items: [{id:'node1'}, {id:'node2'}, {id:'node3'}]
                    }
                };
                var groupsResponse = {
                    data: {
                        groups: {
                            'group2': {
                                'members': ['node2', 'node3'],
                                'policies': {}
                            }
                        }
                    }
                };

                cloudifyClient.nodes.list.and.returnValue(window.mockPromise(nodesResponse));
                cloudifyClient.deployments.get.and.returnValue(window.mockPromise(groupsResponse));
            });


            it('should have groups get nodes', function(){
                scope.deployment.groups = {
                    'group1': {
                        'members': ['node1', 'node2'],
                        'policies':{}
                    }
                };
                init();
                scope.getScalingResources();
                expect(cloudifyClient.deployments.get).not.toHaveBeenCalled();
                expect(cloudifyClient.nodes.list).toHaveBeenCalled();
                expect(scope.resources).toEqual([{groupLabel: 'Groups'}, {label: 'group1', value: 'group1'}, {groupLabel: 'Nodes'}, {label: 'node1', value: 'node1'}, {label: 'node2', value: 'node2'}, {label: 'node3', value: 'node3'}]);
            });

            it('should get groups and get nodes', function(){
                init();
                scope.getScalingResources();
                expect(cloudifyClient.deployments.get).toHaveBeenCalled();
                expect(cloudifyClient.nodes.list).toHaveBeenCalled();
                expect(scope.resources).toEqual([{groupLabel: 'Groups'}, {label: 'group2', value: 'group2'}, {groupLabel: 'Nodes'}, {label: 'node1', value: 'node1'}, {label: 'node2', value: 'node2'}, {label: 'node3', value: 'node3'}]);
            });

            it('should fail getting resources', function(){
                init();
                spyOn(scope, 'setErrorMessage');
                cloudifyClient.nodes.list.and.returnValue(window.mockPromise(null,{}));
                scope.getScalingResources();
                expect(scope.isGetResourcesError).toBe(true);
                expect(scope.setErrorMessage).toHaveBeenCalledWith('dialogs.confirm.getScalingResourcesFail');
            });
        });

        // Backward compatibility
        it('should execute scale with node_id', function(){
            scope.deployment.workflows.push({name: 'scale', parameters: {node_id: {default: '', description: ''}}});
            init();
            scope.workflowName = {value: 'scale'};
            scope.$digest();
            expect(scope.workflow.parameters.node_id).toBe(undefined);
            scope.rawString = '{}';
            scope.resourceId = {value: 'node1'};
            scope.$digest();
            scope.executeWorkflow();
            expect(cloudifyClient.executions.start).toHaveBeenCalledWith('dep1', 'scale', {node_id: 'node1'});
        });

        it('should execute scale with scalable_entity_name', function(){
            scope.deployment.workflows.push({name: 'scale', parameters: {scalable_entity_name: {default: '', description: ''}}});
            init();
            scope.workflowName = {value: 'scale'};
            scope.$digest();
            expect(scope.workflow.parameters.scalable_entity_name).toBe(undefined);
            scope.rawString = '{}';
            scope.resourceId = {value: 'node1'};
            scope.$digest();
            scope.executeWorkflow();
            expect(cloudifyClient.executions.start).toHaveBeenCalledWith('dep1', 'scale', {scalable_entity_name: 'node1'});
        });
    });
});
