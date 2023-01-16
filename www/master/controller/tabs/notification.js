angular
  .module("app")

  .controller(
    "notificationCtrl",
    function (
      $scope,
      $ionicModal,
      $timeout,
      $http,
      $rootScope,
      $timeout,
      $state,
      $stateParams,
      $ionicHistory,
      $ionicActionSheet,
      $ionicLoading,
      $localStorage,
      fachttp,
      $location
    ) {
      let vm = this;

      // $rootScope.notiBadge = 30;

      $scope.readAll = function () {
        let req = {
          mode: "readNotification",
        };
        fachttp.model("notification.php", req).then(
          function (response) {
            if (response.data.status) {
              $rootScope.notiBadge = 0;
            }
          },
          function err(err) {
            $ionicLoading.hide();
            Service.timeout();
          }
        );
      };


      $scope.loadNoti = function () {
        let req = {
          mode: "getNotification",
        };
        fachttp.model("notification.php", req).then(
          function (response) {
            if (response.data.status) {
              $scope.notificationlist = response.data.result;
              $scope.readAll();
            }
          },
          function err(err) {
            $ionicLoading.hide();
            Service.timeout();
          }
        );
      };

     

      $scope.loadNoti();

      $scope.notiClick = function (e) {
        try {
          if (e.url) {
            $ionicHistory.clearCache(),
              setTimeout(() => {
                $state.go(e.url, e.data, { reload: true });
              }, 200);
          }
        } catch (error) {}

        // if (e.url) {
        // }
      };

      $scope.viewNoti = function (e) {
        console.log(222);
      };
    }
  );
