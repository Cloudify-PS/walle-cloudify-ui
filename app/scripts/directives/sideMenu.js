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
                    { 'route' : ['#monitoring'] ,                                     'icon' : 'monitoring' ,           'label':'Monitoring',       isDisabled: true},
                    { 'route' : ['#logs'] ,                                           'icon' : 'logs' ,                 'label':'Logs & Events'},
                    { 'route' : ['#hosts'] ,                                          'icon' : 'hosts' ,                'label':'Hosts',            isDisabled: true},
                    { 'route' : ['#networks'] ,                                       'icon' : 'networks' ,             'label':'Networks',         isDisabled: true},
                    { 'route' : ['#floating-ips'] ,                                   'icon' : 'floating-ips' ,         'label':'Floating IPs',     isDisabled: true},
                    { 'route' : ['#storage'] ,                                        'icon' : 'storage' ,              'label':'Storage',          isDisabled: true}
                ];

                scope.selectedItem = null;

                scope.isSelected = function(item) {
                    return item.route.indexOf('#' + $location.path().substr(1)) >= 0;
                };

                scope.isDisabled = function(item) {
                    return item.isDisabled !== undefined && item.isDisabled === true;
                };

                scope.itemClick = function(item) {
                    if (!scope.isDisabled(item)) {
                        scope.selectedItem = item;
                    }
                };
            }

        };
    });
