export function pararEvento($event) {
    $event.preventDefault();
    $event.stopPropagation();
}

export function criarRemoverEventos ($scope) {
    $scope.novoAmigo = function($event) {
        pararEvento($event);
        $scope.amigos.push({
            nome: '',
            email: ''
        });
    }

    $scope.removerAmigo = function($event, index) {
        pararEvento($event);
        $scope.amigos.splice(index, 1);
    }
}