'use strict';

describe('Directive: cosmoLayout', function () {
    beforeEach(module('cosmoUiApp','backend-mock'));

    var element;

    it('should make hidden element visible', inject(function ($rootScope, $compile, VersionService, $templateCache ) {
        spyOn( VersionService, 'getVersions').andCallFake(function(){ return { then : function( success ){ success('foo'); } }; });
        element = angular.element('<div class="cosmo-layout"></div>');
        $templateCache.put('views/cosmoLayoutTemplate.html','<div></div>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        expect($rootScope.embedded).toBe(undefined);
        expect(VersionService.getVersions).toHaveBeenCalled();
        expect($rootScope.versions).toBe('foo');
    }));
});
