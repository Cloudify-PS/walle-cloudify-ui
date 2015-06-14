angular.module('cosmoUiApp')
    .constant('DELETE_TYPES', {
        'BLUEPRINT': 'blueprint',
        'DEPLOYMENT': 'deployment'
    })
    .constant('INPUT_STATE', {
        'PARAMS': 'params',
        'RAW': 'raw'
    });