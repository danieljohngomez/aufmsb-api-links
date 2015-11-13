angular.module("controllers").controller("ForgotPasswordCtrl", function ($scope, $state, WebService, ForgotPasswordFactory) {
    $scope.isLoading = false;
    $scope.user = {};

    $scope.forgotPassword = function () {

        var forgotCallBack = {
            success: function () {
                //TODO CHANGE TO DIALOG
                console.log("Your SchoolBliz username and password has been sent to your registered e-mail address.");
                $scope.isLoading = false;
                $scope.closeForgotPasswordModal();
            }, error: function () {
                //TODO CHANGE TO DIALOG
                console.log("Can't connect to the server");
                $scope.isLoading = false;
            }, invalidIDNumber: function () {
                //TODO CHANGE TO DIALOG
                console.log("Invalid ID Number");
                $scope.isLoading = false;
            }
        };

        var updateAPICallback = {
            success: function () {
                ForgotPasswordFactory.send($scope.user.idNumber, forgotCallBack);
            },
            error: function () {
                $scope.isLoading = false;
            }
        };

        if ($scope.user.idNumber) {
            $scope.isLoading = true;
            WebService.updateAPI(updateAPICallback);
        } else {
            //TODO CHANGE TO DIALOG
            console.log("ID Number is empty");
        }
    }

});