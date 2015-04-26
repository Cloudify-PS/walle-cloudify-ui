'use strict';

describe('Controller: SourceCtrl', function () {
    // load the controller's module
    beforeEach(module('cosmoUiApp', 'ngMock'));

    var SourceCtrl, scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
        $httpBackend.whenGET('/backend/configuration?access=all').respond(200);
        $httpBackend.whenGET('/backend/versions/ui').respond(200);
        $httpBackend.whenGET('/backend/versions/manager').respond(200);
        $httpBackend.whenGET('/backend/blueprints/get').respond(200);
        $httpBackend.whenGET('/backend/version/latest?version=00').respond('300');

        scope = $rootScope.$new();
        SourceCtrl = $controller('SourceCtrl', {
            $scope: scope
        });
    }));

    it('should create a controller', function () {
        expect(SourceCtrl).not.toBeUndefined();
    });

});