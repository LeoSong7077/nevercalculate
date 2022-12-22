module.exports = function(app) {
    app.use(function(err, req, res, next) {
        console.error('error:', err);

        // res.status(500).send('Something broke!');
        // res.render('error.ejs');
    });
}