window.app.controller('listagemListaController', ['$scope', '$http', function($scope, $http) {
    $scope.listas = [
        {
            uuid: '5a838133-467e-44b4-a452-ca95fbae268b',
            titulo: 'Lista de amigos trabalho'
        },{
            uuid: 'a3d78d77-8633-4151-8b39-cf45ce0b0a6f',
            titulo: 'Lista de amigos familia'
        }
    ]
}]);