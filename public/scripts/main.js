angular.module('gutCheck', ['ngRoute'])
.config(function ($routeProvider) {
    $routeProvider.when('/new', {
        templateUrl: 'views/new.html'
    })
    .when('/factors', {
        templateUrl: 'views/factors.html'
    })
    .otherwise({
        templateUrl: 'views/splash.html'
    });
})
.factory('dataSvc', function () {
    var _pageTitle = '';
    
    return {
        get pageTitle() { return _pageTitle; },
        set pageTitle(t) {
            if (angular.isString(t)) {
                _pageTitle = t;
            }
        }
    };
})
.controller('mainCtrl', function ($location, dataSvc) {
    var mainCtrl = this;

    mainCtrl.getPageTitle = dataSvc.__lookupGetter__('pageTitle');
    
    mainCtrl.isOnSplash = function () {
        return $location.path() === "";
    }

    mainCtrl.getBackUrl = function () {
        switch ($location.path()) {
            case '/new': return '#';
            case '/factors': return '#/new';
            default: return '#';
        }
    }
})
.controller('splashCtrl', function ($location, dataSvc) {
    var splashCtrl = this;

    dataSvc.pageTitle = 'DILEMMA';

    splashCtrl.goNext = function () {
        $location.path('/new');
    }
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