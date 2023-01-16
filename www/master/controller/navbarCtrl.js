angular
  .module("app")

  .controller(
    "nevCtrl",
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
      $localStorage
    ) {
      let vm = this;

      $scope.ww = false;
      $scope.myScroll = {
        height: "calc(100%)",
      };

      // console.log($rootScope.notiBadge);

      function active() {
        let url = $rootScope.ip + "onesig.php"; //'http://192.168.9.172/agriprophp/login.php'

        let req = {
          mode: "checkActive",
          value: $rootScope.global,
        };
        if ($rootScope.ip) {
          $http.post(url, req).then(function suscess(response) {
            // //console.log(response.data)
            if (
              response.data.status == true &&
              response.data.result.length > 0
            ) {
              vm.activeMat = response.data.result;
              $scope.ww = true;
              $scope.myScroll = {
                height: "calc(100% - 50px)",
                "margin-top": "-16px",
              };
            } else {
              $scope.ww = false;
              $scope.myScroll = {
                height: "calc(100%)",
              };
            }
          });
        }
      }

      // active();
      // let loopActive = setInterval(active, 10000);

      $scope.shouldHide = function () {
        // //console.log($state.current.name);
        switch ($state.current.name) {
          case "app.deleteuser":
            return true;
          case "app.receiveitemlist":
            return true;
          case "app.receiveitemdetail":
            return true;
          case "app.receiveitemedit":
            return true;
          case "app.receiveitemadd":
            return true;
          case "app.salevisitEdit":
            return true;
          case "app.salevisitList":
            return true;
          case "app.salevisitCalendar":
            return true;
          case "app.salevisitAdd":
            return true;
          case "app.salevisitDetail":
            return true;
          case "app.salevisitHistory":
            return true;
          case "app.sq1":
            return true;
          case "app.sq2":
            return true;
          case "app.sqadd":
            return true;
          case "app.sq2-1":
            return true;
          case "app.sq2-2":
            return true;
          case "app.sq2-edit":
            return true;
          case "app.sq3":
            return true;
          case "app.sq4":
            return true;
          case "app.sqEdit":
            return true;
          case "app.soadd":
            return true;
          case "app.sotab":
            return true;
          case "app.sotab1":
            return true;
          case "app.sotab2":
            return true;
          case "app.sotab3":
            return true;
          case "app.sotab4":
            return true;
          case "app.sotab4-1":
            return true;
          case "app.sotab4-2":
            return true;
          case "app.sotab4-2-edit":
            return true;
          case "app.so1":
            return true;
          case "app.so2":
            return true;
          case "app.so3":
            return true;
          case "app.so4":
            return true;
          case "app.soEdit":
            return true;
          case "app.inventory1":
            return true;
          case "app.inventory2":
            return true;
          case "app.inventory3":
            return true;
          case "app.saleChance1":
            return true;
          case "app.saleChanceEdit":
            return true;
          case "app.saleChance2":
            return true;
          case "app.saleChance3":
            return true;
          case "app.postpectAddress":
            return true;
          case "app.postpectEdit":
            return true;
          case "app.postpectAddressEdit":
            return true;
          case "app.postpectCredit":
            return true;
          case "app.editsales":
            return true;
          case "app.editpassword":
            return true;

          default:
            return false;
        }
      };

      $scope.farmermenu = function () {
        $ionicHistory.nextViewOptions({
          historyRoot: true,
        });
        $state.go("app.menu");
      };

      $scope.detail = function () {
        $state.go("app.detail");
      };

      $scope.appsetting = function () {
        $state.go("app.appsetting");
      };

      $scope.noti = function () {
        $state.go("app.noti");
      };

      $scope.dashboard = function () {
        $state.go("app.dashboard");
      };
    }
  );
