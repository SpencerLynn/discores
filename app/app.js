var express = require('express'),
    courses = require('./routes/courses.js'),
    scores = require('./routes/scores.js'),
    players = require('./routes/players.js'),
    bodyParser = require('body-parser');

var app = express();
app.use(express.static('public'));
app.use('/bower_components', express.static('bower_components'));
app.use(bodyParser.json());
app.use('/api/courses', courses);
app.use('/api/scores', scores);
app.use('/api/players', players);

module.exports = app;
