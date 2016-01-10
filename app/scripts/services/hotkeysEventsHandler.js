'use strict';

/**
 * @ngdoc service
 * @name cosmoUiApp.hotkeysEventsHandler
 * @description
 * # hotkeysEventsHandler
 * Service in the cosmoUiApp.
 */
angular.module('cosmoUiApp')
  .service('hotkeysEventsHandler', function () {
        var callbacks = [];

        this.subscribeEvent = function(event){
            _.each(callbacks, function(trigger, callback){
                if(trigger === event.combo){
                    callback();
                }
            });
        };

        this.on = function(eventTrigger, callback){
            callbacks.push({eventTrigger: callback});
            return function unsubscribe(){
                var index = _.findIndex(callback,{eventTrigger: callback});
                callback.splice(index,1)
            }
        };
  });
