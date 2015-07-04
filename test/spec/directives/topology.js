'use strict';

describe('Directive: topology', function () {

    // load the directive's module
    beforeEach(module('cosmoUiApp','backend-mock'));

    var element,
        scope;

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    var setup = inject(function ($compile) {
        element = angular.element('<blueprint-topology></blueprint-topology>');
        element = $compile(element)(scope);
        scope.$digest();
    });

    xit('should make hidden element visible', inject(function () {
        setup();
        expect(element.text()).toBe('this is the blueprintTopology directive');
    }));
});
