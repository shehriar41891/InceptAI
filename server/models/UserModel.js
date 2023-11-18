const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose');
const UserSchema = new mongoose.Schema({
    username:{
        Type: String,
        required : true
    },
    email:{
        Type: String,
        required: true,
        unique : true
    },
    password : {
        Type : String,
        required : true
    }
})

UserSchema.plugin(passportLocalMongoose)

const UserModel = mongoose.model('UserModel',UserSchema)

module.exports  = UserModel;