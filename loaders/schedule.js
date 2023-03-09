const User = require('../models/User');
const DailyReport = require('../models/DailyReport');
const UserService = require('../services/UserService');
const DailyReportService = require('../services/DaillyReportService');
const schedule = require('node-schedule');

module.exports = function () {        
    schedule.scheduleJob('00 02 04 * * *', updateReport);
}

async function updateReport() {
    const users = await UserService.get_all();
    for (let i = 0; i < users.length; i++) {

        const uid = users[i]._id.toString();
        const { start, monthly_report_id, total_amount, today_reported, end_date } = users[i];

        if (!start) continue;

        if (!today_reported) await DailyReportService.save({ uid, monthly_report_id, profit_or_lost_rate:0, total_amount });
        await UserService.edit_by_doc(uid, { today_reported:false });
        await UserService.decrease_date_count_by_value(uid, 1);

        // 종료
        await checkEndDate(uid, end_date);
    }
}

async function checkEndDate(uid, end_date) {
    if ((new Date()) > end_date) await UserService.edit_by_doc(uid, { start:false });
}