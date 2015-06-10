'use strict';
/**
 * Used for common backend calls we need to mock
 */
angular.module('backend-mock',[]).config(function( $translateProvider){
    $translateProvider.translations('en', {});
}).run(function( $httpBackend ){
    $httpBackend.whenGET('/backend/configuration?access=all').respond(200);
});
