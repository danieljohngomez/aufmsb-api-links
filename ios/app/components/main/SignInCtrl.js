angular.module('controllers').controller('SignInCtrl', function ($scope, $state, WebService, LoginFactory) {
    $scope.isLoading = false;
    $scope.user = {};

    $scope.signIn = function () {
        function error() {
            //TODO CHANGE TO DIALOG
            console.log("Can't connect to the server");
            $scope.isLoading = false;
        }

        var loginCallback = {
            success: function () {
                $state.go('tab.dashboard');
                $scope.closeSignInModal();
                $scope.isLoading = false;
            }, error: function () {
                error();
            }, complete: function () {
                $scope.isLoading = false;
            }, usernameNotExists: function () {
                //TODO CHANGE TO DIALOG
                console.log('Username doesn\'t exist');
                $scope.isLoading = false;
            }, wrongPassword: function (retriesLeft) {
                //TODO CHANGE TO DIALOG
                console.log('Login authentication failed. No of retries left: ' + retriesLeft +
                    '<br><br>NOTE: Reaching 0 will disable your account.');
                $scope.isLoading = false;
            }, loginExceeded: function () {
                //TODO CHANGE TO DIALOG
                console.log('Maximum retry to login exceeded. Please contact admin to activate your account.');
                $scope.isLoading = false;
            }
        };

        var updateAPICallback = {
            success: function () {
                LoginFactory.login($scope.user.username, $scope.user.password, loginCallback);
            },
            error: function () {
                error();
            }
        };

        if ($scope.user.username && $scope.user.password) {
            $scope.isLoading = true;
            WebService.updateAPI(updateAPICallback);
        } else {
            //navigator.notification.confirm("Username is empty", function(buttonIndex) {
            //    switch(buttonIndex) {
            //        case 1:
            //            console.log("Decline Pressed");
            //            break;
            //        case 2:
            //            console.log("Dont Care Pressed");
            //            break;
            //        case 3:
            //            console.log("Accept Pressed");
            //            break;
            //    }
            //}, "Our Title", [ "Decline", "Dont Care", "Accept" ]);
            //TODO CHANGE TO DIALOG
            console.log("username/password is empty");
        }
    }

});
