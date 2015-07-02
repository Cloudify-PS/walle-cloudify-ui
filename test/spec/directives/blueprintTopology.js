'use strict';

describe('Directive: blueprintTopology', function () {

  // load the directive's module
  beforeEach(module('cosmoUiApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  var setup = inject(function( $compile ){
    element = angular.element('<blueprint-topology></blueprint-topology>');
    element = $compile(element)(scope);
    scope.$digest();
  });

  it('should make hidden element visible', inject(function () {
    setup();
    expect(element.text()).toBe('this is the blueprintTopology directive');
  }));
});
