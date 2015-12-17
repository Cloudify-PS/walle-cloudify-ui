'use strict';

describe('Controller: BlueprintsIndexCtrl', function () {

    // load the controller's module
    beforeEach(module('cosmoUiApp', 'ngMock', 'backend-mock', 'templates-main', function ($provide) {
        $provide.factory('cosmoLayoutDirective', function () {
            return {};
        }); // mock cosmo layout
    }));

    describe('Views tests', function () {
        var BlueprintsIndexCtrl, scope, _ngDialog,_$httpBackend,_$controller, _cloudifyClient, html, view, $compile, _q;

        beforeEach(inject(function ($templateCache,$controller, $rootScope, $httpBackend, ngDialog, cloudifyClient, _$compile_, $q) {
            scope = $rootScope.$new();
            _cloudifyClient = cloudifyClient;
            _ngDialog = ngDialog;
            $compile = _$compile_;
            _$httpBackend = $httpBackend;
            _$controller = $controller;
            _q = $q;
            html = $templateCache.get('views/blueprintsIndex.html');
            _$httpBackend.expectGET(/backend\/cloudify-api\/deployments.*/).respond(200);
            _$httpBackend.expectGET(/backend\/cloudify-api\/blueprints.*/).respond(200);
        }));

        function appendCompiledHtml() {
            BlueprintsIndexCtrl = _$controller('BlueprintsIndexCtrl', {
                $scope: scope,
                cloudifyClient: _cloudifyClient,
                ngDialog: _ngDialog
            });
            view = $compile(angular.element(html))(scope);
            scope.$digest();
            $('body').append(view);
        }

        //Simulates an error status 0 with no info.
        it('should stop showing loading gif if got bad response with no data', function () {
            spyOn(_cloudifyClient.blueprints, 'list').and.callFake(function () {
                return {
                    then: function (success, error) {
                        error({data:''});
                        return _q.defer().promise;
                    }
                };
            });
            appendCompiledHtml();
            var connectErrorMessage = $('.connect-error-message');
            expect(connectErrorMessage.css('display')).not.toBe('none');

        });
    });
});
