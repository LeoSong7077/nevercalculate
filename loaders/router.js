const indexRouter = require('../routes/index');
// const loginRouter = require('../routes/login');

module.exports = function(app) {
    app.use('/', indexRouter);
    // app.use('/login', loginRouter);
};