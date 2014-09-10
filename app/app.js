var express = require('express'),
    courses = require('./routes/courses.js'),
    scores = require('./routes/scores.js'),
    players = require('./routes/players.js'),
    bodyParser = require('body-parser');

var app = express();
app.use(express.static('public'));
app.use(bodyParser.json());
app.use('/courses', courses);
app.use('/scores', scores);
app.use('/players', players);

module.exports = app;
