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
.controller('mainCtrl', function ($scope, $location, $rootScope) {
    $scope.dilemma = {
        query: '',
        factors: []
    };
    
    $scope.onSplash = function () {
        return $location.path() === "";
    }
})
.controller('splashCtrl', function ($scope, $rootScope) {
    $rootScope.pageTitle = 'DILEMMA';
})
.controller('newCtrl', function ($scope, $rootScope, $location) {
    var newCtrl = this;
    var attemptedSubmission = false;

    $rootScope.pageTitle = 'NEW';

    newCtrl.showNewQueryError = function () {
        return newCtrl.newForm.query.$error.required && (attemptedSubmission || newCtrl.newForm.query.$dirty);
    };
    
    newCtrl.submitNewQuery = function () {
        attemptedSubmission = true;
        
        if (newCtrl.newForm.$valid) {
            $location.path('/factors');
        }
    }
})
.controller('factorsCtrl', function ($scope, $rootScope) {
    $rootScope.pageTitle = 'FACTORS';
});