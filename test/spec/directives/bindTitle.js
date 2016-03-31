'use strict';

describe('Directive: bindTitle', function () {

    // load the directive's module
    beforeEach(module('cosmoUiApp', 'backend-mock'));

    var element,
        scope;

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    var $compile;
    var setup = inject(function( _$compile_ ){
        $compile = _$compile_;
        element = angular.element('<div bind-title="shouldWatch">{{text}}</div>');
    });

    function initDirective(){
        element = $compile(element)(scope);
        scope.$digest();
    }

    beforeEach(setup);

    it('should not watch text change', function () {
        scope.shouldWatch = false;
        scope.text = 'text here';

        initDirective();
        expect(element.attr('title')).toBe('text here');

        scope.text = 'text changed';
        scope.$digest();
        expect(element.attr('title')).toBe('text here');
    });

    it('should watch text and stop watching when scope is $destroyed', function () {
        scope.shouldWatch = true;
        scope.text = 'text here';

        initDirective();
        expect(element.attr('title')).toBe('text here');

        scope.text = 'text changed';
        scope.$digest();
        expect(element.attr('title')).toBe('text changed');

        scope.$destroy();
        scope.text = 'text changed again';
        scope.$digest();
        expect(element.attr('title')).toBe('text changed');
    });
});
