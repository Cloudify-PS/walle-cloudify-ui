'use strict';

angular.module('cosmoUi')
    .service('RestService', function RestService($http) {

        function _load(rest, callback){
            new RestLoader(callback).load(rest);
        }

        function RestLoader(callback) {
            var callbackFunc = callback;

            this.load = function (rest) {
                _loadRestInternal(rest);
            };

            function _loadRestInternal(rest) {
                if (callbackFunc !== undefined) {
                    callbackFunc();
                }
                return $http({
                    url: '/backend/' + rest,
                    method: 'GET'
                });
            }
        }

        function _loadBlueprints() {
            _load('blueprints');
        }

        function _addBlueprint() {
            _load('blueprints/add');
        }

        this.loadBlueprints = _loadBlueprints;
        this.addBlueprint = _addBlueprint;
    });
