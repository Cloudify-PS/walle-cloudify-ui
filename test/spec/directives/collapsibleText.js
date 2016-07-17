'use strict';

describe('Directive: collapsibleText', function () {

    // load the directive's module
    beforeEach(module('cosmoUiApp', 'templates-main', 'backend-mock'));

    var element,
        scope;

    var $timeout, isolateScope;
    beforeEach(inject(function ($rootScope, _$timeout_) {
        scope = $rootScope.$new();
        $timeout = _$timeout_;

        scope.lines = 3;
        scope.text = 'HugeTextHugeTextHugeTextHugeTextHugeTextHugeTextHugeTextHugeTextHugeTextHugeTextHugeTextHugeTextHugeTextHugeTextHugeTextHugeTextHugeTextHugeTextHugeTextHugeTextHugeTextHugeText';
    }));

    var setup = inject(function( $compile ){
        element = angular.element('<collapsible-text style="line-height:20px; display:block; max-width:100px; word-break:break-all" lines="lines" text="text"></collapsible-text>');
        element = $compile(element)(scope);
        isolateScope = element.isolateScope();
        scope.$digest();
        $('body').append(element);
        $timeout.flush();
    });

    it('should automatically adjust height', function(){
        setup();

        expect(isolateScope.isAdjusted).toBe(true);
        expect(element.find('span').css('max-height')).toBe('60px');
    });

    it('should toggle show more / less', function(){
        setup();
        isolateScope.showMore();

        expect(isolateScope.isAdjusted).toBe(false);
        expect(element.find('span').css('max-height')).toBe('280px');

        isolateScope.showLess();

        expect(isolateScope.isAdjusted).toBe(true);
        expect(element.find('span').css('max-height')).toBe('60px');
    });

    it('should should not effect text', function(){
        scope.text = 'shortText';
        setup();

        expect(isolateScope.isAdjusted).toBe(undefined);
    });
});
