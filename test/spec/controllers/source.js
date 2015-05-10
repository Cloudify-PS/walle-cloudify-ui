'use strict';

describe('Controller: SourceCtrl', function () {
    // load the controller's module
    beforeEach(module('cosmoUiApp', 'ngMock'));

    var SourceCtrl, scope, cloudifyService, sourceService, blueprintSourceService;

    var _blueprint = {
        created_at: 1429617893844,
        id: 'hw2',
        plan: {},
        updated_at: 1429617893844
    };

    var _browseData = {
        'name': 'root',
        'children': [{
            'name': 'cloudify-hello-world-example',
            'children': [{
                'name': 'images',
                'children': [{
                    'name': 'cloudify-logo.png',
                    'relativePath': '/images/cloudify-logo.png',
                    'path': '/images/cloudify-logo.png',
                    'encoding': 'BINARY'
                }]
            }]
        }]
    };

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $httpBackend, CloudifyService, SourceService, BlueprintSourceService) {
        $httpBackend.whenGET('/backend/configuration?access=all').respond(200);
        $httpBackend.whenGET('/backend/versions/ui').respond(200);
        $httpBackend.whenGET('/backend/versions/manager').respond(200);
        $httpBackend.whenGET('/backend/blueprints/get').respond(200);
        $httpBackend.whenGET('/backend/blueprints/browse?last_update=1429617893844').respond(200);
        $httpBackend.whenGET('/backend/version/latest?version=00').respond('300');

        scope = $rootScope.$new();
        cloudifyService = CloudifyService;
        sourceService = SourceService;
        blueprintSourceService = BlueprintSourceService;

        scope.id = 'blueprint1';
        scope.errorMessage = 'noPreview';

        sourceService.get = function() {
            return {
                then: function(success){
                    success(_blueprint);
                }
            };
        };

        cloudifyService.blueprints.browse = function() {
            return {
                then: function(){
                    scope.browseData = _browseData;
                }
            };
        };

        blueprintSourceService.getBrowseData = function() {
            return {
                then: function(){
                    scope.browseData = _browseData;
                }
            };
        };

        SourceCtrl = $controller('SourceCtrl', {
            $scope: scope,
            CloudifyService: cloudifyService,
            SourceService: sourceService,
            BlueprintSourceService: blueprintSourceService
        });
    }));

    it('should create a controller', function () {
        expect(SourceCtrl).not.toBeUndefined();
    });

    it('should get a specific blueprint by its id', function() {
        waitsFor(function() {
            return scope.selectedBlueprint !== {};
        });
        runs(function() {
            expect(scope.selectedBlueprint).toEqual(_blueprint);
        });
    });

    it('should get browse data of  a specific blueprint by id', function() {
        waitsFor(function() {
            return scope.browseData !== {};
        });
        runs(function() {
            expect(scope.browseData).toEqual(_browseData);
        });
    });

    it('should return fa-minus-square-o string', function() {
        var result = scope.isFolderOpen({show: true});

        expect(result).toBe('fa-minus-square-o');
    });

    it('should return fa-plus-square-o string', function() {
        var result = scope.isFolderOpen({});

        expect(result).toBe('fa-plus-square-o');
    });

    it('should return folder string', function() {
        var result = scope.setBrowseType({children: []});

        expect(result).toBe('folder');
    });

    it('should return true value when filename matches current filename value on scope', function() {
        scope.filename = 'myFile';
        var result = scope.isSelected('myFile');

        expect(result).toBeTruthy();
    });

    it('should return file-jpeg string', function() {
        var result = scope.setBrowseType({encoding: 'jpeg'});

        expect(result).toBe('file-jpeg');
    });

    it('should return true if file is a text file', function() {
        var result = scope.isSourceText('myFile.yaml');

        expect(result).toBeTruthy();
    });

    it('should return false if file is not a text file', function() {
        var result = scope.isSourceText('myFile.jpg');

        expect(result).toBeFalsy();
    });

});