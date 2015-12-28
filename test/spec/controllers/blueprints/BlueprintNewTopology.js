'use strict';

describe('Controller: NewTopologyCtrl', function () {

    // load the controller's module
    beforeEach(module('cosmoUiApp'));

    var BlueprintNewTopologyCtrl,
        cloudifyClient,
        DataProcessingService,
        $routeParams,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, _cloudifyClient_, _DataProcessingService_, _$routeParams_ ) {

        scope = $rootScope.$new();
        $routeParams = _$routeParams_;
        cloudifyClient = _cloudifyClient_;
        DataProcessingService = _DataProcessingService_;

        $routeParams.blueprintId = 'baz';
        spyOn(cloudifyClient.blueprints,'get').and.returnValue(window.mockPromise({ data : 'bar' }));
        spyOn(DataProcessingService,'encodeTopologyFromRest').and.returnValue('foo');
        BlueprintNewTopologyCtrl = $controller('BlueprintNewTopologyCtrl', {
            $scope: scope

        });
    }));


    describe('#init', function(){


        it('should load blueprint', function(){
            expect(cloudifyClient.blueprints.get).toHaveBeenCalled();
        });

        it('should put call DataProcessingService and put its output on scope.topologyLoading', function(){
            expect(DataProcessingService.encodeTopologyFromRest).toHaveBeenCalled();
            expect(scope.page.topologyData).toBe('foo');
            expect(scope.page.topologyLoading).toBe(false);
        });

    });

});
