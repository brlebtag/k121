import {
    pararEvento, url, sucessoAlerta,
    erroAlerta, lockScreen, unlockScreen
} from './crudHelper.js';

window.app.controller('gerarListaController',
    ['$scope', '$stateParams', '$http',
    function($scope, $stateParams,  $http) {
        $scope.notificao = null;
        $scope.amigos = [];

        $scope.enviar = function($event, uuid) {
            pararEvento($event);

            lockScreen();

            $http({
                method: 'POST',
                url: url(`/lista/${$stateParams.uuid}/notificar/${uuid}`)
            }).then(function successCallback(response) {
                unlockScreen();
                $scope.notificao =
                    sucessoAlerta('Todos fora notificados com sucesso!');
            }, function errorCallback(response) {
                console.error(response);
                unlockScreen();
                $scope.notificao =
                    erroAlerta('Não foi possivel notifica-los, por favor tente novamente mais tarde!');
            });
        }

        $scope.enviarParaTodos = function($event) {
            pararEvento($event);

            lockScreen();

            $http({
                method: 'POST',
                url: url(`/lista/${$stateParams.uuid}/notificar`)
            }).then(function successCallback(response) {
                unlockScreen();
                $scope.notificao =
                    sucessoAlerta('Todos fora notificados com sucesso!');
            }, function errorCallback(response) {
                console.error(response);
                unlockScreen();
                $scope.notificao =
                    erroAlerta('Não foi possivel notifica-los, por favor tente novamente mais tarde!');
            });
        }

        lockScreen();

        $http({
            method: 'GET',
            url: url(`/lista/${$stateParams.uuid}`)
        }).then(function successCallback(response) {
            const data = response.data;
            
            const indexAmigos = data.amigos.reduce((indexer, amigo) => {
                indexer[amigo._id] = amigo;
                return indexer;
            }, {});

            $scope.amigos = data.amigos.map(amigo => ({
                _id: amigo._id,
                nome: amigo.nome,
                amigo: indexAmigos[amigo.amigo_id].nome,
            }));
            unlockScreen();
        }, function errorCallback(response) {
            console.error(response);
            unlockScreen();
        });
    }
]);