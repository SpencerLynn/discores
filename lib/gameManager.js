var Q = require('q');
var _ = require('lodash');
var gameIdHelper = require('./gameIdHelper.js');
var blobServiceHelper = require('./blobServiceHelper.js');

module.exports = function(blobService) {
  var self = {
    self: this,
    blobService: blobService,
    getGame: function(gameId) {
      var d = Q.defer();

      try {
        blobService.getBlobToText('scores', gameId, function(err, results) {
          if (err) {
            throw err;
          }
          d.resolve(JSON.parse(results));
        });
      } catch(e) {
        d.reject(e);
      }

      return d.promise;
    },
    updateGame: function(game) {
      var d = Q.defer();

      try {
        blobService.createBlockBlobFromText('scores', game.id, JSON.stringify(game), function(err, result, response) {
          if (err) {
            d.reject(err);
          } else {
            d.resolve(game);
          }
        });
      } catch(e) {
        d.reject(e);
      }

      return d.promise;
    },

    addGameToPlayer: function(gameId, playerId) {
      try {
        blobServiceHelper.acquireLease(blobService, 'players', playerId)
          .then(function(leaseId) {
            blobService.getBlobToText('players', playerId, function(err, results) {
              try {
                var games = JSON.parse(results);
                var contains = _.contains(games, function(gId) {
                  return gId == gameId;
                });

                if (!contains) {
                  games.push(gameId);
                  blobService.createBlockBlobFromText('players', playerId, JSON.stringify(games), function(err, result, resp) {
                    if (err) {
                      throw err;
                    }
                  });
                }
              } catch(e) {
                throw e;
              } finally {
                blobService.releaseLease('players', playerId, leaseId, function () {});
              }
            });
          });
      } catch(e) {
        // Do nothing. Player just won't be able to see this game in their history
        console.log(e);
      }
    },

    startGame: function(game) {
      var d = Q.defer();

      try {
        var timeInMs = Date.now();

        game.id = gameIdHelper.createGameId(game.course, game.players, timeInMs);
        game.date = new Date(timeInMs).toGMTString();
        game.scores = {};
        game.players.forEach(function(p) {
          game.scores[p.id] = [];
          game.scores[p.id].length = game.course.numberOfHoles;
        });

        blobServiceHelper.acquireLease(blobService, 'scores', 'gameIndex')
          .then(function(leaseId) {
            blobService.getBlobToText('scores', 'gameIndex', function(err, results) {
              try {
                var games = JSON.parse(results);
                var contains = _.contains(games, function(gId) {
                  return gId === game.id;
                });

                if (!contains) {
                  games.push(game.id);
                  blobService.createBlockBlobFromText('scores', 'gameIndex', JSON.stringify(games), function(err, result, response) {
                    if (err) {
                      throw err;
                    }
                  });
                }
              } catch(e) {
                throw e;
              } finally {
                blobService.releaseLease('scores', 'gameIndex', leaseId, function () {});
              }
            });

            var addGamesToPlayers = game.players.map(function(p) {
              return self.addGameToPlayer(game.id, p.id);
            });

            Q.all(addGamesToPlayers).then(function() {
              blobService.createBlockBlobFromText('scores', game.id, JSON.stringify(game), function(err, result, response) {
                if (err) {
                  d.reject(err);
                } else {
                  d.resolve(game);
                }
              });
            });
          });
      } catch(e) {
        d.reject(e);
      }

      return d.promise;
    }
  };

  return self;
};
