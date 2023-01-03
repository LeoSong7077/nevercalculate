const indexRouter = require('../routes/index');

module.exports = function(app) {
    app.use('/', indexRouter);
};