'use strict';

describe('Directive: workflowSelector', function () {

    // load the directive's module
    beforeEach(module('cosmoUiApp'));

    var element,
        scope;

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    var setup = inject(function ($compile) {
        element = angular.element('<workflow-selector></workflow-selector>');
        element = $compile(element)(scope);
        scope.$digest();
    });

    xit('should make hidden element visible', inject(function () {
        setup();
        expect(element.text()).toBe('this is the workflowSelector directive');
    }));

    xit('should not set a hover effect on the execute button', function () {
        var _playBtn = element.find('.deployment-play')[0];
        $('body').append('<div id="deployment">' +
        '<div id="deployment-header">' +
        '<div class="header-left">' +
        '<div class="actions"></div>' +
        '</div>' +
        '</div>' +
        '</div>');
        $('.actions').append(_playBtn);

        $('.deployment-play').trigger('mouseover');

        expect($('.deployment-play').css('background-image').indexOf('images/play_disabled.png')).not.toBe(-1);
    });

});
