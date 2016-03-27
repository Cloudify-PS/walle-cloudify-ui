'use strict';

describe('Controller: CloudifyLayoutCtrl', function () {

    // load the controller's module
    beforeEach(module('cosmoUiApp','backend-mock', 'templates-main', function( $provide){

        // override lower level directives
        // http://stackoverflow.com/questions/17533052/how-do-you-mock-directives-to-enable-unit-testing-of-higher-level-directive

        $provide.factory('headerDirective', function(){  return {}; });
        $provide.factory('floatingDeploymentNodePanelDirective', function(){  return {}; });
    }));

    var scope, CloudifyLayoutCtrl, VersionService, $stateParams;

    var init = inject(function(_VersionService_){
        VersionService = _VersionService_;
        spyOn( VersionService, 'getVersions').and.returnValue({ then : function( success ){ success('foo'); } });
        $stateParams = {};
    });

    var initCtrl = inject(function($rootScope, $controller ){
        scope = $rootScope.$new();
        CloudifyLayoutCtrl = $controller('CloudifyLayoutCtrl',{
            $scope: scope,
            $stateParams: $stateParams
        });
        scope.$digest();
    });

    beforeEach(init);

    it('should make hidden element visible', inject(function (VersionService ) {
        initCtrl();
        expect(VersionService.getVersions).toHaveBeenCalled();
        expect(scope.versions).toBe('foo');
    }));

    it('should set embeded by embed url parameter', function(){
        $stateParams.embed = 'true';
        initCtrl();
        expect(scope.embeded).toBe(true);

        $stateParams.embed = 'false';
        initCtrl();
        expect(scope.embeded).toBe(false);
    });

});
