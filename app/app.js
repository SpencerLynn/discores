var express = require('express'),
    courses = require('./routes/courses.js'),
    scores = require('./routes/scores.js'),
    bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use('/courses', courses);
app.use('/scores', scores);

module.exports = app;
