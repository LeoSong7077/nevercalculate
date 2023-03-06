const indexRouter = require('../routes/index');
const getrichRouter = require('../routes/getrich');

module.exports = function(app) {
    app.use('/', indexRouter);
    app.use('/gr', getrichRouter);
};