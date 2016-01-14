'use strict';

/**
 * @ngdoc function
 * @name cosmoUiApp.controller:CloudifyLayoutCtrl
 * @description
 * # CloudifyLayoutCtrl
 * Controller of the cosmoUiApp
 */
angular.module('cosmoUiApp')
  .controller('CloudifyLayoutCtrl', function ($scope, $stateParams, VersionService, $window, HotkeysManager) {
        $scope.embeded = $window !== $window.top;
        if ( $stateParams.hasOwnProperty('embed')  ) { // override
            $scope.embeded = $stateParams.embed === 'true';
        }

        VersionService.getVersions().then(function(versions) {
            $scope.versions = versions;
        });


        $(document).on('scroll', function(){
            var newValue =  $('body').scrollTop();
            $('#left-side-menu').css('bottom', $('#footer').innerHeight() - newValue );
            var $left = $('#left-side-menu');
            if ( newValue > 80 ){
                $left.addClass('fix-to-top');
            }else {
                $left.removeClass('fix-to-top');
            }
        });

        HotkeysManager.bindNavigations($scope);
    });
