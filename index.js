require('dotenv').config();
require('./configuracion/db_config');

const session = require("./configuracion/session_config");
const auth = require("./middlewares/autenticador_midd");

const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');

const app = express();

//MIDDLEWARES
app.use(logger('dev'));
app.use(express.json());
app.use(session);
app.use(auth.cargarUsuario);

//RUTAS
const rutas = require('./configuracion/rutas_config');
app.use('/api', rutas);

// ERROR HANDING
app.use((req, res, next) => {
    next(createError(404, 'Ruta no encontrada'))
});
  
app.use((error, req, res, next) => {
    if (error instanceof mongoose.Error.ValidationError) {
        error = createError(400, error);
    } else if (error instanceof mongoose.Error.CastError && error.message.includes('_id')) {
        error = createError(404, 'Recurso no encontrado');
    } else if (error.message.includes('E11000')) {
        error = createError(409, 'Duplicado');
    } else if (!error.status) {
        error = createError(500, error);
    }

    if (error.status >= 500) {
        console.error(error);
    }

    const data = {};
    data.message = error.message;

    if (error.errors) {
        data.errors = Object.keys(error.errors)
        .reduce((errors, key) => {
            errors[key] = error.errors[key].message;
            return errors;
        }, {});
    }
    res.status(error.status).json(data);
});

// INICIANDO SERVIDOR
const puerto = process.env.PORT || 8000;
app.listen(puerto, (err) => {
    if(err) console.log(err);
    console.log(`Servidor en puerto ${puerto}`);
});