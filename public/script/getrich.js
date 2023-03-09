if (document.getElementById('today_date')) document.getElementById('today_date').innerText = dateFormat(new Date(), true);

function register() {
    const userid = document.getElementById('register_userid').value;
    const password = document.getElementById('register_password').value;
    const password_check = document.getElementById('register_password_check').value;
    const total_amount = document.getElementById('total_amount').value;

    if (!userid || !password || !password_check || !total_amount) return alert('모든 정보를 입력해 주세요.');
    if (password !== password_check) return alert('비밀번호가 일치하지 않습니다.')

    $.ajax({
        method:'post',
        url:'/gr/register/user',
        data : { userid, password, total_amount }
    })
    .done(result => {
        const { success, failType } = result;
        if (!success && failType === 'userid_duplication') return alert('존재하는 아이디 입니다.');
        
        alert('회원가입 성공');
        window.location.href='/gr';
    })
}

function login() {
    const formData = $('#loginBox').serialize();
    $.ajax({
        url:'/gr/login',
        method:'post',
        data:formData
    })
    .done(result => {
        const { success, login } = result;
        if (success && !login) return alert('아이디나 비밀번호가 일치하지 않습니다.');
        if (success && login) {
            return window.location.href = '/gr';
        } 
    })
    .fail(error => {
        console.log(error);
    });
}

function logout() {
    $.ajax({
        type:'get',
        url:'/gr/logout'
    })
    .done(result => {
        const { success } = result;
        window.location.href = '/gr';
    })
}

function start() {
    const original = new Date();
    original.setHours(0);
    original.setMinutes(0);
    original.setSeconds(0);
    const now = new Date(original);
    // console.log("현재 : ", now);

    original.setMonth(original.getMonth() + 1)
    original.setHours(original.getHours() + 4); // 새벽 4시까지
    const oneMonthLater = new Date(original); // 한달 후
    // console.log("한달 후 : ", oneMonthLater);

    const btMs = oneMonthLater.getTime() - now.getTime() ;
    const btDay = Math.round(btMs / (1000*60*60*24));

    $.ajax({
        type:'post',
        url:'/gr/start',
        data: {
            start_date : (now.toString()),
            end_date : (oneMonthLater.toString()),
            date_count : btDay
        }
    })
    .done(result => {
        const { success } = result;
        window.location.href = '/gr';
    })
}

function terminate() {
    if (!window.confirm('한 분기 투가자 종료됩니다. 정말 종료하시겠습니까?')) return;

    $.ajax({
        type:'get',
        url:'/gr/terminate',
    })
    .done(result => {
        const { success } = result;
        window.location.href = '/gr';
    })
}

function restart() {
    if (!window.confirm('한 분기 투가자 종료 후 다시 시작됩니다. 정말 재시작하시겠습니까?')) return;

    const original = new Date();
    original.setHours(0);
    original.setMinutes(0);
    original.setSeconds(0);
    const now = new Date(original);
    // console.log("현재 : ", now);

    original.setMonth(original.getMonth() + 1)
    original.setHours(original.getHours() + 4); // 새벽 4시까지
    const oneMonthLater = new Date(original); // 한달 후
    // console.log("한달 후 : ", oneMonthLater);

    const btMs = oneMonthLater.getTime() - now.getTime() ;
    const btDay = Math.round(btMs / (1000*60*60*24));

    $.ajax({
        type:'post',
        url:'/gr/start',
        data: {
            start_date : (now.toString()),
            end_date : (oneMonthLater.toString()),
            date_count : btDay
        }
    })
    .done(result => {
        const { success } = result;
        window.location.href = '/gr';
    })
}

function dailyReport() {
    if (!window.confirm('오늘 마감가를 입력하시겠습니까?')) return;

    const total_amount = document.getElementById('daily_report').value;
    $.ajax({
        url:'/gr/daily_report',
        method:'post',
        data:{
            total_amount
        }
    })
    .done(result => {
        const { success } = result;
        if (success) window.location.reload();
    })
    .fail(error => {
        console.log(error);
    });
}

function dateFormat(date, isHourRemoved) {
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

    if (!isHourRemoved) return date.getFullYear() + '-' + month + '-' + day + ' ' + '(' + hour + ':' + minute + ':' + second + ')';
    else return date.getFullYear() + '-' + month + '-' + day;
}