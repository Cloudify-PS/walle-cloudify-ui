'use strict';

describe('Directive: workflowSelector', function () {

    // load the directive's module
    beforeEach(module('cosmoUiApp','backend-mock','templates-main'));

    var element,
        scope;

    beforeEach(inject(function ($rootScope, $compile) {
        scope = $rootScope.$new();
        scope.deployment = {};
        scope.currentExecution = {};
        scope.onSubmit = jasmine.createSpy('onSubmit');
        element = angular.element('<div class="workflow-selector" deployment="deployment" current-execution="currentExecution" on-submit="onSubmit()"></div>');
        element = $compile(element)(scope);

    }));


    it('should not set a hover effect on the execute button', inject(function ( ExecutionsService ) {

        spyOn(ExecutionsService,'isRunning').andReturn(false);
        spyOn(ExecutionsService,'canPause').andReturn(false);

        scope.$digest();
        $('body').append(element);
        $('.deployment-play').trigger('mouseover');

        expect($('.deployment-play').css('background-image').indexOf('images/play_disabled.png')).not.toBe(-1);
        element.remove();
    }));

});
