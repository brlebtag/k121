import { 
    pararEvento, criarRemoverEventos,
    lockScreen, unlockScreen, url, erroAlerta
} from './crudHelper.js';

window.app.controller('editarListaController',
    ['$scope', '$stateParams', '$state', '$http',
    function($scope, $stateParams, $state, $http) {
        $scope.modo  = 'Editar lista';
        $scope.titulo = '';
        $scope.amigos = [];
        $scope.notificao = null;
    
        criarRemoverEventos($scope);

        lockScreen();

        $http({
            method: 'GET',
            url: url(`/lista/${$stateParams.uuid}`)
        }).then(function successCallback(response) {
            const data = response.data;
            $scope.titulo = data.titulo;
            $scope.amigos = data.amigos;
            unlockScreen();
        }, function errorCallback(response) {
            console.error(response);
            unlockScreen();
        });

        $scope.salvar = function($event) {
            pararEvento($event);
            lockScreen();
            $http({
                method: 'PUT',
                url: url(`/lista/${$stateParams.uuid}`),
                data: {
                    titulo: $scope.titulo,
                    amigos: $scope.amigos.map(amigo => ({
                        nome: amigo.nome,
                        email: amigo.email,
                    })),
                },
            }).then(function successCallback(response) {
                unlockScreen();
                $state.go('home', {sucesso: 'Lista atualizada com sucesso!'});
            }, function errorCallback(response) {
                console.error(response);
                $scope.notificao = erroAlerta('Não foi possivel salvar a lista, tente novamente mais tarde!');
                unlockScreen();
            });
        };
    }
]);