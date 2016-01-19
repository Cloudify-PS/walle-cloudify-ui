'use strict';

describe('Controller: CloudifyLayoutCtrl', function () {

    // load the controller's module
    beforeEach(module('cosmoUiApp','backend-mock', 'templates-main', function( $provide){

        // override lower level directives
        // http://stackoverflow.com/questions/17533052/how-do-you-mock-directives-to-enable-unit-testing-of-higher-level-directive

        $provide.factory('headerDirective', function(){  return {}; });
        $provide.factory('floatingDeploymentNodePanelDirective', function(){  return {}; });
    }));

    var scope, CloudifyLayoutCtrl, VersionService;

    var init = inject(function(_VersionService_){
        VersionService = _VersionService_;
        spyOn( VersionService, 'getVersions').and.returnValue({ then : function( success ){ success('foo'); } });
        initCtrl();
    });

    var initCtrl = inject(function($rootScope, $controller ){
        scope = $rootScope.$new();
        CloudifyLayoutCtrl = $controller('CloudifyLayoutCtrl',{
            $scope: scope
        });
        scope.$digest();
    });

    beforeEach(init);

    it('should make hidden element visible', inject(function (VersionService ) {
        expect(VersionService.getVersions).toHaveBeenCalled();
        expect(scope.versions).toBe('foo');
    }));


    describe('Directive: cosmoLayout - embed mechanism', function(){
        it('should be true if window is not top', function(){
            expect(scope.embeded).toBe(true);
        });

        it('should be false is window is top', inject(function($window){
            $window.top = $window;
            initCtrl();
            scope.$digest();

            expect(scope.embeded).toBe(false);
        }));

        it('should be override-d by `embed` routeParam', inject(function( $stateParams, $window ){

            // when window != top, we expect true. so lets check override to false
            $stateParams.embed='false';
            initCtrl();
            expect(scope.embeded).toBe(false);

            // when window == top, we expect fal
            $stateParams.embed='true';
            $window.top = $window;
            initCtrl();
            expect(scope.embeded).toBe(true);
        }));
    });
});
