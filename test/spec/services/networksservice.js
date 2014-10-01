'use strict';

describe('Service: NetworksService', function () {

  // load the service's module
  beforeEach(module('cosmoUiAppApp'));

  // instantiate service
  var NetworksService;
  beforeEach(inject(function (_NetworksService_) {
    NetworksService = _NetworksService_;
  }));

  it('should do something', function () {
    expect(!!NetworksService).toBe(true);
  });

});
