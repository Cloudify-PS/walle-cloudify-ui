'use strict';

angular.module('cosmoUi')
    .directive('toolBar', function () {
        return {
            template: '<div id="toolbarButtonsContainer">' +
                    '<input id="search" type="text" placeholder="Search on Cloudify..."/>' +
                    '<div class="toolbarButton apps"></div>' +
                    '<div class="toolbarButton on messages" id="messages">' +
                        '<div class="newAlerts">2</div>' +
                    '</div>' +
                '</div>',
            restrict: 'E',
            link: function( element ) {
                $(element).on('.apps','click', function() {
                    console.log('apps button clicked');
                });

                $(element).on('.messages','click', function() {
                    console.log('messages button clicked');
                });
            }
        };
    });
