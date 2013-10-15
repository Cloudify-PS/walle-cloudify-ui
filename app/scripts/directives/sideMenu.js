'use strict';

angular.module('cosmoUi')
    .directive('sideMenu', function () {
        return {
            template: '<div>' +
                '<div id="logo"></div> ' +
                '<div id="menu">' +
                    '<ul>' +
                        '<li><div class="gsi plans" id="plans"></div>Plans</li>' +
                        '<li><div class="gsi running-apps" id="runningApps"></div>Running Apps</li>' +
                        '<li><div class="gsi events" id="events"></div>Events</li>' +
                        '<li><div class="gsi monitoring" id="monitoring"></div>Monitoring</li>' +
                        '<li><div class="gsi logs" id="logs"></div>Logs</li>' +
                        '<li><div class="gsi hosts" id="hosts"></div>Hosts</li>' +
                        '<li><div class="gsi networks" id="networks"></div>Networks</li>' +
                        '<li><div class="gsi" id="floatingIps"></div>Floating IPs</li>' +
                        '<li><div class="gsi" id="storage"></div>Storage</li>' +
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
