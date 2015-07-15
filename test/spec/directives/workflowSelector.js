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
