const mongoose = require("mongoose");

const MonthlyReportSchema = new mongoose.Schema({
    uid : {type:String},
    profit_or_lost_rate : {type:Number},
    start_total_amount : {type:Number},
    end_total_amount : {type:Number},
});

module.exports = mongoose.model("MonthlyReport", MonthlyReportSchema);