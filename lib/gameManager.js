var Q = require('q');
var _ = require('underscore');
var gameIdHelper = require('./gameIdHelper.js');
var blobServiceHelper = require('./blobServiceHelper.js');

module.exports = function(blobService) {
  return {
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
    startGame: function(game) {
      var d = Q.defer();

      try {
        game.id = gameIdHelper.createGameId(game.course, game.players);
        game.scores = {};
        game.players.forEach(function(p) {
          game.scores[p.name] = [];
          game.scores[p.name].length = game.course.numberOfHoles;
        });

        blobServiceHelper.acquireLease(blobService, 'scores', 'gameIndex')
          .then(function(leaseId) {
            blobService.getBlobToText('scores', 'gameIndex', function(err, results) {
              try {
                var games = JSON.parse(results);
                var contains = _.contains(games, function(gId) {
                  gId === game.id;
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

            blobService.createBlockBlobFromText('scores', game.id, JSON.stringify(game), function(err, result, response) {
              if (err) {
                d.reject(err);
              } else {
                d.resolve(game);
              }
            });
          });
      } catch(e) {
        d.reject(e);
      }

      return d.promise;
    }
  }
};
