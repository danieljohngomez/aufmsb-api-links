angular.module("controllers").controller("AccountsCtrl", function ($scope, Utils, $localstorage, WebService, CONSTANTS, AccountsFactory, $ionicModal) {
    $scope.isLoading = true;
    $scope.hasMessage = false;
    $scope.semester = $localstorage.get(CONSTANTS.ACCOUNTS_SEMESTER, '1st Semester');
    var defaultYear = Utils.getDefaultYear();
    $scope.syFrom = $localstorage.get(CONSTANTS.ACCOUNTS_SY_FROM, defaultYear);
    $scope.syTo = parseInt($scope.syFrom) + 1;

    var requestAccountsCallback = {
        success: function (accounts) {
            if (accounts.length > 0) {
                $scope.accounts = accounts;
                $scope.isLoading = false;
                $scope.hasMessage = false;
            } else {
                $scope.hasMessage = true;
                $scope.message = "No data found";
                $scope.isLoading = false;
            }
            $scope.$broadcast('scroll.refreshComplete');
        }, error: function () {
            $scope.$broadcast('scroll.refreshComplete');
            $scope.hasMessage = true;
            $scope.message = "Can't connect to the server";
            $scope.isLoading = false;
        }
    };
    var updateAPICallback = {
        success: function () {
            AccountsFactory.requestAccounts(requestAccountsCallback);
        },
        error: function () {
            $scope.$broadcast('scroll.refreshComplete');
            $scope.hasMessage = true;
            $scope.message = "Can't connect to the server";
            $scope.isLoading = false;
        }
    };

    $ionicModal.fromTemplateUrl('app/components/accounts/popover-accountsQuery.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.accountsQueryModal = modal;
    });
    $scope.openAccountsQueryModal = function () {
        $scope.accountsQueryModal.show();
    };
    $scope.closeAccountsQueryModal = function () {
        $scope.accountsQueryModal.hide();
    };
    $scope.$on('$destroy', function () {
        $scope.accountsQueryModal.remove();
    });

    $scope.requestAccounts = function (semester, syFrom){
        $scope.isLoading = true;
        $scope.hasMessage = false;
        if(semester){
            window.localStorage[Storage.ACCOUNTS_SEMESTER] = semester;
            window.localStorage[Storage.ACCOUNTS_SY_FROM] = syFrom;
            $scope.semester = semester;
            $scope.syFrom = syFrom;
            $scope.syTo = parseInt($scope.syFrom) + 1;
        }
        if($scope.accountsQueryModal){
            $scope.closeAccountsQueryModal();
        }
        WebService.updateAPI(updateAPICallback);
    };
    $scope.requestAccounts();
});