'use strict';

describe('Directive: onFinishRender', function () {


    beforeEach(module('cosmoUiApp','backend-mock' ));

    var element;

    it('should call scope emit when render finished', inject(function ($rootScope, $compile, $timeout) {
        element = angular.element('<div on-finish-render></div>');
        $rootScope.$last = true;
        element = $compile(element)($rootScope);
        $timeout.flush();
    }));
});
