'use strict';
angular.module('cosmoUiApp')
    .run(function(hotkeys, $state, hotkeysEventsHandler){
        //function broadcastEvent(e) {
        //    hotkeysEventsHandler.broadcast(e);
        //}
        //
        //hotkeys.add({
        //    combo: '.',
        //    description: 'Open actions manager',
        //    callback: broadcastEvent
        //});

        //navigation
        hotkeys.add({
            combo: 'mod+b',
            description: 'Navigating to Blueprint',
            callback: function() {
                $state.go('cloudifyLayout.blueprints')
            }
        });
        hotkeys.add({
            combo: 'mod+d',
            description: 'Navigating to Deployments',
            callback: function(e) {
                e.preventDefault();
                $state.go('cloudifyLayout.deployments')
            }
        });
        hotkeys.add({
            combo: 'mod+l',
            description: 'Navigating to Logs & events',
            callback: function(e) {
                e.preventDefault();
                $state.go('cloudifyLayout.logs')
            }
        });
        hotkeys.add({
            combo: 'mod+i',
            description: 'Navigating to Nodes-Instances',
            callback: function() {
                $state.go('cloudifyLayout.nodes')
            }
        });
});
