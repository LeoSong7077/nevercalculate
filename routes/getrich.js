const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// modules
const doAsync = require('../modules/function/doAsync');
const authentication = require('../modules/object/authentication');

// services
const UserService = require('../services/UserService');

router.get('/', (async function (request, response) {    
    const login = !!request.user;
    const start = (login) ? request.user.start : false;

    response.render(`getrich.ejs`, { login, start });
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

    console.log(new Date());
    // console.log(request.body.date_string)
    // console.log(new Date(request.body.date_string))

    // User - Update : start 날짜 설정, start 설정


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