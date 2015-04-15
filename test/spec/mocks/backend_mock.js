'use strict';
/**
 * Used for common backend calls we need to mock
 */
angular.module('backend-mock',[]).run(function( $httpBackend ){

    $httpBackend.whenGET('/backend/configuration?access=all').respond(200);

});
