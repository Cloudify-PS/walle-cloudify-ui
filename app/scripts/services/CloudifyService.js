'use strict';

/**
 * @ngdoc service
 * @name cosmoUiAppApp.CloudifyService
 * @description
 * # CloudifyService
 * Service in the cosmoUiApp.
 */
angular.module('cosmoUiApp')
    .service('CloudifyService', function Cloudifyservice($rootScope, $q, $log, $timeout, BlueprintsService) {

        var autoPull = [],
            autoPullPromise = {};

        function _autoPull(name, params, fn) {
            var deferred = $q.defer();
            if(autoPull.indexOf(name) === -1) {
                autoPull.push(name);
                (function _internalLoad(){
                    fn(params).then(function(data){
                        deferred.notify(data);
                        autoPullPromise[name] = $timeout(_internalLoad, 10000);
                    });
                })();
            }
            return deferred.promise;
        }

        function _autoPullStop(name) {
            if(autoPull.indexOf(name) !== -1) {
                autoPull.splice(autoPull.indexOf(name), 1);
                $timeout.cancel(autoPullPromise[name]);
            }
        }

        $rootScope.$on('$locationChangeStart', function() {
            for(var name in autoPullPromise) {
                _autoPullStop(name);
            }
            $log.info('Stop all pulling workers');
        });

        this.autoPull = _autoPull;
        this.autoPullStop = _autoPullStop;
        this.blueprints = BlueprintsService;

    });
