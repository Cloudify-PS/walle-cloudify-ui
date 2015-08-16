'use strict';

describe('Directive: cosmoLayout', function () {




    beforeEach(module('cosmoUiApp','backend-mock', 'templates-main', function( $provide){

        // override $window to test embed mechanism
        $provide.provider('$window', function(){
            this.$get = function(){
                return {};
            };
        });

        // override lower level directives
        // http://stackoverflow.com/questions/17533052/how-do-you-mock-directives-to-enable-unit-testing-of-higher-level-directive

        $provide.factory('headerDirective', function(){  return {}; });
        $provide.factory('floatingDeploymentNodePanelDirective', function(){  return {}; });


    }));


    var element;
    var scope;

    var setup = inject(function($rootScope, $compile, VersionService ){



        spyOn( VersionService, 'getVersions').andReturn({ then : function( success ){ success('foo'); } });
        scope = $rootScope.$new();
        element = angular.element('<div class="cosmo-layout"></div>');
        element = $compile(element)(scope);
        scope.$digest();
    });

    beforeEach(setup);

    it('should make hidden element visible', inject(function (VersionService ) {

        expect(VersionService.getVersions).toHaveBeenCalled();
        expect(scope.versions).toBe('foo');
    }));


    describe('Directive: cosmoLayout - embed mechanism', function(){
        it('should be true if window is not top', function(){
            expect(scope.embeded).toBe(true);
        });

        it('should be false is window is top', inject(function($compile, $window){
            $window.top = $window;
            element = angular.element('<div class="cosmo-layout"></div>');
            element = $compile(element)(scope);
            scope.$digest();

            expect(scope.embeded).toBe(false);
        }));

        it('should be override-d by `embed` routeParam', inject(function( $routeParams, $compile, $window ){

            // when window != top, we expect true. so lets check override to false
            $routeParams.embed='false';
            element = angular.element('<div class="cosmo-layout"></div>');
            $compile(element)(scope);
            scope.$digest();
            expect(scope.embeded).toBe(false);

            // when window == top, we expect fal
            $routeParams.embed='true';
            $window.top = $window;
            element = angular.element('<div class="cosmo-layout"></div>');
            $compile(element)(scope);
            scope.$digest();
            expect(scope.embeded).toBe(true);
        }));
    });


});

