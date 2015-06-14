'use strict';

/**
 * @ngdoc function
 * @name cosmoUiApp.controller:SourceCtrl
 * @description
 * # SourceCtrl
 * Controller of the cosmoUiApp
 */
angular.module('cosmoUiApp')
    .controller('SourceCtrl', function ($scope, $routeParams, $location, CloudifyService, SourceService, VIEW_CONTEXT) {

        $scope.id = $routeParams.id;
        $scope.errorMessage = 'noPreview';
        $scope.selectedBlueprint = {};
        $scope.browseData = {};

        var context = $location.url().indexOf(VIEW_CONTEXT.DEPLOYMENT) > -1 ? VIEW_CONTEXT.DEPLOYMENT : VIEW_CONTEXT.BLUEPRINT;
        var autoFilesList = ['blueprint.yaml', 'README.md'];
        var selectedAutoFile = null;
        var firstDefaultFile = null;
        var autoKeepLooking = true;

        SourceService.get($scope.id, context)
            .then(function(blueprint) {
                setData(blueprint);
            });

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
            SourceService.getBrowseData(blueprint.id, blueprint.updated_at)
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

angular.module('cosmoUiApp')
    .constant('VIEW_CONTEXT', {
        DEPLOYMENT: 'deployment',
        BLUEPRINT: 'blueprint'
    });