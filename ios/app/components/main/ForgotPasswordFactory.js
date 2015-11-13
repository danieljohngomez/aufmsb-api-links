angular.module("services").factory('ForgotPasswordFactory', function ($http, WebService, CONSTANTS) {

    function send(idNumber, callback) {
        var url = WebService.getLink(CONSTANTS.LINK_FORGOT_PASSWORD);
        var params = {
            id_number: idNumber,
            Submit1: 'Send Password'
        };

        console.log("Requesting forgot password...");
        $http({
            method: 'POST',
            url: url,
            data: params
        }).then(function (response) {
            if (response.data.includes("invalid")) {
                console.log("Invalid ID Number");
                callback.invalidIDNumber();
            } else {
                console.log("Request successfully");
                callback.success();
            }
        }, function (error) {
            console.log("Failure in requesting forgot password: " + error);
            callback.error();
        });
    }

    return {
        send: function (idNumber, callback) {
            return send(idNumber, callback);
        }
    }

});