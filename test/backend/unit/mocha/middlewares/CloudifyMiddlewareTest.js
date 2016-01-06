'use strict';
var expect = require('expect.js');

describe('CloudifyMiddleware', function () {
    var middlewares;

    beforeEach(function () {
        middlewares = require('../../../../../backend/middlewares');
    });

    it('should put authentication details if exist on session', function () {
        var req = {
            'session': {
                'cloudifyCredentials': {
                    'username': 'foo',
                    'password': 'bar'
                }
            }
        };
        middlewares.cloudifyAuthentication(req, {}, function () {
        });
        expect(req.cloudifyAuthHeader).to.be('Basic Zm9vOmJhcg==');
    });

});
