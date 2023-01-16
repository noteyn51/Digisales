angular
  .module("app")

  .controller(
    "saleChance1Ctrl",
    function (
      $http,
      $rootScope,
      $ionicHistory,
      fachttp,
      $ionicLoading,
      Service,
      $state,
      $scope,
      $ionicModal,
      $timeout
    ) {
      let vm = this;


      vm.goBack = function(){
        $ionicHistory.goBack();
      }
      $ionicModal
        .fromTemplateUrl("filter-modal.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.modalFilter = modal;
        });

      $scope.openModalFilter = function () {
        $scope.modalFilter.show();
      };

      $scope.closeModalFilter = function () {
        $scope.modalFilter.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        $scope.modalFilter.remove();
      });

      $scope.filter = function () {
        console.log("filter");
      };

      vm.chanceEdit = function (e) {
        console.log(e);
        $state.go("app.saleChanceEdit", { osno: e.os_nbr });
      };

      $scope.confirmFilter = function () {
        console.log(vm.os_statusList);
        $ionicLoading.show();
        let req = {
          mode: "os_filter",
          filter: vm.os_statusList,
        };
        fachttp.model("salepp.php", req).then(
          function (response) {
            console.log(response.data);
            if (response.data.status == true) {
              vm.os_list = response.data;
            } else {
              vm.os_list = [];
            }
            $timeout(function () {
              $ionicLoading.hide();

              $scope.modalFilter.hide();
            }, 500);
          },
          function err(err) {
            $scope.modalFilter.hide();
            $ionicLoading.hide();
            Service.timeout();
          }
        );
      };

      $scope.model = {};

      function onStart() {
        let req = {
          mode: "os_list",
        };
        fachttp.model("salepp.php", req).then(
          function (response) {
            console.log(response.data);
            if (response.data.status == true) {
              vm.os_list = response.data;
              vm.os_statusList = response.data.os_status;
            } else {
              vm.os_list = [];
            }
          },
          function err(err) {
            $ionicLoading.hide();
            Service.timeout();
          }
        );
      }

      onStart();

      vm.search = function () {
        $state.go("app.inventory2", { search: JSON.stringify($scope.model) });
      };

      $scope.chance2 = function () {
        $state.go("app.saleChance2");
      };
    }
  )

  .controller(
    "saleChanceEditCtrl",
    function (
      $http,
      $rootScope,
      $ionicHistory,
      fachttp,
      $ionicLoading,
      Service,
      $state,
      $scope,
      $ionicModal,
      $mdDialog,
      $stateParams
    ) {
      let vm = this;

      console.log($stateParams);

      $scope.callPhone = function(){
        window.open('tel:'+vm.os_data.cmad_phone);
      }

      vm.goBack = function(){
        $ionicHistory.goBack();
      }

      $scope.commentlist = [];
      $scope.commentText = "";

      vm.addSq = function () {
        $scope.closeModalSq();
        $state.go("app.sq2", {
          os_nbr: vm.os_data.os_nbr,
          cm_nbr: vm.os_data.cm_addr,
        });
      };

      $scope.addComment = function (data) {
        if (data != null && data != undefined && data != "") {
          console.log(data);
          $scope.commentlist.push({ desc: data });
          $scope.commentText = "";
        }
      };

      $scope.deleteComment = function (i) {
        $scope.commentlist.splice(i, 1);
      };

      function onStart() {
        let req = {
          mode: "os_detail",
          os_no: $stateParams,
        };
        fachttp.model("salepp.php", req).then(
          function (response) {
            console.log(response.data);
            if (response.data.status == true) {
              vm.os_data = response.data.result;
              vm.os_status = response.data.os_status;
              vm.osSelect = response.data.os_status_select;
              $scope.commentlist = response.data.os_cmt;
              vm.sqSelected = response.data.sq_select;
              vm.ar_amt = response.data.ar_amt;

              if (vm.osSelect.os_code == 5 || vm.osSelect.os_code == 6) {
                $scope.canEdit = false;
              } else {
                $scope.canEdit = true;
              }
            } else {
              vm.os_data = [];
            }
          },
          function err(err) {
            $ionicLoading.hide();
            Service.timeout();
          }
        );
      }

      onStart();

      $scope.model = {
        projectval: "",
        mandays: "",
        projectdesc: "",
        comment: null,
      };

      $ionicModal
        .fromTemplateUrl("sq-modal.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.modalSq = modal;
        });

      $scope.openModalSq = function () {
        $scope.modalSq.show();
        $scope.loadSq();
      };

      $scope.closeModalSq = function () {
        $scope.modalSq.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        $scope.modalSq.remove();
      });

      $scope.loadSq = function () {
        vm.sq = [];
        $ionicLoading.show();
        let req = {
          mode: "selectsq_by_os",
          osnbr: vm.os_data.os_nbr,
        };
        fachttp.model("salepp.php", req).then(
          function (response) {
            console.log(response.data);
            vm.sq = response.data;
            setTimeout(() => {
              $ionicLoading.hide();
            }, 500);
          },
          function err(err) {
            $ionicLoading.hide();
            Service.timeout();
          }
        );
      };
      $scope.selectSq = function (e) {
        vm.sqSelected = e;
        $scope.closeModalSq();
      };
      $scope.checkDisabled = function () {
        try {
          if (vm.osSelect.os_code == "5" && !vm.sqSelected) {
            return true;
          }

          if (vm.osSelect.os_code == "6" && !vm.os_data.os_remks) {
            return true;
          }
          return false;
        } catch (error) {
          console.log(error);
        }
      };

      ////////////////////////////////////////

      vm.search = function () {
        $state.go("app.inventory2", { search: JSON.stringify($scope.model) });
      };

      $scope.currenttab = "tab1";

      $scope.gotoTab = function (page) {
        $scope.currenttab = page;

        console.log($scope.currenttab);
      };

      $scope.createos = function (e) {
        var confirm = $mdDialog
          .confirm()
          .title("แจ้งเตือน")
          .textContent("ต้องการบันทึกโอกาสการขาย ?")
          .ariaLabel("Lucky day")
          .targetEvent()
          .ok("ยืนยัน")
          .cancel("ยกเลิก");

        $mdDialog.show(confirm).then(function (result) {
          if (result) {
            $ionicLoading.show();
            Object.keys($scope.model).forEach(function (el) {
              $scope.model[el] = parseInt($scope.model[el]);
            });

            console.log($scope.model);
            let req = {
              mode: "edit_os",
              cm: vm.os_data,
              os_status: vm.osSelect,
              cmt: $scope.commentlist,
              sq: vm.sqSelected,
            };
            fachttp.model("salepp.php", req).then(
              function (response) {
                console.log(response.data);

                if (response.data.status == true) {
                  if (response.data.so) {
                    $ionicHistory.nextViewOptions({
                      disableAnimate: true,
                      historyRoot: true,
                    });
                    $state.go("app.menu");

                    setTimeout(() => {
                      $ionicHistory.clearHistory();
                      $ionicLoading.hide();
                      $state.go("app.soadd", {
                        nbr: response.data.so,
                        mode: "edit",
                      });
                    }, 1000);
                  } else {
                    $ionicLoading.hide();

                    $ionicHistory.goBack();
                  }
                } else {
                  $mdDialog.show(
                    $mdDialog
                      .alert()
                      .parent(
                        angular.element(
                          document.querySelector("#popupContainer")
                        )
                      )
                      .clickOutsideToClose(false)
                      .title("แจ้งเตือน")
                      .textContent(
                        "เกิดข้อผิดพลาดในการแก้ไขโปรดลองใหม่อีกครั้ง"
                      )
                      .ariaLabel("Alert Dialog Demo")
                      .ok("OK")
                      .targetEvent()
                  );
                }
              },
              function err(err) {
                $ionicLoading.hide();
                Service.timeout();
              }
            );
          }
        });
      };

      function toThaiDateString(date) {
        let monthNames = [
          "มกราคม",
          "กุมภาพันธ์",
          "มีนาคม",
          "เมษายน",
          "พฤษภาคม",
          "มิถุนายน",
          "กรกฎาคม",
          "สิงหาคม.",
          "กันยายน",
          "ตุลาคม",
          "พฤศจิกายน",
          "ธันวาคม",
        ];

        let year = date.getFullYear() + 543;
        let month = monthNames[date.getMonth()];
        let numOfDay = date.getDate();

        let hour = date.getHours().toString().padStart(2, "0");
        let minutes = date.getMinutes().toString().padStart(2, "0");
        let second = date.getSeconds().toString().padStart(2, "0");

        // return `${numOfDay} ${month} ${year} ` +
        //     `${hour}:${minutes}:${second} น.`;

        return `${numOfDay} ${month} ${year} `;
      }

      $scope.mandayChange = function (e) {
        console.log(e);
        let val = parseInt(e);
        var d = new Date();
        d.setDate(d.getDate() + val);
        $scope.datedesc = toThaiDateString(d);
        console.log(toThaiDateString(d));
      };
    }
  )

  .controller(
    "saleChance2Ctrl",
    function (
      $http,
      $rootScope,
      $ionicHistory,
      fachttp,
      $ionicLoading,
      Service,
      $state,
      $scope,
      $ionicModal,
      $mdDialog,
      $mdBottomSheet
    ) {
      let vm = this;

      //   $scope.alert = '';
      // $mdBottomSheet.show({
      //   templateUrl: 'bottom-sheet-list-template.html',
      //   controller: 'saleChance2Ctrl'
      // }).then(function(clickedItem) {
      //   $scope.alert = clickedItem['name'] + ' clicked!';
      // }).catch(function(error) {
      //   // User clicked outside or hit escape
      // });

      vm.addPP = function () {
        $scope.closeModalCm();
        $state.go("post.menupostpect2");
      };
      $scope.items = [
        { name: "Share", icon: "share" },
        { name: "Upload", icon: "upload" },
        { name: "Copy", icon: "copy" },
        { name: "Print this page", icon: "print" },
      ];

      $scope.listItemClick = function ($index) {
        var clickedItem = $scope.items[$index];
        $mdBottomSheet.hide(clickedItem);
      };

      $scope.model = {
        projectval: "",
        mandays: "",
        projectdesc: "",
        comment: null,
      };
      $scope.commentlist = [];
      $scope.commentText = "";

      $scope.addComment = function (data) {
        if (data != null && data != undefined && data != "") {
          console.log(data);
          $scope.commentlist.push({ desc: data });
          $scope.commentText = "";
        }
      };
      $scope.deleteComment = function (i) {
        $scope.commentlist.splice(i, 1);
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

      ////////////////////////////////////////
      $ionicModal
        .fromTemplateUrl("part-modal.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.modalPart = modal;
        });

      $scope.openModalPart = function () {
        vm.partItem = [];
        $scope.modalPart.show();
        $scope.loadPart();
      };

      $scope.closeModalPart = function () {
        $scope.modalPart.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        $scope.modalPart.remove();
      });

      vm.search = function () {
        $state.go("app.inventory2", { search: JSON.stringify($scope.model) });
      };

      $scope.currenttab = "tab1";

      $scope.gotoTab = function (page) {
        $scope.currenttab = page;

        console.log($scope.currenttab);
      };

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

      $scope.loadPart = function () {
        $ionicLoading.show();
        let req = {
          mode: "pt_mstr",
        };
        fachttp.model("salepp.php", req).then(
          function (response) {
            console.log(response.data);
            vm.partItem = response.data;
            $ionicLoading.hide();
          },
          function err(err) {
            $ionicLoading.hide();
            Service.timeout();
          }
        );
      };

      $scope.selectPart = function (e) {
        vm.partSelect = e;
        $scope.closeModalPart();
        console.log(vm.partSelect);
      };

      $scope.selectCm = function (e) {
        $ionicLoading.show();
        let req = {
          mode: "select_cm",
          cmad_addr: e.cm_addr,
        };
        fachttp.model("salepp.php", req).then(
          function (response) {
            console.log(response.data);

            if (response.data.status == true) {
              vm.cmad_det = response.data.result;
              vm.os_status = response.data.os_status;
              vm.osSelect = response.data.os_status_select;
              vm.os_num = response.data.soc_nbr;
              $scope.model.comment = null;
              vm.ar_amt = response.data.ar_amt;
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

      $scope.createos = function (e) {
        //  $scope.alert = '';
        // $mdBottomSheet.show({
        //   templateUrl: 'bottom-sheet-list-template.html',
        //   controller: 'saleChance2Ctrl'
        // }).then(function(clickedItem) {
        //   $scope.alert = clickedItem['name'] + ' clicked!';
        // }).catch(function(error) {
        //   // User clicked outside or hit escape
        // });

        if (
          $scope.model.mandays &&
          $scope.model.projectval &&
          vm.partSelect &&
          $scope.model.projectdesc &&
          vm.cmselect
        ) {
          var confirm = $mdDialog
            .confirm()
            .title("แจ้งเตือน")
            .textContent("ต้องการสร้างโอกาสการขายนี้หรือไม่ ?")
            .ariaLabel("Lucky day")
            .targetEvent()
            .ok("ยืนยัน")
            .cancel("ยกเลิก");

          $mdDialog.show(confirm).then(function (result) {
            if (result) {
              $ionicLoading.show();

              $scope.model.projectval = parseInt($scope.model.projectval);
              $scope.model.mandays = parseInt($scope.model.mandays);

              console.log($scope.model);
              let req = {
                mode: "createos",
                cm: vm.cmad_det,
                os_status: vm.osSelect,
                os_num: vm.os_num,
                data: $scope.model,
                part: vm.partSelect,
                cmt: $scope.commentlist,
              };
              fachttp.model("salepp.php", req).then(
                function (response) {
                  console.log(response.data);

                  if (response.data.status == true) {
                    $state.go("app.saleChance1");
                  } else {
                    $mdDialog.show(
                      $mdDialog
                        .alert()
                        .parent(
                          angular.element(
                            document.querySelector("#popupContainer")
                          )
                        )
                        .clickOutsideToClose(false)
                        .title("แจ้งเตือน")
                        .textContent("ไม่พบรายการที่เลือก")
                        .ariaLabel("Alert Dialog Demo")
                        .ok("OK")
                        .targetEvent()
                    );
                  }
                  $ionicHistory.goBack();

                  $ionicLoading.hide();
                },
                function err(err) {
                  $ionicLoading.hide();
                  Service.timeout();
                }
              );
            }
          });
        } else {
          $mdDialog.show(
            $mdDialog
              .alert()
              .parent(
                angular.element(document.querySelector("#popupContainer"))
              )
              .clickOutsideToClose(false)
              .title("แจ้งเตือน")
              .textContent("ข้อมูลไม่ครบถ้วน")
              .ariaLabel("Alert Dialog Demo")
              .ok("OK")
              .targetEvent()
          );
        }
      };

      function toThaiDateString(date) {
        let monthNames = [
          "มกราคม",
          "กุมภาพันธ์",
          "มีนาคม",
          "เมษายน",
          "พฤษภาคม",
          "มิถุนายน",
          "กรกฎาคม",
          "สิงหาคม.",
          "กันยายน",
          "ตุลาคม",
          "พฤศจิกายน",
          "ธันวาคม",
        ];

        let year = date.getFullYear() + 543;
        let month = monthNames[date.getMonth()];
        let numOfDay = date.getDate();

        let hour = date.getHours().toString().padStart(2, "0");
        let minutes = date.getMinutes().toString().padStart(2, "0");
        let second = date.getSeconds().toString().padStart(2, "0");

        // return `${numOfDay} ${month} ${year} ` +
        //     `${hour}:${minutes}:${second} น.`;

        return `${numOfDay} ${month} ${year} `;
      }

      $scope.mandayChange = function (e) {
        console.log(e);
        let val = parseInt(e);
        var d = new Date();
        d.setDate(d.getDate() + val);
        $scope.datedesc = toThaiDateString(d);
        console.log(toThaiDateString(d));
      };
    }
  )

  .controller(
    "saleChance3Ctrl",
    function (
      $http,
      $rootScope,
      $ionicHistory,
      fachttp,
      $ionicLoading,
      Service,
      $state,
      $scope
    ) {
      let vm = this;

      $scope.model = {};

      vm.search = function () {
        $state.go("app.inventory2", { search: JSON.stringify($scope.model) });
      };
    }
  );
