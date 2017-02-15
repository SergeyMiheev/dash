var app = angular.module("dashApp", []);

app.factory('api', [
    function () {
        return {
            post: function (action, data) {
                return new Promise(function (resolve, reject) {
                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', 'api.php', false);
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState == XMLHttpRequest.DONE) {
                            var resp = JSON.parse(xhr.responseText);
                            if (resp.hasOwnProperty('success') && resp.success === true && resp.hasOwnProperty('payload')) {
                                resolve(resp.payload);
                            } else {
                                reject({});
                            }
                        }
                    }.bind(this);

                    var request = {action: action, data:data};
                    xhr.send(JSON.stringify(request));
                });

            }
        }
    }
]);
