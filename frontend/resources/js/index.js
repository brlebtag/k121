window._ = require('lodash');
window.Popper = require('popper.js').default;

try {
    window.$ = window.jQuery = require('jquery');

    require('bootstrap');
} catch (e) {}

window.axios = require('axios');

window.angular = require('angular');

window['ui.router'] = require('@uirouter/angularjs');

window.app = window.angular.module('amigoSecretoApp', ['ui.router']);

require('./rotas.js');
require('./listagemListaController.js');
require('./criarListaController.js');
require('./editarListaController.js');
require('./geradoListaController.js');