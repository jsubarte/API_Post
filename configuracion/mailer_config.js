const nodemailer = require("nodemailer");

const email = process.env.EMAIL_ACCOUNT;

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: email,
        pass: process.env.EMAIL_PASSWORD
    }
});

module.exports.sendValidationEmail = (user) => {
    transporter.sendMail({
        form: `"Api Node" <${email}>`,
        to: user.email,
        subject: "Este es el asunto del correo",
        html: `<h1>Bienvenido a API NODE</h1>
               <p>Active su cuenta con el siguiente enlace</p>
               <a href="${process.env.APP_HOST}/api/users/${user.id}/active">Click aquí</a>`
    })
    .then(() => { console.log(`Email enviado a ${user.id}`); })
    .catch((err) => { console.error("Error enviando email", err); });
};