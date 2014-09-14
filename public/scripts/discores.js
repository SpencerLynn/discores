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
      .otherwise({
        template: 'NOOOOO!'
      });
      //.otherwise({ redirectTo: '/courses' });
  }]);

  app.controller('CourseCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
    var self = this;

    self.courses = [];

    self.newName = '';

    self.save = function() {
      if (!self.newName) return;

      var courseToSave = { 'name': self.newName };
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
    $http.get('/api/scores')
      .success(function(data) {
      });
  }]);
})();
