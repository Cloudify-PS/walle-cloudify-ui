'use strict';

angular.module('cosmoYamlApp')
  .directive('toolBar', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        //element.text('this is the toolBar directive');
      }
    };
  });
