module.exports = function (app) {
    // open server
    const port = process.env.SERVER_PORT;
    const server = app.listen(port, function() {
        console.log(`listening on ${port}`); 
    });
}