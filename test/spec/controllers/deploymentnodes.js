'use strict';

describe('Controller: DeploymentNodesCtrl', function () {

    // load the controller's module
    beforeEach(module('cosmoUiApp', 'ngMock', function ($translateProvider) {
        $translateProvider.translations('en', {});
    }));

    var DeploymentNodesCtrl, scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
        $httpBackend.whenGET('/backend/configuration?access=all').respond(200);
        $httpBackend.whenGET('/backend/versions/ui').respond(200);
        $httpBackend.whenGET('/backend/versions/manager').respond(200);
        $httpBackend.whenGET('/backend/version/latest?version=00').respond('300');

        scope = $rootScope.$new();
        DeploymentNodesCtrl = $controller('DeploymentNodesCtrl', {
            $scope: scope
        });
    }));

    it('should create a controller', function () {
        expect(DeploymentNodesCtrl).not.toBeUndefined();
    });

    it('should set default middle alignment to table when gs-table-align-top class is not used', function () {
        $('body').append('<table class="gs-table"><td><tr></tr></td></table>');
        expect($('.gs-table > tbody  > tr > td').css('vertical-align')).toBe('middle');
    });

    it('should add top alignment to table when gs-table-align-top class is used', function () {
        $('body').append('<table class="gs-table gs-table-align-top"><td><tr></tr></td></table>');
        expect($('.gs-table-align-top > tbody  > tr > td').css('vertical-align')).toBe('top');
    });
});
