import { pararEvento, criarRemoverEventos } from './crudHelper.js';

window.app.controller('criarListaController',
    ['$scope', '$http',
    function($scope, $http) {
        $scope.titulo = 'Criar lista';

        criarRemoverEventos($scope);

        $scope.amigos = [
            {
                nome: 'Bruno',
                email: 'brlebtag@gmail.com'
            }
        ];

        $scope.salvar = function($event) {
            pararEvento($event);
        };
    }
]);