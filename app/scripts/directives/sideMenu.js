'use strict';

angular.module('cosmoYamlApp')
    .directive('sideMenu', function () {
        return {
            template: '<div>' +
                '<div id="logo"></div> ' +
                '<div id="menu">' +
                    '<ul>' +
                        '<li><div class="menuIcon" id="plans"></div>Plans</li>' +
                        '<li><div class="menuIcon" id="runningApps"></div>Running Apps</li>' +
                        '<li><div class="menuIcon" id="events"></div>Events</li>' +
                        '<li><div class="menuIcon" id="monitoring"></div>Monitoring</li>' +
                        '<li><div class="menuIcon" id="logs"></div>Logs</li>' +
                        '<li><div class="menuIcon" id="hosts"></div>Hosts</li>' +
                        '<li><div class="menuIcon" id="networks"></div>Networks</li>' +
                        '<li><div class="menuIcon" id="floatingIps"></div>Floating IPs</li>' +
                        '<li><div class="menuIcon" id="storage"></div>Storage</li>' +
                    '</ul>' +
                '</div> ' +
              '</div>',
            restrict: 'E',
            link: function() {
                $('#menu li').on('click', function(element) {
                    console.log(element.currentTarget.innerText + ' button was clicked');
                });
            }
        };
    });
