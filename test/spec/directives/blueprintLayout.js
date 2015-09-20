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

});
