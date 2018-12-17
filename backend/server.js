'use strict';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const mongoose = require('mongoose');
const _ = require('lodash');
const nodemailer = require('nodemailer');
const helmet = require('helmet');
const cors = require('cors');

const corsOptions = {
    origin: 'http://localhost',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(helmet());
app.use(cors(corsOptions));

const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "33719081279f39822",
        pass: "415f286bfee4ea"
    }
  });

mongoose.connect('mongodb://localhost:27017/amigo-secreto', {
    useNewUrlParser: true,
}).catch(function (e) {
    console.log(e);
});

const Schema = mongoose.Schema;

const ListaSchema = Schema({
    titulo: String,
    amigos: [
        {
            nome: String,
            email: String,
            amigo_id: { type: String, required: false },
        }
    ]
});

const ListaModel = mongoose.model('Lista', ListaSchema);

app.get('/lista', jsonParser, async function(req, res) {
    try
    {
        var listas = await ListaModel.find({});

        res.send(listas);
    }
    catch(e)
    {
        console.log(e);
        res.sendStatus(400);
    }
});


app.post('/lista', jsonParser, async function(req, res) {
    try
    {
        const data = req.body;

        data.amigos = data.amigos.map(amigo => ({
            nome: amigo.nome,
            email: amigo.email, 
        }));

        const lista = new ListaModel(req.body);
        const error = lista.validateSync();

        if (error)
        {
            res.sendStatus(400);
        }
        else
        {
            await lista.save();
            res.sendStatus(201);
        }
    }
    catch(e)
    {
        console.log(e);
        res.sendStatus(422);
    }
});

app.post('/lista/:uuid/notificar', jsonParser, async function(req, res) {
    try
    {
        const lista = await ListaModel.findOne({_id: req.params.uuid});

        const indiceAmigos = lista.amigos.reduce((combinacao, amigo) => {
            combinacao[amigo._id] = amigo;
            return combinacao;
        }, {});

        const amigos =  lista.amigos;
        const tamanho = amigos.length;

        for(var i = 0; i < tamanho; i++) {
            const amigo = amigos[i];

            if (amigo.amigo_id) {
                const mailOptions = {
                    from: '"Amigo secreto" <amigo@secreto.com>',
                    to: amigo.email,
                    subject: "Amigo Secreto",
                    text: `Olá ${indiceAmigos[amigo._id].nome}, seu amigo secreto é ${indiceAmigos[amigo.amigo_id].nome}`
                };

                await transporter.sendMail(mailOptions);
            }
        }

        res.sendStatus(200);
    }
    catch(e)
    {
        console.log(e);
        res.sendStatus(422);
    }
});

app.put('/lista/:uuid', jsonParser, async function(req, res) {
    try
    {
        const data = req.body;

        if (!data.titulo)
        {
            res.sendStatus(400);
        }

        data.amigos = data.amigos || [];
        
        data.amigos = data.amigos.map(amigo => ({
            nome: amigo.nome,
            email: amigo.email, 
        }));

        await ListaModel.updateOne(
            {_id: req.params.uuid},
            {$set: {titulo: data.titulo, amigos: data.amigos}}
        );

        res.sendStatus(200);
    }
    catch(e)
    {
        console.log(e);
        res.sendStatus(422);
    }
});

app.post('/lista/:uuid/notificar/:amigo_uuid', jsonParser, async function(req, res) {
    try
    {
        const listaUuid = req.params.uuid;

        const amigoUuid = req.params.amigo_uuid;

        const lista = await ListaModel.findOne({_id: listaUuid});

        const indiceAmigos = lista.amigos.reduce((combinacao, amigo) => {
            combinacao[amigo._id] = amigo;
            return combinacao;
        }, {});

        const amigo = indiceAmigos[amigoUuid];

        if (amigo && amigo.amigo_id) {
            const mailOptions = {
                from: '"Amigo secreto" <amigo@secreto.com>',
                to: amigo.email,
                subject: "Amigo Secreto",
                text: `Olá ${indiceAmigos[amigo._id].nome}, seu amigo secreto é ${indiceAmigos[amigo.amigo_id].nome}`
            };

            await transporter.sendMail(mailOptions);

            res.sendStatus(200);
        } else {
            res.sendStatus(400);
        }
    }
    catch(e)
    {
        console.log(e);
        res.sendStatus(422);
    }
});

app.post('/lista/:uuid/gerar', jsonParser, async function(req, res) {
    try
    {
        const listaUuid = req.params.uuid;

        const lista = await ListaModel.findOne({_id: listaUuid});

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

        await ListaModel.updateOne(
            {_id: listaUuid},
            {$set: {amigos: amigos}}
        );

        res.sendStatus(200);
    }
    catch(e)
    {
        console.log(e);
        res.sendStatus(422);
    }
});

app.get('/lista/:uuid', jsonParser, async function(req, res) {
    try
    {
        const listaUuid = req.params.uuid;

        const lista = await ListaModel.findOne({_id: listaUuid});

        console.log(lista);

        if (lista) {
            res.send(lista);
        } else {
            res.sendStatus(204);
        }
    }
    catch(e)
    {
        console.log(e);
        res.sendStatus(422);
    }
});

app.delete('/lista/:uuid', jsonParser, async function(req, res) {
    try
    {
        const listaUuid = req.params.uuid;

        await ListaModel.deleteOne({_id: listaUuid});

        res.sendStatus(200);
    }
    catch(e)
    {
        console.log(e);
        res.sendStatus(422);
    }
});


app.listen(3000, function () {
    console.log('Amigo secreto ouvindo na porta 3000!');
});