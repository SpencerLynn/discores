(function() {
  'use strict';
  
  angular.module('discores').directive('select', materialSelect);
  
  materialSelect.$inject = ['$timeout'];
  
  function materialSelect($timeout) {
    return {
	    restrict: 'E',
	    require: 'ngModel',
      priority: 1,
      link: function(scope, element, attrs, ngModel) {
        $timeout(function() {
          element.material_select();
	      });
	  
	      element.one('$destroy', function () {
          element.material_select('destroy');
        });
      }
    };
  }
})();