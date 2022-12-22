// ### middleware, controller ###

const passport = require('passport');

// const googleAuth = passport.authenticate('google', { scope: ['email', 'profile'] });

const signin = function (type) {
    if (type === 'local') return passport.authenticate(type, { failureRedirect:'/login/fail', successRedirect:'/login/success', failureFlash:true });
    // else if (type === 'google') return passport.authenticate(type, { failureRedirect:'/login/google/fail', successRedirect:'/login/google/success', failureFlash:true });
    // else if (type === 'custom') return passport.authenticate(type, { failureRedirect:'/login/google/fail', successRedirect:'/login/custom/success', failureFlash:true });
}

const signout = function (request, response, next) { // 로그아웃 시.. 쿠키도 삭제해줘야 바로 다시 로그인이 안된다!! => 쿠키 삭제 해줘야 구글 계정 선택할 수 있음!!
    request.logout(function(err) {
        if (err) { return next(err); }
        next();
    });
}

module.exports = { signin, signout }; // googleAuth