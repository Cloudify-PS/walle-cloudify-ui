'use strict';

describe('Run: hotkeysDialogListener', function () {

    var $rootScope, hotkeys;
    beforeEach(module('cosmoUiApp'));

    beforeEach(inject(function(_$rootScope_, _hotkeys_ ){
        hotkeys = _hotkeys_;
        $rootScope = _$rootScope_;
        spyOn(hotkeys, 'pause').and.callThrough();
        spyOn(hotkeys, 'unpause').and.callThrough();
    }));

    it('should pause all hotkeys', inject(function(){
        $rootScope.$broadcast('ngDialog.opened');
        expect(hotkeys.pause).toHaveBeenCalled();
    }));

    it('should unpause all hotkeys', function(){
        $rootScope.$broadcast('ngDialog.closed');
        expect(hotkeys.unpause).toHaveBeenCalled();
    });
});
