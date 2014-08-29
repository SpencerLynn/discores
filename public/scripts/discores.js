(function() {
  var app = angular.module('discores', ['ngRoute']);

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({
      templateUrl: '/views/courses.html',
      controller: 'CourseCtrl',
      controllerAs: 'courseCtrl'
    });
  }]);

  app.controller('CourseCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
    var self = this;

    self.courses = [];

    self.newName = '';

    self.save = function() {
      if (!self.newName) return;
      
      var courseToSave = { 'name': self.newName };
      $http.post('/courses', courseToSave)
        .success(function() {
          self.courses.push(courseToSave);
        })
        .error(function() {
          alert("OH NOES!");
        });
    };

    $http.get('/courses')
      .success(function(data) {
        self.courses.length = 0;
        data.forEach(function(c) {
          self.courses.push(c);
        });
      });
  }]);
})();
