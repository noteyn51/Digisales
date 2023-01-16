angular
  .module("app")

  .controller(
    "dashboardCtrl",
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

      $scope.version = null;
      document.addEventListener("deviceready", function () {
        cordova.getAppVersion.getVersionNumber().then(function (version) {
          $(".version").text(version);
          console.log(version);
          $scope.version = version;
        });
      });

      vm.area = function () {
        $state.go("app.area");
      };

      vm.usersetting = function () {
        $state.go("app.usersetting");
      };

      vm.editpassword = function () {
        $state.go("app.editpassword");
      };

      vm.startPlant = function () {
        $state.go("app.startPlant");
        $scope.modalsetting.hide();
      };

      vm.logout = function () {
        let hideSheet = $ionicActionSheet.show({
          titleText: "Logout ",
          buttons: [
            {
              text: '<i class="icon ion-log-out"></i> Logout',
            },
            // {
            //   text: '<i class="icon ion-chatboxes"></i> Share with Sms'
            // },
            // {
            //   text: '<i class="icon ion-network"></i> Share with Social'
            // },
          ],

          buttonClicked: function (index) {
            console.log(index);
            if (index == 0) {
              $ionicLoading.show();
              document.addEventListener("deviceready", function () {
                for (let i = 0; i < $rootScope.global.iot.length; i++) {
                  // FCMPlugin.unsubscribeFromTopic($rootScope.global.iot[i]);
                  
                  
                  FirebasePlugin.unsubscribe($rootScope.global.iot[i], function(){
                    console.log("Unsubscribed from topic");
                }, function(error){
                     console.error("Error unsubscribing from topic: " + error);
                });
                }
              });
              let platform = ionic.Platform.platform();
              // if (platform == "android") {
              //   document.addEventListener("deviceready", function () {
              //     window.plugins.OneSignal.getTags(function (tags) {
              //       // console.log(tags);
              //       for (x in tags) {
              //         // console.log(x)
              //         let key = x;
              //         window.plugins.OneSignal.deleteTag(key);
              //       }
              //     });
              //   });
              // }

              $rootScope.global = {};
              delete $localStorage.globalAGRI;
              $timeout(function () {
                window.location = "index.html";
                $ionicLoading.hide();
              }, 5000);
            }

            return true;
          },
        });

        // For example's sake, hide the sheet after two seconds
        $timeout(function () {
          hideSheet();
        }, 7000);

        // $state.go('app.farmerlogin')
      };

      // espSmartconfig.getNetworklist({numLevels: false}, $scope.listHandler, $scope.fail);
      // console.log('ss')

      // $scope.listHandler = function(ssids) {
      //   console.log(ssids.SSID);
      //   console.log(ssids.BSSID);
      // };

      // $scope.fail = function(e) {
      //   console.log(e);
      // };
    }
  )
