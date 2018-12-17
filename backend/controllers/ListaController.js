const BaseController = require('./BaseController');
const ListaRepository = require('../repositories/ListaRepository');
const MailService = require('../services/MailService');
const _ = require('lodash');

module.exports = class ListaController extends BaseController {
    constructor(app, db, mail) {
        super(app);

        this.repository = new ListaRepository(db);
        this.mailService = new MailService(mail);

        app.get('/lista', this.listarListas.bind(this));
        app.post('/lista', this.criarLista.bind(this));
        app.post('/lista/:uuid/notificar', this.notificarTodos.bind(this));
        app.put('/lista/:uuid', this.atualizarLista.bind(this));
        app.post('/lista/:uuid/notificar/:amigo_uuid', this.notificarAmigo.bind(this));
        app.post('/lista/:uuid/gerar', this.gerarAmigoSecreto.bind(this));
        app.get('/lista/:uuid', this.obterLista.bind(this));
        app.delete('/lista/:uuid', this.obterLista.bind(this));
    }

    async listarListas(req, res) {
        try
        {
            var listas = await this.repository.todos.call(this.repository);

            res.send(listas);
        }
        catch(e)
        {
            console.error(e);
            res.sendStatus(400);
        }
    }

    async criarLista(req, res) {
        try
        {
            const data = req.body;

            data.amigos = data.amigos.map(amigo => ({
                nome: amigo.nome,
                email: amigo.email, 
            }));

            await this.repository.criar.call(this.repository, data);

            res.sendStatus(201);
        }
        catch(e)
        {
            console.error(e);
            res.sendStatus(400);
        }
    }

    async notificarTodos(req, res) {
        try
        {
            const listaUuid = req.params.uuid;

            const lista = await this.repository.porId.call(this.repository, listaUuid);
    
            const indiceAmigos = lista.amigos.reduce((combinacao, amigo) => {
                combinacao[amigo._id] = amigo;
                return combinacao;
            }, {});
    
            const amigos =  lista.amigos;
            const tamanho = amigos.length;
    
            for(var i = 0; i < tamanho; i++) {
                const amigo = amigos[i];
    
                if (amigo.amigo_id) {
                    const opcoesEmail = {
                        from: '"Amigo secreto" <amigo@secreto.com>',
                        to: amigo.email,
                        subject: "Amigo Secreto",
                        text: `Olá ${indiceAmigos[amigo._id].nome}, seu amigo secreto é ${indiceAmigos[amigo.amigo_id].nome}`
                    };
    
                    await this.mailService.enviar.call(this.mailService, opcoesEmail);
                }
            }
    
            res.sendStatus(200);
        }
        catch(e)
        {
            console.error(e);
            res.sendStatus(422);
        }
    }

    async atualizarLista(req, res) {
        try
        {
            const data = req.body;
            const listaUuid = req.params.uuid;
    
            if (!data.titulo)
            {
                res.sendStatus(400);
            }
    
            data.amigos = data.amigos || [];
            
            data.amigos = data.amigos.map(amigo => ({
                nome: amigo.nome,
                email: amigo.email, 
            }));

            await this.repository.atualizar.call(
                this.repository,
                listaUuid,
                {titulo: data.titulo, amigos: data.amigos}
            );
    
            res.sendStatus(200);
        }
        catch(e)
        {
            console.error(e);
            res.sendStatus(422);
        }
    }

    async notificarAmigo(req, res) {
        try
        {
            const listaUuid = req.params.uuid;
    
            const amigoUuid = req.params.amigo_uuid;
    
            const lista = await this.repository.porId.call(this.repository, listaUuid);
    
            const indiceAmigos = lista.amigos.reduce((combinacao, amigo) => {
                combinacao[amigo._id] = amigo;
                return combinacao;
            }, {});
    
            const amigo = indiceAmigos[amigoUuid];
    
            if (amigo && amigo.amigo_id) {
                const opcoesEmail = {
                    from: '"Amigo secreto" <amigo@secreto.com>',
                    to: amigo.email,
                    subject: "Amigo Secreto",
                    text: `Olá ${indiceAmigos[amigo._id].nome}, seu amigo secreto é ${indiceAmigos[amigo.amigo_id].nome}`
                };

                await this.mailService.enviar.call(this.mailService, opcoesEmail);
    
                res.sendStatus(200);
            } else {
                res.sendStatus(400);
            }
        }
        catch(e)
        {
            console.error(e);
            res.sendStatus(422);
        }
    }

    async gerarAmigoSecreto(req, res) {
        try
        {
            const listaUuid = req.params.uuid;
    
            const lista = await this.repository.porId.call(this.repository, listaUuid);
    
            const amigos = lista.amigos;
    
            const amigosEmbaralhado = _.shuffle(amigos);        
            
            const tamanho = amigosEmbaralhado.length;
    
            const combinacaoAmigo = {};
    
            for(let i = 0; i < tamanho; i++)
            {
                combinacaoAmigo[amigosEmbaralhado[i]._id] = amigosEmbaralhado[(i + 1) % tamanho]._id;
            }
    
            for(let i = 0; i < tamanho; i++)
            {
                let amigo = amigos[i];
                amigo.amigo_id = combinacaoAmigo[amigo._id];
            }

            await this.repository.atualizar.call(
                this.repository,
                listaUuid,
                {titulo: lista.titulo, amigos: amigos}
            );
    
            res.sendStatus(200);
        }
        catch(e)
        {
            console.error(e);
            res.sendStatus(422);
        }
    }

    async obterLista(req, res) {
        try
        {
            const listaUuid = req.params.uuid;
    
            const lista = await this.repository.porId.call(this.repository, listaUuid);
    
            if (lista) {
                res.send(lista);
            } else {
                res.sendStatus(204);
            }
        }
        catch(e)
        {
            console.error(e);
            res.sendStatus(422);
        }
    }

    async function(req, res) {
        try
        {
            const listaUuid = req.params.uuid;
    
            await this.repository.excluir.call(this.repository, listaUuid);
    
            res.sendStatus(200);
        }
        catch(e)
        {
            console.error(e);
            res.sendStatus(422);
        }
    }
};