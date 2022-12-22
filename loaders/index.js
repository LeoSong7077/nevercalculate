const mongooseLoader = require('./mongoose');
const expressLoader = require('./express');
const routerLoader = require('./router');
// const loginLoader = require('./login');
const middlewareLoader = require('./middleware');
const errorHandlerLoader = require('./errorHandler');

// 실행
module.exports = function (app) {
    mongooseLoader();
    expressLoader(app);
    middlewareLoader(app);
    
    // loginLoader(app);
    routerLoader(app);
    
    errorHandlerLoader(app);
    
}