angular.module('gutCheck', ['ngRoute'])
    .config(function ($routeProvider) {
    $routeProvider.when('/new', {
        templateUrl: '/views/new.html'
    })
                .when('/factors', {
        templateUrl: '/views/factors.html'
    })
                .otherwise({
        templateUrl: '/views/splash.html'
    });
})
    .controller('mainCtrl', function ($scope, $location) {
    $scope.hello = 'world';
    
    $scope.onSplash = function () {
        return $location.path() === "";
    }
});