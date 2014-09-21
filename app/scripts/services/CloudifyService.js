'use strict';

/**
 * @ngdoc service
 * @name cosmoUiAppApp.CloudifyService
 * @description
 * # CloudifyService
 * Service in the cosmoUiApp.
 */
angular.module('cosmoUiApp')
    .service('CloudifyService', function Cloudifyservice(BlueprintsService) {

        this.blueprints = BlueprintsService;


    });
