'use strict';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const helmet = require('helmet');
const cors = require('cors');
const ListaController = require('./controllers/ListaController');

const corsOptions = {
    origin: 'http://localhost',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(bodyParser.json());

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

const controller = new ListaController(
    app,
    mongoose,
    transporter
);

app.listen(3000, function () {
    console.log('Amigo secreto ouvindo na porta 3000!');
});