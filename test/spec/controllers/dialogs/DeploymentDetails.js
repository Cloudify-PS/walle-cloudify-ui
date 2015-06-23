'use strict';

describe('Controller: dialogs/DeploymentDetailsCtrl', function () {

    // load the controller's module
    beforeEach(module('cosmoUiApp'));

    var DeploymentDetailsCtrl,
        _getOutputsSuccess = null,
        _getOutputsError = null,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, CloudifyService, $httpBackend) {
        $httpBackend.whenGET('/backend/configuration?access=all').respond(200);
        scope = $rootScope.$new();
        _getOutputsError = null;
        _getOutputsSuccess = null;
        scope.deployment = {'id' : 'foo'};
        spyOn(CloudifyService.deployments, 'getOutputs').andCallFake(function(){
            return {
                then:function(success, error){
                    if ( !!_getOutputsSuccess ) {
                        success(_getOutputsSuccess);
                    }

                    if ( !!_getOutputsError ){
                        error(_getOutputsError);
                    }
                }
            };
        });
        DeploymentDetailsCtrl = $controller('DeploymentDetailsCtrl', {
            $scope: scope
        });
    }));

    describe('on load', function(){
        it('should load outputs', inject(function (CloudifyService) {
            expect(CloudifyService.deployments.getOutputs).toHaveBeenCalled();
        }));

        it('should save outputs on scope.outputs', function(){
            _getOutputsSuccess = { 'data' : 'foo' };
            scope.load();
            expect(scope.outputs).toBe('foo');

        });

        it('should keep `error` on scope if could not retrieve outputs', function(){
            _getOutputsError = { 'data' : { 'message' : 'bar'}};
            scope.load();
            expect(scope.error).toBe('bar');
        });

        it('should have a default error message', function(){
            _getOutputsError = { 'data' : {} };
            scope.load();
            expect(scope.error).toBe('general.unknownError');
        });
    });

});
