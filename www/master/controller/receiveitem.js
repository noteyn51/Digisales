angular
  .module("app")
 
 
  .controller(
    "receiveitemListCtrl",
    function (
      $http,
      $rootScope,
      $ionicHistory,
      fachttp,
      $ionicLoading,
      Service,
      $state,
      $scope,
      $ionicModal
    ) {
      let vm = this;

      $scope.soAdd = function () {
        $state.go("app.soadd");
      };

      function onStart() {
        let req = {
          mode: "sq_list",
        };
        fachttp.model("sq.php", req).then(
          function (response) {
            console.log(response.data);
            if (response.data.status == true) {
              vm.sq_list = response.data;
            } else {
              vm.sq_list = [];
            }
          },
          function err(err) {
            $ionicLoading.hide();
            Service.timeout();
          }
        );
      }
      onStart();

      vm.sqEdit = function (e) {
        // console.log()
        $state.go("app.sqEdit", { nbr: e.sq_nbr });
      };
    }
  )

  .controller(
    "receiveitemDetialCtrl",
    function (
      $http,
      $rootScope,
      $ionicHistory,
      fachttp,
      $ionicLoading,
      Service,
      $state,
      $scope,
      $ionicModal
    ) {
      let vm = this;

      $scope.soAdd = function () {
        $state.go("app.soadd");
      };

      function onStart() {
        let req = {
          mode: "sq_list",
        };
        fachttp.model("sq.php", req).then(
          function (response) {
            console.log(response.data);
            if (response.data.status == true) {
              vm.sq_list = response.data;
            } else {
              vm.sq_list = [];
            }
          },
          function err(err) {
            $ionicLoading.hide();
            Service.timeout();
          }
        );
      }
      onStart();

      vm.sqEdit = function (e) {
        // console.log()
        $state.go("app.sqEdit", { nbr: e.sq_nbr });
      };
    }
  )

  .controller(
    "receiveitemEditCtrl",
    function (
      $http,
      $rootScope,
      $ionicHistory,
      fachttp,
      $ionicLoading,
      Service,
      $state,
      $scope,
      $ionicModal
    ) {
      let vm = this;

      $scope.soAdd = function () {
        $state.go("app.soadd");
      };

      function onStart() {
        let req = {
          mode: "sq_list",
        };
        fachttp.model("sq.php", req).then(
          function (response) {
            console.log(response.data);
            if (response.data.status == true) {
              vm.sq_list = response.data;
            } else {
              vm.sq_list = [];
            }
          },
          function err(err) {
            $ionicLoading.hide();
            Service.timeout();
          }
        );
      }
      onStart();

      vm.sqEdit = function (e) {
        // console.log()
        $state.go("app.sqEdit", { nbr: e.sq_nbr });
      };
    }
  )

  .controller(
    "receiveitemAddCtrl",
    function (
      $http,
      $rootScope,
      $ionicHistory,
      fachttp,
      $ionicLoading,
      Service,
      $state,
      $scope,
      $ionicModal
    ) {
      let vm = this;

      $scope.soAdd = function () {
        $state.go("app.soadd");
      };

      function onStart() {
        let req = {
          mode: "sq_list",
        };
        fachttp.model("sq.php", req).then(
          function (response) {
            console.log(response.data);
            if (response.data.status == true) {
              vm.sq_list = response.data;
            } else {
              vm.sq_list = [];
            }
          },
          function err(err) {
            $ionicLoading.hide();
            Service.timeout();
          }
        );
      }
      onStart();

      vm.sqEdit = function (e) {
        // console.log()
        $state.go("app.sqEdit", { nbr: e.sq_nbr });
      };
    }
  )
