var express = require('express'),
    courses = require('./routes/courses.js'),
    game = require('./routes/game.js'),
    players = require('./routes/players.js'),
    bodyParser = require('body-parser');

var app = express();
app.use(express.static('public'));
app.use(bodyParser.json());
app.use('/api/courses', courses);
app.use('/api/game', game);
app.use('/api/players', players);

module.exports = app;
