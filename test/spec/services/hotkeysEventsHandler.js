'use strict';

describe('Service: hotkeysEventsHandler', function () {

  // load the service's module
  beforeEach(module('cosmoUiApp'));

  // instantiate service
  var mhotkeysEventsHandler;
  beforeEach(inject(function (hotkeysEventsHandler) {
    mhotkeysEventsHandler = hotkeysEventsHandler;
  }));

  it('should do something', function () {
    expect(!!mhotkeysEventsHandler).toBe(true);
  });

});
