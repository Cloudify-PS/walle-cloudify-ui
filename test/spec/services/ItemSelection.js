'use strict';

describe('Service: ItemSelection', function () {

    // load the service's module
    beforeEach(module('cosmoUiApp'));

    // instantiate service
    var mySelection, blueprintsList;
    beforeEach(inject(function (ItemSelection) {
        blueprintsList = [{id: 'blueprint1'},{id: 'blueprint2'}];
        mySelection = new ItemSelection(blueprintsList);
    }));

    it('should select specific', function(){
        mySelection.select(blueprintsList[1]);
        expect(blueprintsList[1].isSelected).toBe(true);
        expect(mySelection.selected).toBe(blueprintsList[1]);

        mySelection.select(blueprintsList[0]);
        expect(blueprintsList[1].isSelected).toBe(false);
        expect(blueprintsList[0].isSelected).toBe(true);
        expect(mySelection.selected).toBe(blueprintsList[0]);
    });

    it('should select next', function () {
        mySelection.selectNext();
        expect(blueprintsList[0].isSelected).toBe(true);
        expect(mySelection.selected).toBe(blueprintsList[0]);
        mySelection.selectNext();
        expect(blueprintsList[0].isSelected).toBe(false);
        expect(blueprintsList[1].isSelected).toBe(true);
        expect(mySelection.selected).toBe(blueprintsList[1]);
        mySelection.selectNext();
        expect(blueprintsList[1].isSelected).toBe(true);
        expect(mySelection.selected).toBe(blueprintsList[1]);
    });

    it('should select previous', function(){
        mySelection.select(blueprintsList[1]);
        mySelection.selectPrevious();
        expect(blueprintsList[0].isSelected).toBe(true);
        expect(blueprintsList[1].isSelected).toBe(false);
        expect(mySelection.selected).toBe(blueprintsList[0]);

        mySelection.selectPrevious();
        expect(blueprintsList[0].isSelected).toBe(true);
        expect(mySelection.selected).toBe(blueprintsList[0]);
    });
});
