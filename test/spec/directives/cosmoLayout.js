'use strict';

describe('Directive: cosmoLayout', function () {
  beforeEach(module('cosmoUi'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<div class="cosmo-layout"></div>');
    element = $compile(element)($rootScope);
    expect(element.html()).toContain('menu');
  }));
});
