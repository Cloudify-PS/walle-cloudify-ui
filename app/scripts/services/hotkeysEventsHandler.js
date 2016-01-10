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
        var subscriptions = [];

        this.broadcast = function(event){
            _.forEach(subscriptions, function(subscription){
                var eventTrigger = String.fromCharCode(event.keyCode);
                if(subscription.trigger === eventTrigger){
                    subscription.callback();
                }
            });
        };

        this.on = function(eventTrigger, callback){
            subscriptions.push({trigger: eventTrigger, callback: callback});
            return function unsubscribe(){
                var index = _.findIndex(callback,{trigger: eventTrigger, callback: callback});
                callback.splice(index,1)
            }
        };
  });
