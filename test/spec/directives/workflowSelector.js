'use strict';

describe('Directive: workflowSelector', function () {

    // load the directive's module
    beforeEach(module('cosmoUiApp','backend-mock','templates-main'));

    var element,
        scope,
        _$compile;

    beforeEach(inject(function ($rootScope, $compile) {
        _$compile = $compile;
        scope = $rootScope.$new();
        scope.deployment = {};
        scope.currentExecution = {};
        scope.onSubmit = jasmine.createSpy('onSubmit');
        element = angular.element('<div class="workflow-selector" deployment="deployment" current-execution="currentExecution" on-submit="onSubmit()"></div>');

    }));


    it('should not set a hover effect on the execute button', inject(function ( ExecutionsService ) {
        element = _$compile(element)(scope);
        spyOn(ExecutionsService,'isRunning').andReturn(false);
        spyOn(ExecutionsService,'canPause').andReturn(false);

        scope.$digest();
        $('body').append(element);
        $('.deployment-play').trigger('mouseover');

        expect($('.deployment-play').css('background-image').indexOf('images/play_disabled.png')).not.toBe(-1);
        element.remove();
    }));


    describe('isolateScope functions', function () {
        var isolateScope = null;

        beforeEach(function () {
            element = _$compile(element)(scope);
            scope.$digest();
            isolateScope = element.children().scope();
        });

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

            it('should return null if currentExecution does not exist', function(){
                expect(isolateScope.getExecutionName()).toBe(null);
            });

        });

        describe('dialogs', function(){
            var _ngDialog = null;
            beforeEach(inject(function( ngDialog ){
                _ngDialog = ngDialog;
                spyOn(_ngDialog,'open');
            }));

            describe('#onPlay', function(){
                it('should open dialog', function(){
                    isolateScope.onPlay();
                    expect(_ngDialog.open).toHaveBeenCalled();
                });
            });

            describe('#onCancel', function(){ //stop execution
                it('should open cancellation dialog', function(){
                    isolateScope.onCancel();
                    expect(_ngDialog.open).toHaveBeenCalled();
                });
            });

        });


    });


    it('should overflow and elipsis text',inject(function(){
        scope.currentExecution = 'A very very very verrryyyyyy long workflow name';
        element = _$compile(element)(scope);
        scope.$digest();

        $('body').append(element);
        var $selectedWorkflow = $('.gs-selection-button t');

        expect($selectedWorkflow.css('overflow')).toBe('hidden');
        expect($selectedWorkflow.css('text-overflow')).toBe('ellipsis');
        element.remove();
    }));
});
