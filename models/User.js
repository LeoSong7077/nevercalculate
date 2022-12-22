const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    userid : {type:String, required:true}, // user phone or officer id
    password : {type:String, default:'', bcrypt:true, rounds:Number(process.env.BCRYPT_ROUND)},
    nickname : {type:String, required:true},
    photo : {type:String, default:'/public/images/profile.png'},
    gmail : {type:String, default:''},
    isGmailRegister : {type:Boolean, default:false},
    isDarkTheme : {type:Boolean, default:false},
    register_date: {type:Date, default:new Date()},
});

// plugins
UserSchema.plugin(require('mongoose-bcrypt'));

module.exports = mongoose.model("User", UserSchema);