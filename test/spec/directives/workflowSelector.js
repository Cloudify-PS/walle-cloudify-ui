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
});
