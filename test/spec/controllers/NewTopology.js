'use strict';

describe('Controller: NewTopologyCtrl', function () {

  // load the controller's module
  beforeEach(module('cosmoUiApp'));

  var NewTopologyCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NewTopologyCtrl = $controller('NewTopologyCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', inject(function () {
    expect(scope.awesomeThings.length).toBe(3);
  }));
});
