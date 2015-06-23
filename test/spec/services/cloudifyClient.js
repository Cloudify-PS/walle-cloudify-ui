'use strict';

describe('Service: cloudifyClient', function () {

  // load the service's module
  beforeEach(module('cosmoUiApp'));

  // instantiate service
  var mcloudifyClient;
  beforeEach(inject(function (cloudifyClient) {
    mcloudifyClient = cloudifyClient;
  }));

  it('should do something', function () {
    expect(!!mcloudifyClient).toBe(true);
  });

});
