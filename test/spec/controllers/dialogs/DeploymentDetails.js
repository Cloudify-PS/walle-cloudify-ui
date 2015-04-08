'use strict';

describe('Controller: dialogs/DeploymentDetailsCtrl', function () {

  // load the controller's module
  beforeEach(module('cosmoUiApp'));

  var dialogs/DeploymentDetailsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    dialogs/DeploymentDetailsCtrl = $controller('dialogs/DeploymentDetailsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', inject(function () {
    expect(scope.awesomeThings.length).toBe(3);
  }));
});
