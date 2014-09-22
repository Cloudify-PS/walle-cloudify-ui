'use strict';

describe('Controller: DeploymentsCtrl', function () {
    var DeploymentsCtrl, scope;
    var _executionError = {
        "error_code": "1",
        "message": "Error"
    };
    var _execution = {

    };

    beforeEach(module('cosmoUiApp', 'ngMock'));

    function _testSetup() {
        inject(function ($controller, $rootScope, $httpBackend, $q, RestService) {
            $httpBackend.whenGET("/backend/configuration?access=all").respond(200);
            $httpBackend.whenGET("/backend/versions/ui").respond(200);
            $httpBackend.whenGET("/backend/versions/manager").respond(200);
            $httpBackend.whenGET("/backend/version/latest?version=00").respond('300');
            $httpBackend.whenGET("/backend/blueprints").respond(200);

            scope = $rootScope.$new();

            RestService.executeDeployment = function(executionData) {
                var deferred = $q.defer();

                deferred.resolve(executionData.parameters === undefined ? _executionError : _execution);

                return deferred.promise;
            };

            DeploymentsCtrl = $controller('DeploymentsCtrl', {
                $scope: scope,
                RestService: RestService
            });

            scope.$digest();
        });
    }

    describe('Test setup', function() {
        it ('', function() {
            _testSetup(true);
        });
    });

    describe('Controller tests', function() {
        it('should create a controller', function () {
            expect(DeploymentsCtrl).not.toBeUndefined();
        });

        it('should show error message if required parameters are not provided', function() {
            scope.selectedDeployment = {
                id: "deployment1"
            };
            scope.selectedWorkflow = {
                "data": {
                    "parameters": undefined
                }
            };
            scope.isExecuteEnabled = function() {
                return true;
            };

            scope.executeDeployment();
            scope.$apply();

            waitsFor(function() {
                return scope.executedErr !== false;
            });
            runs(function() {
                expect(scope.executedErr).toBe(_executionError.message);
            });
        });

    });
});