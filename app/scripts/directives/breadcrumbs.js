'use strict';

//angular.module('cosmoUi')
//    .directive('breadcrumb', function () {
//        return {
//            template: '<div id="breadcrumb"></div>',
//            restrict: 'EA',
//            scope: {
//
//            },
//            link: function postLink(scope, element) {
//                scope.breadcrumb = [];
//
//                scope.add = function(obj) {
//                    scope.breadcrumb.push(obj);
//                };
//
//                scope.remove = function() {
//                    scope.breadcrumb.pop();
//                };
//
//                function updateBreadcrumb() {
//                    var div = element.find('breadcrumb');
//                    for (var i in scope.breadcrumb) {
//
//                    }
//                }
//            }
//        };
//    });


angular.module('cosmoUi')
    .directive('breadcrumbs', function(BreadcrumbsService) {
    return {
        restrict: 'EA',
        template: '<ul><li ng-repeat=\'bc in breadcrumbs\' ng-class="{\'active\': {{$last}} }"><a ng-click="unregisterBreadCrumb( $index )" ng-href="{{bc.href}}">{{bc.label}}</a><span class="divider" ng-show="! $last">|</span></li></ul>',
        replace: true,
        compile: function() {
            return function($scope, $elem, $attr) {
                var bc_id = $attr.id,
                    resetCrumbs = function() {
                        $scope.breadcrumbs = [];
                        angular.forEach(BreadcrumbsService.get(bc_id), function(v) {
                            $scope.breadcrumbs.push(v);
                        });
                    };
                resetCrumbs();
                $scope.unregisterBreadCrumb = function( index ) {
                    BreadcrumbsService.setLastIndex( bc_id, index );
                    resetCrumbs();
                };
                $scope.$on( 'breadcrumbsRefresh', function() {
                    console.log( '$on' );
                    resetCrumbs();
                } );
            };
        }
    };

});