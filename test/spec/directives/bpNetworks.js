'use strict';

describe('Directive: bpNetworks', function () {
    beforeEach(module('cosmoUiApp', 'backend-mock', 'templates-main'));

    var element;

    it('should make hidden element visible', inject(function ($rootScope, $compile) {
        element = angular.element('<div bp-networks></div>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();

        expect(element.text()).toBe(''); // empty template
    }));
});

describe('Directive: bpNetworkCoordinate', function () {
    beforeEach(module('cosmoUiApp', 'backend-mock', 'templates-main'));

    var element;

    var testRender = function (type) {
        return inject(function ($rootScope, $compile, bpNetworkService) {
            var methodName = 'addDevice';
            if (type !== 'foo') {
                methodName = 'add' + type[0].toUpperCase() + type.substring(1);
            } else {

            }
            spyOn(bpNetworkService, methodName);
            $rootScope.myData = {type: type};
            element = angular.element('<div bp-network-coordinate="myData" ng-model="myData"></div>');
            element = $compile(element)($rootScope);
            $rootScope.$digest();

            expect(element.text()).toBe(''); // empty template
            expect(bpNetworkService[methodName]).toHaveBeenCalled();
        });
    };

    it('renderSubnet', testRender('subnet'));
    it('renderSubnet', testRender('network'));
    it('renderSubnet', testRender('router'));
    it('renderSubnet', testRender('foo'));
});
