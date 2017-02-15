app.controller('dashCtrl', ['$scope', 'api', function ($scope, api) {
    $scope.revisions = {};
    $scope.selectedRevision = null;

    $scope.selectRevision = function(rev) {
        api.post('getRevisionById', {'revId':  rev.id}).then(function(data) {
            $scope.selectedRevision = data;
            $scope.$apply();
        });
    };

    $scoe.initCommand = function() {
        console.log('asd');
    };

    api.post('getRevisionList', {}).then(function(data) {
        $scope.revisions = data;
        $scope.$apply();
    });
}]);
