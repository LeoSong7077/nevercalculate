const mongoose = require("mongoose");

const DailyReportSchema = new mongoose.Schema({
    uid : {type:String},
    monthly_report_id : {type:String},
    profit_or_lost_rate : {type:Number},
    total_amount : {type:Number},
    isBreak : {type:Boolean, default:false}
});

module.exports = mongoose.model("DailyReport", DailyReportSchema);