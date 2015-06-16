// TODO: delete
//'use strict';
//
//describe('Controller: DeploymentEventsCtrl', function () {
//
//    // load the controller's module
//    beforeEach(module('cosmoUiApp', 'backend-mock'));
//
//    var DeploymentEventsCtrl,
//        scope;
//
//    // Initialize the controller and a mock scope
//    beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
//        scope = $rootScope.$new();
//        $httpBackend.whenPOST('/backend/events/_search').respond(200);
//        DeploymentEventsCtrl = $controller('DeploymentEventsCtrl', {
//            $scope: scope
//        });
//    }));
//
//    it('should put filter loading on scope', function () {
//        expect(scope.filterLoading).toBe(true);
//    });
//
//    describe('workflowsData event listener', function () {
//        it( 'should put workflowsList on scope',inject(function ($rootScope) {
//            $rootScope.$broadcast('workflowsData', 'foo');
//            expect(scope.workflowsList).toBe('foo');
//        }));
//    });
//
//    describe('#isSortActive', function(){
//        it('should return true iff sort is active', function(){
//            expect(scope.isSortActive()).toBe(true);
//        });
//
//        it('should return false', function(){
//            expect(scope)
//        });
//    });
//
//
//});
