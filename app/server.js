var express = require('express'),
    courses = require('./routes/courses.js'),
    scores = require('./routes/scores.js');

var app = express();
app.use('/courses', courses);
app.use('/scores', scores);

module.exports = app;
