import { pararEvento } from './crudHelper.js';

window.app.controller('gerarListaController',
    ['$scope', '$stateParams', '$http',
    function($scope, $stateParams,  $http) {
        $scope.enviar = function($event, uuid) {
            pararEvento($event);
        }

        $scope.enviarParaTodos = function($event) {
            pararEvento($event);
        }

        $scope.amigos = [
            {
                uuid: 'a3d78d77-8633-4151-8b39-cf45ce0b0a6f',
                nome: 'João',
                amigo: 'Maria'
            }
        ]
    }
]);