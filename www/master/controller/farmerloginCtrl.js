angular
  .module("app")

  .controller(
    "farmerloginCtrl",
    function (
      $localStorage,
      $rootScope,
      $scope,
      $state,
      $ionicHistory,
      $http,
      Service,
      $ionicLoading,
      $timeout,
      fachttp,
      Service
    ) {
      (function ($) {
        "use strict";

        /*==================================================================
        [ Focus input ]*/
     

        /*==================================================================
        [ Show pass ]*/
        var showPass = 0;
        $(".btn-show-pass").on("click", function () {
          var x = document.getElementById("mypassword");
          if (x.type === "password") {
            x.type = "text";
          } else {
            x.type = "password";
          }

          if (showPass == 0) {
            $(this).next("input").attr("type", "text");
            $(this).find("i").removeClass("zmdi-eye");
            $(this).find("i").addClass("zmdi-eye-off");
            showPass = 1;
          } else {
            console.log(2);

            $(this).next("input").attr("type", "password");
            $(this).find("i").addClass("zmdi-eye");
            $(this).find("i").removeClass("zmdi-eye-off");
            showPass = 0;
          }
        });
      })(jQuery);

      let vm = this;

      $scope.model = {
        username: "",
        password: "",
      };

      // let req = { mode: "logincenter", value: $scope.model };

      // fachttp.post('login.php',req).then(function(response){
      //   console.log(response)
      // })

      vm.goback = function () {
        $ionicHistory.goBack();
      };

      vm.login = function () {
        $ionicLoading.show({
          template:
            '<ion-spinner  class="spinner-calm"></ion-spinner><br>กรุณารอสักครู่',
        });

        let req = {
          mode: "logincenter",
          value: $scope.model,
        };

        fachttp.login("login.php", req).then(
          function (response) {
            console.log(response);
            if (response.data.status == true) {
              $state.go("app.menu");
              mobiscroll.toast({
                message: "เข้าสู่ระบบสำเร็จ",
                color: "success",
                display: "bottom",
              });
              $rootScope.global = response.data.result;
              $localStorage.globalDIGIS = $rootScope.global;

              if (response.data.mess) {
                mobiscroll.alert({
                  title: "แจ้งเตือน !!",
                  message: response.data.mess,
                });
              }
            } else {
              mobiscroll.alert({
                title: "แจ้งเตือน !!",
                message: response.data.mess,
              });
            }

            $ionicLoading.hide();
          },
          function err(errors) {
            console.log(errors);
            Service.timeout();
            $ionicLoading.hide();
          }
        );
      };

      vm.regis = function () {
        $state.go("register.regisapp");
      };
    }
  )
  .controller(
    "regisAppCtrl",
    function (
      $localStorage,
      $rootScope,
      $scope,
      $state,
      $ionicHistory,
      $http,
      Service,
      $ionicLoading,
      $ionicPopup,
      $mdDialog,
      $q,
      $timeout,
      $ionicScrollDelegate,
      $ionicModal
    ) {
      let vm = this;
      $scope.checkbox = {
        check1: false,
        check2: true,
      };

      $scope.openModal = function () {
        $ionicModal
          .fromTemplateUrl("user.html", {
            scope: $scope,
            animation: "slide-in-up",
          })
          .then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
          });
      };

      $scope.closeModal = function () {
        $scope.modal.hide();
        $scope.modal.remove();
      };

      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        if ($scope.modal) {
          $scope.modal.remove();
        } else {
        }
      });

      vm.check1Change = function (e) {
        if (e) {
          $scope.checkbox.check2 = false;
        }
      };

      vm.check2Change = function (e) {
        if (e) {
          $scope.checkbox.check1 = false;
        }
      };

      vm.goback = function () {
        $ionicHistory.goBack();
      };
      $scope.model = {};

      function province() {
        $ionicLoading.show();
        let url = $rootScope.ipregister + "register.php";
        let req = {
          mode: "province",
        };

        $http.post(url, req).then(
          function (response) {
            console.log(response.data);
            if (response.data.status == true) {
              vm.province = response.data.result;
              vm.provinceSelect = response.data.provinceSelect;
              vm.aumphur = response.data.aumphur;
              vm.aumphurSelect = response.data.aumphurSelect;
              vm.tumbol = response.data.tumbol;
              vm.tumbolSelect = response.data.tumbolSelect;
              $ionicLoading.hide();
            } else {
              $ionicLoading.hide();
            }
          },
          function err() {
            $ionicLoading.hide();
          }
        );
      }

      console.log("123");

      province();

      vm.provinceChange = function (e) {
        console.log(e);
        $ionicLoading.show();
        let url = $rootScope.ipregister + "register.php";
        let req = {
          mode: "AUMPHUR",
          data: e,
        };

        $http.post(url, req).then(
          function (response) {
            console.log(response.data);
            if (response.data.status == true) {
              vm.aumphur = response.data.result;
              vm.aumphurSelect = vm.aumphur[0];
              vm.aumphurChange(vm.aumphurSelect);
              // vm.tumbol =[];
              // delete vm.tumbolSelect

              $ionicLoading.hide();
            } else {
              $ionicLoading.hide();
            }
          },
          function err() {
            $ionicLoading.hide();
          }
        );
      };

      vm.aumphurChange = function (e) {
        $ionicLoading.show();
        let url = $rootScope.ipregister + "register.php";
        let req = {
          mode: "tumbol",
          data: e,
        };

        $http.post(url, req).then(
          function (response) {
            console.log(response.data);
            if (response.data.status == true) {
              vm.tumbol = response.data.result;
              vm.tumbolSelect = vm.tumbol[0];
              $ionicLoading.hide();
            } else {
              $ionicLoading.hide();
            }
          },
          function err() {
            $ionicLoading.hide();
          }
        );
      };

      vm.confirm = function () {
        console.log($scope.model);
        let passchech = $scope.checkPass();
        let citizenid = $scope.citizenId();

        if (!passchech) {
          $mdDialog.show(
            $mdDialog
              .alert()
              .parent(
                angular.element(document.querySelector("#popupContainer"))
              )
              .clickOutsideToClose(true)
              .title("แจ้งเตือน")
              .textContent(
                "ไม่สามารถสร้างผู้ใช้งานได้เนื่องจาก Password ไม่ตรงกันกรุณาลองใหม่อีกครั้ง"
              )
              .ariaLabel("Alert Dialog Demo")
              .ok("OK")
              .targetEvent()
          );
          // $scope.openModal()
        } else {
          $ionicLoading.show();
          console.log(passchech);
          console.log($scope.model);
          let canceller = $q.defer();

          $timeout(function () {
            canceller.resolve("user cancelled");
          }, 30000);

          let pro = {
            province: vm.provinceSelect,
            aumphur: vm.aumphurSelect,
            tumbol: vm.tumbolSelect,
          };
          let url = $rootScope.ipregister + "register.php";
          let req = {
            mode: "regis",
            value: $scope.model,
            pro: pro,
            img: vm.img,
            check: $scope.checkbox,
          };

          $http
            .post(url, req, {
              timeout: canceller.promise,
            })
            .then(
              function (response) {
                console.log(response.data);
                if (response.data.status == true) {
                  mobiscroll.alert({
                    title: "แจ้งเตือน",
                    message: "ลงทะเบียนสำเร็จโปรดแจ้ง ADMIN เพื่อทำการอนุมัติ",
                    callback: function () {
                      $scope.closeModal();
                      $ionicHistory.nextViewOptions({
                        disableBack: true,
                      });
                      $state.go("farmerlogin");
                    },
                  });
                  $ionicLoading.hide();
                } else {
                  $mdDialog.show(
                    $mdDialog
                      .alert()
                      .parent(
                        angular.element(
                          document.querySelector("#popupContainer")
                        )
                      )
                      .clickOutsideToClose(true)
                      .title("แจ้งเตือน")
                      .textContent(response.data.check)
                      .ariaLabel("Alert Dialog Demo")
                      .ok("OK")
                      .targetEvent()
                  );
                  $ionicLoading.hide();
                }
              },
              function err(err) {
                console.log(err);
                $ionicLoading.hide();
              }
            );
        }
      };

      let platform = ionic.Platform.platform();

      vm.pickdate = function () {
        if (platform == "android" || platform == "ios") {
          document.addEventListener("deviceready", function () {
            let k = Service.pickdate();
            k.then(function suss(data) {
              $scope.model.user_lastck = data;
            });
          });
        } else {
          $scope.datamodal = {};

          // An elaborate, custom popup
          var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="datamodal.date">',
            title: "Enter Date Ex 2019-01-31",
            subTitle: "ป้อนข้อูลตามรูปแบบ",
            scope: $scope,
            buttons: [
              {
                text: "Cancel",
              },
              {
                text: "<b>Save</b>",
                type: "button-positive",
                onTap: function (e) {
                  if (!$scope.datamodal.date) {
                    //don't allow the user to close unless he enters wifi password
                    e.preventDefault();
                  } else {
                    $scope.model.user_lastck = $scope.datamodal.date;
                  }
                },
              },
            ],
          });
        }
      };

      var monthArr = new Array();
      monthArr[0] = "มกราคม";
      monthArr[1] = "กุมภาพันธ์";
      monthArr[2] = "มีนาคม";
      monthArr[3] = "เมษายน";
      monthArr[4] = "พฤษภาคม";
      monthArr[5] = "มิถุนายน";
      monthArr[6] = "กรกฎาคม";
      monthArr[7] = "สิงหาคม";
      monthArr[8] = "กันยายน";
      monthArr[9] = "ตุลาคม";
      monthArr[10] = "พฤศจิกายน";
      monthArr[11] = "ธันวาคม";

      $scope.model = {
        userbirth: null,
        datedesc: null,
      };

      function startDate() {
        var d = new Date(),
          month = "" + (d.getMonth() + 1),
          day = "" + d.getDate(),
          year = d.getFullYear();

        monthAD = month;
        if (month.length < 2) monthAD = "0" + month;
        if (day.length < 2) day = "0" + day;

        $scope.model.user_birth = [year, monthAD, day].join("-");

        monthBE = monthArr[month - 1];

        $scope.model.datedesc = [day, monthBE, year + 543].join(" ");
      }

      startDate();

      $scope.mdDateChange = function (date) {
        var d = new Date(date),
          month = "" + (d.getMonth() + 1),
          day = "" + d.getDate(),
          year = d.getFullYear();

        monthAD = month;
        if (month.length < 2) monthAD = "0" + month;
        if (day.length < 2) day = "0" + day;

        $scope.model.user_birth = [year, monthAD, day].join("-");
        monthBE = monthArr[month - 1];
        $scope.model.datedesc = [day, monthBE, year + 543].join(" ");
      };

      vm.pickbirth = function () {
        if (platform == "android" || platform == "ios") {
          document.addEventListener("deviceready", function () {
            let k = Service.pickdate();
            k.then(function suss(data) {
              $scope.model.user_birth = data;
            });
          });
        } else {
          $scope.datamodal = {};

          // An elaborate, custom popup
          var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="datamodal.date">',
            title: "Enter Date Ex 2019-01-31",
            subTitle: "ป้อนข้อูลตามรูปแบบ",
            scope: $scope,
            buttons: [
              {
                text: "Cancel",
              },
              {
                text: "<b>Save</b>",
                type: "button-positive",
                onTap: function (e) {
                  if (!$scope.datamodal.date) {
                    //don't allow the user to close unless he enters wifi password
                    e.preventDefault();
                  } else {
                    $scope.model.user_birth = $scope.datamodal.date;
                  }
                },
              },
            ],
          });
        }
      };

      $scope.check = function () {
        if (
          !$scope.model.user_username ||
          !$scope.model.user_pass ||
          !$scope.model.user_repass ||
          // !$scope.model.user_title ||
          !$scope.model.user_fname ||
          !$scope.model.user_lname ||
          !$scope.model.user_birth ||
          // !$scope.model.user_citizen_id ||
          !$scope.model.user_email ||
          !$scope.model.user_tel ||
          !$scope.model.user_address ||
          !$scope.model.user_moo ||
          !vm.provinceSelect ||
          !vm.aumphurSelect ||
          !vm.tumbolSelect ||
          !$scope.model.user_zip ||
          $scope.citizenId() == false
        ) {
          return true;
        } else {
          return false;
        }
      };

      $scope.checkPass = function () {
        if (
          $scope.model.user_pass != $scope.model.user_repass ||
          !$scope.model.user_pass ||
          !$scope.model.user_repass
        ) {
          return false;
        } else {
          return true;
        }
      };

      $scope.citizenId = function () {
        if ($scope.model.user_citizen_id) {
          let str = $scope.model.user_citizen_id;

          for (i = 0, sum = 0; i < 12; i++) {
            sum += parseFloat(str.charAt(i)) * (13 - i);
          }
          if ((11 - (sum % 11)) % 10 != parseFloat(str.charAt(12))) {
            return false;
          } else {
            return true;
          }
        } else {
          return false;
        }
      };

      vm.img = [];
      vm.remove = function (index) {
        console.log(index);
        vm.img.splice(index, 1);
      };

      vm.add = function (ev) {
        if (vm.img.length < 6) {
          let platform = ionic.Platform.platform();
          // $scope.openModalPic();

          if (platform == "android" || platform == "ios") {
            $mdDialog
              .show({
                controller: DialogController,
                templateUrl: "templates/dialog1.html",
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
              })
              .then(
                function (answer) {
                  switch (answer) {
                    case "camera":
                      camera();
                      break;
                    case "image":
                      image();
                      break;
                  }
                  //////console.log('You said the information was "' + answer + '".');
                },
                function () {}
              );
          } else {
            vm.img.push(
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAhFBMVEVHcEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADu3R4CAAAAK3RSTlMAMgbMyOLaEfAIxRDQ6iqeBQHnpQ75/Qry/HuF+7H0WTldD8PgDM+i7vZT5lfrpwAAAIRJREFUKM+tkNkSgjAMRQtlqcquKLIqyqL5//+TTpHQPnUYzlvumUwyl5CNHBBznZ8A8bREy5CXzunIlYjn+HJOQYLlQoRyDHUJT57HTM6TWwMVF6aykD0KOC7iav9J+IgC7o7gDYrw5xcDDRFRSvuV+ExziCWiUNodDcFXs/bOQgayNz9lFx11aSeL8AAAAABJRU5ErkJggg=="
            );
            $ionicScrollDelegate.resize();
          }
        } else {
          $mdDialog.show(
            $mdDialog
              .alert()
              .parent(
                angular.element(document.querySelector("#popupContainer"))
              )
              .clickOutsideToClose(true)
              .title("แจ้งเตือน")
              .textContent("ไม่สามารถเพิ่มรูปภาพมากกว่า 6 รูปได้")
              .ariaLabel("Alert Dialog Demo")
              .ok("OK")
              .targetEvent()
          );
        }
      };

      function DialogController($scope, $mdDialog) {
        $scope.hide = function () {
          $mdDialog.hide();
        };

        $scope.cancel = function () {
          $mdDialog.cancel();
        };

        $scope.answer = function (answer) {
          $mdDialog.hide(answer);
        };
      }

      function camera() {
        navigator.camera.getPicture(onSuccess, onFail, {
          quality: 40,
          sourceType: Camera.PictureSourceType.CAMERA,
          destinationType: Camera.DestinationType.DATA_URL,
        });

        function onSuccess(imageData) {
          var image = document.getElementById("myImage");
          $scope.image = "data:image/jpeg;base64," + imageData;
          vm.img.push($scope.image);
          $ionicScrollDelegate.resize();
        }

        function onFail(message) {
          alert("Failed because: " + message);
        }
      }

      function image() {
        navigator.camera.getPicture(onSuccess, onFail, {
          quality: 40,
          sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
          destinationType: Camera.DestinationType.DATA_URL,
          targetWidth: 1920,
          targetHeight: 1080,
        });

        function onSuccess(imageData) {
          var image = document.getElementById("myImage");
          $scope.image = "data:image/jpeg;base64," + imageData;
          vm.img.push($scope.image);
          $ionicScrollDelegate.resize();
        }

        function onFail(message) {
          alert("Failed because: " + message);
        }
      }

      $scope.back = function () {
        $ionicHistory.goBack();
      };

      $scope.checkChecCon = function () {
        console.log(1);
        if (
          $scope.checkbox.check1 == false &&
          $scope.checkbox.check2 == false
        ) {
          console.log(2);

          return true;
        } else if (
          $scope.checkbox.check1 == true &&
          $scope.checkbox.check2 == false
        ) {
          console.log(3);
          return false;
        } else if (
          $scope.checkbox.check1 == false &&
          $scope.checkbox.check2 == true
        ) {
          console.log(4);
          if ($scope.model.enterpise_pass) {
            return false;
          } else {
            return true;
          }
        }
      };
    }
  );
