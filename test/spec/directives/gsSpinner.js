'use strict';

describe('Directive: gsSpinner', function () {

    // load the directive's module
    beforeEach(module('cosmoUiApp', 'backend-mock', 'templates-main'));

    var element,
        scope;

    beforeEach(inject(function ($rootScope, $compile) {
        scope = $rootScope.$new();
        scope.active = 'foo';
        element = angular.element('<div gs-spinner="hello" class="inline large"></div>');
        element = $compile(element)(scope);
        scope.$digest();
    }));


    describe('classes', function(){
        it('should take class large and inline from parent and put it on gs-loader', function(){
            var $gsLoader = element.find('.gs-loader');
            expect($gsLoader.is('.large')).toBe(true);
            expect($gsLoader.is('.inline')).toBe(true);
        });
    });

    // todo : fix this test

    //describe('active', function(){
    //    it('should add gs-spinner-active on element', inject(function( $timeout, $rootScope ){
    //        expect(element.is('.gs-spinner-active')).toBe(false);
    //        angular.element('body').append(element);
    //        scope.active = true;
    //        element.scope().active = true;
    //        element.scope().$apply();
    //        scope.$digest();
    //        scope.$apply();
    //        element.scope().$digest();
    //        element.scope().$apply();
    //        element.children().scope().$apply();
    //        element.children().scope().$digest();
    //        $rootScope.$digest();
    //
    //        waitsFor(function(){
    //            try{
    //                $timeout.flush();
    //            }catch(e){}
    //            return element.is('.gs-spinner-active')
    //        });
    //        expect(element.is('.gs-spinner-active')).toBe(true);
    //    }));
    //})
});
