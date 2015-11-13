var app = angular.module("services");

app.factory("Utils", function () {
    return {
        getDefaultYear: function () {
            var currentTime = new Date();
            var year = currentTime.getFullYear();
            var month = currentTime.getMonth() + 1;
            return month >= 6 ? year : year - 1;
        }, semNameToNumber: function (semName) {
            var semNumber = "";
            if (semName == "1st Semester") {
                semNumber = "1";
            } else if (semName == "2nd Semester") {
                semNumber = "2";
            } else if (semName == "3rd Semester") {
                semNumber = "3";
            } else if (semName == "Summer") {
                semNumber = "0";
            }
            return semNumber;
        }, contains: function (toProcess, valueToCheck) {
            return toProcess.indexOf(valueToCheck) > -1
        }
    }
});

app.factory('$localstorage', function($window) {
        return {
            set: function(key, value) {
                $window.localStorage[key] = value;
            },
            get: function(key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function(key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function(key) {
                return JSON.parse($window.localStorage[key] || '{}');
            }, remove: function(key){
                $window.localStorage.removeItem(key);
            }
        }
    });
