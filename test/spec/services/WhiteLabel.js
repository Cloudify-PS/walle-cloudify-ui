'use strict';

describe('Service: WhiteLabel', function () {

  // load the service's module
  beforeEach(module('cosmoUi'));

  // instantiate service
  var WhiteLabel;
  beforeEach(inject(function (_WhiteLabel_) {
    WhiteLabel = _WhiteLabel_;
  }));

  it('should do something', function () {
    expect(!!WhiteLabel).toBe(true);
  });

});
