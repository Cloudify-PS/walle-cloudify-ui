'use strict';

describe('Service: Breadcrumbsservice', function () {

    var Breadcrumbsservice;

    describe('Test setup', function() {
        it('Injecting required data & initializing a new instance', function() {

            // Load the app module
            module('cosmoUiApp');

            // Initialize a new instance of Breadcrumbsservice
            inject(function (_Breadcrumbsservice_) {
                Breadcrumbsservice = _Breadcrumbsservice_;
            });

        });
    });

    describe('Unit tests', function() {

        it('should create a new Breadcrumbsservice instance', function() {
            expect(Breadcrumbsservice).not.toBeUndefined();
        });

    });

});
