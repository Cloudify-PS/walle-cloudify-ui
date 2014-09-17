'use strict';

describe('Controller: DeploydialogCtrl', function () {
    var DeployDialogCtrl, scope;

    beforeEach(module('cosmoUiApp', 'ngMock', 'templates-main'));

    describe('Test setup', function() {
        it ('', inject(function ($controller, $rootScope, $httpBackend, RestService) {
            $httpBackend.whenGET("/backend/configuration?access=all").respond(200);
            $httpBackend.whenGET("/backend/versions/ui").respond(200);
            $httpBackend.whenGET("/backend/versions/manager").respond(200);
            $httpBackend.whenGET("/backend/version/latest?version=00").respond('300');

            scope = $rootScope.$new();

            RestService.deployBlueprint = function() {
                // mock deployBlueprint call
            };

            DeployDialogCtrl = $controller('DeployDialogCtrl', {
                $scope: scope,
                RestService: RestService
            });

            scope.$digest();
        }));
    });

    describe('Controller tests', function() {
        it('should create a controller', function () {
            expect(DeployDialogCtrl).not.toBeUndefined();
        });

        it('should show error message if deployment name is not provided', function() {

        });

        it('should show error message if inputs parameters are not provided', function() {

        });

        it('should pass all params provided to RestService on deployment creation', function() {
            // RestService.deployBlueprint
        });
    });
});
