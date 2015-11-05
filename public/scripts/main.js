angular.module('gutCheck', ['ngRoute', 'ui.bootstrap'])
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
    //var _factors = [];
    
    return {
        get pageTitle() { return _pageTitle; },
        set pageTitle(str) {
            if (angular.isString(str)) {
                _pageTitle = str;
            }
        },
        
        //get factors() { return _factors; }
    };
})
.controller('mainCtrl', function ($location, dataSvc) {
    var mainCtrl = this;
    
    mainCtrl.dilemma = {
        query: ''
    };

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
    
    newCtrl.goNext = function () {
        if (newCtrl.newForm.$valid) {
            $location.path('/factors');
        }
    };
})
.controller('factorsCtrl', function (dataSvc) {
    var factorsCtrl = this;
    
    factorsCtrl.factors = [];
    factorsCtrl.newFactor = {
        procon: 'Pro',
        factorText: '',
        grade: 50
    };

    dataSvc.pageTitle = 'FACTORS';

    var gradeSlider = new Slider('input.slider', {
        id: 'gradeSlider',
        min: 0,
        max: 100,
        step: 1,
        value: 50,
        selection: 'before',
        tooltip: 'show',
        tooltip_position: 'bottom',
        handle: 'round'
    }).on('slideStop', function (value) {
        factorsCtrl.newFactor.grade = value;
    });
    
    factorsCtrl.addNew = function () {
        if (factorsCtrl.factorForm.$valid) {
            factorsCtrl.factors.push(factorsCtrl.newFactor);

            factorsCtrl.newFactor = {
                procon: 'Pro',
                factorText: '',
                grade: 50
            };
            gradeSlider.setValue(50);

            $('#newFactorModal').modal('hide');
        }
    };

    //Calculate -> push the factors to dataSvc, operate on next controller?
});