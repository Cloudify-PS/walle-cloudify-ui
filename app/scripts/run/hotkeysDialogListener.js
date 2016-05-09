'use strict';

angular.module('cosmoUiApp')
    .run(function($rootScope, hotkeys){
        $rootScope.$on('ngDialog.opened',function(){
            hotkeys.pause();
        });
        $rootScope.$on('ngDialog.closed',function(){
            hotkeys.unpause();
        });
    });
