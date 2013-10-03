'use strict';

angular.module('cosmoYamlApp')
    .directive('toolBar', function () {
        return {
            template: '<div id="toolbarButtonsContainer">' +
                    '<input id="search" type="text" placeholder="Search on Cloudify..."/>' +
                    '<div class="toolbarButton" id="apps"></div>' +
                    '<div class="toolbarButton on" id="messages">' +
                        '<div class="newAlerts">2</div>' +
                    '</div>' +
                '</div>',
            restrict: 'E',
            link: function() {
                $('#apps').on('click', function() {
                    console.log('apps button clicked');
                });

                $('#messages').on('click', function() {
                    console.log('messages button clicked');
                });
            }
        };
    });
