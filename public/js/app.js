var lottoApp = angular.module('lottoLoteryApp', ['homeController','ngMdIcons','angularUtils.directives.dirPagination']);
 
lottoApp .config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/home', {
        templateUrl: 'templates/home.html',
     	controller: 'homeController'
      }).
      
      when('/how_it_work', {
        templateUrl: 'templates/how_it_work.html',
      controller: 'homeController'
      }).
      when('/house_winning', {
        templateUrl: 'templates/house_winning.html',
      controller: 'homeController'
      }).
      when('/drawing', {
        templateUrl: 'templates/drawing.html',
      controller: 'homeController'
      }).
      when('/pricing', {
        templateUrl: 'templates/pricing.html',
      controller: 'homeController'
      }).
      when('/result', {
        templateUrl: 'templates/result.html',
      controller: 'homeController'
      }).
      when('/stats', {
        templateUrl: 'templates/stats.html',
      controller: 'homeController'
      }).
      when('/video', {
        templateUrl: 'templates/video.html',
      controller: 'homeController'
      }).
      when('/about_us', {
        templateUrl: 'templates/about_us.html',
      controller: 'homeController'
      }).
      when('/affliates', {
        templateUrl: 'templates/affliates.html',
      controller: 'affliatesController'
      }).
      when('/contact_us', {
        templateUrl: 'templates/contact_us.html',
      controller: 'contactUsController'
      }).
      when('/legal', {
        templateUrl: 'templates/legal.html',
      controller: 'homeController'
      }).
      otherwise({
        redirectTo: '/home'
      });
  }]);