'use strict';

/**
 * @ngdoc function
 * @name cosmoUiApp.controller:SourceCtrl
 * @description
 * # SourceCtrl
 * Controller of the cosmoUiApp
 */
angular.module('cosmoUiApp')
    .controller('SourceCtrl', function ($scope, $routeParams, $location, CloudifyService, BlueprintSourceService, cloudifyClient ) {


        $scope.errorMessage = 'noPreview';
        $scope.selectedBlueprint = {};
        $scope.browseData = {};

        var autoFilesList = ['blueprint.yaml', 'README.md'];
        var selectedAutoFile = null;
        var firstDefaultFile = null;
        var autoKeepLooking = true;


        $scope.$watch('blueprintId', function(newValue){
            if ( !!newValue ) {
                cloudifyClient.blueprints.get(newValue, 'id,updated_at').then(function( result ){
                    setData(result.data);
                });
            }
        });

        if ( $routeParams.blueprintId ){
            $scope.blueprintId = $routeParams.blueprintId;
        }



        if ( $routeParams.deploymentId ){
            cloudifyClient.deployments.get($routeParams.deploymentId, 'blueprint_id').then(function( result ){
                $scope.blueprintId = result.data.blueprint_id;
            });
        }


        function locateFilesInBrowseTree(data) {
            for(var i in data) {
                if(!autoKeepLooking) {
                    break;
                }
                var pos = autoFilesList.indexOf(data[i].name);
                if(pos > -1) {
                    selectedAutoFile = data[i];
                }
                if(pos !== 0) {
                    locateFilesInBrowseTree(data[i].children);
                }
                else {
                    autoKeepLooking = false;
                }
                if(!data[i].hasOwnProperty('children') && firstDefaultFile === null) {
                    firstDefaultFile = data[i];
                }
            }
        }

        function autoOpenSourceFile() {
            if(selectedAutoFile !== null) {
                $scope.openSourceFile(selectedAutoFile);
            }
            else if(firstDefaultFile !== null) {
                $scope.openSourceFile(firstDefaultFile);
            }
        }

        function getBrashByFile(file) {
            var ext = file.split('.');
            switch(ext[ext.length-1]) {
            case 'sh':
                return 'bash';
            case 'bat':
                return 'bat';
            case 'cmd':
                return 'cmd';
            case 'ps1':
                return 'powershell';
            case 'yaml':
                return 'yml';
            case 'py':
                return 'py';
            case 'md':
                return 'text';
            case 'html':
                return 'text';
            default:
                return 'text';
            }
        }

        function setData(blueprint) {
            if (blueprint.hasOwnProperty('error_code')) {
                $location.path('/blueprints');
            }

            $scope.selectedBlueprint = blueprint;

            // Add breadcrumbs for the current deployment
            $scope.breadcrumb = [
                {
                    href: false,
                    label: blueprint.id,
                    id: 'blueprint'
                }
            ];

            // Emit deployment data
            BlueprintSourceService.getBrowseData(blueprint.id, blueprint.updated_at)
                .then(function(browseData) {
                    if (browseData.errCode) {
                        $scope.errorMessage = browseData.errCode;
                    }
                    $scope.browseData = browseData;

                    locateFilesInBrowseTree(browseData[0].children);
                    autoOpenSourceFile();
                });
        }

        $scope.openTreeFolder = function(data) {
            if(!data.hasOwnProperty('show')) {
                data.show = true;
            }
            else {
                data.show = !data.show;
            }
        };

        $scope.isFolderOpen = function(data) {
            if(data.hasOwnProperty('show') && data.show === true) {
                return 'fa-minus-square-o';
            }
            return 'fa-plus-square-o';
        };

        $scope.setBrowseType = function(data) {
            if(data.hasOwnProperty('children')) {
                return 'folder';
            }
            return 'file-' + data.encoding;
        };

        $scope.isSelected = function(fileName) {
            if($scope.filename === fileName) {
                return 'current';
            }
        };

        $scope.openSourceFile = function(data) {
            CloudifyService.blueprints.browseFile({id: $scope.selectedBlueprint.id, path: new Date($scope.selectedBlueprint.updated_at).getTime() + '/' + data.relativePath})
                .then(function(fileContent) {
                    $scope.dataCode = {
                        data: fileContent,
                        brush: getBrashByFile(data.name),
                        path: data.path
                    };
                    $scope.filename = data.name;
                });
        };

        $scope.isSourceText = function(fileName) {
            if (fileName === undefined) {
                return;
            }
            var textExt = ['yaml', 'js', 'css', 'sh', 'txt', 'bat', 'cmd', 'ps1', 'py', 'md', 'html'];
            var fileExt = fileName.substr(fileName.lastIndexOf('.') + 1);
            return textExt.indexOf(fileExt) > -1;

        };

    });
