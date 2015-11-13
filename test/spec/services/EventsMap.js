'use strict';

describe('Service: EventsMap', function () {
    var eventsMock =  {
            'event_type': 'task_failed',
            'timestamp': '2015-04-15 07:02:03',
            '@timestamp': '2015-04-15T07:02:34.415+00:00',
            'message_code': null,
            'context': {
                'task_id': 'a6832f7b-a7f2-4a3c-8be8-d96761d3d6bc',
                'blueprint_id': 'nodecellar',
                'plugin': 'agent_installer',
                'task_target': 'nodecellar-2',
                'node_name': 'nodejs_host',
                'workflow_id': 'install',
                'node_id': 'nodejs_host_63586',
                'task_name': 'worker_installer.tasks.install',
                'operation': 'cloudify.interfaces.worker_installer.install',
                'deployment_id': 'nodecellar-2',
                'execution_id': '19227fed-2658-458b-bb78-2bf51d05fd58',
                'task_current_retries': 20,
                'task_total_retries': -1
            },
            'message': {
                'text': 'Task failed "worker_installer.tasks.install" -> RecoverableError("NetworkError: Low level socket error connecting to host 10.67.79.24 on port 22: No route to host (tried 1 time)",) [attempt 3]',
                'arguments': null
            },
            'type': 'cloudify_event'
        };

    var EventsMap;

    describe('Test setup', function () {
        it('Injecting required data & initializing a new instance', function () {

            // load the service's module, mocking ejsResource dependency
            module('cosmoUiApp', 'ngMock', 'backend-mock');

            // initialize a new instance of the service
            inject(function (_EventsMap_) {
                EventsMap = _EventsMap_;
            });
        });
    });

    describe('sanity', function () {
        it('should verify eventsMap is defined', function () {
            expect(EventsMap).not.toBe(undefined);
        });
    });

    describe('test getEventIcon', function () {
        it('should test a recoverable task failed', function () {
            eventsMock.message.text = 'Task failed "worker_installer.tasks.install" -> RecoverableError("NetworkError: Low level socket error connecting to host 10.67.79.24 on port 22: No route to host (tried 1 time)",) [attempt 3]';
            eventsMock.context.task_total_retries = -1;
            eventsMock.context.task_current_retries = 20;
            expect(EventsMap.getEventIcon(eventsMock)).toBe('icon-gs-task-retried');

            eventsMock.context.task_total_retries = 3;
            eventsMock.context.task_current_retries = 2;
            expect(EventsMap.getEventIcon(eventsMock)).toBe('icon-gs-task-retried');

            eventsMock.context.task_total_retries = 3;
            eventsMock.context.task_current_retries = 3;
            expect(EventsMap.getEventIcon(eventsMock)).toBe('icon-gs-task-failed');

        });

        it('should test a non recoverable task', function () {
            eventsMock.message.text = 'Task failed "worker_installer.tasks.install" -> NonRecoverableError("NetworkError: Low level socket error connecting to host 10.67.79.24 on port 22: No route to host (tried 1 time)",) [attempt 3]';
            expect(EventsMap.getEventIcon(eventsMock)).toBe('icon-gs-task-failed');
        });

        it('should test fallbacks if properties are missing', function () {
            eventsMock.message.text = 'Task failed "worker_installer.tasks.install" -> NonRecoverableError("NetworkError: Low level socket error connecting to host 10.67.79.24 on port 22: No route to host (tried 1 time)",) [attempt 3]';
            eventsMock.context.task_current_retries = undefined;
            eventsMock.context.task_total_retries = undefined;
            expect(EventsMap.getEventIcon(eventsMock)).toBe('icon-gs-task-failed');

            eventsMock.message.text = 'Task failed "worker_installer.tasks.install" -> RecoverableError("NetworkError: Low level socket error connecting to host 10.67.79.24 on port 22: No route to host (tried 1 time)",) [attempt 3]';
            expect(EventsMap.getEventIcon(eventsMock)).toBe('icon-gs-task-failed');

        });

    });

});
