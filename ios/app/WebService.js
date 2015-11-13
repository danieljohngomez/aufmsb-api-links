var app = angular.module("services");

app.factory("WebService", function ($http, CONSTANTS, $localstorage) {

    function getServerAPI(onSuccess, onError) {
        console.log("Getting server API...");
        $http.get(CONSTANTS.URL_API_VERSION).
            then(function successCallback(response) {
                console.log("Successfully got server API");
                onSuccess(response.data);
            }, function errorCallback(response) {
                console.log("Failure in getting server API: " + response);
                onError();
            });
    }

    function getClientAPI() {
        return $localstorage.get(CONSTANTS.CLIENT_API_VERSION, 0);
    }

    function updateAPI(callback) {
        console.log("Updating API...");
        var clientAPI = getClientAPI();
        getServerAPI(success, callback.error);

        function success(serverAPI) {
            if (clientAPI < serverAPI) {
                $localstorage.set(CONSTANTS.CLIENT_API_VERSION, serverAPI);
                console.log("Client API: " + clientAPI + " < " + serverAPI + ", localstorage updated");
            }
            updateLinks(callback)
        }
    }

    function updateLinks(callback) {
        console.log("Updating links from WebService...");
        $http.get(CONSTANTS.URL_API_LINKS)
            .then(function successCallback(response) {
                console.log("Links from localstorage has been successfully updated");
                saveLinks(response.data);
                callback.success();
            }, function errorCallback(response) {
                console.log("Failure in updating links: " + response);
                callback.error();
            });
    }

    function saveLinks(data) {
        $localstorage.setObject(CONSTANTS.LINKS_RAW_COLLECTION, data);
    }

    function getLink(link) {
        var links = $localstorage.getObject(CONSTANTS.LINKS_RAW_COLLECTION);
        for (var i = 0; i < links.length; i++) {
            if (links[i]["name"] == link) {
                return links[i].url;
            }
        }
    }


    return {
        getServerAPI: function (onSuccess, onError) {
            return getServerAPI(onSuccess, onError);
        },
        getClientAPI: function () {
            return getClientAPI();
        },
        updateAPI: function (callback) {
            return updateAPI(callback);
        },
        updateLinks: function (callback) {
            return updateLinks(callback);
        },
        getLink: function (link) {
            return getLink(link);
        }

    }
});
