'use strict';
angular.module('cosmoUiApp')
    .run(function(hotkeys, $state, hotkeysEventsHandler){

        hotkeys.add({
            combo: '.',
            description: 'test 1',
            callback: function(e) {
                console.log('dot has clicked');
                console.log(e);
                console.log(hotkeys.get('mod+b'));

                hotkeysEventsHandler.subscribeEvent(e);
            }
        });

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

        hotkeysEventsHandler.on('.',function(){
            console.log(1);
        })
});
