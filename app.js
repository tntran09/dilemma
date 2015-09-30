var express = require('express');
var path = require('path');
var debug = require('debug')('Dilemma.Web');

//var routes = require('./routes/index');
//var users = require('./routes/users');

var app = express();
app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    console.log('i should log a debug message');
    debug('Express server listening on port ' + server.address().port);
});

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

//app.use('/', routes);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});




module.exports = app;
