angular.module('cosmoUiApp')
    .constant('DELETE_TYPES', {
        'BLUEPRINT': 'blueprint',
        'DEPLOYMENT': 'deployment'
    })
    .constant('DIALOG_EVENTS', {
        'BLUEPRINT_DELETED' : 'blueprint_deleted',
        'DEPLOYMENT_CREATED' : 'deployment_created',
        'DEPLOYMENT_DELETED' : 'deployment_deleted',
        'EXECUTION_STARTED' : 'execution_started',
        'EXECUTION_CANCELED' : 'execution_canceled'
    })
    .constant('INPUT_STATE', {
        'PARAMS': 'params',
        'RAW': 'raw'
    });
