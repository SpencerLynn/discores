(function() {
  var app = angular.module('discores', ['ngRoute']);

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/courses', {
        templateUrl: '/views/courses.html',
        controller: 'CourseCtrl',
        controllerAs: 'courseCtrl'
      })
      .when('/players/:playerId/games', {
        templateUrl:'views/player-games.html',
        controller: 'PlayerGamesCtrl',
        controllerAs: 'playerGamesCtrl'
      })
      .when('/players', {
        templateUrl: '/views/players.html',
        controller: 'PlayerCtrl',
        controllerAs: 'playerCtrl'
      })
      .when('/game/results/:gameId', {
        templateUrl: 'views/game-results.html',
        controller: 'ResultsCtrl',
        controllerAs: 'resultsCtrl'
      })
      .when('/game/:gameId/:holeNumber', {
        templateUrl: 'views/play-game.html',
        controller: 'PlayCtrl',
        controllerAs: 'playCtrl'
      })
      .when('/game', {
        templateUrl: '/views/create-game.html',
        controller: 'GameCtrl',
        controllerAs: 'gameCtrl'
      })
      .otherwise({
        redirectTo: '/game'
      });
  }]);

  app.controller('ResultsCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
    var self = this;
    self.game = null;
    self.holes = [];
    self.playersScores = [];

    $http.get('/api/game/' + $routeParams.gameId)
      .success(function(g) {
        self.game = g;

        for (var i = 0; i < self.game.course.numberOfHoles; i++) {
          self.holes.push(i + 1);
        }

        self.game.players.forEach(function(p) {
          var sum = self.game.scores[p.id].reduce(function(sum, h) {
            sum += h;
            return sum;
          }, 0);

          var result = '';
          if (sum === self.game.course.par) {
            result = 'E';
          } else {
            result = 0 - (self.game.course.par - sum);
          }

          self.playersScores.push({
            'name': p.name,
            'scores': self.game.scores[p.id],
            'result': result
          })
        });
      });
  }]);

  app.controller('PlayCtrl', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location) {
    var self = this;

    self.game = null;
    self.holeNumber = $routeParams.holeNumber;
    self.holeScores = {};

    self.nextHole = function() {
      if (self.holeNumber < 1) {
        alert('Oh no! Invalid URL. Current hole is less than 1. Go Go Hole 1.');
        $location.path('/game/' + self.game.id + '/' + 1);
      }

      // Save the current hole
      self.game.players.forEach(function(p) {
        self.game.scores[p.id][self.holeNumber-1] = self.holeScores[p.id];
      });

      $http.post('/api/game/update', self.game)
        .success(function(game) {
          self.holeNumber++;
          if (self.holeNumber > self.game.course.numberOfHoles) {
            $location.path('/game/results/' + game.id + '/');
          } else {
            $location.path('/game/' + game.id + '/' + self.holeNumber);
          }
        })
        .error(function(e) {
          alert('Uh oh! Error moving to next hole :(');
        });
    };

    $http.get('/api/game/' + $routeParams.gameId)
      .success(function(g) {
        self.game = g;

        self.game.players.forEach(function(p) {
          self.holeScores[p.id] = self.game.scores[p.id][self.holeNumber-1] || 0;
        });
      });
  }]);

  app.controller('PlayerGamesCtrl', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
    var self = this;

    self.games = [];
    self.playerId = $routeParams.playerId;
    self.playerNameLabel = null;

    $http.get('/api/players/' + self.playerId)
      .success(function(data) {
        self.playerNameLabel = data.name + "'s Games";
      });

    $http.get('/api/players/' + self.playerId + '/games/')
      .success(function(data) {
        self.games = data.map(function(g) {
          var sum = g.scores[self.playerId].reduce(function(sum, h) {
            sum += h;
            return sum;
          }, 0);
          g.myResult = 0 - (g.course.par - sum);
          return g;
        });
      });

  }]);

  app.controller('GameCtrl', ['$scope', '$http', '$routeParams', '$location', function ($scope, $http, $routeParams, $location) {
    var self = this;

    $scope.$parent.tab = 0;

    self.allCourses = [];
    self.allPlayers = [];
    self.selectedCourse = null;
    self.selectedPlayers = [];
    self.newPlayer = null;

    self.startGame = function() {
      if (!self.selectedPlayers.length || !self.selectedCourse) {
        return;
      }

      var courseName = self.selectedCourse.name;
      var playersNames = _.pluck(self.selectedPlayers, 'name').join(',');
      console.log('Starting game at ' + courseName + ' with ' + playersNames);

      // Begin the game and change the view
      var newGame = {
        course: self.selectedCourse,
        players: self.selectedPlayers
      };

      $http.post('/api/game', newGame)
        .success(function(game) {
          // Change window location
          $location.path('/game/' + game.id + '/' + 1);
        })
        .error(function(e) {
          alert('Whoops! Error beginning game');
        });
    };

    self.addPlayer = function() {
      for (var i = 0; i < self.selectedPlayers.length; i++) {
        if (self.selectedPlayers[i].id === self.newPlayer.id) {
          alert('Player already added');
          return;
        }
      }

      self.selectedPlayers.push(self.newPlayer);
      self.newPlayer = null;
    }

    self.removePlayer = function(player) {
      if (!player) return;

      self.selectedPlayers = self.selectedPlayers.filter(function(p) {
        return p.id !== player.id;
      });
    }

    $http.get('/api/players')
      .success(function(data) {
        self.allPlayers.length = 0;
        data.forEach(function(p) {
          self.allPlayers.push(p);
        });
      });

    $http.get('/api/courses')
      .success(function(data) {
        self.allCourses.length = 0;
        data.forEach(function(c) {
          self.allCourses.push(c);
        });
      });
  }]);

  app.controller('CourseCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
    var self = this;

    $scope.$parent.tab = 1;

    self.courses = [];

    self.newName = '';
    self.newPar = '';
    self.newNumberOfHoles = '';

    self.save = function() {
      if (!self.newName || self.newPar < 1 || self.newNumberOfHoles < 1) {
        return;
      }

      var courseToSave = {
        'name': self.newName,
        'par': self.newPar,
        'numberOfHoles': self.newNumberOfHoles
      };

      $http.post('/api/courses', courseToSave)
        .success(function() {
          self.courses.push(courseToSave);
        })
        .error(function(e) {
          alert('OH NOES!');
        });
    };

    $http.get('/api/courses')
      .success(function(data) {
        self.courses.length = 0;
        data.forEach(function(c) {
          self.courses.push(c);
        });
      });
  }]);

  app.controller('PlayerCtrl', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
    var self = this;

    $scope.$parent.tab = 2;

    self.players = [];

    self.newPlayerName = '';

    self.save = function() {
      if (!self.newPlayerName) return;

      var playerToSave = { 'name': self.newPlayerName };
      $http.post('/api/players', playerToSave)
        .success(function() {
          self.players.push(playerToSave);
        })
        .error(function(e) {
          alert('OH NOES - Something went wrong');
        });

      self.newPlayerName = '';
    };

    $http.get('/api/players')
      .success(function(data) {
        self.players.length = 0;
        data.forEach(function(p) {
          self.players.push(p);
        });
      });
  }]);
})();
