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
.factory('dataSvc', function () {
    var _pageTitle = ''
    
    return {
        get pageTitle() { return _pageTitle; },
        set pageTitle(t) {
            if (t === null || typeof (t) === 'string') {
                _pageTitle = t;
            }
        }
    };
})
.controller('mainCtrl', function ($location, dataSvc) {
    var mainCtrl = this;

    mainCtrl.pageTitle = dataSvc.__lookupGetter__('pageTitle');
    
    mainCtrl.onSplash = function () {
        return $location.path() === "";
    }
})
.controller('splashCtrl', function (dataSvc) {
    dataSvc.pageTitle = 'DILEMMA';
})
.controller('newCtrl', function ($location, dataSvc) {
    var newCtrl = this;

    dataSvc.pageTitle = 'NEW';

    newCtrl.showNewQueryError = function () {
        return newCtrl.newForm.query.$error.required && (newCtrl.newForm.$submitted || newCtrl.newForm.query.$dirty);
    };
    
    newCtrl.submitNewQuery = function () {
        if (newCtrl.newForm.$valid) {
            $location.path('/factors');
        }
    }
})
.controller('factorsCtrl', function (dataSvc) {
    dataSvc.pageTitle = 'FACTORS';
});