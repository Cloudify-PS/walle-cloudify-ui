'use strict';

describe('Directive: blueprintLayout', function () {

    var element, scope;
    beforeEach(module('cosmoUiApp', 'ngMock', 'templates-main','backend-mock'));

    beforeEach(inject(function($rootScope, $compile, $httpBackend, CloudifyService ){
        spyOn(CloudifyService.blueprints,'getBlueprintById').andCallFake(function(){
            return {
                then:function(success){
                    success({ id: 'foo',plan: { inputs: {} } });
                }
            };
        });
        $httpBackend.whenGET('/backend/blueprints/get').respond(200);

        element = angular.element('<div blueprint-layout></div>');
        scope = $rootScope.$new();
        scope.bc = { 'label' : 'foo', 'i18nKey' : 'bar', 'href' : 'foohref' };
        element = $compile(element)(scope);
        scope.$digest();
    }));

    xit('should render template', inject(function () {
        expect(element.text().indexOf('foo') >= 0).toBe(true);
    }));

});
