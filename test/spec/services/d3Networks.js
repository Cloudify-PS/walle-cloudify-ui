'use strict';

describe('Service: d3Networks', function () {

  // load the service's module
  beforeEach(module('cosmoUiApp'));

  // instantiate service
  var d3Networks;
  beforeEach(inject(function (_d3Networks_) {
    d3Networks = _d3Networks_;
  }));

  it('should do something', function () {
    expect(!!d3Networks).toBe(true);
  });

});
