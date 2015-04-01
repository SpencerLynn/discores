(function() {
  var app = angular.module('discores', ['ngRoute']);

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/courses', {
        templateUrl: '/views/courses.html',
        controller: 'CourseCtrl',
        controllerAs: 'courseCtrl'
      })
      .when('/players', {
        templateUrl: '/views/players.html',
        controller: 'PlayerCtrl',
        controllerAs: 'playerCtrl'
      })
      .when('/scores', {
        templateUrl: '/views/scores.html',
        controller: 'ScoreCtrl',
        controllerAs: 'scoreCtrl'
      })
      // .otherwise({
      //   template: 'NOOOOO!'
      // });
      .otherwise({
        redirectTo: '/courses'
      });
  }]);

  app.controller('CourseCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
    var self = this;

    $scope.$parent.tab = 0;

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

    $scope.$parent.tab = 1;

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

  app.controller('ScoreCtrl', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
    var self = this;

    $scope.$parent.tab = 2;

    self.allCourses = [];
    self.allPlayers = [];
    self.selectedCourse = null;
    self.selectedPlayers = [];
    self.newPlayer = null;

    self.startGame = function() {
      if (self.selectedPlayers.length && self.selectedCourse) {
        var courseName = self.selectedCourse.name;
        var playersNames = self.selectedPlayers.map(function(p) { return p.name; }).join(',');
        alert('Starting game at ' + courseName + ' with ' + playersNames);
      }
    };

    self.addPlayer = function() {
      for (var i = 0; i < self.selectedPlayers.length; i++) {
        if (self.selectedPlayers[i].name === self.newPlayer.name) {
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
        return p.name !== player.name;
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
})();
