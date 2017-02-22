app.controller('dashCtrl', ['$scope', 'api', '$uibModal', function ($scope, api, $uibModal) {
    $scope.revisions = {};
    $scope.selectedRevision = null;

    // Select revision
    $scope.selectRevision = function (revisionId) {
        console.log('Issues list updating');

        api.post('getIssuesList', {'revisionId': revisionId}).then(function (data) {
            $scope.issues = data;
        }).catch(function (error) {
            errorDialog(error.hasOwnProperty('message') ? error['message'] : error);
        });
    };

    // Select issue
    $scope.selectIssue = function (id) {
        console.log('Issue loading');

        api.post('getIssueDetails', {'id': id}).then(function (data) {
            $uibModal.open({
                templateUrl: 'template/issue.html',
                size: 'lg',
                controller: function ($scope) {
                    console.log(data);
                    $scope.issue = data;
                }
            });
        }).catch(function (error) {
            errorDialog(error.hasOwnProperty('message') ? error['message'] : error);
        });
    };

    // Reload revisions
    $scope.reload = function () {
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

                // First revision
                if (data.hasOwnProperty(0)) {
                    $scope.selectRevision(data[0].id)
                }

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
            // nothing
        }).catch(function (error) {
            errorDialog(error.hasOwnProperty('message') ? error['message'] : error);
        });
    };

    // Init
    build();
}]);

app.controller('commandCtrl', ['$scope', 'api', '$uibModal', function ($scope, api, $uibModal) {
    $scope.revisions = {};
    $scope.selectedRevision = null;

    // Release
    $scope.releaseCommand = function () {
        confirmDialog(
            function () {
                $scope.command('release')
            },
            'Do you want release?'
        );
    };

    // Repair
    $scope.repairRevisionCommand = function () {
        confirmDialog(
            function () {
                $scope.command('repairRevision')
            },
            'Do you want repair last failed revision?'
        );
    };

    // Add issue
    $scope.addIssueCommand = function () {
        swal({
                title: "Add issue(s)",
                type: "input",
                showCancelButton: true,
                closeOnConfirm: false,
                animation: "slide-from-top",
                inputPlaceholder: "PSPD-100, PSPD-101"
            },
            function (inputValue) {
                if (inputValue === false) return false;

                if (inputValue === "") {
                    swal.showInputError("You need to write something!");
                    return false
                }

                $scope.command('addIssue', {issue: inputValue});
            });
    };

    $scope.command = function (command, data) {
        console.log('Command ' + command + ' invoked');

        if (!data) {
            data = {};
        }

        api.post(command, data).then(function (data) {
            infoDialog('Task created with id ' + data['id']);
        }).catch(function (error) {
            errorDialog(error.hasOwnProperty('message') ? error['message'] : error);
        });
    }
}]);

function confirmDialog(callback, message, title) {
    swal({
        title: !title ? "Are you sure?" : title,
        text: message,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        closeOnConfirm: false
    }, callback);
}

function infoDialog(message, title) {
    swal({
        title: !title ? "Yo!" : title,
        text: message,
        type: "success",
        confirmButtonText: "Crap"
    });
}

function errorDialog(message) {
    swal({
        title: "Error!",
        text: message,
        type: "error",
        confirmButtonText: "Crap"
    });
}