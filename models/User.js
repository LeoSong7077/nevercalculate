const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    userid : {type:String, required:true}, // user phone or officer id
    password : {type:String, default:'', bcrypt:true, rounds:Number(process.env.BCRYPT_ROUND)},
    total_amount : {type:Number},
    register_date: {type:Date, default:new Date()},

    start : {type:Boolean, default:false},
    start_date: {type:Date},
    end_date: {type:Date},
    date_count : {type:Number},
    monthly_report_id : {type:String},

    today_reported : {type:Boolean, default:false}
});

// plugins
UserSchema.plugin(require('mongoose-bcrypt'));

module.exports = mongoose.model("User", UserSchema);