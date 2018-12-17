import $ from 'jquery';

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

export function lockScreen() {
    $("#lock").css('display', 'block');
}

export function unlockScreen() {
    $("#lock").css('display', 'none');
}

export function sucessoAlerta(mensagem) {
    return {
        tipo: 'success',
        mensagem: mensagem,
    };
}

export function erroAlerta(mensagem) {
    return {
        tipo: 'danger ',
        mensagem: mensagem,
    };
}

export function url(uri) {
    return `http://localhost:3000${uri}`;
}