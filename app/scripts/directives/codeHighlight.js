'use strict';

angular.module('cosmoUiApp')
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
                    'collapse': false,
                    'first-line': 1,
                    'gutter': true,
                    'highlight': false,
                    'html-script': true,
                    'smart-tabs': false,
                    'tab-size': 4,
                    'toolbar': false,
                    'quick-code': false
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
