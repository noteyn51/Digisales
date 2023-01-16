angular
  .module("app")

  .controller(
    "farmerMenuCtrl",
    function (
      $http,
      $ionicLoading,
      $timeout,
      $scope,
      $state,
      $rootScope,
      $localStorage,
      $ionicHistory,
      Service,
      $ionicSlideBoxDelegate,
      deviceService,
      $ionicActionSheet,
      $ionicScrollDelegate,
      fachttp,
      $q,
      $ionicModal,
      $mdDialog
    ) {
      let vm = this;

setTimeout(() => {
  $ionicHistory.clearCache();
}, 800);

      console.log($rootScope.global);
      $scope.testnoti = function () {};

      let subTopic1 = [
        $rootScope.global.mob_app,
        $rootScope.global.mob_config,
        $rootScope.global.mob_site,
        $rootScope.global.sales.sp_addr,
      ]
        .join("-")
        .toUpperCase();

      var topic = [
        subTopic1,
        $rootScope.global.mob_id,
        $rootScope.global.mob_config,
      ];

      console.log(subTopic1);

      document.addEventListener("deviceready", function () {
        FirebasePlugin.isAutoInitEnabled(function (enabled) {
          console.log("Auto init is " + (enabled ? "enabled" : "disabled"));
        });

        FirebasePlugin.grantPermission(function (hasPermission) {
          console.log(
            "Permission was " + (hasPermission ? "granted" : "denied")
          );
        });

        FirebasePlugin.hasPermission(function (hasPermission) {
          console.log(
            "Permission is " + (hasPermission ? "granted" : "denied")
          );
        });

        FirebasePlugin.getToken(
          function (fcmToken) {
            console.log(fcmToken);
           
          },
          function (error) {
            console.error(error);
          }
        );

        FirebasePlugin.onMessageReceived(
          function (message) {
            console.log("Message type: " + message.messageType);
            if (message.messageType === "notification") {
              console.log("Notification message received");
              if (message.tap) {
                console.log("Tapped in " + message.tap);
              }
            }
            console.dir(message);
          },
          function (error) {
            console.error(error);
          }
        );

        FirebasePlugin.onTokenRefresh(
          function (fcmToken) {
            console.log(fcmToken);
          },
          function (error) {
            console.error(error);
          }
        );

        topic.forEach((element) => {
          FirebasePlugin.subscribe(
            element,
            function () {
              console.log("Subscribed to topic " + element);
            },
            function (error) {
              console.error("Error subscribing to topic: " + error);
            }
          );
        });
      });

      $ionicModal
        .fromTemplateUrl("sp-modal.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.modalSp = modal;
        });

      $scope.openModalSp = function () {
        $scope.modalSp.show();
        $scope.loadSp();
      };

      $scope.closeModalSp = function () {
        $scope.modalSp.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        $scope.modalSp.remove();
      });

      $scope.loadSp = function () {
        $ionicLoading.show();
        let req = {
          mode: "sp_mstr",
        };
        fachttp.model("salepp.php", req).then(
          function (response) {
            // console.log(response.data);
            vm.data = response.data;
            $ionicLoading.hide();
          },
          function err(err) {
            $ionicLoading.hide();
            Service.timeout();
          }
        );
      };

      $scope.selectSP = function (e) {
        $scope.closeModalSp();
        let j = angular.merge($rootScope.global, { sales: e });
        $localStorage.globalDIGIS = j;
        vm.saleSelect = true;
      };

      $scope.getnotiUnread = function () {
        $ionicLoading.show();
        let req = {
          mode: "getNotificationUnread",
        };
        fachttp.model("notification.php", req).then(
          function (response) {
            // console.log(response.data);
            $rootScope.notiBadge = response.data.result.unread_count;
            // vm.data = response.data;
            $ionicLoading.hide();
          },
          function err(err) {
            $ionicLoading.hide();
            Service.timeout();
          }
        );
      };

      vm.saleSelect = false;

      if ($rootScope.global.sales) {
        vm.saleSelect = true;
      }

      vm.detail = function () {
        $ionicLoading.show();
        let req = {
          mode: "route_menu_detail",
        };

        fachttp.model("route.php", req).then(
          function (response) {
            $ionicLoading.hide();
            // console.log(response.data);

            $state.go(response.data.route);
          },
          function err(err) {
            $ionicLoading.hide();

            alert("ไม่สามารถเชื่อมต่อกับ server ได้ลองใหม่อีกครั้ง");
          }
        );
      };

      $scope.saleVisit = function () {
        $state.go("app.salevisitList");
      };

      $scope.postpect = function () {
        $ionicScrollDelegate.resize();
        $state.go("post.menupostpect2");
      };

      $scope.inven = function () {
        $state.go("app.inventory1");
      };

      $scope.saleChance = function () {
        $state.go("app.saleChance1");
      };

      $scope.sq = function () {
        $state.go("app.sq1");
      };

      $scope.saleorder = function () {
        $state.go("app.so1");
      };

      $scope.notification = function () {
        $state.go("app.noti");
      };

      $scope.viewDetail = function (e) {
        $state.go("app.salevisitDetail", { visitNbr: e.calendar_nbr });
      };

      $scope.receiveItem = function (e) {
        $mdDialog.show(
          $mdDialog
            .alert()
            .parent(angular.element(document.querySelector("#popupContainer")))
            .clickOutsideToClose(false)
            .title("แจ้งเตือน")
            .textContent("รับสินค้า")
            .ariaLabel("Alert Dialog Demo")
            .ok("OK")
            .targetEvent()
        );
        // $state.go("app.receiveitemlist");
      };

      $scope.getvisit = function () {
        let req = {
          mode: "getvisitList",
        };
        fachttp.model("salevisit.php", req).then(
          function (response) {
            if (response.status) {
              $scope.jobList = response.data.result;
              // console.log($scope.jobList);
            } else {
            }
          },
          function err(err) {
            $ionicLoading.hide();
            Service.timeout();
          }
        );
      };

      $scope.checkReject = function () {
        let req = {
          mode: "checkLogin",
        };
        fachttp.model("checkLogin.php", req).then(
          function (response) {
            if (!response.data.status) {
              document.addEventListener("deviceready", function () {
                FirebasePlugin.getToken(
                  function (fcmToken) {
                    console.log(fcmToken);
                    let serverkey =
                      "AAAAy5EkEJI:APA91bF_t0BAgVUo1XS13f5RxNA4SXfu95K7JKC3fhTe4dGC1HNDD1IGhVaPo4KxEyY68-P-eFdZBWY8CA2NDmNH5ax4ZqPR-QnC6voY7WC_wUPq4e2BPMQ2eQ5y_6_iUGr_NX0Zbdhx";
                    $http({
                      method: "GET",
                      url:
                        "https://iid.googleapis.com/iid/info/" +
                        fcmToken +
                        "?details=true",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + serverkey,
                      },
                    }).then(function (response) {
                      console.log(response.data.rel);
                      if (response.data.rel) {
                        for (const [key, value] of Object.entries(
                          response.data.rel.topics
                        )) {
                          console.log(key);

                          FirebasePlugin.unsubscribe(
                            key,
                            function () {
                              console.log("Unsubscribed from topic", key);
                            },
                            function (error) {
                              console.error(
                                "Error unsubscribing from topic: " + error
                              );
                            }
                          );
                        }
                      }
                    });
                  },
                  function (error) {
                    console.error(error);
                  }
                );
              });

              Service.toast("ออกจากระบบ", "danger");

              $rootScope.global = {};

              delete $localStorage.globalDIGIS;
              $ionicLoading.hide();
              $state.go("farmerlogin", null, {
                location: "replace",
              });
            }
          },
          function err(err) {}
        );
      };

      $scope.getDashboard = function () {
        let req = {
          mode: "getSaleDashboard",
        };
        fachttp.model("dashboard.php", req).then(
          function (response) {
            $scope.dashBoard = response.data;
            //   $scope.dashBoard = [
            //   {
            //     name: "โอกาสการขาย",
            //     color: "card",
            //     desc: "xxxxx",
            //     numb: 50,
            //     footer: "อัพเดทเมือ 20 มกราคม 2565",
            //     icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAAB/ElEQVRoge2Yu0oDQRSGz4gi2Ahq0MIgCCGFFhY2WvkQXopY26eyDYgPYBdbQUQRfA3fIIUvICReQS0M+Sx2lsTNbrKX2UzE+WCb3Znz///umWESkZwAFLAPqLw0cgU4weMGmBm1+GzG+RWgQ5d7YCl3T8AccAY8pxUENoEPftMEVtPU0zUL2tMFsBg2YAo40kI+9RRCK8BjwPwXsJXWvK573lPvBTgGpv2H20CDftrARkKhJd0uPh2gktH8hvYSpAFsT4jIp4iUQuY+iEiixaeUehSRHRG50rdOlVKXWQJoDw8h90vieRcB6oFPVAWm0ipieAvVLV7V3vpbHG/xNiMXyZhAd5NpAoXgw0xb5yhJ7RVYizmuCNwC7/q6A8omNRID1IBv4GDIuCLwFLJrPAPFIXMPtEYtD/M+A0PoNx/FTQzzPmZCAOuBwgND6JaJ4i2meV9j3VSIKIG+EEMCvGapPZIQeAs2imsr5pMIAmW8BRukBSxbM58wRBHvd8Cbvq7HwnyPgd0QA23gMMbcvYi5mQ59iUkTYmzM9xiKaoUW/bSsts2AEGFfIg723nyQFCGMmTf2lwfQEpH5mMOflFILJnRNBiCRsFJGtCdMFLGJC2AbF8A2LoBtXADbuAC2mcyrcPCsk/SsFJc//wVcANu4ALZxAWzjAjj+Oz+aTMDrTmcS2QAAAABJRU5ErkJggg==",
            //   },
            //   {
            //     name: "ยอดขาย เดือนปัจจุบัน ปีตามระบบ ERP",
            //     color: "card",
            //     desc: "xxxxx",
            //     numb: 2000000,
            //     footer: "อัพเดทเมือ 20 มกราคม 2565",
            //     icon: "https://img.icons8.com/external-line-icons-vinzence-studio/64/FFFFFF/external-currency-money-and-currency-line-icons-vinzence-studio-15.png",
            //   },
            //   {
            //     name: "ยอดขายไตรมาส ปัจจุบัน ปีตามระบบ ERP",
            //     color: "card",
            //     desc: "xxxxx",
            //     numb: 8000000,
            //     footer: "อัพเดทเมือ 20 มกราคม 2565",
            //     icon: "https://img.icons8.com/external-line-icons-vinzence-studio/64/FFFFFF/external-currency-money-and-currency-line-icons-vinzence-studio-15.png",
            //   },
            //   {
            //     name: "ยอดขายเดือนปัจจุบัน",
            //     color: "card",
            //     desc: "xxxxx",
            //     numb: 879184,
            //     footer: "อัพเดทเมือ 20 มกราคม 2565",
            //     icon: "https://img.icons8.com/external-line-icons-vinzence-studio/64/FFFFFF/external-currency-money-and-currency-line-icons-vinzence-studio-15.png",
            //   },
            // ];
          },
          function err(err) {}
        );
      };

      $scope.getDashboard();
      $scope.checkReject();
      $scope.getvisit();
      $scope.getnotiUnread();
    }
  );
