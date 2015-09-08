'use strict';

/**
 * @ngdoc service
 * @name cosmoUiAppApp.BlueprintsService
 * @description
 * # BlueprintsService
 * Service in the cosmoUiApp.
 */
angular.module('cosmoUiApp')
    .service('BlueprintsService', function Blueprintsservice($q, $timeout, $http ) {

        function _add(data, successCallback, errorCallback) {
            $.ajax({ // we have to use $.ajax here.. :( formData issue.
                url: '/backend/blueprints/upload',
                data: data,
                type: 'POST',
                contentType: false,
                processData: false,
                cache: false,
                success: function(data) {
                    $timeout(function(){ // make sure digest loop, timeout will not crash if already in digest
                        successCallback(data);
                    },0);

                },
                error: function(e) { // make sure digest loop, timeout will not crash if already in digest
                    $timeout(function(){
                        errorCallback(e.responseJSON);
                    },0);

                }
            });
        }

        function _browse(params) {
            return $http({ url: '/backend/blueprints/browse', method: 'GET', params: params});
        }

        function _browseFile(params) {
            return $http({ url: '/backend/blueprints/browse/file', method: 'GET', params: params});
        }

        this.browse = _browse;
        this.browseFile = _browseFile;
        this.add = _add; // for file upload

    });
