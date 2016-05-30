'use strict';

describe('Directive: uploadFileForm', function () {
    // load the directive's module
    beforeEach(module('cosmoUiApp', 'templates-main', 'backend-mock'));

    var element,
      scope, directiveScope;

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    var setup = inject(function( $compile ){
        element = angular.element('<upload-file-form extensions="\'.tar.gz\'" selection="selection"></upload-file-form>');
        element = $compile(element)(scope);
        scope.$digest();
        directiveScope = element.isolateScope();
    });

    it('should listen on file selection', function(){
        setup();
        var file = {name: 'file.tar.gz'};
        directiveScope.onFileSelect(file);
        scope.$digest();
        expect(scope.selection).toEqual(file);
        expect(directiveScope.inputText).toBe('file.tar.gz');

        directiveScope.onFileSelect();
        scope.$digest();
        expect(scope.selection).toEqual(undefined);
        expect(directiveScope.inputText).toBe(null);
    });

    it('should listen on inputText changes', function(){
        setup();
        var file = 'http://archive';
        directiveScope.inputText = file;
        scope.$digest();
        expect(scope.selection).toBe(file);

        file = '';
        directiveScope.inputText = file;
        scope.$digest();
        expect(scope.selection).toBe(undefined);
    });
});
