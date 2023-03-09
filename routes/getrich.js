const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// modules
const doAsync = require('../modules/function/doAsync');
const authentication = require('../modules/object/authentication');

// services
const UserService = require('../services/UserService');
const MonthlyReportService = require('../services/MonthlyReportService');
const DailyReportService = require('../services/DaillyReportService');

router.get('/', (async function (request, response) {    
    const login = !!request.user;
    const start = (login) ? request.user.start : false;

    let userid = '',
        start_date = '', 
        end_date = '',
        date_count = '',
        card_count = '',
        today_reported = '',
        daily_reports = '',
        total_amount = '',
        current_profit_rate = '',
        start_total_amount = '';
        
    if (login) {
        const { user } = request;
        if (start) {
            userid = user.userid
            start_date = dateFormat(changeToKRTime(user.start_date));
            end_date = dateFormat(changeToKRTime(user.end_date));
            date_count = user.date_count;
            card_count = await calculateCardCount(user.id, user.monthly_report_id,  user.date_count);
            today_reported = user.today_reported;
            daily_reports = await DailyReportService.get_many_by_doc({uid:user.id, monthly_report_id:user.monthly_report_id});
            total_amount = user.total_amount;
            current_profit_rate = await getUserCurrentProfitRate(user.monthly_report_id, user.total_amount);
            start_total_amount = (await MonthlyReportService.get_one_by_id(user.monthly_report_id)).start_total_amount;
        }
    }

    response.render(`getrich.ejs`, 
        {   
            login, 
            start,
            // user
            userid,
            start_date,
            end_date,
            date_count,
            card_count,
            today_reported,
            daily_reports,
            total_amount,
            current_profit_rate,
            start_total_amount
        });
}));

router.get('/register', (async function (request, response) {
    response.render(`getrich.register.ejs`);
}));

router.post('/register/user', (async function (request, response) {
    if (await UserService.isDuplicate('userid', request.body.userid)) return response.send({success:false, failType:'userid_duplication'});

    await UserService.save(request.body);

    response.send({success:true});
}));

router.post('/start', (async function (request, response) {
    const { start_date, end_date, date_count } = request.body;

    const monthly_report = await MonthlyReportService.save({start_total_amount:request.user.total_amount});

    // User - Update : start 날짜 설정, start 설정
    await UserService.edit_by_doc(request.user.id, 
        {   
            start:true, 
            start_date, 
            end_date, 
            date_count,
            monthly_report_id : monthly_report._id.toString()
        });

    response.send({success:true});
}));

router.get('/terminate', (async function (request, response) {
    await UserService.edit_by_doc(request.user.id, { start:false, today_reported:false });

    response.send({success:true});
}));

router.post('/daily_report', (async function (request, response) {
    const total_amount = Number(request.body.total_amount);
    const { id, monthly_report_id  } = request.user;
    const user_total_amount = request.user.total_amount;

    const diff =  total_amount - user_total_amount;
    const rate = Number((diff / user_total_amount).toFixed(3));

    // DailyReport 생성
    await DailyReportService.save({uid:id, monthly_report_id, profit_or_lost_rate:rate, total_amount});

    // User 업데이트
    await UserService.edit_by_doc(id, {total_amount }); // today_reported:true

    response.send({success:true});
}));

// ================== LOGIN ==================

router.post('/login', authentication.signin('local'));

router.get('/login/fail', function (request, response) {
    response.send({success:true, login:false});
});

router.get('/login/success', function (request, response) {
    response.send({success:true, login:true});
});


router.get('/logout', authentication.signout, function(request, response) { // ajax
    response.send({success:true});
});

module.exports = router; 

function changeToKRTime(date) {
    const utc = 
        date.getTime() + 
        (date.getTimezoneOffset() * 60 * 1000);

    // 3. UTC to KST (UTC + 9시간)
    const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
    const kr_curr = 
        new Date(utc + (KR_TIME_DIFF));
    return kr_curr;
}

function dateFormat(date) {
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    month = month >= 10 ? month : '0' + month;
    day = day >= 10 ? day : '0' + day;
    hour = hour >= 10 ? hour : '0' + hour;
    minute = minute >= 10 ? minute : '0' + minute;
    second = second >= 10 ? second : '0' + second;

    return date.getFullYear() + '-' + month + '-' + day + ' ' + '(' + hour + ':' + minute + ':' + second + ')';
}

async function calculateCardCount(uid, monthly_report_id,  date_count) {
    const daily_reports = await DailyReportService.get_many_by_doc({uid, isBreak:true, monthly_report_id});
    // 휴일 빼고 남은 날짜 수
    const real_date_count = date_count - daily_reports.length;

    let cnt = 0;
    while (cnt < real_date_count) {
        const profit = Math.pow(0.9, cnt) * Math.pow(1.05, (real_date_count - cnt));
        if (profit < 1) break;
        cnt++;
    }
    cnt--;

    const loss_daily_reports = await DailyReportService.get_many_by_doc({uid, isBreak:false, monthly_report_id, profit_or_lost_rate:{$lt:0}});

    return cnt - loss_daily_reports.length;
}

async function getUserCurrentProfitRate(monthly_report_id, total_amount) {
    const monthly_report = await MonthlyReportService.get_one_by_id(monthly_report_id);
    const start_total_amount = monthly_report.start_total_amount;

    const diff =  total_amount - start_total_amount;
    const rate = Number((diff / start_total_amount).toFixed(3));

    return rate;
}