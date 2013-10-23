'use strict';

// this service will load yamls and send to parser.
angular.module('cosmoUi')
    .service('YamlService', function YamlService($http, YamlTreeParser, YamlGraphParser ) {

        this.newInstance = function(){
            return new YamlLoader( YamlGraphParser.newInstance() );
        };


        this.load = function( folderName, appName, callback ){
            new YamlLoader( folderName, callback ).load( appName);
        };


        function YamlLoader( folderName, callback ) {
            var that = this;

            var imports = [];
            var resultsArr = {};

            var requestCount = 0;
            var responseCount = 0;
            var callbackFunc = callback;

            var parser = YamlGraphParser.newInstance();

            this.load = function (  appName ) {
                _loadYamlInternal(appName, false);
            };

            function _loadYamlInternal(yamlName, isImport) {

                var url;
                requestCount++;
                url = '/plans/path?file=' + yamlName + "&import=" + isImport + "&folder=" + folderName;


                $http.get(url)
                    .success(function (data) {
                        _parseResult(data);
                        resultsArr[yamlName] = data;
                        responseCount++;


                        if (resultsArr[yamlName].imports !== undefined && resultsArr[yamlName].imports.length > 0) {
                            _loadImports(resultsArr[yamlName].imports);
                        }
                        if (_isLoadingDone()) {
                            callbackFunc(null, parser.getParsedResult());
                        }
                    });
            };


            function _parseResult(result) {
                parser.parseResult( result );
                if (result.imports !== undefined) {
                    for (var key in result.imports) {
                        if ($.inArray(key, imports === -1)) {
                            imports.push(result.imports[key]);
                        }
                    }
                }
            }

            function _loadYaml(_import) {
                _loadYamlInternal(_import, true);
            }

            function _loadYamlTimeout(_import) {
                setTimeout(function () {
                    _loadYaml(_import);
                }, 1);
            }

            function _loadImports(imports) {
                for (var i = 0; i < imports.length; i++) {
                    var importName = imports[i];
                    // erez - turns out that if we don't do it very complicated, angular throws a "$digest already in progress" error.
                    _loadYamlTimeout(importName);
                }
            }

            function _isLoadingDone() {
                return responseCount === requestCount;
            }
        }





    });