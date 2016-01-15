angular.module('gutCheck', ['ngRoute'])
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
    var _query = '';
    var _choices = [];
    var _factors = [];

    return {
        get pageTitle() { return _pageTitle; },
        set pageTitle(str) {
            if (angular.isString(str)) {
                _pageTitle = str;
            }
        },
        
        get query() { return _query; },
        set query(str) {
            if (angular.isString(str)) {
                _query = str;
            }
        },
        
        get choices() { return angular.copy(_choices); },
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
        set backFnOverride(fn) { _goBackOverride = fn; },

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
        set nextFnOverride(fn) { _goNextOverride = fn; }
    }
})
.controller('mainCtrl', function ($location, dataSvc, navigatorSvc) {
    var mainCtrl = this;

    mainCtrl.getPageTitle = Object.getOwnPropertyDescriptor(dataSvc, 'pageTitle').get;
    mainCtrl.getBackFn = Object.getOwnPropertyDescriptor(navigatorSvc, 'getBackFn').get;
    mainCtrl.getNextFn = Object.getOwnPropertyDescriptor(navigatorSvc, 'getNextFn').get;

    mainCtrl.isOnSplash = function () {
        return $location.path() === "" || $location.path() === "/";
    }
    
    mainCtrl.isOnVerdict = function () {
        return $location.path() === "/verdict";
    }
})
.controller('splashCtrl', function (dataSvc, navigatorSvc) {
    var splashCtrl = this;

    dataSvc.pageTitle = 'DILEMMA';
    navigatorSvc.backFnOverride = null;
    navigatorSvc.nextFnOverride = null;

    splashCtrl.goNext = navigatorSvc.getNextFn;
})
.controller('newCtrl', function ($location, dataSvc, navigatorSvc) {
    var newCtrl = this;

    dataSvc.pageTitle = 'DILEMMA';
    navigatorSvc.backFnOverride = null;
    navigatorSvc.nextFnOverride = function () {
        newCtrl.newForm.$setSubmitted();

        if (newCtrl.newForm.$valid) {
            dataSvc.query = newCtrl.query;
            $location.path('/choices');
        }
    };

    newCtrl.goNext = navigatorSvc.getNextFn;
    
    newCtrl.query = dataSvc.query;
    newCtrl.examples = [
        'What toppings should I get on my pizza?',
        'Where should I have my midlife crisis?',
        'Where should I move to?'
    ];
    
    newCtrl.showNewQueryError = function () {
        return newCtrl.newForm.query.$error.required && (newCtrl.newForm.$submitted || newCtrl.newForm.query.$dirty);
    };

    newCtrl.autoFillQuery = function (example) {
        newCtrl.query = example
    }
})
.controller('choicesCtrl', function ($location, dataSvc, navigatorSvc) {
    var choicesCtrl = this;
    var _attemptedNext = false;

    dataSvc.pageTitle = 'CHOICES';
    navigatorSvc.backFnOverride = function () {
        dataSvc.choices = choicesCtrl.choices;
        $location.path('/new');
    };
    navigatorSvc.nextFnOverride = function () {
        _attemptedNext = true;

        if (choicesCtrl.choices.length >= 2) {
            $location.path('/factors');
        }
    };
    
    choicesCtrl.choices = dataSvc.choices;
    choicesCtrl.newChoice = '';
    
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
                dataSvc.choices = choicesCtrl.choices;
            }
            else {
                // duplicate choice
                $('input[name=choice]').focus();
            }
        }
    };
    choicesCtrl.deleteChoice = function (index) {
        var temp = choicesCtrl.choices;
        choicesCtrl.choices = []
            .concat(temp.splice(0, index))
            .concat(temp.splice(1));
    }
})
.controller('factorsCtrl', function ($location, dataSvc, navigatorSvc) {
    var factorsCtrl = this;
    
    dataSvc.pageTitle = 'FACTORS';
    navigatorSvc.backFnOverride = null;
    navigatorSvc.nextFnOverride = function () {
        // if factorsCtrl.factors.length > 0
        $location.path('/verdict');
    };

    factorsCtrl.goNext = navigatorSvc.getNextFn;

    var factorId = 1;
    var editIndex = 0;
    
    factorsCtrl.query = dataSvc.query;
    factorsCtrl.choices = dataSvc.choices;
    factorsCtrl.factors = dataSvc.factors;
    factorsCtrl.activeFactor = {
        id: 1,
        selectedChoice: 0,
        factorText: '',
        emotionalGrade: 50,
        importanceGrade: 50
    };
    factorsCtrl.modalSubmitAction = 'Add';
    
    // TODO: remove bootstrap slider in favor of doing carousel or something else
    var emotionalGradeSlider = new Slider('input#emotionalGrade', {
        id: 'emotionalGrade',
        min: 0,
        max: 100,
        step: 1,
        value: 50,
        selection: 'before',
        tooltip: 'show',
        tooltip_position: 'bottom',
        handle: 'round'
    }).on('slideStop', function (value) {
        factorsCtrl.activeFactor.emotionalGrade = value;
    });
    var importanceGradeSlider = new Slider('input#importanceGrade', {
        id: 'importanceGrade',
        min: 0,
        max: 100,
        step: 1,
        value: 50,
        selection: 'before',
        tooltip: 'show',
        tooltip_position: 'bottom',
        handle: 'round'
    }).on('slideStop', function (value) {
        factorsCtrl.activeFactor.importanceGrade = value;
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
                selectedChoice: 0,
                factorText: '',
                emotionalGrade: 50,
                importanceGrade: 50
            };
            emotionalGradeSlider.setValue(50);
            importanceGradeSlider.setValue(50);
            dataSvc.factors = factorsCtrl.factors;
            
            $('#factorModal').modal('hide');
        }
    };
    
    factorsCtrl.popupAdd = function () {
        factorsCtrl.modalSubmitAction = 'Add';
        
        factorsCtrl.activeFactor = {
            id: factorId,
            selectedChoice: 0,
            factorText: '',
            emotionalGrade: 50,
            importanceGrade: 50
        };
        emotionalGradeSlider.setValue(50);
        importanceGradeSlider.setValue(50);
        
        $('#factorModal').modal('show');
    };
    
    factorsCtrl.popupEdit = function (factor) {
        factorsCtrl.modalSubmitAction = 'Edit';
        
        editIndex = factorsCtrl.factors.indexOf(factor);
        factorsCtrl.activeFactor = angular.copy(factor);
        emotionalGradeSlider.setValue(factorsCtrl.activeFactor.emotionalGrade);
        importanceGradeSlider.setValue(factorsCtrl.activeFactor.importanceGrade);
        
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
