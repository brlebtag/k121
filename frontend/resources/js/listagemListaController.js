import {
    pararEvento, lockScreen, unlockScreen,
    sucessoAlerta, erroAlerta, url
} from './crudHelper.js';

window.app.controller('listagemListaController',
    ['$scope', '$stateParams', '$http', '$state',
    function($scope, $stateParams, $http, $state) {
        $scope.listas = [];

        if ($stateParams.sucesso) {
            $scope.notificao = {
                tipo: 'success',
                mensagem: $stateParams.sucesso,
            };
        } else {
            $scope.notificao = null;
        }

        lockScreen();

        $http({
            method: 'GET',
            url: url('/lista')
        }).then(function successCallback(response) {
            $scope.listas = response.data;
            unlockScreen();
        }, function errorCallback(response) {
            console.error(response);
            unlockScreen();
        });

        $scope.removerListar = function($event, uuid) {
            pararEvento($event);
            lockScreen();

            $http({
                method: 'DELETE',
                url: url(`/lista/${uuid}`),
            }).then(function successCallback(response) {
                $scope.notificao =
                    sucessoAlerta('Lista removida com sucesso!');
                unlockScreen();
            }, function errorCallback(response) {
                $scope.notificao =
                    erroAlerta('Não foi possivel remover a lista!');
                unlockScreen();
            });
        };

        $scope.removerAlert = function($event) {
            pararEvento($event);
            $scope.notificao = null;
        };

        $scope.gerarAmigosSecretos = function($event, uuid) {
            pararEvento($event);
            lockScreen();
            $http({
                method: 'POST',
                url: url(`/lista/${uuid}/gerar`),
            }).then(function successCallback() {
                unlockScreen();
                $state.go('lista_gerada', {uuid: uuid});
            }, function errorCallback() {
                $scope.notificao = 
                    erroAlerta('Não foi possivel gerar a lista de amigos secretos!');
                unlockScreen();
            });
        };
    }
]);