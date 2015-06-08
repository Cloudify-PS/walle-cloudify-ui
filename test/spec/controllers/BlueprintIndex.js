'use strict';

describe('Controller: BlueprintsIndexCtrl', function () {

    var BlueprintsIndexCtrl, scope, _cloudifyService, _ngDialog;
    var errorDeleteJSON = {
        'data': {
            'message': 'Can\'t delete blueprint blueprint1 - There exist deployments for this blueprint; Deployments ids: deployment1',
            'error_code': 'dependent_exists_error',
            'server_traceback': 'Traceback'
        },
        'status': 400,
        'config': {
            'method': 'GET',
            'transformRequest': [null],
            'transformResponse': [null],
            'url': '/backend/blueprints/delete',
            'params': {
                'id': 'blueprint1'
            },
            'headers': {
                'Accept': 'application/json, text/plain, */*'
            }
        },
        'statusText': 'Bad Request'
    };
    var successDeleteJSON = {
        'id': 'blueprint1'
    };

    // load the controller's module
    beforeEach(module('cosmoUiApp', 'ngMock', 'templates-main'));

    function _testSetup(deleteSuccess) {
        inject(function ($controller, $rootScope, $httpBackend, $q, CloudifyService, ngDialog) {
            $httpBackend.whenGET('/backend/configuration?access=all').respond(200);
            $httpBackend.whenGET('/backend/versions/ui').respond(200);
            $httpBackend.whenGET('/backend/versions/manager').respond(200);
            $httpBackend.whenGET('/backend/version/latest?version=00').respond('300');

            scope = $rootScope.$new();
            _cloudifyService = CloudifyService;
            _ngDialog = ngDialog;

            _cloudifyService.blueprints.list = function () {
                var deferred = $q.defer();
                var blueprints = [
                    {
                        'updated_at': '2014-08- 21 00:54:04.878540',
                        'created_at': '2014-08-21 00:54:04.878540',
                        'id': 'blueprint1',
                        'deployments': []
                    },
                    {
                        'updated_at': '2014-08-17 01:13:10.905309',
                        'created_at': '2014-08-17 01:13:10.905309',
                        'id': 'blueprint2',
                        'deployments': [
                            {
                                'workflows': [
                                    {
                                        'created_at': null,
                                        'name': 'install',
                                        'parameters': []
                                    },
                                    {
                                        'created_at': null,
                                        'name': 'uninstall',
                                        'parameters': []
                                    }
                                ],
                                'created_at': '2014-08-17 04:07:46.933729',
                                'blueprint_id': 'nodecellar',
                                'id': 'deployment1',
                                'updated_at': '2014-08-17 04:07:46.933729'
                            }
                        ]
                    }
                ];

                deferred.resolve(blueprints);

                return deferred.promise;
            };

            _cloudifyService.blueprints.delete = function () {
                return {
                    then: function(success, error){
                        if (!deleteSuccess) {
                            error( errorDeleteJSON );
                        } else {
                            success( successDeleteJSON );
                        }

                    }
                };
            };

            BlueprintsIndexCtrl = $controller('BlueprintsIndexCtrl', {
                $scope: scope,
                CloudifyService: _cloudifyService,
                ngDialog: _ngDialog
            });

            scope.$digest();
        });
    }

    describe('Test setup', function () {
        it('', function () {
            _testSetup(true);
        });
    });

    describe('Controller tests', function () {
        it('should create a controller', function () {
            expect(BlueprintsIndexCtrl).not.toBeUndefined();
        });

        it('should load blueprints list', function () {
            waitsFor(function () {
                return scope.blueprints !== null;
            });

            runs(function () {
                expect(scope.blueprints.length).toBe(2);
            });
        });

        it('should open delete confirmation dialog when deleteBlueprint function is triggered', function () {
            var blueprintToDelete = scope.blueprints[0];
            spyOn(_ngDialog, 'open').andCallThrough();

            scope.deleteBlueprint(blueprintToDelete);

            expect(scope.itemToDelete.id).toBe(blueprintToDelete.id);
            expect(_ngDialog.open).toHaveBeenCalled();
        });
    });
});
