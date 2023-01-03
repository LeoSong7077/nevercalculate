module.exports = function(app) {
    app.use(function(err, req, res, next) {
        console.error('error:', err);
    });
}