'use strict';

angular.module('cosmoUi')
    .directive('codeHighlight', function () {
        return {
            restrict: 'A',
            require: '?ngModel',
            transclude: true,
            scope: true,
            link: function postLink($scope, $element, $attrs, ngModel) {
                if (!ngModel) { // do nothing if no ngModel
                    return;
                }
                var options = {
                    'brush': $attrs.codeHighlight,
                    'auto-links': true,
                    'class-name': '',
                    'collapse': false,
                    'first-line': 1,
                    'gutter': false,
                    'highlight': false,
                    'html-script': false,
                    'smart-tabs': true,
                    'tab-size': 4,
                    'toolbar': false
                };
                ngModel.$render = function () {
                    var config = ngModel.$viewValue || {};
                    angular.forEach(config, function(value, name){
                        if(options.hasOwnProperty(name)) {
                            options[name] = value;
                        }
                    });
                    if (config.hasOwnProperty('data') && config.data !== '') {
                        $element.empty();
                        var tmpSpan = angular.element('<span>');
                        $element.append(tmpSpan);
                        tmpSpan.text(config.data);
                        window.SyntaxHighlighter.highlight(options, tmpSpan[0], false);
                    }
                };
            }
        };
    });
