'use strict';

angular.module('gsMocks', [])
    .value('ejsResource', function(){
        var response = {"hits": {
            "hits": [
                {
                    "sort": [1413244177520],
                    "_type": "cloudify_event",
                    "_source": {
                        "event_type": "task_failed",
                        "timestamp": "2014-10-13 23:49:37.520",
                        "@timestamp": "2014-10-13T23:49:37.520+00:00",
                        "message_code": null,
                        "@version": "1",
                        "context": {
                            "task_id": "bd9d3258-55da-4a34-ac79-23481b0e1aa2",
                            "blueprint_id": "nodecellar",
                            "plugin": null,
                            "task_target": "nodecellarDep",
                            "node_name": null,
                            "workflow_id": "create_deployment_environment",
                            "node_id": null,
                            "task_name": "plugin_installer.tasks.install",
                            "operation": null,
                            "deployment_id": "nodecellarDep",
                            "execution_id": "29e18328-e356-4e4e-8bd0-4bd35f0ac34e"
                        },
                        "message": {
                            "text": "Task failed 'plugin_installer.tasks.install' -> CommandExecutionException('Failed executing command: /home/ubuntu/cloudify.nodecellarDep/env/bin/pip install https://github.com/cloudify-cosmo/cloudify-openstack-plugin/archive/1.1m5.zip\\ncode: 1\\nerror: \\nmessage: Downloading/unpacking https://github.com/cloudify-cosmo/cloudify-openstack-plugin/archive/1.1m5.zip\\n  Running setup.py (path:/tmp/pip-PCYc6a-build/setup.py) egg_info for package from https://github.com/cloudify-cosmo/cloudify-openstack-plugin/archive/1.1m5.zip\\n    \\nDownloading/unpacking cloudify-plugins-common==3.1a5 (from cloudify-openstack-plugin==1.1a5)\\n  Could not find a version that satisfies the requirement cloudify-plugins-common==3.1a5 (from cloudify-openstack-plugin==1.1a5) (from versions: 3.0)\\nCleaning up...\\nNo distributions matching the version for cloudify-plugins-common==3.1a5 (from cloudify-openstack-plugin==1.1a5)\\nStoring debug log for failure in /home/ubuntu/.pip/pip.log\\n',) [attempt 17164]",
                            "arguments": null
                        },
                        "type": "cloudify_event"
                    },
                    "_score": null,
                    "_index": "cloudify_events",
                    "_id": "n7SLu8gOTVOLwI8ZO0SH8A"
                }
            ],
            "total": 34335,
            "max_score": null
        }, "_shards": {
            "successful": 5,
            "failed": 0,
            "total": 5
        }, "took": 7, "timed_out": false};

        var q;
        inject(function ($q) {
            q = $q;
        });

        return {
            QueryStringQuery: function() {
                return {
                    query: function() {}
                }
            },
            Request: function() {
                return {
                    from: function() {
                        return {
                            size: function() {
                                return {
                                    query: function() {
                                        return {
                                            sort: function() {
                                                return {
                                                    doSearch: function() {
                                                        var deferred = q.defer();
                                                        deferred.resolve(response);
                                                        return deferred.promise;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            Sort: function() {
                return {
                    order: function() {}
                }
            },
            TermFilter: function() {},
            AndFilter: function() {}
        }
    });

