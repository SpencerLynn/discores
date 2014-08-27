var express = require('express'),
    courses = require('./routes/courses.js');

var app = express();
app.use('/courses', courses);

module.exports = app;
