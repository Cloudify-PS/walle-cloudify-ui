'use strict';

describe('Controller: InputsOutputsCtrl', function () {

    // load the controller's module
    beforeEach(module('cosmoUiApp','templates-main',function($provide){
        $provide.factory('cosmoLayoutDirective', function () {
            return {};
        }); // mock cosmo layout
        $provide.factory('deploymentLayoutDirective', function () {
            return {};
        }); // mock deployment layout
    }));

    var InputsOutputsCtrl,
        scope,html,$compile;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $httpBackend,$templateCache, _$compile_) {
        $httpBackend.whenGET(/\/backend\/deployments\/.*\/outputs/).respond(200);
        $httpBackend.whenGET('/backend/deployments/get').respond(200);
        $httpBackend.whenGET('/backend/configuration?access=all').respond(200);
        $httpBackend.whenGET('/i18n/translations_en.json').respond(200);


        scope = $rootScope.$new();
        InputsOutputsCtrl = $controller('InputsOutputsCtrl', {
            $scope: scope
        });
        $compile = _$compile_;
        html = $templateCache.get('views/deployment/deploymentInputsOutputs.html');
    }));

    function appendCompiledHtml(scope){
        var view = $compile(angular.element(html))(scope);
        scope.$digest();
        $('body').append(view);
    }

    it('should create a controller', function () {
        expect(InputsOutputsCtrl).not.toBeUndefined();
    });

    it('should show only inputs table', function(){
        scope.inputs = {
            'eden':'eden',
            'bla':'bla',
            'foo':'bar'
        };
        appendCompiledHtml(scope);

        var inputsErrorHtml = $('#inputs .error');
        var inputsInfoHtml = $('#inputs .info');
        var inputsTable = $('#inputs table');
        var rowCount = $('#inputs tr').length;
        $('.inputsOutputs').remove();

        expect(inputsErrorHtml.length).toBe(0);
        expect(inputsInfoHtml.length).toBe(0);
        expect(inputsTable.length).toBe(1);
        expect(rowCount).toBe(4);
    });

    it('should show only outputs table', function(){
        scope.outputs = {
            'eden':'eden',
            'bla':'bla',
            'foo':'bar'
        };
        appendCompiledHtml(scope);

        var outputsErrorHtml = $('#outputs .error');
        var outputsInfoHtml = $('#outputs .info');
        var outputsTable = $('#outputs table');
        var rowCount = $('#outputs tr').length;
        $('.inputsOutputs').remove();

        expect(outputsErrorHtml.length).toBe(0);
        expect(outputsInfoHtml.length).toBe(0);
        expect(outputsTable.length).toBe(1);
        expect(rowCount).toBe(4);
    });

    it('should show only inputs error', function(){
        scope.inputsError = 'There was an error';
        appendCompiledHtml(scope);

        var inputsErrorHtml = $('#inputs .error');
        var inputsInfoHtml = $('#inputs .info');
        var inputsTable = $('#inputs table');
        $('.inputsOutputs').remove();

        expect(inputsErrorHtml.length).toBe(1);
        expect(inputsInfoHtml.length).toBe(0);
        expect(inputsTable.length).toBe(0);
    });

    it('should show only outputs error', function(){
        scope.outputsError = 'There was an error';
        appendCompiledHtml(scope);

        var outputsErrorHtml = $('#outputs .error');
        var outputsInfoHtml = $('#outputs .info');
        var outputsTable = $('#outputs table');
        $('.inputsOutputs').remove();

        expect(outputsErrorHtml.length).toBe(1);
        expect(outputsInfoHtml.length).toBe(0);
        expect(outputsTable.length).toBe(0);
    });

    it('should show only inputs not defined', function(){
        appendCompiledHtml(scope);

        var inputsErrorHtml = $('#inputs .error');
        var inputsInfoHtml = $('#inputs .info');
        var inputsTable = $('#inputs table');
        $('.inputsOutputs').remove();

        expect(inputsErrorHtml.length).toBe(0);
        expect(inputsInfoHtml.length).toBe(1);
        expect(inputsTable.length).toBe(0);
    });

    it('should show only outputs not defined', function(){
        appendCompiledHtml(scope);

        var outputsErrorHtml = $('#outputs .error');
        var outputsInfoHtml = $('#outputs .info');
        var outputsTable = $('#outputs table');
        $('.inputsOutputs').remove();

        expect(outputsErrorHtml.length).toBe(0);
        expect(outputsInfoHtml.length).toBe(1);
        expect(outputsTable.length).toBe(0);
    });

    it('should make inputs container float left',function(){
        scope.inputs = {
            'eden':'eden',
            'bla':'bla',
            'foo':'bar'
        };
        scope.outputs = {
            'eden':'eden',
            'bla':'bla',
            'foo':'bar'
        };
        appendCompiledHtml(scope);
        var inputsFloat = $('#inputs').css('float');
        $('.inputsOutputs').remove();

        expect(inputsFloat).toBe('left');
    });

    it('should make outputs container float right',function(){
        scope.inputs = {
            'eden':'eden',
            'bla':'bla',
            'foo':'bar'
        };
        scope.outputs = {
            'eden':'eden',
            'bla':'bla',
            'foo':'bar'
        };
        appendCompiledHtml(scope);
        var outputsFloat = $('#outputs').css('float');
        $('.inputsOutputs').remove();

        expect(outputsFloat).toBe('right');
    });


});
