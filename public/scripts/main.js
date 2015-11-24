angular.module('gutCheck', ['ngRoute', 'ui.bootstrap'])
.config(function ($routeProvider) {
    $routeProvider.when('/new', {
        templateUrl: 'views/new.html'
    })
    .when('/factors', {
        templateUrl: 'views/factors.html'
    })
    .when('/verdict', {
        templateUrl: 'views/verdict.html'
    })
    .otherwise({
        templateUrl: 'views/splash.html'
    });
})
.factory('dataSvc', function () {
    var _pageTitle = '';
    var _factors = [];

    return {
        get pageTitle() { return _pageTitle; },
        set pageTitle(str) {
            if (angular.isString(str)) {
                _pageTitle = str;
            }
        },

        get factors() { return angular.copy(_factors); },
        set factors(arr) {
            if (angular.isArray(arr)) {
                _factors = angular.copy(arr);
            }
        }
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
    
    mainCtrl.isOnNew = function () {
        return $location.path() === "/new";
    }

    mainCtrl.getBackUrl = function () {
        switch ($location.path()) {
            case '/new': return '#';
            case '/factors': return '#/new';
            case '/verdict': return '#/factors';
            default: return '#';
        }
    }

    mainCtrl.getNextUrl = function () {
        switch ($location.path()) {
            case '/new': return '#/factors';
            case '/factors': return '#/verdict';
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
.controller('factorsCtrl', function ($location, dataSvc) {
    var factorsCtrl = this;

    var factorId = 1;
    var editIndex = 0;

    factorsCtrl.factors = dataSvc.factors;
    factorsCtrl.activeFactor = {
        id: 1,
        procon: 'Pro',
        factorText: '',
        grade: 50
    };
    factorsCtrl.modalSubmitAction = 'Add';

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
        factorsCtrl.activeFactor.grade = value;
    });

    factorsCtrl.save = function () {
        if (factorsCtrl.factorForm.$valid) {
            switch (factorsCtrl.modalSubmitAction) {
                case 'Add':
                    factorsCtrl.factors.push(factorsCtrl.activeFactor);
                    factorId++;
                    break;
                case 'Edit':
                    factorsCtrl.factors[editIndex] = angular.copy(factorsCtrl.activeFactor);
                    editIndex = 0;
                    break;
            }

            factorsCtrl.activeFactor = {
                id: factorId,
                procon: 'Pro',
                factorText: '',
                grade: 50
            };
            gradeSlider.setValue(50);

            $('#factorModal').modal('hide');
        }
    };

    factorsCtrl.popupAdd = function () {
        factorsCtrl.modalSubmitAction = 'Add';

        factorsCtrl.activeFactor = {
            id: factorId,
            procon: 'Pro',
            factorText: '',
            grade: 50
        };
        gradeSlider.setValue(50);

        $('#factorModal').modal('show');
    }

    factorsCtrl.popupEdit = function (factor) {
        factorsCtrl.modalSubmitAction = 'Edit';

        editIndex = factorsCtrl.factors.indexOf(factor);
        factorsCtrl.activeFactor = angular.copy(factor);
        gradeSlider.setValue(factorsCtrl.activeFactor.grade);

        $('#factorModal').modal('show');
    }

    factorsCtrl.goNext = function () {
        dataSvc.factors = factorsCtrl.factors;

        $location.path('/verdict');
    }

    $('#factorModal').on('shown.bs.modal', function () {
        $('input[name=factorText]').focus();
    })
})
.controller('verdictCtrl', function (dataSvc) {
    var verdictCtrl = this;

    dataSvc.pageTitle = 'VERDICT';
});
