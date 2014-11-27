'use strict';

describe('Backend: walkFolder', function () {
    var browseBlueprint = require('../../../../backend/services/BrowseBluerprintService');
    var walker = new browseBlueprint.Walker();

    it('has a browseBlueprint', function () {
        expect(browseBlueprint).not.toBeUndefined();
    });

    it('should have a Walker object', function() {
        expect(walker).not.toBeUndefined();
    });

    it('should return folder content without hidden files & symbolic links', function(done) {
        var folderFiles = {};
        walker.walk('./test/backend/resources/content', function(err, data) {
            folderFiles = data;
        });

        waitsFor(function() {
            return folderFiles.children !== undefined;
        }, "waiting for folder content", 5000);

        runs(function () {
            expect(folderFiles.children.length).toBe(1);
            done();
        });
    });
});