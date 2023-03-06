const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    userid : {type:String, required:true}, // user phone or officer id
    password : {type:String, default:'', bcrypt:true, rounds:Number(process.env.BCRYPT_ROUND)},
    start : {type:Boolean, default:false},
    register_date: {type:Date, default:new Date()},
    start_date: {type:Date},
    total_date: {type:Number}
});

// plugins
UserSchema.plugin(require('mongoose-bcrypt'));

module.exports = mongoose.model("User", UserSchema);