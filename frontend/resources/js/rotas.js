window.app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state({
            name: 'home',
            url: '/',
            templateUrl: 'listagem.html',
            controller: 'listagemListaController',
        })
        .state({
            name: 'cadastrar',
            url: '/cadastrar',
            templateUrl: 'form.html',
            controller: 'criarListaController',
        })
        .state({
            name: 'editar', 
            url: '/editar/{uuid}',
            templateUrl: 'form.html',
            controller: 'editarListaController',
        })
        .state({
            name: 'lista_gerada',
            url: '/gerado/{uuid}',
            templateUrl: 'gerado.html',
            controller: 'gerarListaController',
        });
    
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});
