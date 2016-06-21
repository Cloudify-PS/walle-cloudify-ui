'use strict';

angular.module('cosmoUiApp')
    .directive('multiSelectMenu', function ($document) {
        return {
            restrict: 'A',
            require: '?ngModel',
            templateUrl : 'views/directives/multiSelectMenu.html',
            replace: true,
            scope: {
                options: '='
            },
            link: function postLink($scope, $element, $attrs, ngModel) {

                $scope.multiple = false;
                $scope.isInit = false;
                var optionMark = false,
                    isOpen = false;


                function setValue(value){
                    ngModel.$setViewValue(value);
                }

                function isGroup(option){
                    return option.groupLabel ? true : false;
                }

                $scope.$watch('filter', filterOptions, true);
                function filterOptions(newValue){
                    var filtered = [];
                    _.forEachRight($scope.options, function(option){
                        var beforeIsItem = filtered[0] && filtered[0].label ? true : false;
                        if((isGroup(option) && beforeIsItem) || (option.label && option.label.indexOf(newValue) !== -1)){
                            filtered.unshift(option);
                        }
                    });
                    $scope.filteredItems = filtered;
                }

                /**
                 * Update Marked option when filtering the options
                 */
                function _filterItems() {
                    $scope.$watch('filteredItems', function () {
                        _navigateStart();
                    }, true);
                }

                /**
                 * Clean non relevant selected options
                 */
                function _listener() {
                    $scope.$watch('options', function (options) {
                        setInit();
                        if(options){
                            filterOptions($scope.filter || '');
                        }
                        if (ngModel.$modelValue && ngModel.$modelValue.length > 0) {
                            var selected = ngModel.$modelValue;
                            for(var i in selected) {
                                var option = selected[i];
                                if (options.indexOf(option) === -1) {
                                    selected.splice(i, 1);
                                }
                            }
                            setValue(selected);
                        }
                    }, true);
                }

                if($attrs.listener === 'true') {
                    _filterItems();
                    _listener();
                }

                /**
                 * Define Multiple Mode
                 */
                if($attrs.hasOwnProperty('multiple') && $attrs.multiple === 'true') {
                    $scope.multiple = true;
                    setValue([]);
                }

                /**
                 * Set Init Value
                 */
                function setInit() {
                    if(!$scope.isInit && $attrs.init !== undefined) {
                        for(var i in $scope.options) {
                            if($scope.options[i].value && $attrs.init.indexOf($scope.options[i].value) !== -1) {
                                _select($scope.options[i]);
                                if(!$scope.multiple) {
                                    break;
                                }
                            }
                        }
                        $scope.isInit = false;
                    }
                }

                /**
                 * Open DropDown
                 * @private
                 */
                var activeElement;
                function _open( $event ) {
                    if($event) {
                        if ($event.stopPropagation) {
                            $event.stopPropagation();
                        }
                        if ($event.preventDefault) {
                            $event.preventDefault();
                        }
                        $event.cancelBubble = true;
                        $event.returnValue = false;

                        if ($event && $event.target) {
                            if ($($event.target).is('.no-click')) {
                                return;
                            }

                            if ($($event.target).is('t')) {
                                $('[data-ng-model="filter"]').focus();
                                $('[data-ng-model="filter"]')[0].setSelectionRange(0, 0);
                            }

                        }
                    }
                    activeElement = document.activeElement;
                    activeElement && activeElement.blur();

                    if ( !isOpen ){
                        $scope.filter = '';
                        if (ngModel.$modelValue) {
                            optionMark = ngModel.$modelValue;
                        }
                        isOpen = true;
                    }else{
                        _close();
                    }
                }

                /**
                 * Close DropDown
                 * @private
                 */
                function _close() {
                    isOpen = false;
                    if (activeElement) {
                        activeElement.focus();
                        activeElement = undefined;
                    }
                }

                /**
                 * Select Option
                 * @param option
                 * @private
                 */
                function _select(option) {

                    if($scope.multiple === true ) {
                        if ( !ngModel.$modelValue ){
                            ngModel.$modelValue = []; // init
                        }
                        if(ngModel.$modelValue.indexOf(option) > -1) {
                            var values = ngModel.$modelValue;
                            values.splice(ngModel.$modelValue.indexOf(option), 1);
                            setValue(values);
                        }else {
                            setValue(ngModel.$modelValue.concat(option));
                        }
                    }else {
                        setValue(option);
                        _close();
                    }
                }

                /**
                 * Define the option which will start the navigation
                 * @private
                 */
                function _navigateStart() {
                    if ($scope.filteredItems && $scope.filteredItems.length) {
                        if (optionMark) {
                            if ($scope.filteredItems.indexOf(optionMark) === -1) {
                                optionMark = $scope.filteredItems[0];
                            }
                        }else {
                            optionMark = $scope.filteredItems[0];
                        }
                    }
                }

                /**
                 * Navigate to next/prev option by keyboard
                 * @param to - event keycode
                 * @private
                 */
                function _navigate(to) {
                    var ARROW_UP = 38;
                    var ARROW_DOWN= 40;
                    var currentIndex;
                    switch (to) {
                        case ARROW_UP:
                            currentIndex = $scope.filteredItems.indexOf(optionMark);
                            if(currentIndex - 1 > -1){
                                if(isGroup($scope.filteredItems[currentIndex - 1])){
                                    if(currentIndex -2 > -1) {
                                        optionMark = $scope.filteredItems[currentIndex - 2];
                                    }
                                } else{
                                    optionMark = $scope.filteredItems[currentIndex - 1];
                                }
                            }
                            $scope.$digest();
                            break;
                        case ARROW_DOWN:
                            currentIndex = $scope.filteredItems.indexOf(optionMark);
                            if($scope.filteredItems.length > currentIndex + 1){
                                if(isGroup($scope.filteredItems[currentIndex + 1])){
                                    optionMark = $scope.filteredItems[currentIndex + 2];
                                } else{
                                    optionMark = $scope.filteredItems[currentIndex + 1];
                                }
                            }
                            $scope.$digest();
                            break;
                    }
                }

                /**
                 * Public Methods Pointers
                 */
                $scope.close = _close;
                $scope.open = _open;
                $scope.select = _select;

                /**
                 * Bind the style of open mode
                 * @returns {string}
                 */
                $scope.isOpen = function () {
                    return isOpen ? 'open' : 'closed';
                };

                /**
                 * Default label when nothing is selected
                 * @returns {*}
                 */
                $scope.selectedLabel = function () {

                    if (!ngModel.$modelValue || ngModel.$modelValue.length === 0) {
                        return $attrs.text || 'Select';
                    }else {
                        if($scope.multiple === true) {
                            if(ngModel.$modelValue.length === 1) {
                                return ngModel.$modelValue[0].label;
                            }
                            if($attrs.hasOwnProperty('selection')) {
                                return $attrs.selection.replace('$count', ngModel.$modelValue.length);
                            }
                            return ngModel.$modelValue.length + ' Selections';
                        }
                        return ngModel.$modelValue.label;
                    }
                };

                /**
                 * Checked the checkbox on multiple selection
                 * @param option
                 * @returns {boolean}
                 */
                $scope.optionChecked = function(option) {
                    if($scope.multiple === true && ngModel.$modelValue ) {
                        return ngModel.$modelValue.indexOf(option) > -1 ? true : false;
                    }
                    return false;
                };

                /**
                 * Set the current option as the Marked option on Hover
                 * @param option
                 */
                $scope.hoverOption = function (option) {
                    optionMark = option;
                };

                /**
                 * Reflect the current option will be selected by press on 'Enter'
                 * @returns {string}
                 */
                $scope.reflection = function () {
                    if (optionMark && optionMark.hasOwnProperty('label')) {
                        var label = optionMark.label;
                        if ($scope.filter !== undefined) {
                            var chars = label.substr(0, $scope.filter.length);
                            if ($scope.filter.toLowerCase() === chars.toLowerCase()) {
                                label = label.substr($scope.filter.length);
                                return $scope.filter + label;
                            }
                        }
                    }
                };

                /**
                 * Bind style for currnet Marked option
                 * @param option
                 * @returns {string}
                 */
                $scope.navigator = function (option) {
                    if (option === optionMark) {
                        return 'markNav';
                    }
                };



                /**
                 * Close on Click Out
                 */
                $document.click(function (e) {
                    if ($element.has(e.target).length === 0) {
                        $scope.$apply(_close);
                    }
                });

                /**
                 * Keywords Shourcuts
                 */
                $document.keydown(function (e) {
                    if (!isOpen || e.isDefaultPrevented() ) {
                        return;
                    }
                    if (e.keyCode === 27) {
                        $scope.$apply(_close);
                    }
                    switch (e.keyCode) {
                        case 27: // Esc
                            $scope.$apply(_close);
                            break;
                        case 13: // Enter
                            $scope.selectMarked(e);
                            break;
                        case 38: // navigate up
                        case 40: // navigate down
                            _navigate(e.keyCode);
                            break;
                    }
                });

                $scope.selectMarked = function(event){
                    $scope.$apply(_select(optionMark));
                    if(event){
                        event.preventDefault();
                    }
                };

            }
        };
    });
