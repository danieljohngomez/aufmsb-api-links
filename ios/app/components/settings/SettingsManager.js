var app = angular.module("controllers");

app.controller('SettingsCtrl', function ($scope, $state, WebService, $http, CONSTANTS, $localstorage, $ionicHistory, $timeout) {
    var status = $localstorage.get(CONSTANTS.EMAIL_NOTIFICATION_ENABLED, false) == "true" ? "ON" : "OFF";
    $scope.model = {
        email: $localstorage.get(CONSTANTS.STUDENT_EMAIL, ""),
        status: status
    };

    var updateAPICallback = {
        success: function () {
            var url = WebService.getLink(CONSTANTS.LINK_NOTIFY);
            var params = {
                value: $scope.model.status,
                id_number: $localstorage.get(CONSTANTS.STUDENT_ID, "")
            };
            $http({
                method: "POST",
                url: url,
                data: params
            });
        },
        error: function () {
            $ionicPopup.alert({
                template: "Cannot connect to the server"
            });
        }
    };

    $scope.change = function (){
        WebService.updateAPI(updateAPICallback);
    };

    $scope.signOut = function(){
        //TODO remove is logged in/cookie
        $localstorage.remove(CONSTANTS.USERNAME);
        $localstorage.remove(CONSTANTS.PASSWORD);
        $localstorage.remove(CONSTANTS.GRADEBOOK_TERM);
        $localstorage.remove(CONSTANTS.GRADEBOOK_SEMESTER);
        $localstorage.remove(CONSTANTS.GRADEBOOK_SY_FROM);
        $localstorage.remove(CONSTANTS.ACCOUNTS_SEMESTER);
        $localstorage.remove(CONSTANTS.ACCOUNTS_SY_FROM);
        $timeout(function () {
            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();
        }, 1500);
        $state.go('main');
    }
});