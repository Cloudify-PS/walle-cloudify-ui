'use strict';

describe('Controller: BlueprintSourceCtrl', function () {
    beforeEach(module('cosmoUiApp', 'backend-mock'));

    var scope;
    var BlueprintSourceCtrl;

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        BlueprintSourceCtrl = $controller('BlueprintSourceCtrl', {
            $scope: scope
        });
    }));

    describe('#openTreeFolder', function () {
        it('should toggle show', function () {
            var data = {};
            scope.openTreeFolder(data);
            expect(data.show).toBe(true);
            scope.openTreeFolder(data);
            expect(data.show).toBe(false);

        });
    });

    describe('#setBrowseType', function () {
        it('should return file or folder', function () {
            expect(scope.setBrowseType({children: []})).toBe('folder');
            expect(scope.setBrowseType({encoding: 'foo'})).toBe('file-foo');
        });
    });

    describe('#isSelected', function () {
        it('should return current if on scope', function () {
            expect(scope.isSelected('foo')).toBe(undefined);
            scope.filename = 'foo';
            expect(scope.isSelected('foo')).toBe('current');
        });
    });

    describe('#openSourceFile', function () {

        var fileContentTypeTest = function (fileName, brush) {
            return inject(function (CloudifyService, $rootScope) {
                spyOn(CloudifyService.blueprints, 'browse').andCallFake(
                    function () {
                        return {
                            then: function (success) {
                                success({children: [{name: fileName}]});
                            }
                        };
                    });
                spyOn(CloudifyService.blueprints, 'browseFile').andCallFake(function () {
                    return {
                        then: function (success) {
                            success('foo');
                        }
                    };
                });
                $rootScope.$broadcast('blueprintData', {});

                expect(CloudifyService.blueprints.browseFile).toHaveBeenCalled();
                expect(scope.dataCode.data).toBe('foo');
                expect(scope.dataCode.brush).toBe(brush);
            });
        };

        it('should fetch file contents', fileContentTypeTest('blueprint.yaml', 'yml'));
        it('should fetch file contents', fileContentTypeTest('blueprint.py', 'py'));
        it('should fetch file contents', fileContentTypeTest('blueprint.foo', 'text'));
        it('should fetch file contents', fileContentTypeTest('blueprint.ps1', 'powershell'));
        it('should fetch file contents', fileContentTypeTest('blueprint.sh', 'bash'));
        it('should fetch file contents', fileContentTypeTest('blueprint.bat', 'bat'));
        it('should fetch file contents', fileContentTypeTest('blueprint.cmd', 'cmd'));
        it('should fetch file contents', fileContentTypeTest('blueprint.md', 'text'));
        it('should fetch file contents', fileContentTypeTest('blueprint.html', 'text'));
    });

    describe('#isSourceText', function () {
        it('should return true if filename has text suffix', function () {
            expect(scope.isSourceText()).toBe(undefined);
            expect(scope.isSourceText('yaml')).toBe(true);
            expect(scope.isSourceText('cmd')).toBe(true);
        });
    });

    describe('#blueprintData event handler', function () {
        it('should keep error message on scope', inject(function (CloudifyService, $rootScope) {
            spyOn(CloudifyService.blueprints, 'browse').andCallFake(function () {
                return {
                    then: function (success) {
                        success({'errCode': 'foo'});
                    }
                };
            });
            $rootScope.$broadcast('blueprintData', {});
            expect(scope.errorMessage).toBe('foo');
        }));
    });

    describe('#isFolderOpen', function () {
        it('should return a class according to open flag', function () {
            expect(scope.isFolderOpen({})).toBe('fa-plus-square-o');
            expect(scope.isFolderOpen({show: true})).toBe('fa-minus-square-o');
        });
    });
});
