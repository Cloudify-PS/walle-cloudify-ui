'use strict';

describe('Directive: deploymentLayout', function () {

    var element, scope;

    beforeEach(module('cosmoUiApp', 'ngMock', 'templates-main'));

    describe('Test setup', function() {
        it ('', inject(function ($compile, $rootScope, $httpBackend) {
            $httpBackend.whenGET("/backend/configuration?access=all").respond(200);
            $httpBackend.whenGET("/backend/versions/ui").respond(200);
            $httpBackend.whenGET("/backend/versions/manager").respond(200);
            $httpBackend.whenGET("/backend/version/latest?version=00").respond('300');
            $httpBackend.whenGET("/backend/deployments/executions/get").respond(200);
            $httpBackend.whenPOST("/backend/deployments/get").respond(200);

            scope = $rootScope.$new();
            element = $compile(angular.element('<div deployment-layout></div>'))(scope);

            scope.$digest();
        }));
    });

    describe('Directive tests', function() {
        it('should create an element with isExecuteEnabled function', function() {
            expect(typeof(element.children().scope().isExecuteEnabled)).toBe('function');
        });
    });

});
