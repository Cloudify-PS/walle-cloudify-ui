'use strict';

describe('Controller: LogsCtrl', function () {
    var LogsCtrl, scope;

    // load the controller's module
    beforeEach(module('cosmoUiApp', 'ngMock'));

    describe('Test setup', function() {
        it ('', inject(function ($controller, $rootScope, $httpBackend) {
            $httpBackend.whenGET("/backend/configuration?access=all").respond(200);
            $httpBackend.whenGET("/backend/versions/ui").respond(200);
            $httpBackend.whenGET("/backend/versions/manager").respond(200);
            $httpBackend.whenGET("/backend/version/latest?version=00").respond('300');

            scope = $rootScope.$new();

            LogsCtrl = $controller('LogsCtrl', {
                $scope: scope
            });
        }));
    });

    describe('Controller tests', function() {

        it('should create a controller', function () {
            expect(LogsCtrl).not.toBeUndefined();
        });
    });
});
