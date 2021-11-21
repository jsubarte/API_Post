const Posts = require("../modelos/post_models");
const createError = require('http-errors');

module.exports.crear = (req, res, next) => {
    const body = {title, text, author, imagen} = req.body;
    if(req.file){
        body.imagen = req.file.path;
    }
    Posts.create(body)
        .then(post => {
            res.status(201).json(post);
        })
        .catch(next);
};

module.exports.listar = (req, res, next) => {
    Posts.find()
        .then(post => {
            res.json(post);
        })
        .catch(next);
};

module.exports.detalle = (req, res, next) => {
    Posts.findById(req.params.id)
        .then(post => {
            post ? res.json(post) : next(createError(404,'Post no encontrado'))
        })
        .catch(next);
};

module.exports.actualizar = (req, res, next) => {
    const body = {title, text, author} = req.body;
    Posts.findByIdAndUpdate(req.params.id, body, {new: true})
        .then(post => {
            post ? res.json(post) : next(createError(404,'Post no encontrado'))
        })
        .catch(next);
};

module.exports.eliminar = (req, res, next) => {
    Posts.findByIdAndDelete(req.params.id)
        .then(post => {
            post ? res.status(204).send() : next(createError(404,'Post no encontrado'))
        })
        .catch(next);
};