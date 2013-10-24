'use strict';

angular.module('cosmoUi')
    .directive('sideMenu', function () {
        return {
            template: '<div class="side-menu">' +
                '<div class="logo"></div> ' +
                '<div class="menu">' +
                    '<ul>' +
                        '<li ng-repeat="item in items"><a href="{{item.route}}">              <i class="gs-icon-{{item.icon}}">         </i>            {{item.label}}               </a></li>' +
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
                    { 'route' : '#plans' ,              'icon' : 'plans' ,                'label':'Blueprints'},
                    { 'route' : '#running-apps' ,       'icon' : 'running-apps' ,         'label':'Running Apps'},
                    { 'route' : '#events' ,              'icon' : 'events' ,                'label':'Events'},
                    { 'route' : '#monitoring' ,         'icon' : 'monitoring' ,           'label':'Monitoring'},
                    { 'route' : '#logs' ,               'icon' : 'logs' ,                 'label':'Logs'},
                    { 'route' : '#hosts' ,              'icon' : 'hosts' ,                'label':'Hosts'},
                    { 'route' : '#networks' ,           'icon' : 'networks' ,             'label':'Networks'},
                    { 'route' : '#floating-ips' ,       'icon' : 'floating-ips' ,         'label':'Floating IPs'},
                    { 'route' : '#storage' ,            'icon' : 'storage' ,              'label':'Storage'}
                ];
            }

        };
    });
