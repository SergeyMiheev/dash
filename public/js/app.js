var app = angular.module("dashApp", [
    'ui.bootstrap',
    'ui.bootstrap.tpls'
]);

app.factory('api', ['$http',
    function ($http) {
        return {
            post: function (action, data) {
                return new Promise(function (resolve, reject) {
                    $http({
                        method: 'POST',
                        url: 'api.php',
                        data: {
                            'action': action,
                            'payload' : data
                        }
                    }).then(function successCallback(response) {
                        if (response.data.hasOwnProperty('success') &&
                            response.data.success === true &&
                            response.data.hasOwnProperty('payload')
                        ) {
                            resolve(response.data.payload);
                        } else {
                            reject({
                                "message": response.data.message
                            });
                        }
                    }, function errorCallback(response) {
                        reject(response)
                    });
                });
            }
        }
    }
]);
