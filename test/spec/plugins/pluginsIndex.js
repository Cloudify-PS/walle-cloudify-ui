'use strict';

describe('Controller: PluginsCtrl', function() {

    var PluginsCtrl, scope;
    var plugins = [{
        'distribution_release': 'precise',
        'archive_name': 'cloudify_diamond_plugin-1.3-py27-none-linux_x86_64-Ubuntu-precise.wgn',
        'package_name': 'cloudify-diamond-plugin',
        'distribution_version': '12.04',
        'package_version': '1.3',
        'supported_platform': 'linux_x86_64',
        'package_source': 'https://opencm:QBgsgs987@github.com/cloudify-cosmo/cloudify-diamond-plugin/archive/1.3.tar.gz',
        'distribution': 'ubuntu',
        'supported_py_versions': ['py27'],
        'uploaded_at': '2015-12-03 16:00:39.369841',
        'id': 'be573b3a-c700-48bf-bfac-63b984593fe8',
        'wheels': ['cloudify_diamond_plugin-1.3-py2-none-any.whl', 'pika-0.9.14-py2-none-any.whl', 'traceback2-1.4.0-py2.py3-none-any.whl', 'testtools-1.8.1-py2.py3-none-any.whl', 'mock-1.3.0-py2.py3-none-any.whl', 'bottle-0.12.7-py2-none-any.whl', 'unittest2-1.1.0-py2.py3-none-any.whl', 'psutil-2.1.1-cp27-none-linux_x86_64.whl', 'PyYAML-3.10-cp27-none-linux_x86_64.whl', 'cloudify_dsl_parser-3.3-py2-none-any.whl', 'proxy_tools-0.1.0-py2-none-any.whl', 'six-1.10.0-py2.py3-none-any.whl', 'extras-0.0.3-py2-none-any.whl', 'linecache2-1.0.0-py2.py3-none-any.whl', 'cloudify_plugins_common-3.3-py2-none-any.whl', 'Jinja2-2.7.2-py2-none-any.whl', 'configobj-5.0.6-py2-none-any.whl', 'diamond-3.5.0-py2-none-any.whl', 'pbr-1.8.1-py2.py3-none-any.whl', 'funcsigs-0.4-py2.py3-none-any.whl', 'MarkupSafe-0.23-cp27-none-linux_x86_64.whl', 'python_mimeparse-0.1.4-py2-none-any.whl', 'requests-2.7.0-py2.py3-none-any.whl', 'networkx-1.8.1-py2-none-any.whl', 'cloudify_rest_client-3.3-py2-none-any.whl', 'argparse-1.4.0-py2.py3-none-any.whl'],
        'excluded_wheels': []
    }, {
        'distribution_release': 'trusty',
        'archive_name': 'cloudify_diamond_plugin-1.3-py27-none-linux_x86_64-Ubuntu-trusty.wgn',
        'package_name': 'cloudify-diamond-plugin',
        'distribution_version': '14.04',
        'package_version': '1.3',
        'supported_platform': 'linux_x86_64',
        'package_source': 'https://opencm:QBgsgs987@github.com/cloudify-cosmo/cloudify-diamond-plugin/archive/1.3.tar.gz',
        'distribution': 'ubuntu',
        'supported_py_versions': ['py27'],
        'uploaded_at': '2016-02-26 18:47:57.136009',
        'id': '87d27d4e-adf3-4f24-b350-dd6cc3b81a91',
        'wheels': ['pbr-1.8.1-py2.py3-none-any.whl', 'diamond-3.5.0-py2-none-any.whl', 'unittest2-1.1.0-py2.py3-none-any.whl', 'argparse-1.4.0-py2.py3-none-any.whl', 'extras-0.0.3-py2-none-any.whl', 'psutil-2.1.1-cp27-none-linux_x86_64.whl', 'networkx-1.8.1-py2-none-any.whl', 'Jinja2-2.7.2-py2-none-any.whl', 'configobj-5.0.6-py2-none-any.whl', 'traceback2-1.4.0-py2.py3-none-any.whl', 'MarkupSafe-0.23-cp27-none-linux_x86_64.whl', 'testtools-1.8.1-py2.py3-none-any.whl', 'PyYAML-3.10-cp27-none-linux_x86_64.whl', 'cloudify_dsl_parser-3.3-py2-none-any.whl', 'requests-2.7.0-py2.py3-none-any.whl', 'mock-1.3.0-py2.py3-none-any.whl', 'cloudify_rest_client-3.3-py2-none-any.whl', 'cloudify_plugins_common-3.3-py2-none-any.whl', 'cloudify_diamond_plugin-1.3-py2-none-any.whl', 'pika-0.9.14-py2-none-any.whl', 'python_mimeparse-0.1.4-py2-none-any.whl', 'funcsigs-0.4-py2.py3-none-any.whl', 'linecache2-1.0.0-py2.py3-none-any.whl', 'bottle-0.12.7-py2-none-any.whl', 'proxy_tools-0.1.0-py2-none-any.whl', 'six-1.10.0-py2.py3-none-any.whl'],
        'excluded_wheels': []
    }];

    // load the controller's module
    beforeEach(module('cosmoUiApp', 'ngMock', 'backend-mock', 'templates-main'));

    function _testSetup(done) {
        inject(function($controller, $rootScope, $q, cloudifyClient) {
            scope = $rootScope.$new();

            spyOn(cloudifyClient.plugins, 'list').and.returnValue({
                then: function(success) {
                    success({data: {items: plugins}});
                    return $q.defer().promise;
                }
            });

            PluginsCtrl = $controller('PluginsCtrl', {$scope: scope});
            scope.$digest();
            done();
        });
    }

    beforeEach(_testSetup);

    describe('Controller tests', function() {
        it('should create a controller', function() {
            expect(PluginsCtrl).not.toBeUndefined();
        });

        it('should load plugins list', function() {
            expect(scope.plugins.length).toBe(2);
        });
    });

    describe('#uploadBtn', function() {
        it('should create a controller', function() {
            expect(PluginsCtrl).not.toBeUndefined();
        });
    });
});
