const User = require("../modelos/user_models");
const createError = require('http-errors');
const jwt = require('jsonwebtoken');

module.exports.cargarUsuario = (req, res, next) => {
    if(req.session.userId){
        User.findById(req.session.userId)
            .then((user) =>{
                if(user){
                    req.user = user;
                }
                next();
            })
            .catch(next);
    }
    else if(req.headers.authorization){
        const token = req.headers.authorization.replace("Bearer ","");
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err){
                console.error("ERROR TOKEN: ", err);
                next();
            }
            else{
                User.findById(decoded.sub)
                    .then((user) =>{
                        if(user){
                            req.user = user;
                        }
                        next();
                    })
                    .catch(next);
            }
        });
    }
    else{
        next();
    }
};

module.exports.estaAutenticado = (req, res, next) => {
    req.user ? next() : next(createError(401, "No Autorizado"));
};