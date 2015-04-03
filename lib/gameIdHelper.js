var crypto = require('crypto');
var _ = require('underscore');

module.exports = {
  createGameId: function(course, players) {
    var courseName = course.name;
    var playersNames = _.pluck(players, 'name').sort().join(',');
    var timeInMs = Date.now();

    var md5 = crypto.createHash('md5');
    md5.update([courseName, playersNames, timeInMs].join(':'));
    var hashName = md5.digest('hex');

    return hashName;
  }
};
