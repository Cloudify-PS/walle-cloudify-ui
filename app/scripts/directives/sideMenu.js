'use strict';

angular.module('cosmoUi')
    .directive('sideMenu', function ($location) {
        return {
            templateUrl: 'views/sideMenuTemplate.html',
            restrict: 'A',
            scope:{

            },
            replace:true,
            transclude:true,
            link:function( scope ){
                scope.items = [
                    { 'route' : ['#blueprints', '#blueprint'] ,                       'icon' : 'plans' ,                'label':'Blueprints'},
                    { 'route' : ['#deployments', '#deployment'] ,                     'icon' : 'deployments' ,          'label':'Deployments'},
                    { 'route' : ['#monitoring'] ,                                     'icon' : 'monitoring' ,           'label':'Monitoring'},
                    { 'route' : ['#logs'] ,                                           'icon' : 'logs' ,                 'label':'Logs'},
                    { 'route' : ['#hosts'] ,                                          'icon' : 'hosts' ,                'label':'Hosts'},
                    { 'route' : ['#networks'] ,                                       'icon' : 'networks' ,             'label':'Networks'},
                    { 'route' : ['#floating-ips'] ,                                   'icon' : 'floating-ips' ,         'label':'Floating IPs'},
                    { 'route' : ['#storage'] ,                                        'icon' : 'storage' ,              'label':'Storage'}
                ];

                scope.selectedItem = null;

                scope.isSelected = function(item) {
                    return item.route.indexOf('#' + $location.path().substr(1)) >= 0;
                };

                scope.itemClick = function(item) {
                    scope.selectedItem = item;
                };
            }

        };
    });
