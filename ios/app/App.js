var app = angular.module("aufmschoolbliz", ["ionic", "controllers", "services", "constants"]);
angular.module("controllers", []);
angular.module("services", []);
angular.module("constants", []);
app.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }
    });
});

app.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {

    $httpProvider.defaults.useXDomain = true;
    //Remove text on back button
    $ionicConfigProvider.backButton.previousTitleText(false).text("&emsp;&emsp;");
    $httpProvider.defaults.withCredentials = true;
    //Setting angularjs' $http to behave as url encoded parameters and request instead of JSON
    $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=utf-8";

    var param = function (obj) {
        var query = "", name, value, fullSubName, subName, subValue, innerObj, i;

        for (name in obj) {
            value = obj[name];

            if (value instanceof Array) {
                for (i = 0; i < value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if (value instanceof Object) {
                for (subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if (value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    };

    $httpProvider.defaults.transformRequest = [function (data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];

    //$httpProvider.defaults.withCredentials = true;
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    $stateProvider

        // setup an abstract state for the tabs directive
        .state('tab', {
            url: '/tab',
            abstract: true,
            templateUrl: 'app/tabs.html'
        })

        // Each tab has its own nav history stack:

        .state('tab.dashboard', {
            url: '/dashboard',
            views: {
                'tab-dashboard': {
                    templateUrl: 'app/components/dashboard/tab-dashboard.html',
                    controller: 'DashboardCtrl'
                }
            }
        })

        .state('tab.gradebook', {
            url: '/gradebook',
            views: {
                'tab-gradebook': {
                    templateUrl: 'app/components/gradebook/tab-gradebook.html',
                    controller: 'GradebookCtrl'
                }
            }
        })
        .state('tab.accounts', {
            url: '/accounts',
            views: {
                'tab-accounts': {
                    templateUrl: 'app/components/accounts/tab-accounts.html',
                    controller: 'AccountsCtrl'
                }
            }
        })
        .state('tab.settings', {
            url: '/settings',
            views: {
                'tab-settings': {
                    templateUrl: 'app/components/settings/tab-settings.html',
                    controller: 'SettingsCtrl'
                }
            }
        })
        .state('main', {
            url: '/',
            templateUrl: 'app/components/main/main.html',
            controller: 'MainCtrl'

        });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/');

});
