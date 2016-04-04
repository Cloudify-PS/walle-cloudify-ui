'use strict';

angular.module('cosmoUiApp')
    .directive('sideMenu', function ($location, $state) {
        return {
            templateUrl: 'views/sideMenuTemplate.html',
            restrict: 'A',
            scope:{

            },
            replace:true,
            transclude:true,
            link:function( scope ){
                scope.items = [
                    { 'route' : ['#blueprints', '#blueprint'] ,         reload: true,  'icon': 'plans',        'label':'Blueprints'                         },
                    { 'route' : ['#deployments', '#deployment'] ,       reload: false,  'icon': 'deployments',  'label':'Deployments'                        },
//                    { 'route' : ['#monitoring'] ,                       reload: false, 'icon': 'monitoring',   'label':'Monitoring',       isDisabled: true },
                    { 'route' : ['#logs'] ,                             reload: false, 'icon': 'logs',         'label':'Logs & Events'                      },
                    { 'route' : ['#nodes-instances'] ,                            reload: false, 'icon': 'nodes-instances',        'label':'Nodes Instances'                              }
                    //{ 'route' : ['#floating-ips'] ,                     reload: false, 'icon': 'floating-ips', 'label':'Floating IPs',     isDisabled: true },
                    //{ 'route' : ['#storage'] ,                          reload: false, 'icon': 'storage',      'label':'Storage',          isDisabled: true }
                ];

                scope.selectedItem = null;

                scope.isSelected = function(item) {
                    for(var i in item.route) {
                        if($location.path().substr(1).search(item.route[i].substr(1)) === 0) {
                            return true;
                        }
                    }
                    return false;
                };

                scope.isDisabled = function(item) {
                    return item.isDisabled !== undefined && item.isDisabled === true;
                };

                scope.itemClick = function(item) {
                    if (!scope.isDisabled(item)) {
                        scope.selectedItem = item;
                    }
                };

                scope.goTo = function(item) {
                    if($location.path() === '/' + item.route[0].substr(1) && item.reload === true) {
                        $state.go($state.current, {}, {reload: true});
                    }
                    $location.url(item.route[0].substr(1));
                };
            }

        };
    });
