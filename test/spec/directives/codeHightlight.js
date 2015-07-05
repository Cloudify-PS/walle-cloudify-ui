'use strict';

describe('Directive: codeHighlight', function () {

    var element;
    beforeEach(module('cosmoUiApp', 'ngMock', 'templates-main','backend-mock'));

    it('should put items on scope', inject(function ($rootScope, $compile) {
        $rootScope.dataCode = { data : 'this is data', 'tab-size':2 } ;
        element = angular.element('<div code-highlight="yml" ng-model="dataCode"></div>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        expect(element.find('.syntaxhighlighter.yml').length).toBe(1);
    }));

});
