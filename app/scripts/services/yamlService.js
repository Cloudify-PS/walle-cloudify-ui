'use strict';

// this service will load yamls and send to parser.
angular.module('cosmoUi')
    .service('YamlService', function YamlService($http, YamlTreeParser, YamlGraphParser ) {

        this.newInstance = function(){
            return new YamlLoader( YamlGraphParser.newInstance() );
        };

        this.load = function( id, callback ){
            new YamlLoader( callback ).load( id);
        };

        function YamlLoader( callback ) {

            var imports = [];
            var loadedImports = [];
            var resultsArr = {};

            var requestCount = 0;
            var responseCount = 0;
            var callbackFunc = callback;

            var parser = YamlGraphParser.newInstance();

            this.load = function ( id ) {
                _loadYamlInternal(id);
            };

            function _loadYamlInternal(id) {
                var url = '/backend/blueprints/get';
                requestCount++;


                $http({
                        url: url,
                        method: 'GET',
                        params: {id: id}
                    })
                    .success(function (data) {
                        var result = JSON.parse(data.plan);
                        if (result.imports !== undefined) {
                            for (var key in result.imports) {
                                if ($.inArray(key, imports === -1)) {
                                    imports.push(result.imports[key]);
                                }
                            }
                            _loadImports(imports);
                        }

                        _parseResult(result);

                        resultsArr[id] = result;

                        if (result.imports !== undefined) {
                            responseCount++;
                        }

                        if (_isLoadingDone()) {
                            callbackFunc(null, parser.getParsedResult());
                        }
                    });
            }

            function _parseResult(result) {
                parser.parseResult( result );
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
                    if ( loadedImports.indexOf(importName) < 0){
                        loadedImports.push(importName);
                        // erez - turns out that if we don't do it very complicated, angular throws a "$digest already in progress" error.
                        _loadYamlTimeout(importName);
                    }
                }
            }

            function _isLoadingDone() {
                return responseCount === loadedImports.length;
            }
        }





    });