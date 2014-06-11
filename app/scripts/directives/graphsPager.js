'use strict';

angular.module('cosmoUi')
    .directive('graphsPager', function ($window) {
        return {
            restrict: 'A',
            link: function postLink($scope, $element) {

                var currentPage = 0;

                function _onResize(callbackFn, firstInit) {
                    if(firstInit === true){
                        callbackFn();
                    }
                    angular.element($window).bind('resize', function() {
                        callbackFn();
                    });
                }

                _onResize(function(){
                    $scope.pagerWidth = $element.width();
                    $scope.pagerLength = $element.find('.page').length;
                }, true);

                function _scrollToPage(page) {
                    $element.find('.pages').css('left', -($scope.pagerWidth * page));
                }

                $scope.scrollRight = function() {
                    if($element.find('.page').length > (currentPage + 1)) {
                        currentPage++;
                        _scrollToPage(currentPage);
                    }
                };

                $scope.scrollLeft = function() {
                    if(currentPage > 0) {
                        currentPage--;
                        _scrollToPage(currentPage);
                    }
                };

            }
        };
    });
