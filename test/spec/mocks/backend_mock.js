'use strict';
/**
 * Used for common backend calls we need to mock
 */
angular.module('backend-mock',[]).config(function( $translateProvider){
    $translateProvider.translations('en', { 'hosts' : {}, 'deployment' : { 'process' : { 'foo' : 'Foo Process'} } });
    $translateProvider.useMissingTranslationHandler('missingTranslationFactory');
}).run(function( $httpBackend ){
    $httpBackend.whenGET('/backend/configuration?access=all').respond(200);
});


// for tests, return the key
angular.module('backend-mock').factory('missingTranslationFactory', function (){
        return function(key){
            return key;
        };
    }
);


