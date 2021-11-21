const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const EMAIL_FORMAT = /^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i;
const PASSWORD_PATTERN = /^.{8,}$/;

const schema = new mongoose.Schema(
    {
        name: {
            type: String, 
            required: true
        },
        email: {
            type: String, 
            required: true,
            unique: true,
            match: EMAIL_FORMAT
        },
        password: {
            type: String, 
            required: true,
            match: PASSWORD_PATTERN
        },
        bio: {
            type: String, 
            maxlength: 500
        },
        active: {
            type: Boolean, 
            default: false
        }
    },
    {
        timestamps: true,
        toJSON:{
            transform: (doc, ret) => {
                ret.id = doc._id,
                delete ret._id,
                delete ret.__v,
                delete ret.password,
                delete ret.active
            }
        }
    }
);

schema.pre('save', function(next) {
    this.isModified("password")
    ?
        (
            bcrypt
                .genSalt(10)
                .then((salt) => {
                    bcrypt
                    .hash(this.password, salt)
                    .then((hash) => {
                        this.password = hash;
                        next();
                    })
                    .catch((error) => next(error));
                })
                .catch((error) => next(error))
        )
    :
    next();
}
);

schema.methods.checkPassword = function(password){
    return bcrypt.compare(password,this.password);
};

module.exports = mongoose.model('User',schema);