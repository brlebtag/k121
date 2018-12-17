import { 
    pararEvento, criarRemoverEventos,
    lockScreen, unlockScreen, url, erroAlerta
} from './crudHelper.js';

window.app.controller('criarListaController',
    ['$scope', '$http', '$state',
    function($scope, $http, $state) {
        $scope.modo  = 'Criar lista';
        $scope.titulo = '';
        $scope.amigos = [];
        $scope.notificao = null;
    
        criarRemoverEventos($scope);        

        $scope.salvar = function($event) {
            pararEvento($event);
            lockScreen();
            $http({
                method: 'POST',
                url: url('/lista'),
                data: {
                    titulo: $scope.titulo,
                    amigos: $scope.amigos,
                },
            }).then(function successCallback(response) {
                unlockScreen();
                $state.go('home', {sucesso: 'Lista criada com sucesso!'});
            }, function errorCallback(response) {
                console.error(response);
                $scope.notificao = erroAlerta('Não foi possivel criar a lista, tente novamente mais tarde!');
                unlockScreen();
            });
        };
    }
]);