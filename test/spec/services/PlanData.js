'use strict';

describe('Service: PlanData', function () {

  // load the service's module
  beforeEach(module('cosmoUi'));

  // instantiate service
  var PlanData;
  beforeEach(inject(function (_PlanData_) {
    PlanData = _PlanData_;
  }));

  it('should do something', function () {
      var planData = PlanData.newInstance();
      planData.addNode({});
    expect(planData.getNodes().length).toBe(1);
  });

});
