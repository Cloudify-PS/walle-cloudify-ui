'use strict';

angular.module('cosmoYamlApp')
    .directive('yamlResult', function () {
        return {
            template: '<div id="json"></div>',
            restrict: 'E',
            scope: {
                json: '='
            },
            link: function(scope) {
                function json2html(json) {
                    var i, ret = '';
                    ret += '<ul>';
                    for( i in json) {
                        ret += '<li>' + i + ': ';
                        if( typeof json[i] === 'object') {
                            ret += json2html(json[i]);
                        } else {
                            ret += json[i];
                        }
                        ret += '</li>';
                    }
                    ret += '</ul>';
                    return ret;
                }

                scope.$watch('json', function() {
                    $('#json').html(json2html(scope.json));
                });

            }
        };
    });
