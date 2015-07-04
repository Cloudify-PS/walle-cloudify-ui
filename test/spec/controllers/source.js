'use strict';

describe('Controller: SourceCtrl', function () {
    // load the controller's module
    beforeEach(module('cosmoUiApp', 'ngMock', 'backend-mock'));

    var SourceCtrl, scope;


    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, BlueprintSourceService, CloudifyService ) {

        scope = $rootScope.$new();

        scope.id = 'blueprint1';
        scope.errorMessage = 'noPreview';

        spyOn(BlueprintSourceService,'get').andCallFake( function() {
            return {
                then: function(success){
                    success(_blueprint);
                }
            };
        });

        spyOn(CloudifyService.blueprints,'browse').andCallFake(function() {
            return {
                then: function(){
                    scope.browseData = _browseData;
                }
            };
        });

        spyOn(BlueprintSourceService,'getBrowseData').andCallFake(function() {
            return {
                then: function(){
                    scope.browseData = _browseData;
                }
            };
        });

        SourceCtrl = $controller('SourceCtrl', {
            $scope: scope
        });
    }));

    it('should create a controller', function () {
        expect(SourceCtrl).not.toBeUndefined();
    });

    xit('should get a specific blueprint by its id', function() {
        waitsFor(function() {
            return scope.selectedBlueprint !== {};
        });
        runs(function() {
            expect(scope.selectedBlueprint).toEqual(_blueprint);
        });
    });

    xit('should get browse data of  a specific blueprint by id', function() {
          expect(scope.browseData).toEqual('foo');
    });

    it('should return fa-minus-square-o string', function() {
        var result = scope.isFolderOpen({show: true});

        expect(result).toBe('fa-minus-square-o');
    });

    it('should return fa-plus-square-o string', function() {
        var result = scope.isFolderOpen({});

        expect(result).toBe('fa-plus-square-o');
    });

    it('should return folder string', function() {
        var result = scope.setBrowseType({children: []});

        expect(result).toBe('folder');
    });

    it('should return true value when filename matches current filename value on scope', function() {
        scope.filename = 'myFile';
        var result = scope.isSelected('myFile');

        expect(result).toBeTruthy();
    });

    xit('should return file-jpeg string', function() {
        var result = scope.setBrowseType({encoding: 'jpeg'});

        expect(result).toBe('file-jpeg');
    });

    xit('should return true if file is a text file', function() {
        var result = scope.isSourceText('myFile.yaml');

        expect(result).toBeTruthy();
    });

    xit('should return false if file is not a text file', function() {
        var result = scope.isSourceText('myFile.jpg');

        expect(result).toBeFalsy();
    });

});
