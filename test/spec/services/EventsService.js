'use strict';

describe('Service: EventsService', function () {

    var eventsService, events, _callback,
        isExecuted = false;

    describe('Test setup', function() {
        it('Injecting required data & initializing a new instance', function() {

            // load the service's module, mocking ejsResource dependency
            module('cosmoUiApp', 'ngMock', 'gsUiHelper', 'elasticjs.service');

            // initialize a new instance of the filter
            inject(function (EventsService, $helper) {
                $helper.addInjects([
                    {
                        method: 'POST',
                        url: '/backend/events/_search',
                        respond: {
                            "hits": {
                                "hits": [
                                    {
                                        "sort": [
                                            1413244177520
                                        ],
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
                                "total": 1,
                                "max_score": null
                            },
                            "_shards": {
                                "successful": 1,
                                "failed": 0,
                                "total": 1
                            },
                            "took": 1,
                            "timed_out": false
                        }
                    }
                ]);
                eventsService = EventsService;

                events = eventsService.newInstance('/backend/events');
                _callback = function(data) {
                    console.log('_callback called', data);
                    isExecuted = true;
                };
            });
        });
    });

    describe('Unit tests', function() {

        it('should create a new EventsService instance', function() {
            expect(!!eventsService).toBe(true);
        });

        it('should use defined autopull time provided by controller',inject( function( $timeout ) {
            isExecuted = false;
            spyOn(events, 'autoPull').andCallThrough();

            events.execute(_callback, true, 1000);

            $timeout.flush();
            waitsFor(function() {
                return isExecuted;
            });

            runs(function() {
                expect(events.autoPull).toHaveBeenCalledWith(_callback, 1000);
            });
        }));

//        var executeResult;
//        beforeEach(function(){
//            events.filter('blueprint_id', 'monitoringbp');
//            events.filter('deployment_id', 'monitoringdep');
//            events.filter('deployment_id', 'monitoringbptest');
//            events.filterRange('@timestamp', {
//                from: "2014-11-04T11:13:16.838Z",
//                to: "2014-11-09T11:18:16.838Z"
//            });
//            events.execute(function(data, result){
//                console.log('execute', result);
//                executeResult = result;
//            }, false);
//        });
//
//        if('should create query with multiple deployments filter', function(){
//
//
//
//        });

    });
});
