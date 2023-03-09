const mongooseLoader = require('./mongoose');
const expressLoader = require('./express');
const middlewareLoader = require('./middleware');
const errorHandlerLoader = require('./errorHandler');
const routerLoader = require('./router');
const loginLoader = require('./login');
const scheduleLoader = require('./schedule');

// 실행
module.exports = function (app) {
    mongooseLoader();
    expressLoader(app);
    middlewareLoader(app);
    errorHandlerLoader(app);
    loginLoader(app);
    routerLoader(app);
    scheduleLoader(app);
}