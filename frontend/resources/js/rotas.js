window.app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'listagem.html',
            controller: 'listagemListaController',
        })
        .state('cadastrar', {
            url: '/cadastrar',
            templateUrl: 'form.html',
            controller: 'criarListaController',
        })
        .state('editar', {
            url: '/editar/{id}',
            templateUrl: 'form.html',
            controller: 'editarListaController',
        })
        .state('lista_gerada', {
            url: '/gerado',
            templateUrl: 'gerado.html',
            controller: 'gerarListaController',
        });
    
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});
