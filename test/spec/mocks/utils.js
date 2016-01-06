/**
 *
 * @description
 *
 * a utility function to help mock promises. Using $q for mocks in tests is a bad practice. tests should not be asyncronous.
 * This mock makes a synchronous promise like mechanism.
 * I found it answers at least 80% of my use-cases and reduces code significantly.
 *
 * Usage:
 *
 * `spyOn(MyService,'callApiRequest').and.returnValue(window.mockPromise()) // ==> will not call any of the callbacks`
 *
 * To call success, run `window.mockPromise(successResponse)` - set successResponse to whatever you want.
 * To call error, run `window.mockPromise(null, errorResponse)` - set errorResponse to whatever you want.
 *
 * The use of `window` is so we won't get jshint issues.
 *
 *
 **/

'use strict';
window.mockPromise = function (successResponse, errorResponse) {
    return {
        then: function (success, error) {
            if (!!successResponse) {
                success(successResponse);
            }

            if (!!errorResponse) {
                error(errorResponse);
            }
        }
    };
};
