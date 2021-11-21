const express = require('express');
const rutas = express.Router();
const posts = require("../controladores/posts_controllers");
const users = require("../controladores/users_controllers");
const auth = require("../middlewares/autenticador_midd");
const upload = require('../configuracion/multer_config');

// RUTAS
rutas.post('/posts', auth.estaAutenticado, upload.single("imagen"), posts.crear);
rutas.get('/posts', auth.estaAutenticado, posts.listar);
rutas.get('/posts/:id', auth.estaAutenticado, posts.detalle);
rutas.patch('/posts/:id', auth.estaAutenticado, posts.actualizar);
rutas.delete('/posts/:id', auth.estaAutenticado, posts.eliminar);

rutas.post('/users', users.crear);
rutas.get('/users/:id/active', users.validate);
rutas.post('/users/login', users.login);
rutas.post('/users/logout', auth.estaAutenticado, users.logout);

module.exports = rutas;