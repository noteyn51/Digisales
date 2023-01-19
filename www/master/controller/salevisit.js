angular
  .module("app")

  .controller(
    "salevisitAddCtrl",
    function (
      $http,
      $rootScope,
      $ionicHistory,
      fachttp,
      $ionicLoading,
      Service,
      $state,
      $scope,
      $compile,
      $ionicModal,
      goBackMany,
      $ionicScrollDelegate,
      $ionicPopup,
      $stateParams,
      $mdDialog,
      $location
    ) {
      let vm = this;
      let platform = ionic.Platform.platform();

      var defaultdate;
      var defaultdateDesc;
      var defaultdateValue;
      var defaultTimedesc;

      $scope.jobAdd = [];
      $scope.jobDelete = [];

      if ($stateParams.date) {
        console.log($stateParams.date);
        defaultdate = new Date($stateParams.date);
        defaultdateValue = defaultdate.toLocaleDateString("en-CA");
        defaultdateDesc = defaultdate.toLocaleDateString("th-TH", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        defaultTimedesc = new Date().toLocaleString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        });
      } else {
        defaultdate = new Date();
        defaultdateDesc = defaultdate.toLocaleDateString("th-TH", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        defaultdateValue = defaultdate.toLocaleDateString("en-CA");
        defaultTimedesc = defaultdate.toLocaleString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        });
      }

      $scope.checkValue = function () {
        var checkdata = $scope.model;
        if (
          checkdata.cm &&
          checkdata.os &&
          checkdata.location &&
          checkdata.listJob.length > 0
        ) {
          return true;
        } else {
          return false;
        }
      };

      $scope.confirm = function () {
        console.log($scope.model);

        let check = $scope.checkValue();

        if (check) {
          $ionicLoading.show();
          let req = {
            mode: "insertvisit",
            data: $scope.model,
          };
          fachttp.model("salevisit.php", req).then(
            function (response) {
              console.log(response.data);

              $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true,
              });

              $state.go("app.menu");
              setTimeout(() => {
                $ionicLoading.hide();
                $ionicHistory.clearHistory();
                $state.go("app.salevisitList");
              }, 500);
            },
            function err(err) {
              $ionicLoading.hide();
              Service.timeout();
            }
          );
        } else {
          $mdDialog.show(
            $mdDialog
              .alert()
              .parent(
                angular.element(document.querySelector("#popupContainer"))
              )
              .clickOutsideToClose(false)
              .title("แจ้งเตือน")
              .textContent("ข้อมูลไม่ครบถ้วนโปรดลองใหม่อีกครั้ง")
              .ariaLabel("Alert Dialog Demo")
              .ok("OK")
              .targetEvent()
          );
        }
      };

      $scope.model = {
        cm: null,
        os: null,
        location: null,
        datestart: {
          value: defaultdateValue,
          desc: defaultdateDesc,
        },
        timestart: { value: defaultTimedesc, desc: defaultTimedesc },
        dateend: { value: defaultdateValue, desc: defaultdateDesc },
        timeend: { value: defaultTimedesc, desc: defaultTimedesc },
        listJob: [],
      };

      $scope.selectDate = function () {
        if (platform == "android" || platform == "ios") {
          document.addEventListener("deviceready", function () {
            let k = Service.pickdate();
            k.then(function suss(data) {
              const mydate = new Date(data);
              const resultdesc = mydate.toLocaleDateString("th-TH", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });
              const resultvalue = mydate.toLocaleDateString("en-CA");

              $scope.model.datestart.value = resultvalue;
              $scope.model.datestart.desc = resultdesc;
              $scope.model.dateend.value = resultvalue;
              $scope.model.dateend.desc = resultdesc;
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
              { text: "Cancel" },
              {
                text: "<b>Save</b>",
                type: "button-positive",
                onTap: function (e) {
                  if (!$scope.datamodal.date) {
                    //don't allow the user to close unless he enters wifi password
                    e.preventDefault();
                  } else {
                    return $scope.datamodal.date;
                  }
                },
              },
            ],
          });

          myPopup.then(function (res) {
            if (res) {
              const mydate = new Date($scope.datamodal.date);
              const result = mydate.toLocaleDateString("th-TH", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });

              $scope.model.datestart.value = $scope.datamodal.date;
              $scope.model.datestart.desc = result;
            }
          });
        }
      };

      $scope.selectTime = function () {
        if (platform == "android" || platform == "ios") {
          document.addEventListener("deviceready", function () {
            let k = Service.picktime();
            k.then(function suss(data) {
              data = data.substr(0, 5);

              $scope.model.timestart.value = data;
              $scope.model.timestart.dsec = data;
            });
          });
        } else {
          $scope.data = {};

          // An elaborate, custom popup
          var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="data.date">',
            title: "Enter Date Ex 20:20",
            subTitle: "ป้อนข้อูลตามรูปแบบ",
            scope: $scope,
            buttons: [
              { text: "Cancel" },
              {
                text: "<b>Save</b>",
                type: "button-positive",
                onTap: function (e) {
                  if (!$scope.data.date) {
                    //don't allow the user to close unless he enters wifi password
                    e.preventDefault();
                  } else {
                    return $scope.data.date;
                  }
                },
              },
            ],
          });

          myPopup.then(function (res) {
            // console.log($scope.data)
            if (res) {
              $scope.model.timestart.value = $scope.data.date.substr(0, 5);
              $scope.model.timestart.desc = $scope.data.date.substr(0, 5);
            }
          });
        }
      };

      $scope.selectDateTo = function () {
        if (platform == "android" || platform == "ios") {
          document.addEventListener("deviceready", function () {
            let k = Service.pickdate();
            k.then(function suss(data) {
              const mydate = new Date(data);
              const resultdesc = mydate.toLocaleDateString("th-TH", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });
              const resultvalue = mydate.toLocaleDateString("en-CA");

              if (resultvalue >= $scope.model.datestart.value) {
                $scope.model.dateend.value = resultvalue;
                $scope.model.dateend.desc = resultdesc;
              } else {
                $mdDialog.show(
                  $mdDialog
                    .alert()
                    .parent(
                      angular.element(document.querySelector("#popupContainer"))
                    )
                    .clickOutsideToClose(false)
                    .title("แจ้งเตือน")
                    .textContent("รูปแบบวันที่ไม่ถูกต้อง")
                    .ariaLabel("Alert Dialog Demo")
                    .ok("OK")
                    .targetEvent()
                );
              }
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
              { text: "Cancel" },
              {
                text: "<b>Save</b>",
                type: "button-positive",
                onTap: function (e) {
                  if (!$scope.datamodal.date) {
                    //don't allow the user to close unless he enters wifi password
                    e.preventDefault();
                  } else {
                    return $scope.datamodal.date;
                  }
                },
              },
            ],
          });

          myPopup.then(function (res) {
            if (res) {
              const mydate = new Date($scope.datamodal.date);
              const result = mydate.toLocaleDateString("th-TH", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });

              $scope.model.dateend.value = $scope.datamodal.date;
              $scope.model.dateend.desc = result;
            }
          });
        }
      };

      $scope.selectTimeTo = function () {
        if (platform == "android" || platform == "ios") {
          document.addEventListener("deviceready", function () {
            let k = Service.picktime();
            k.then(function suss(data) {
              data = data.substr(0, 5);
              $scope.model.timeend.value = data;
              $scope.model.timeend.dsec = data;
            });
          });
        } else {
          $scope.data = {};

          // An elaborate, custom popup
          var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="data.date">',
            title: "Enter Date Ex 20:20",
            subTitle: "ป้อนข้อูลตามรูปแบบ",
            scope: $scope,
            buttons: [
              { text: "Cancel" },
              {
                text: "<b>Save</b>",
                type: "button-positive",
                onTap: function (e) {
                  if (!$scope.data.date) {
                    //don't allow the user to close unless he enters wifi password
                    e.preventDefault();
                  } else {
                    return $scope.data.date;
                  }
                },
              },
            ],
          });

          myPopup.then(function (res) {
            // console.log($scope.data)
            if (res) {
              $scope.model.timeend.value = $scope.data.date.substr(0, 5);
              $scope.model.timeend.desc = $scope.data.date.substr(0, 5);
            }
          });
        }
      };

      $scope.viewCalendar = function () {
        $state.go("app.salevisitCalendar");
      };

      $scope.viewHistory = function () {
        $state.go("app.salevisitHistory");
      };

      $scope.viewAdd = function () {
        $state.go("app.salevisitAdd");
      };

      $scope.finish = function () {
        goBackMany(1);
      };

      $scope.addJob = function () {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog
          .prompt()
          .title("เพิ่มหัวข้อดำเนินการที่ต้องทำ")
          .textContent("ป้อนรายละเอียดหัวข้องาน")
          .placeholder("")
          .ariaLabel("Dog name")
          .initialValue("")
          .targetEvent()
          .required(true)
          .ok("ยืนยัน")
          .cancel("ยกเลิก");

        $mdDialog.show(confirm).then(
          function (result) {
            let job = {
              title: result,
              message: null,
            };

            $scope.model.listJob.push(job);
            $scope.jobAdd.push(job);
            $ionicScrollDelegate.resize();
          },
          function () {
            // $scope.status = 'You didn\'t name your dog.';
          }
        );
      };

      $scope.deleteJob = function (e) {
        $scope.model.listJob.splice(e, 1);
        $scope.jobAdd.push($scope.model.listJob[e]);

        $ionicScrollDelegate.resize();
      };

      $ionicModal
        .fromTemplateUrl("cm-modal.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.modalCm = modal;
        });

      $scope.openModalCm = function () {
        vm.data = [];
        $scope.modalCm.show();
        $scope.loadCm();
      };

      $scope.closeModalCm = function () {
        $scope.modalCm.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        $scope.modalCm.remove();
      });

      $ionicModal
        .fromTemplateUrl("cm-os.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.modalOs = modal;
        });

      $scope.openModalOs = function () {
        vm.oslist = [];
        $scope.modalOs.show();
        $scope.loadOs();
      };

      $scope.closeModalOs = function () {
        $scope.modalOs.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        $scope.modalOs.remove();
      });

      $scope.loadCm = function () {
        $ionicLoading.show();
        let req = {
          mode: "cm_p_mstr",
        };
        fachttp.model("salepp.php", req).then(
          function (response) {
            console.log(response.data);
            vm.data = response.data;
            $ionicLoading.hide();
          },
          function err(err) {
            $ionicLoading.hide();
            Service.timeout();
          }
        );
      };

      $scope.loadOs = function () {
        $ionicLoading.show();
        let req = {
          mode: "os_list",
          cm_select: vm.cmselect,
        };
        fachttp.model("sq.php", req).then(
          function (response) {
            console.log(response.data);
            vm.oslist = response.data;
            $ionicLoading.hide();
          },
          function err(err) {
            $ionicLoading.hide();
            Service.timeout();
          }
        );
      };

      $scope.selectCm = function (e) {
        $ionicLoading.show();
        let req = {
          mode: "select_cm",
          cmad_addr: e.cm_addr,
        };
        fachttp.model("sq.php", req).then(
          function (response) {
            console.log(response.data);

            if (response.data.status == true) {
              $scope.model.cm = response.data.result;
              $scope.model.os = null;
            } else {
              $mdDialog.show(
                $mdDialog
                  .alert()
                  .parent(
                    angular.element(document.querySelector("#popupContainer"))
                  )
                  .clickOutsideToClose(false)
                  .title("แจ้งเตือน")
                  .textContent("ไม่พบรายการที่เลือก")
                  .ariaLabel("Alert Dialog Demo")
                  .ok("OK")
                  .targetEvent()
              );
            }

            $ionicLoading.hide();
          },
          function err(err) {
            $ionicLoading.hide();
            Service.timeout();
          }
        );
        vm.cmselect = e;
        $scope.closeModalCm();
        console.log(vm.cmselect);
      };

      $scope.selectOs = function (e) {
        $scope.model.os = e;
        $scope.closeModalOs();
        console.log(e);
      };
    }
  )

  .controller(
    "salevisitEditCtrl",
    function (
      $http,
      $rootScope,
      $ionicHistory,
      fachttp,
      $ionicLoading,
      Service,
      $state,
      $scope,
      $compile,
      $ionicModal,
      goBackMany,
      $ionicScrollDelegate,
      $ionicPopup,
      $stateParams,
      $mdDialog,
      $location
    ) {
      let vm = this;
      let platform = ionic.Platform.platform();

      $scope.data = JSON.parse($stateParams.data);
      console.log($scope.data);

      $scope.jobAdd = [];
      $scope.jobDelete = [];

      var defaultdate;
      var defaultdateDesc;
      var defaultdateValue;
      var defaultTimedesc;

      var defaultdateEnd;
      var defaultdateDescEnd;
      var defaultdateValueEnd;
      var defaultTimedescEnd;

      if ($scope.data) {
        var dateMomentObject = moment(
          $scope.data.calendar_date1_start_value,
          "YYYY-MM-DD HH:mm"
        ); // 1st argument - string, 2nd argument - format
        defaultdate = dateMomentObject.toDate();

        defaultdateValue = defaultdate.toLocaleDateString("en-CA");
        defaultdateDesc = defaultdate.toLocaleDateString("th-TH", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        defaultTimedesc = defaultdate.toLocaleString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        });

        var dateMomentObjectEnd = moment(
          $scope.data.calendar_date1_end_value,
          "YYYY-MM-DD HH:mm"
        ); // 1st argument - string, 2nd argument - format
        defaultdateEnd = dateMomentObjectEnd.toDate();

        defaultdateValueEnd = defaultdateEnd.toLocaleDateString("en-CA");
        defaultdateDescEnd = defaultdateEnd.toLocaleDateString("th-TH", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        defaultTimedescEnd = defaultdateEnd.toLocaleString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        });
      } else {
        defaultdate = new Date();
        defaultdateDesc = defaultdate.toLocaleDateString("th-TH", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        defaultdateValue = defaultdate.toLocaleDateString("en-CA");
        defaultTimedesc = defaultdate.toLocaleString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        });
      }

      $scope.confirm = function () {
        console.log($scope.model);

        $ionicLoading.show();
        let req = {
          mode: "updateVisitMstr",
          data: $scope.model,
          jobadd: $scope.jobAdd,
          jobdel: $scope.jobDelete,
        };
        fachttp.model("salevisit.php", req).then(
          function (response) {
            console.log(response.data);

            $ionicHistory.nextViewOptions({
              disableAnimate: true,
              disableBack: true,
            });

            $state.go("app.menu");
            setTimeout(() => {
              $ionicLoading.hide();
              $ionicHistory.clearHistory();
              $state.go("app.salevisitList");
            }, 500);
          },
          function err(err) {
            $ionicLoading.hide();
            Service.timeout();
          }
        );
      };

      $scope.deleteVisit = function () {
        var confirm = $mdDialog
          .confirm()
          .title("ต้องการยกเลิกนัดหมายนี้หรือไม่ ?")
          .textContent("ยกเลิกรายการนัดหมายนี้ รายการนัดหมายนี้จะหายไป")
          .ariaLabel("Lucky day")
          .targetEvent()
          .ok("ยืนยัน")
          .cancel("ยกเลิก");

        $mdDialog.show(confirm).then(
          function () {
            $ionicLoading.show();
            let req = {
              mode: "deletevisit",
              data: $scope.model,
            };
            fachttp.model("salevisit.php", req).then(
              function (response) {
                console.log(response.data);

                $ionicHistory.nextViewOptions({
                  disableAnimate: true,
                  disableBack: true,
                });

                $state.go("app.menu");
                setTimeout(() => {
                  $ionicLoading.hide();
                  $ionicHistory.clearHistory();
                  $state.go("app.salevisitList");
                }, 500);
              },
              function err(err) {
                $ionicLoading.hide();
                Service.timeout();
              }
            );
          },
          function () {}
        );
      };

      $scope.model = {
        calendar_nbr: $scope.data.calendar_nbr,
        cm: {
          cmad_addr: $scope.data.calendar_cust,
          cm_sort: $scope.data.cmad_attn,
        },
        os: { os_nbr: $scope.data.calendar_os_nbr },
        location: $scope.data.calendar_desc1,
        datestart: {
          value: defaultdateValue,
          desc: defaultdateDesc,
        },
        timestart: { value: defaultTimedesc, desc: defaultTimedesc },
        dateend: { value: defaultdateValueEnd, desc: defaultdateDescEnd },
        timeend: { value: defaultTimedescEnd, desc: defaultTimedescEnd },
        listJob: $scope.data.listjob,
      };

      $scope.selectDate = function () {
        if (platform == "android" || platform == "ios") {
          document.addEventListener("deviceready", function () {
            let k = Service.pickdate();
            k.then(function suss(data) {
              const mydate = new Date(data);
              const resultdesc = mydate.toLocaleDateString("th-TH", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });
              const resultvalue = mydate.toLocaleDateString("en-CA");

              $scope.model.datestart.value = resultvalue;
              $scope.model.datestart.desc = resultdesc;
              $scope.model.dateend.value = resultvalue;
              $scope.model.dateend.desc = resultdesc;
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
              { text: "Cancel" },
              {
                text: "<b>Save</b>",
                type: "button-positive",
                onTap: function (e) {
                  if (!$scope.datamodal.date) {
                    //don't allow the user to close unless he enters wifi password
                    e.preventDefault();
                  } else {
                    return $scope.datamodal.date;
                  }
                },
              },
            ],
          });

          myPopup.then(function (res) {
            if (res) {
              const mydate = new Date($scope.datamodal.date);
              const result = mydate.toLocaleDateString("th-TH", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });

              $scope.model.datestart.value = $scope.datamodal.date;
              $scope.model.datestart.desc = result;
            }
          });
        }
      };

      $scope.selectTime = function () {
        if (platform == "android" || platform == "ios") {
          document.addEventListener("deviceready", function () {
            let k = Service.picktime();
            k.then(function suss(data) {
              data = data.substr(0, 5);

              $scope.model.timestart.value = data;
              $scope.model.timestart.dsec = data;
            });
          });
        } else {
          $scope.data = {};

          // An elaborate, custom popup
          var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="data.date">',
            title: "Enter Date Ex 20:20",
            subTitle: "ป้อนข้อูลตามรูปแบบ",
            scope: $scope,
            buttons: [
              { text: "Cancel" },
              {
                text: "<b>Save</b>",
                type: "button-positive",
                onTap: function (e) {
                  if (!$scope.data.date) {
                    //don't allow the user to close unless he enters wifi password
                    e.preventDefault();
                  } else {
                    return $scope.data.date;
                  }
                },
              },
            ],
          });

          myPopup.then(function (res) {
            // console.log($scope.data)
            if (res) {
              $scope.model.timestart.value = $scope.data.date.substr(0, 5);
              $scope.model.timestart.desc = $scope.data.date.substr(0, 5);
            }
          });
        }
      };

      $scope.selectDateTo = function () {
        if (platform == "android" || platform == "ios") {
          document.addEventListener("deviceready", function () {
            let k = Service.pickdate();
            k.then(function suss(data) {
              const mydate = new Date(data);
              const resultdesc = mydate.toLocaleDateString("th-TH", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });
              const resultvalue = mydate.toLocaleDateString("en-CA");

              if (resultvalue >= $scope.model.datestart.value) {
                $scope.model.dateend.value = resultvalue;
                $scope.model.dateend.desc = resultdesc;
              } else {
                $mdDialog.show(
                  $mdDialog
                    .alert()
                    .parent(
                      angular.element(document.querySelector("#popupContainer"))
                    )
                    .clickOutsideToClose(false)
                    .title("แจ้งเตือน")
                    .textContent("รูปแบบวันที่ไม่ถูกต้อง")
                    .ariaLabel("Alert Dialog Demo")
                    .ok("OK")
                    .targetEvent()
                );
              }
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
              { text: "Cancel" },
              {
                text: "<b>Save</b>",
                type: "button-positive",
                onTap: function (e) {
                  if (!$scope.datamodal.date) {
                    e.preventDefault();
                  } else {
                    return $scope.datamodal.date;
                  }
                },
              },
            ],
          });

          myPopup.then(function (res) {
            if (res) {
              const mydate = new Date($scope.datamodal.date);
              const result = mydate.toLocaleDateString("th-TH", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });

              $scope.model.dateend.value = $scope.datamodal.date;
              $scope.model.dateend.desc = result;
            }
          });
        }
      };

      $scope.selectTimeTo = function () {
        if (platform == "android" || platform == "ios") {
          document.addEventListener("deviceready", function () {
            let k = Service.picktime();
            k.then(function suss(data) {
              data = data.substr(0, 5);
              $scope.model.timeend.value = data;
              $scope.model.timeend.dsec = data;
            });
          });
        } else {
          $scope.data = {};

          // An elaborate, custom popup
          var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="data.date">',
            title: "Enter Date Ex 20:20",
            subTitle: "ป้อนข้อูลตามรูปแบบ",
            scope: $scope,
            buttons: [
              { text: "Cancel" },
              {
                text: "<b>Save</b>",
                type: "button-positive",
                onTap: function (e) {
                  if (!$scope.data.date) {
                    //don't allow the user to close unless he enters wifi password
                    e.preventDefault();
                  } else {
                    return $scope.data.date;
                  }
                },
              },
            ],
          });

          myPopup.then(function (res) {
            // console.log($scope.data)
            if (res) {
              $scope.model.timeend.value = $scope.data.date.substr(0, 5);
              $scope.model.timeend.desc = $scope.data.date.substr(0, 5);
            }
          });
        }
      };

      $scope.viewCalendar = function () {
        $state.go("app.salevisitCalendar");
      };

      $scope.viewHistory = function () {
        $state.go("app.salevisitHistory");
      };

      $scope.viewAdd = function () {
        $state.go("app.salevisitAdd");
      };

      $scope.finish = function () {
        goBackMany(1);
      };

      $scope.addJob = function () {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog
          .prompt()
          .title("เพิ่มหัวข้อดำเนินการที่ต้องทำ")
          .textContent("ป้อนรายละเอียดหัวข้องาน")
          .placeholder("")
          .ariaLabel("Dog name")
          .initialValue("")
          .targetEvent()
          .required(true)
          .ok("ยืนยัน")
          .cancel("ยกเลิก");

        $mdDialog.show(confirm).then(
          function (result) {
            let job = {
              title: result,
              message: null,
            };

            $scope.model.listJob.push(job);
            $scope.jobAdd.push(job);
            $ionicScrollDelegate.resize();
          },
          function () {}
        );
      };

      $scope.deleteJob = function (e) {
        console.log($scope.model.listJob);
        console.log(e);
        $scope.jobDelete.push($scope.model.listJob[e]);
        $scope.model.listJob.splice(e, 1);
        $ionicScrollDelegate.resize();
      };

      $ionicModal
        .fromTemplateUrl("cm-modal.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.modalCm = modal;
        });

      $scope.openModalCm = function () {
        vm.data = [];
        $scope.modalCm.show();
        $scope.loadCm();
      };

      $scope.closeModalCm = function () {
        $scope.modalCm.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        $scope.modalCm.remove();
      });

      $ionicModal
        .fromTemplateUrl("cm-os.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.modalOs = modal;
        });

      $scope.openModalOs = function () {
        vm.oslist = [];
        $scope.modalOs.show();
        $scope.loadOs();
      };

      $scope.closeModalOs = function () {
        $scope.modalOs.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        $scope.modalOs.remove();
      });

      $scope.loadCm = function () {
        $ionicLoading.show();
        let req = {
          mode: "cm_p_mstr",
        };
        fachttp.model("salepp.php", req).then(
          function (response) {
            console.log(response.data);
            vm.data = response.data;
            $ionicLoading.hide();
          },
          function err(err) {
            $ionicLoading.hide();
            Service.timeout();
          }
        );
      };

      $scope.loadOs = function () {
        $ionicLoading.show();
        let req = {
          mode: "os_list",
          cm_select: vm.cmselect,
        };
        fachttp.model("sq.php", req).then(
          function (response) {
            console.log(response.data);
            vm.oslist = response.data;
            $ionicLoading.hide();
          },
          function err(err) {
            $ionicLoading.hide();
            Service.timeout();
          }
        );
      };

      $scope.selectCm = function (e) {
        $ionicLoading.show();
        let req = {
          mode: "select_cm",
          cmad_addr: e.cm_addr,
        };
        fachttp.model("sq.php", req).then(
          function (response) {
            console.log(response.data);

            if (response.data.status == true) {
              $scope.model.cm = response.data.result;
              $scope.model.os = null;
            } else {
              $mdDialog.show(
                $mdDialog
                  .alert()
                  .parent(
                    angular.element(document.querySelector("#popupContainer"))
                  )
                  .clickOutsideToClose(false)
                  .title("แจ้งเตือน")
                  .textContent("ไม่พบรายการที่เลือก")
                  .ariaLabel("Alert Dialog Demo")
                  .ok("OK")
                  .targetEvent()
              );
            }

            $ionicLoading.hide();
          },
          function err(err) {
            $ionicLoading.hide();
            Service.timeout();
          }
        );
        vm.cmselect = e;
        $scope.closeModalCm();
        console.log(vm.cmselect);
      };

      $scope.selectOs = function (e) {
        $scope.model.os = e;
        $scope.closeModalOs();
        console.log(e);
      };
    }
  )

  .controller(
    "salevisitDetailCtrl",
    function (
      $http,
      $rootScope,
      $ionicHistory,
      fachttp,
      $ionicLoading,
      Service,
      $state,
      $scope,
      $compile,
      $ionicModal,
      goBackMany,
      $stateParams,
      $mdBottomSheet
    ) {
      let vm = this;

      $scope.visitDetail = {};
      // $scope.image = [{image_path:"data:image/gif;base64,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"}];

      $scope.image = [];

      $scope.imaeDel = [];

      $scope.getvisitDetail = function () {
        $ionicLoading.show();
        let req = {
          mode: "getvisitDet",
          visitnbr: $stateParams.visitNbr,
        };
        fachttp.model("salevisit.php", req).then(
          function (response) {
            console.log(response.data);
            if (response.status) {
              $scope.visitDetail = response.data.result;
              $scope.visitDetail.listimg.forEach((element) => {
                // console.log(element.pic_path)
                $scope.image.push(element);
              });
            } else {
            }
            $ionicLoading.hide();
          },
          function err(err) {
            $ionicLoading.hide();
            Service.timeout();
          }
        );
      };

      $scope.getvisitDetail();

      $scope.edit = function () {
        $state.go("app.salevisitEdit", {
          data: JSON.stringify($scope.visitDetail),
        });

        console.log($scope.visitDetail);
      };
      $scope.checkVisit = function (e) {
        console.log($scope.model);
        $ionicLoading.show();
        let req = {
          mode: "checkVisit",
          submode: e,
          visitDetail: $scope.visitDetail,
        };
        fachttp.model("salevisit.php", req).then(
          function (response) {
            console.log(response.data);
            document.addEventListener("deviceready", function () {
              cordova.plugins.notification.local.schedule({
                title:
                  e == "checkin"
                    ? "เช็คอินเรียบร้อยแล้ว"
                    : "เช็คเอาท์เรียนร้อยแล้ว",
                // text: "Notification Test",
                vibrate: true,
                foreground: true,
                data: { notification_foreground: true },
                priority: 2,
                sound: true,
                smallIcon: "res://notification_icon",
              });
            });

            $scope.getvisitDetail();
            $ionicLoading.hide();
          },
          function err(err) {
            $ionicLoading.hide();
            Service.timeout();
          }
        );

        document.addEventListener("deviceready", function () {
          setTimeout(() => {
            if (e == "checkin") {
              let message =
                "สิ้นสุดเวลานัดหมาย " +
                $scope.visitDetail.cmad_attn +
                " โปรดเช็คเอาท์เพื่อบันทึกข้อมูล";

              var dateend = $scope.visitDetail.calendar_date1_end_value; //"2022-10-20 16:00";
              var nowDate = new Date();
              var d1 = new Date(dateend);
              console.log(d1);
              console.log(message);

              if (nowDate < d1) {
                cordova.plugins.notification.local.schedule({
                  title: "แจ้งเตือนนัดหมาย",
                  text: message,
                  vibrate: true,
                  foreground: true,
                  data: { notification_foreground: true },
                  priority: 3,
                  sound: true,
                  smallIcon: "res://notification_icon",
                  trigger: { at: d1 },
                });
              }
            }
          }, 1000);
        });
      };

      $scope.saveDetail = function () {
        $ionicLoading.show();
        let req = {
          mode: "updateListJob",
          data: $scope.visitDetail,
          img: $scope.image,
          imgDel: $scope.imaeDel,
        };
        fachttp.model("salevisit.php", req).then(
          function (response) {
            console.log(response.data);
            if (response.status) {
              $ionicHistory.goBack();
              // $scope.visitDetail = response.data.result;
            } else {
            }
            $ionicLoading.hide();
          },
          function err(err) {
            $ionicLoading.hide();
            Service.timeout();
          }
        );

        console.log($scope.visitDetail.listjob);
      };

      $scope.jobDetail = {
        jobList: [
          { title: "หัวข้อ1" },
          { title: "หัวข้อ2" },
          { title: "หัวข้อ3" },
          { title: "หัวข้อ4" },
          { title: "หัวข้อ5" },
          { title: "หัวข้อ6" },
          { title: "หัวข้อ7" },
          { title: "หัวข้อ8" },
          { title: "หัวข้อ9" },
        ],
      };

      $scope.showListBottomSheet = function () {
        $scope.alert = "";
        $mdBottomSheet
          .show({
            templateUrl: "action.html",
            controller: "ListBottomSheetCtrl",
          })
          .then(function (clickedItem) {
            $scope.alert = clickedItem["name"] + " clicked!";
            console.log(clickedItem);

            switch (clickedItem["icon"]) {
              case "image":
                $scope.getPicture();

                break;

              default:
                $scope.takePicture();
                break;
            }
          })
          .catch(function (error) {
            // User clicked outside or hit escape
          });
      };

      $scope.imageAction = function (i, e) {
        $scope.alert = "";
        $mdBottomSheet
          .show({
            templateUrl: "action.html",
            controller: "ListBottomSheetActionCtrl",
          })
          .then(function (clickedItem) {
            $scope.alert = clickedItem["name"] + " clicked!";
            console.log(clickedItem);

            switch (clickedItem["icon"]) {
              case "image":
                $scope.getPicture("edit", i, e);

                break;
              case "camera":
                $scope.takePicture("edit", i, e);

                break;

              default:
                $scope.imaeDel.push(e);
                $scope.image.splice(i, 1);
                break;
            }
          })
          .catch(function (error) {
            // User clicked outside or hit escape
          });
      };

      $scope.takePicture = function (e, i, d) {
        navigator.camera.getPicture(onSuccess, onFail, {
          sourceType: Camera.PictureSourceType.CAMERA,
          destinationType: Camera.DestinationType.DATA_URL,
          targetWidth: 1024,
          targetHeight: 1024,
          // Some common settings are 20, 50, and 100
          quality: 50,
          // In this app, dynamically set the picture source, Camera or photo gallery
          encodingType: Camera.EncodingType.JPEG,
          mediaType: Camera.MediaType.PICTURE,
          allowEdit: false,
          correctOrientation: true,
        });

        function onSuccess(imageData) {
          $ionicLoading.show({
            duration: 500,
          });
          var image = "data:image/jpeg;base64," + imageData;

          if (e == "edit") {
            $scope.imaeDel.push(d);
            $scope.image[i] = { image_path: image };
          } else {
            var image = "data:image/jpeg;base64," + imageData;
            $scope.image.push({ image_path: image });
          }
        }

        function onFail(message) {
          console.log(message);
        }
      };

      $scope.getPicture = function (e, i, d) {
        navigator.camera.getPicture(onSuccess, onFail, {
          sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
          destinationType: Camera.DestinationType.DATA_URL,
          targetWidth: 1024,
          targetHeight: 1024,
          // Some common settings are 20, 50, and 100
          quality: 50,
          // In this app, dynamically set the picture source, Camera or photo gallery
          encodingType: Camera.EncodingType.JPEG,
          mediaType: Camera.MediaType.PICTURE,
          correctOrientation: true,
        });

        function onSuccess(imageData) {
          $ionicLoading.show({
            duration: 500,
          });
          var image = "data:image/jpeg;base64," + imageData;

          if (e == "edit") {
            $scope.imaeDel.push(d);
            $scope.image[i] = { image_path: image };
          } else {
            var image = "data:image/jpeg;base64," + imageData;
            $scope.image.push({ image_path: image });
          }
        }

        function onFail(message) {
          console.log(message);
        }
      };

      $scope.deleteImg = function (i, e) {
        console.log(i);
        $scope.imaeDel.push(e);
        $scope.image.splice(i, 1);
      };
    }
  )

  .controller(
    "salevisitHistoryCtrl",
    function (
      $http,
      $rootScope,
      $ionicHistory,
      fachttp,
      $ionicLoading,
      Service,
      $state,
      $scope,
      $compile,
      $ionicModal
    ) {
      let vm = this;

      $scope.topDirections = ["left", "up"];
      $scope.bottomDirections = ["down", "right"];

      $scope.isOpen = false;

      $scope.availableModes = ["md-fling", "md-scale"];
      $scope.selectedMode = "md-scale";

      $scope.availableDirections = ["up", "down", "left", "right"];
      $scope.selectedDirection = "up";

      $scope.jobList = [];

      $scope.viewCalendar = function () {
        $state.go("app.salevisitCalendar");
      };

      $scope.viewHistory = function () {
        $state.go("app.salevisitHistory");
      };

      $scope.viewAdd = function () {
        $state.go("app.salevisitAdd");
      };

      $scope.viewDetail = function (e) {
        console.log(e);
        $state.go("app.salevisitDetail", { visitNbr: e.calendar_nbr });
      };

      $scope.getvisit = function () {
        console.log($scope.model);

        $ionicLoading.show();
        let req = {
          mode: "getvisitListHist",
        };
        fachttp.model("salevisit.php", req).then(
          function (response) {
            console.log(response.data);
            if (response.status) {
              $scope.jobList = response.data.result;
              console.log($scope.jobList);
            } else {
            }
            $ionicLoading.hide();
          },
          function err(err) {
            $ionicLoading.hide();
            Service.timeout();
          }
        );
      };

      $scope.getvisit();
    }
  )

  .controller(
    "salevisitListCtrl",
    function (
      $http,
      $rootScope,
      $ionicHistory,
      fachttp,
      $ionicLoading,
      Service,
      $state,
      $scope,
      $compile,
      $ionicModal
    ) {
      let vm = this;

      $scope.topDirections = ["left", "up"];
      $scope.bottomDirections = ["down", "right"];

      $scope.isOpen = false;

      $scope.availableModes = ["md-fling", "md-scale"];
      $scope.selectedMode = "md-scale";

      $scope.availableDirections = ["up", "down", "left", "right"];
      $scope.selectedDirection = "up";

      $scope.jobList = [];

      $scope.viewCalendar = function () {
        $state.go("app.salevisitCalendar");
      };

      $scope.viewHistory = function () {
        $state.go("app.salevisitHistory");
      };

      $scope.viewAdd = function () {
        $state.go("app.salevisitAdd");
      };

      $scope.viewDetail = function (e) {
        console.log(e);
        $state.go("app.salevisitDetail", { visitNbr: e.calendar_nbr });
      };

      $scope.getvisit = function () {
        $ionicLoading.show();
        let req = {
          mode: "getvisitList",
        };
        fachttp.model("salevisit.php", req).then(
          function (response) {
            console.log(response.data);
            if (response.status) {
              $scope.jobList = response.data.result;
              console.log($scope.jobList);
            } else {
            }
            $ionicLoading.hide();
          },
          function err(err) {
            $ionicLoading.hide();
            Service.timeout();
          }
        );
      };

      $scope.getvisit();
    }
  )

  .controller(
    "salevisitCalendarCtrl",
    function (
      $http,
      $rootScope,
      $ionicHistory,
      fachttp,
      $ionicLoading,
      Service,
      $state,
      $scope,
      $compile,
      $ionicModal
    ) {
      var date = new Date();
      var d = date.getDate();
      var m = date.getMonth();
      var y = date.getFullYear();

      $scope.viewAdd = function () {
        $state.go("app.salevisitAdd");
      };

      $scope.events = [
        // {
        //   start: "2022-10-16 15:00",
        //   end: "2022-10-30 15:00",
        // },
      ];

      // $scope.events.push({
      //   title: "Open Sesame",
      //   start: new Date(y, m, 28),
      //   end: new Date(y, m, 29),
      //   className: ["openSesame"],
      // })

      $scope.getvisit = function () {
        console.log($scope.model);

        $ionicLoading.show();
        let req = {
          mode: "getvisitListCalendar",
        };
        fachttp.model("salevisit.php", req).then(
          function (response) {
            console.log(response.data);
            if (response.status) {
              response.data.result.forEach((element, i) => {
                element.start = element.calendar_date1_start_value;
                element.end = element.calendar_date1_end_value;
                element.title =
                  element.cmad_attn + " - " + element.calendar_desc1;
                element.color = element.calendar_color
                  ? element.calendar_color
                  : "none";

                // var datas = {
                //   start: element.calendar_date1_start_value,
                //   end: element.calendar_date1_end_value,
                //   title: element.cmad_attn + " - " + element.calendar_desc1,
                // };

                $scope.events.push(element);
              });

              // $scope.events = response.data.result;

              console.log($scope.events);
            } else {
            }
            $ionicLoading.hide();
          },
          function err(err) {
            $ionicLoading.hide();
            Service.timeout();
          }
        );
      };

      $scope.getvisit();

      $scope.changeTo = "English";

      $scope.eventsF = function (start, end, timezone, callback) {
        console.log(1);
        var s = new Date(start).getTime() / 1000;
        var e = new Date(end).getTime() / 1000;
        var m = new Date(start).getMonth();
        var events = [
          {
            title: "Feed Me " + m,
            start: s + 50000,
            end: s + 100000,
            allDay: false,
            className: ["customFeed"],
          },
        ];
        callback(events);
      };

      $scope.calEventsExt = {
        color: "#f00",
        textColor: "yellow",
        events: [
          {
            type: "party",
            title: "Lunch",
            start: new Date(y, m, d, 12, 0),
            end: new Date(y, m, d, 14, 0),
            allDay: false,
          },
          {
            type: "party",
            title: "Lunch 2",
            start: new Date(y, m, d, 12, 0),
            end: new Date(y, m, d, 14, 0),
            allDay: false,
          },
          {
            type: "party",
            title: "Click for Google",
            start: new Date(y, m, 28),
            end: new Date(y, m, 29),
            url: "http://google.com/",
          },
        ],
      };
      /* alert on eventClick */
      $scope.alertOnEventClick = function (date, jsEvent, view) {
        console.log(date);
        $state.go("app.salevisitDetail", { visitNbr: date.calendar_nbr });
      };
      /* alert on Drop */
      $scope.alertOnDrop = function (
        event,
        delta,
        revertFunc,
        jsEvent,
        ui,
        view
      ) {
        console.log(2);

        $scope.alertMessage = "Event Droped to make dayDelta " + delta;
      };
      /* alert on Resize */
      $scope.alertOnResize = function (
        event,
        delta,
        revertFunc,
        jsEvent,
        ui,
        view
      ) {
        console.log(3);
      };

      $scope.addEvent = function () {
        $scope.events.push({
          title: "Open Sesame",
          start: new Date(y, m, 28),
          end: new Date(y, m, 29),
          className: ["openSesame"],
        });
      };
      /* remove event */
      $scope.remove = function (index) {
        console.log(5);

        $scope.events.splice(index, 1);
      };
      /* Change View */
      $scope.changeView = function (view, calendar) {
        console.log(7);

        uiCalendarConfig.calendars[calendar].fullCalendar("changeView", view);
      };
      /* Change View */
      $scope.renderCalender = function (calendar) {
        console.log(0);

        if (uiCalendarConfig.calendars[calendar]) {
          uiCalendarConfig.calendars[calendar].fullCalendar("render");
        }
      };
      /* Render Tooltip */
      $scope.eventRender = function (event, element, view) {
        console.log(9);

        // element.attr({ tooltip: event.title, "tooltip-append-to-body": true });
        // $compile(element)($scope);
      };

      $scope.dateClicks = function (date) {
        const mydate = date._d;
        const result = mydate.toLocaleDateString("th-TH", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

        $state.go("app.salevisitAdd", { date: mydate });

        console.log(date);
        console.log(date._d.toUTCString());

        console.log(result);
      };
      /* config object */
      $scope.uiConfig = {
        calendar: {
          height: 500,
          editable: true,
          header: {
            left: "title,month,agendaWeek,agendaDay,today prev,next",
            right: "",
          },
          monthNames: [
            "มกราคม",
            "กุมภาพันธ์",
            "มีนาคม",
            "เมษายน",
            "พฤษภาคม",
            "มิถุนายน",
            "กรกฎาคม",
            "สิงหาคม",
            "กันยายน",
            "ตุลาคม",
            "พฤศจิกายน",
            "ธันวาคม",
          ],
          monthNamesShort: [
            "ม.ค.",
            "ก.พ.",
            "ม.ค.",
            "เม.ย.",
            "พ.ค.",
            "มิ.ย.",
            "ก.ค.",
            "ส.ค.",
            "ก.ย.",
            "ต.ค.",
            "พ.ย.",
            "ธ.ค.",
          ],
          dayNames: [
            "อาทิตย์",
            "จันทร์",
            "อังการ",
            "พุธ",
            "พฤหัสบดี",
            "ศุกร์",
            "เสาร์",
          ],
          dayNamesShort: ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"],
          axisFormat: "h:mm",
          timeFormat: "H:mm",
          lang: "th",
          eventClick: $scope.alertOnEventClick,
          dayClick: $scope.dateClicks,
          eventDrop: $scope.alertOnDrop,
          eventResize: $scope.alertOnResize,
          eventRender: $scope.eventRender,
        },
      };

      /* event sources array*/
      $scope.eventSources = [$scope.events];

      $ionicModal
        .fromTemplateUrl("add-calendar.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.modalCalendar = modal;
        });

      $scope.openModalCalendar = function () {
        $scope.modalCalendar.show();
      };

      $scope.closeModalCalendar = function () {
        $scope.modalCalendar.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        $scope.modalCalendar.remove();
      });
    }
  )

  .controller("ListBottomSheetCtrl", function ($scope, $mdBottomSheet) {
    $scope.items = [
      { name: "เลือกจากอัลบั้ม", icon: "image" },
      { name: "ถ่ายรูป", icon: "camera" },
    ];

    $scope.listItemClick = function ($index) {
      var clickedItem = $scope.items[$index];
      $mdBottomSheet.hide(clickedItem);
    };
  })

  .controller("ListBottomSheetActionCtrl", function ($scope, $mdBottomSheet) {
    $scope.items = [
      { name: "แทนที่", icon: "image" },
      { name: "ถ่ายรูปใหม่", icon: "camera" },
      { name: "ลบรูปภาพ", icon: "trash-a" },
    ];

    $scope.listItemClick = function ($index) {
      var clickedItem = $scope.items[$index];
      $mdBottomSheet.hide(clickedItem);
    };
  });
