angular.module('gutCheck', ['ngRoute', 'ui.bootstrap'])
.config(function ($routeProvider) {
    $routeProvider.when('/new', {
        templateUrl: 'views/new.html'
    })
    .when('/choices', {
        templateUrl: 'views/choices.html'
    })
    .when('/factors', {
        templateUrl: 'views/factors.html'
    })
    .when('/verdict', {
        templateUrl: 'views/verdict.html'
    })
    .when('/', {
        templateUrl: 'views/splash.html'
    })
    .otherwise({
        templateUrl: 'views/splash.html'
    });
})
.factory('dataSvc', function () {
    var _pageTitle = '';
    var _choices = [];
    var _factors = [];

    return {
        get pageTitle() { return _pageTitle; },
        set pageTitle(str) {
            if (angular.isString(str)) {
                _pageTitle = str;
            }
        },
        
        get choices() { return _choices; },
        set choices(arr) {
            if (angular.isArray(arr)) {
                _choices = angular.copy(arr);
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
.factory('navigatorSvc', function ($location) {
    var _goBackOverride = null;
    var _goNextOverride = null;

    return {
        // TODO: remove if back function is never overridden
        get getBackFn() {
            return _goBackOverride || function () {
                var path = '';
                
                switch ($location.path()) {
                    case '/new': path = '/'; break;
                    case '/choices': path = '/new'; break;
                    case '/factors': path = '/choices'; break;
                    case '/verdict': path = '/factors'; break;
                    default: path = '/';
                }
                
                $location.path(path);
            }
        },
        // TODO: change name to clarify write-only variable
        set getBackFn(fn) { _goBackOverride = fn; },

        get getNextFn() {
            return _goNextOverride || function () {
                var path = '';
                
                switch ($location.path()) {
                    case '/': path = '/new'; break;
                    case '/new': path = '/choices'; break;
                    case '/choices': path = '/factors'; break;
                    case '/factors': path = '/verdict'; break;
                    default: path = '/';
                }
                
                $location.path(path);
            }
        },
        // TODO: change name
        set getNextFn(fn) { _goNextOverride = fn; }
    }
})
.controller('mainCtrl', function ($location, dataSvc, navigatorSvc) {
    var mainCtrl = this;

    mainCtrl.dilemma = {
        query: ''
    };

    mainCtrl.getPageTitle = Object.getOwnPropertyDescriptor(dataSvc, 'pageTitle').get;

    mainCtrl.isOnSplash = function () {
        return $location.path() === "" || $location.path() === "/";
    }
    
    mainCtrl.isOnVerdict = function () {
        return $location.path() === "/verdict";
    }
    
    mainCtrl.getBackFn = Object.getOwnPropertyDescriptor(navigatorSvc, 'getBackFn').get;
    mainCtrl.getNextFn = Object.getOwnPropertyDescriptor(navigatorSvc, 'getNextFn').get;
})
.controller('splashCtrl', function (dataSvc, navigatorSvc) {
    var splashCtrl = this;

    dataSvc.pageTitle = 'DILEMMA';
    navigatorSvc.getBackFn = null;
    navigatorSvc.getNextFn = null;

    splashCtrl.goNext = navigatorSvc.getNextFn;
})
.controller('newCtrl', function ($location, dataSvc, navigatorSvc) {
    var newCtrl = this;

    dataSvc.pageTitle = 'NEW';
    navigatorSvc.getBackFn = null;
    navigatorSvc.getNextFn = function () {
        if (newCtrl.newForm.$valid) {
            $location.path('/choices');
        }
    };

    newCtrl.goNext = navigatorSvc.getNextFn;
    
    newCtrl.showNewQueryError = function () {
        return newCtrl.newForm.query.$error.required && (newCtrl.newForm.$submitted || newCtrl.newForm.query.$dirty);
    };

    newCtrl.doSomething = function (arg) {
        console.log(arg);
    }
})
.controller('choicesCtrl', function ($location, dataSvc, navigatorSvc) {
    var choicesCtrl = this;
    var _attemptedNext = false;

    dataSvc.pageTitle = 'CHOICES';
    navigatorSvc.getBackFn = null;
    navigatorSvc.getNextFn = function () {
        _attemptedNext = true;

        if (choicesCtrl.choices.length >= 2) {
            dataSvc.choices = choicesCtrl.choices;
            $location.path('/factors');
        }
    };
    
    choicesCtrl.goNext = navigatorSvc.getNextFn;

    choicesCtrl.newChoice = '';
    choicesCtrl.choices = dataSvc.choices;
    
    choicesCtrl.showChoicesCountError = function () {
        return choicesCtrl.choices.length < 2 && _attemptedNext;
    };
    choicesCtrl.showNewChoiceError = function () {
        return choicesCtrl.newForm.choice.$error.required && (choicesCtrl.newForm.$submitted || choicesCtrl.newForm.choice.$dirty)
    };
    choicesCtrl.showDuplicateChoiceError = function () {
        return choicesCtrl.choices.indexOf(choicesCtrl.newChoice) !== -1;
    }

    choicesCtrl.addChoice = function () {
        if (choicesCtrl.newChoice.length > 0) {
            if (choicesCtrl.choices.indexOf(choicesCtrl.newChoice) === -1) {
                choicesCtrl.choices.push(choicesCtrl.newChoice);
                choicesCtrl.newChoice = '';
                choicesCtrl.newForm.$setPristine();
                $('input[name=choice]').focus();
            }
            else {
                // duplicate
                $('input[name=choice]').focus();
            }
        }
    };
    choicesCtrl.deleteChoice = function (index) {
        var temp = angular.copy(choicesCtrl.choices);
        choicesCtrl.choices = []
            .concat(temp.splice(0, index))
            .concat(temp.splice(1));
    }
})
.controller('factorsCtrl', function ($location, dataSvc, navigatorSvc) {
    var factorsCtrl = this;
    
    dataSvc.pageTitle = 'FACTORS';
    navigatorSvc.getBackFn = null;
    navigatorSvc.getNextFn = function () {
        dataSvc.factors = factorsCtrl.factors;
        $location.path('/verdict');
    };

    factorsCtrl.goNext = navigatorSvc.getNextFn;

    var factorId = 1;
    var editIndex = 0;

    factorsCtrl.factors = dataSvc.factors;
    // TODO: remove 'procon' attribute to measure things on degree of importance
    factorsCtrl.activeFactor = {
        id: 1,
        // selectedChoice
        procon: 'Pro',
        factorText: '',
        grade: 50 //emotionalGrade
        // importanceGrade
    };
    factorsCtrl.modalSubmitAction = 'Add';
    
    // TODO: remove bootstrap slider in favor of doing carousel or something else
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
            
            // TODO: copy initialization of new factor as above
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
        console.log('popup Add now:')
        factorsCtrl.modalSubmitAction = 'Add';
        
        // TODO: copy initialization of new factor as above
        factorsCtrl.activeFactor = {
            id: factorId,
            procon: 'Pro',
            factorText: '',
            grade: 50
        };
        gradeSlider.setValue(50);
        
        $('#factorModal').modal('show');
    };
    
    factorsCtrl.popupEdit = function (factor) {
        factorsCtrl.modalSubmitAction = 'Edit';
        
        editIndex = factorsCtrl.factors.indexOf(factor);
        factorsCtrl.activeFactor = angular.copy(factor);
        gradeSlider.setValue(factorsCtrl.activeFactor.grade);
        
        $('#factorModal').modal('show');
    };
    
    //$('#factorModal').on('shown.bs.modal', function () {
    //    $('input[name=factorText]').focus();
    //});
})
.controller('verdictCtrl', function (dataSvc) {
    var verdictCtrl = this;

    dataSvc.pageTitle = 'VERDICT';
});
