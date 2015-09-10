'use strict';

describe('Directive: blueprintLayout', function () {

    var element, scope;

    beforeEach(module('cosmoUiApp', 'templates-main', 'backend-mock', function ($provide) {
        $provide.factory('cosmoLayoutDirective', function () {
            return {};
        }); // mock cosmo layout
    }));


    var compileElement = inject(function ($rootScope, $compile ) {
        element = angular.element('<div class="blueprint-layout"></div>');

        scope = $rootScope.$new( );
        element = $compile(element)(scope);
        //scope.$digest(); -- do not digest here.. we need to override isolate scope functions. use $digest in inner describes.
    });

    beforeEach(inject(function (cloudifyClient) {
        spyOn(cloudifyClient.blueprints, 'get').andCallFake(function () {
            return {
                then: function (success) {
                    var result = success({ data : {id: 'foo', plan: {inputs: {}}} });
                    return {
                        then: function(success){
                            success(result);
                        }
                    };
                }
            };
        });
        compileElement();
    }));


    describe('#openDeployDialog', function(){
        it('should open dialog', inject(function(ngDialog){
            spyOn(ngDialog,'open').andReturn();
            scope.$digest();
            element.isolateScope().openDeployDialog();
            expect(ngDialog.open).toHaveBeenCalled();
        }));
    });

    describe('init', function () {

        it('should open deploy dialog if routeParams include deploy=true', inject(function ($rootScope, $routeParams) {
            $routeParams.deploy = 'true';
            var origNew = scope.$new;
            var newIsolatedScope = null;

            spyOn(scope,'$new').andCallFake(function( isolate, parent ){
                //console.log('this scope.$new', isolate, parent);
                var newScope = origNew( isolate, parent );
                if ( isolate ){
                    //console.log('this is isolated');
                    newScope.openDeployDialog = jasmine.createSpy('openDeployDialog');
                    newIsolatedScope = newScope;
                }

                return newScope;
            });
            scope.$digest();
            expect(newIsolatedScope.openDeployDialog).toHaveBeenCalled();
        }));
    });

});
