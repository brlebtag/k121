import { pararEvento, criarRemoverEventos } from './crudHelper.js';

window.app.controller('editarListaController',
    ['$scope', '$stateParams', '$http',
    function($scope, $stateParams, $http) {
        $scope.titulo = 'Editar lista';

        criarRemoverEventos($scope);

        $scope.salvar = function($event) {
            pararEvento($event);
        };
    }
]);