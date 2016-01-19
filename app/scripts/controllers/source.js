'use strict';

/**
 * @ngdoc function
 * @name cosmoUiApp.controller:SourceCtrl
 * @description
 * # SourceCtrl
 * Controller of the cosmoUiApp
 */
angular.module('cosmoUiApp')
    .controller('SourceCtrl', function ($scope, $stateParams, $location, CloudifyService, BlueprintSourceService, cloudifyClient ) {



        $scope.errorMessage = 'noPreview';
        $scope.selectedBlueprint = {};
        $scope.browseData = {};

        var autoFileDetector = new RegExp(['.*blueprint.*\\.yaml', 'README(\\.md)?'].join('|'));





        $scope.$watch('blueprintId', function(newValue){
            if ( !!newValue ) {
                cloudifyClient.blueprints.get(newValue, 'id,updated_at,main_file_name').then(function( result ){
                    $scope.setData(result.data);
                });
            }
        });

        if ( $stateParams.blueprintId ){
            $scope.blueprintId = $stateParams.blueprintId;
        }



        if ( $stateParams.deploymentId ){
            cloudifyClient.deployments.get($stateParams.deploymentId, 'blueprint_id').then(function( result ){
                $scope.blueprintId = result.data.blueprint_id;
            });
        }


        // returns true iff we might want this file to open by default
        function isDefaultCandidate( filename ){
            return autoFileDetector.test( filename );
        }


        /**
         * we are going for a very non efficient but simple algorithm.
         * trusting small size (in amount of file ) for blueprint
         *
         * http://stackoverflow.com/a/18008336
         *
         * @param data
         * @param fileName
         * @returns {*}
         */
        function autoSelectFile(data, fileName) {

            var list = [];

            // the reason we split into 2 loops is to have lowest level available first.
            function flatten(item) {
                // add all leafs in this level
                _.each(_.filter(item.children, function (_item) {
                    return !_item.children;
                }), function (_item) {
                    list.push(_item);
                });
                // go over the rest recursively
                _.each(_.filter(item.children, function (_item) {
                    return !!_item.children;
                }), flatten);

            }
            flatten(data);

            list = _.flatten(list);

            // if fileName was provided then choose it, otherwise check default
            var result = fileName ?
                _.find(list, function(item) { return item.name === fileName; }) :
                _.find(list, function(item) { return isDefaultCandidate(item.name); });

            if ( !result ){
                result = _.first(list);
            }

            return result;
        }

        var brushes = {
            'sh' : 'bash',
            'bat' : 'bat',
            'cmd' : 'cmd',
            'ps1' : 'powershell',
            'yaml' : 'yml',
            'yml' : 'yml',
            'py' : 'py',
            'cfg' : 'text',
            '': 'text',
            'md' : 'text',
            'html' : 'text',
            '_' : 'text' // default

        };

        function getExt( file ){
            var filename = file;
            if ( file.hasOwnProperty('name') ){
                filename = file.name;
            }
            var args = filename.split('.');
            var ext = args.length > 1 ? args[args.length-1] : '';
            if ( ext === 'template' && args.length > 2){ // support templates too (since 3.3)
                try{
                    ext = args[args.length-2];
                }catch(e){}
            }
            return ext;
        }

        function getBrushByFile(file) {
            var ext = getExt(file);
            if ( brushes.hasOwnProperty(ext) ){
                return brushes[ext];
            }else{
                return brushes._;
            }
        }

        // put on scope for test purpose. make test friendly.
        $scope.setData = function(blueprint) {
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
                    $scope.browseData = browseData;
                    $scope.openSourceFile(autoSelectFile(browseData[0], blueprint.main_file_name));
                }, function(err) {
                    $scope.errorMessage = 'browseError';
                    try {
                        $scope.errorMessage = err.data.error.errCode;
                    } catch (e) {}
                    $scope.downloadLink = '/backend/cloudify-api/blueprints/' + $scope.selectedBlueprint.id + '/archive';
                });
        };

        $scope.openTreeFolder = function(data) {
            if(!data.hasOwnProperty('show')) {
                data.show = true;
            }else {
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
                        data: fileContent.data,
                        brush: getBrushByFile(data.name),
                        path: data.path
                    };
                    $scope.filename = data.name;
                });
        };

        $scope.isSourceText = function(filename) {
            if (!filename){
                return;
            }
            var textExt = ['yaml', 'js', 'css', 'sh', 'txt', 'bat', 'cmd', 'ps1', 'py', 'md', 'html'].concat(Object.keys(brushes));
            var fileExt = getExt(filename);
            return textExt.indexOf(fileExt) > -1;

        };


        //// for tests - make test friendly
        $scope.autoSelectFile = autoSelectFile;
        $scope.isDefaultCandidate = isDefaultCandidate;
        $scope.getBrushByFile = getBrushByFile;


    });
