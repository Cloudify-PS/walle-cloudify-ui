'use strict';

describe('Controller: BlueprintLayoutCtrl', function () {

    var scope;
    var BlueprintLayoutCtrl;

    beforeEach(module('cosmoUiApp', 'templates-main', 'backend-mock'));

    var init = inject(function(cloudifyClient, $stateParams){
        spyOn(cloudifyClient.blueprints, 'get').and.callFake(function () {
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
        $stateParams.blueprintId = 'hello'; // default blueprint id can be override
        initCtrl();
    });

    var initCtrl = inject(function($rootScope, $controller ){
        scope = $rootScope.$new();
        BlueprintLayoutCtrl = $controller('BlueprintLayoutCtrl',{
            $scope: scope
        });
        scope.$digest();
    });

    beforeEach(init);

    it('should get the blueprint id from the stateParams', function(){
        initCtrl();
        expect(scope.blueprint).toEqual({id:'hello', description: undefined});
    });
});
