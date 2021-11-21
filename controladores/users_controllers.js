const Users = require("../modelos/user_models");
const createError = require('http-errors');
const mailer = require('../configuracion/mailer_config');
const jwt = require('jsonwebtoken');

module.exports.crear = (req, res, next) => {
    const body = {name, email, password, bio} = req.body;
    Users.create(body)
        .then(user => {
            mailer.sendValidationEmail(user);
            res.status(201).json(user);
        })
        .catch(next);
};

module.exports.login = (req, res, next) => {
    const {email, password} = req.body;
    Users.findOne({ email, active: true })
        .then((user) => {
            if(user){
                user
                    .checkPassword(password)
                    .then((match) => {
                        if(match){
                            // AUTENTICACION POR COOKIES
                            /*req.session.userId = user.id;
                            res.json(user);*/
                            // AUTENTICACION POR TOKEN
                            const token = jwt.sign({
                                sub: user.id,
                                exp: Math.floor(Date.now() / 1000) + (60 * 30)
                            },process.env.JWT_SECRET);
                            res.json({accessToken: token});
                        }
                        else{
                            next(createError(404,'Usuario no encontrado'));
                        }
                    })
                    .catch(next);
            }
            else{
                next(createError(404,'Usuario no encontrado'));
            }
        })
        .catch(next);
};

module.exports.logout = (req, res, next) => {
    req.session.destroy();
    res.status(204).send();
};

module.exports.validate = (req, res, next) => {
    Users.findByIdAndUpdate(req.params.id, {active: true}, {new: true})
        .then((user) => { user ? res.json(user) : next(createError(404,'Usuario no encontrado')); })
        .catch(next);
};