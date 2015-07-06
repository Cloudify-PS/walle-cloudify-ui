'use strict';

// todo : increase code coverage
describe('Directive: topology', function () {

    // load the directive's module
    beforeEach(module('cosmoUiApp','backend-mock' ,'templates-main'));

    var element,
        scope;

    beforeEach(inject(function ($rootScope, $compile) {
        scope = $rootScope.$new();
        spyOn(scope,'registerTickerTask');
        element = angular.element('<div topology blueprint-id="blueprintId"></div>');
        element = $compile(element)(scope);

    }));


    describe('init', function(){
        it('should load blueprint if id exists', inject(function( cloudifyClient ){
            spyOn(cloudifyClient.blueprints,'get').andReturn({ then:function(){ }});
            scope.blueprintId = 'foo';
            scope.$digest();
            expect(cloudifyClient.blueprints.get).toHaveBeenCalled();
        }));
    });

});
