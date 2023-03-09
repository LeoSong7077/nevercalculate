const User = require('../models/User');
const DailyReport = require('../models/DailyReport');
const UserService = require('../services/UserService');
const DailyReportService = require('../services/DaillyReportService');
// const schedule = require('node-schedule');

module.exports = function () {
    
    // 00시에 마감일을 넘겼는지 확인
    // 넘겼으면 => 종료, start:false
    // 안넘겼으면 => 00시에 오늘 저장된 데이터가 없으면 자동으로 투자 안했다고 기록
        
    // Exchange - 6시간 (or 12시간)
    // schedule.scheduleJob('0 0 */6 * * *', updateExchanges);
    // schedule.scheduleJob('0 0 */12 * * *', updateExchanges);
    // updateExchanges();

}

async function updateBreakDailyReport() {
    const users = await UserService.get_all();
    for (let i = 0; i < users.length; i++) {

        const uid = users[i]._id.toString();
        const { start, monthly_report_id, total_amount, today_reported, end_date } = users[i];

        if (!start) continue;

        if (!today_reported) await DailyReportService.save({ uid, monthly_report_id, profit_or_lost_rate:0, total_amount });
        await UserService.edit_by_doc(uid, { date_count:{$inc:-1}, today_reported:false });

        // 종료
        await checkEndDate(uid, end_date);
    }
}

async function checkEndDate(uid, end_date) {
    if ((new Date()) > end_date) await UserService.edit_by_doc(uid, { start:false });
}