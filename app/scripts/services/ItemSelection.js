'use strict';

/**
 * @ngdoc service
 * @name cosmoUiApp.ItemSelection
 * @description
 * # ItemSelection
 * Factory in the cosmoUiApp.
 */
angular.module('cosmoUiApp')
    .factory('ItemSelection', function () {
        function ItemSelection(items){
            this.selected = '';

            this.select = function(selectedItem){
                _.each(items, function(item){
                    item.isSelected = false;
                });
                selectedItem.isSelected = true;
                this.selected = selectedItem;
            };

            this.selectNext = function(){
                var selectedIndex = _.findIndex(items, 'isSelected') + 1;
                if(selectedIndex !== items.length){
                    this.select(items[selectedIndex]);
                }
            };

            this.selectPrevious = function(){
                var selectedIndex = _.findIndex(items, 'isSelected') - 1;
                if(selectedIndex > -1){
                    this.select(items[selectedIndex]);
                }
            };
        }

        return ItemSelection;
    });
