'use strict';

describe('Directive: uploadFile', function () {

    // load the directive's module
    beforeEach(module('cosmoUiApp', 'backend-mock', 'templates-main'));

    var element, scope;
    var $timeout;

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    var setup = inject(function( $compile, _$timeout_){
        $timeout = _$timeout_;
        element = angular.element('<upload-file extensions="extensions" on-file-select="selectCallback" open-file-selection="open"></upload-file>');
        element = $compile(element)(scope);
        scope.$digest();
    });


    it('should open file selection', function(){
        setup();
        spyOn(element[0].children[0],'click').and.callThrough();
        expect(typeof scope.open).toBe('function');
        scope.open();
        expect(element[0].children[0].click).toHaveBeenCalled();
    });

    it('should bind extensions', function(){
        scope.extensions = '.tar.bz2,.bz2,.gz,.tar.gz,.tar,.tgz,.zip';
        setup();

        expect(element[0].children[1].attributes.accept.value).toBe(scope.extensions);
    });
});
