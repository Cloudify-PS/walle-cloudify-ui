'use strict';

angular.module('cosmoUi')
    .directive('sideMenu', function ($location) {
        return {
            template: '<div class="side-menu">' +
                '<div class="menu">' +
                    '<ul>' +
                        '<li ng-repeat="item in items" ng-class="{selected:isSelected(item)}" ng-click="itemClick(item)">' +
                            '<a href="{{item.route[0]}}">' +
                                '<div class="gs-icon-{{item.icon}} side-menu-icon"></div>' +
                                '<div class="side-menu-title">{{item.label}}</div>' +
                            '</a>' +
                        '</li>' +
                    '</ul>' +
                '</div> ' +
              '</div>',
            restrict: 'A',
            scope:{

            },
            replace:true,
            transclude:true,
            link:function( scope ){
                scope.items = [
                    { 'route' : ['#blueprints', '#blueprint'] ,                       'icon' : 'plans' ,                'label':'Blueprints'},
                    { 'route' : ['#deployments', '#deployment'] ,                     'icon' : 'deployments' ,          'label':'Deployments'},
//                    { 'route' : ['#events'] ,                                         'icon' : 'events' ,               'label':'Events'},
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
//                    return $location.path().substr(1) === item.route.substr(1).split('?')[0];
                };

                scope.itemClick = function(item) {
                    scope.selectedItem = item;
                };
            }

        };
    });
