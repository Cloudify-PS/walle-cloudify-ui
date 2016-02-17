'use strict';

describe('Directive: deploymentActionSelector', function () {

    // load the directive's module
    beforeEach(module('cosmoUiApp', 'backend-mock', 'templates-main'));

    var element;
    var scope;

    beforeEach(inject(function ($rootScope, ngDialog, $compile) {
        scope = $rootScope.$new();
        scope.deployment = {id: 'foo'};
        scope.currentExecution = {};
        scope.onSubmit = jasmine.createSpy('onSubmit');
        element = angular.element('<div class="deployment-action-selector" deployment="deployment" current-execution="currentExecution" on-submit="onSubmit()"></div>');
        element = $compile(element)(scope);
    }));

    describe('display', function () {
        it('should overflow and ellipsis text', inject(function () {
            scope.currentExecution = 'A very very very verrryyyyyy long workflow name';
            scope.$digest();
            // only after we add to body, the css will be applied
            $('body').append(element);
            var $selectedAction = $('#split-button');
            expect($selectedAction.css('overflow')).toBe('hidden');
            expect($selectedAction.css('text-overflow')).toBe('ellipsis');
            element.remove();
        }));
    });

    describe('isolateScope functions', function () {
        var isolateScope = null;

        beforeEach(inject(function ($compile) {
            element = $compile(element)(scope);
            scope.$digest();
            isolateScope = element.children().scope();
        }));

        describe('#isRunning', function () {
            it('should call execution service isRunning', inject(function (ExecutionsService) {
                spyOn(ExecutionsService, 'isRunning');
                isolateScope.isRunning();
                expect(ExecutionsService.isRunning).toHaveBeenCalled();
            }));
        });

        describe('#getExecutionName', function () {
            it('should translate the workflow', function () {
                var result = isolateScope.getExecutionName({workflow_id: 'foo'});
                expect(result).toBe('Foo Process'); // this translation is found at backend_mock.js..
            });

            it('should fallback to workflow_id when translation is missing CFY-3591', function () {
                var result = isolateScope.getExecutionName({workflow_id: 'bar'});
                expect(result).toBe('bar'); // this translation is found at backend_mock.js..
            });

            it('should return translation for "deployment.process.wait" if workflow_id is missing', function () {
                var result = isolateScope.getExecutionName({});
                expect(result).toBe('deployment.process.wait'); // this translation is found at backend_mock.js..
            });

            it('should return null if currentExecution does not exist', function () {
                expect(isolateScope.getExecutionName()).toBe(null);
            });

        });

        describe('dialogs', function () {
            var ngDialog = null;
            var ExecutionsService = null;
            beforeEach(inject(function (_ngDialog_, _ExecutionsService_) {
                ngDialog = _ngDialog_;
                ExecutionsService = _ExecutionsService_;
                spyOn(ngDialog, 'open');
                spyOn(ExecutionsService, 'canPause').and.callFake(function(){return false;});
                spyOn(ExecutionsService, 'isRunning').and.callFake(function(){return false;});
            }));

            it('should toggle delete confirmation dialog when deleteDeployment is selected', function () {
                scope.$digest();

                var deleteAction = element.isolateScope().actions.filter(function (a) {
                    return a.name === 'deployments.deleteBtn';
                })[0];

                element.isolateScope().selectAction(deleteAction);
                expect(element.isolateScope().itemToDelete.id).toBe(element.isolateScope().deployment.id);
                expect(ngDialog.open).toHaveBeenCalled();

                ExecutionsService.isRunning.and.callFake(function(){return true;});

                element.isolateScope().selectAction(deleteAction);
                expect(ngDialog.open.calls.count()).toBe(1);
            });

            it('should toggle execution dialog', function () {
                scope.$digest();

                var executeAction = element.isolateScope().actions.filter(function (a) {
                    return a.name === 'deployments.executeWorkflowBtn';
                })[0];

                element.isolateScope().selectAction(executeAction);
                expect(ngDialog.open).toHaveBeenCalled();

                ExecutionsService.isRunning.and.callFake(function(){return true;});

                element.isolateScope().selectAction(executeAction);
                expect(ngDialog.open.calls.count()).toBe(1);
            });

            it('should toggle cancel execution dialog', function () {
                scope.$digest();
                console.log(element.isolateScope().cancel);
                element.isolateScope().cancel();
                expect(ngDialog.open).not.toHaveBeenCalled();

                ExecutionsService.canPause.and.callFake(function(){return true;});

                element.isolateScope().cancel();
                expect(ngDialog.open).toHaveBeenCalled();
            });
        });
    });
});
