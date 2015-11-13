angular.module('controllers').controller('MainCtrl', function ($scope, $ionicModal) {

    $ionicModal.fromTemplateUrl('app/components/main/popover-signIn.html', {
        scope: $scope,
        animation: 'scale-in'
    }).then(function(modal) {
        $scope.signInModal = modal;
    });
    $scope.openSignInModal = function() {
        $scope.signInModal.show();
    };
    $scope.closeSignInModal = function() {
        $scope.signInModal.hide();
    };
    $scope.$on('$destroy', function() {
        $scope.signInModal.remove();
    });


    $ionicModal.fromTemplateUrl('app/components/main/popover-forgotPassword.html', {
        scope: $scope,
        animation: 'scale-in'
    }).then(function(modal) {
        $scope.forgotPasswordModal = modal;
    });
    $scope.openForgotPasswordModal = function() {
        $scope.forgotPasswordModal.show();
    };
    $scope.closeForgotPasswordModal = function() {
        $scope.forgotPasswordModal.hide();
    };
    $scope.$on('$destroy', function() {
        $scope.forgotPasswordModal.remove();
    });

});