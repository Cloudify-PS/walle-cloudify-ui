'use strict';

describe('Directive: focusOn', function () {

    // load the directive's module
    beforeEach(module('cosmoUiApp', 'backend-mock', 'templates-main'));

    var element,scope;
    var $timeout, $compile;

    beforeEach(inject(function ($rootScope, _$timeout_, _$compile_) {
        $timeout = _$timeout_;
        $compile = _$compile_;
        scope = $rootScope.$new();
    }));

    var setup = function(watch){
        if(watch){
            element = angular.element('<input type="text" focus-on="'+watch+'"/>');
        } else{
            element = angular.element('<input type="text" focus-on/>');
        }
        element = $compile(element)(scope);
        spyOn(element[0],'focus');
        scope.$digest();
    };

    it('should focus element', inject(function () {
        setup();
        $timeout.flush();
        expect(element[0].focus).toHaveBeenCalled();
    }));

    it('should watch and focus element', function(){
        setup('trigger');
        $timeout.flush();

        expect(element[0].focus).not.toHaveBeenCalled();

        scope.trigger = true;
        scope.$digest();
        $timeout.flush();
        expect(element[0].focus).toHaveBeenCalled();
    });
});
