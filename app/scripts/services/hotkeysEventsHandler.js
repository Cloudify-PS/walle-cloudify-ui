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
                var eventTrigger = String.fromCharCode(event.keyCode);
                if(trigger === eventTrigger){
                    callback();
                }
            });
        };

        this.on = function(eventTrigger, callback){
            var event = {};
            event[eventTrigger] = callback;
            callbacks.push(event);
            return function unsubscribe(){
                var index = _.findIndex(callback,{eventTrigger: callback});
                callback.splice(index,1)
            }
        };
  });
