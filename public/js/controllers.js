app.controller('dashCtrl', ['$scope', 'api', '$uibModal', function ($scope, api, $uibModal) {
    $scope.revisions = {};
    $scope.selectedRevision = null;

    // Select revision
    $scope.selectRevision = function(revisionId) {
        console.log('Issues list updating');

        api.post('getIssuesList', {'revisionId':  revisionId}).then(function(data) {
            $scope.issues = data;
            $scope.$apply();
        }).catch(function (error) {
            errorDialog(error.hasOwnProperty('message') ? error['message'] : error);
        });
    };

    // Select issue
    $scope.selectIssue = function(id) {
        console.log('Issue loading');

        api.post('getIssueDetails', {'id':  id}).then(function(data) {
            $uibModal.open({
                templateUrl: 'template/issue.html',
                size: 'lg',
                controller: function($scope) {
                    console.log(data);
                    $scope.issue = data;
                }
            });
        }).catch(function (error) {
            errorDialog(error.hasOwnProperty('message') ? error['message'] : error);
        });
    };

    // Reload revisions
    $scope.reload = function() {
        console.log('Reloading');

        $scope.tasks = {};
        $scope.revisions = {};
        $scope.issues = {};

        build();
    };

    // Revision list
    var getRevisionsList = function () {
        return new Promise(function (resolve, reject) {
            api.post('getRevisionsList', {'limit': 10}).then(function (data) {
                $scope.revisions = data;
                resolve();
            }).catch(function (error) {
                reject(error);
            });
        });
    };

    // Task list
    var getTaskList = function () {
        return new Promise(function (resolve, reject) {
            api.post('getTaskList', {'limit': 5}).then(function (data) {
                $scope.tasks = data;
                resolve();
            }).catch(function (error) {
                reject(error);
            });
        });
    };

    // Build factory
    var build = function () {
        Promise.all([
            getTaskList(),
            getRevisionsList()
        ]).then(function () {
            $scope.$apply();
        }).catch(function (error) {
            errorDialog(error.hasOwnProperty('message') ? error['message'] : error);
        });
    };

    // Init
    build();
}]);

function errorDialog(message) {
    swal({
        title: "Error!",
        text: message,
        type: "error",
        confirmButtonText: "Crap"
    });
}