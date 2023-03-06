function register() {
    const userid = document.getElementById('register_userid').value;
    const password = document.getElementById('register_password').value;
    const password_check = document.getElementById('register_password_check').value;

    if (!userid || !password || !password_check) return alert('모든 정보를 입력해 주세요.');
    if (password !== password_check) return alert('비밀번호가 일치하지 않습니다.')

    $.ajax({
        method:'post',
        url:'/gr/register/user',
        data : { userid, password }
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
    const oneMonthLater = new Date(original.setMonth(original.getMonth() + 1)); // 한달 후
    // console.log("한달 후 : ", oneMonthLater);

    const btMs = oneMonthLater.getTime() - now.getTime() ;
    const btDay = btMs / (1000*60*60*24) ;
    // console.log("일수 차이는?? " + btDay);

    $.ajax({
        type:'post',
        url:'/gr/start',
        data: {
            date_string : (original.toString()),
            total_date : btDay
        }
    })
    .done(result => {
        const { success } = result;
        window.location.href = '/gr';
    })
}