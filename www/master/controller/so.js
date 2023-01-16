angular
  .module("app")
  .factory("soParam", function () {
    const obj = {};
    obj.data = undefined;
    obj.baseData = undefined;
    obj.financeData = undefined;
    obj.transportData = undefined;
    obj.itemData = undefined;
    obj.billTotal = undefined;

    // obj.getData = function () {
    //   return obj.data;
    // };

    // obj.setData = function (dataObject) {
    //   console.log(dataObject);
    //   obj.data = dataObject;
    // };

    obj.getBaseData = function () {
      return obj.baseData;
    };

    obj.setBaseData = function (dataObject) {
      obj.baseData = dataObject;
    };

    ////////////////
    obj.getFinanceData = function () {
      return obj.financeData;
    };
    ////////////////

    ////////////////
    obj.setFinanceData = function (dataObject) {
      obj.financeData = dataObject;
    };

    obj.getTransportData = function () {
      return obj.transportData;
    };
    ///////////////

    obj.setTransportData = function (dataObject) {
      obj.transportData = dataObject;
    };

    obj.getItemData = function () {
      return obj.itemData;
    };

    obj.setItemData = function (dataObject) {
      obj.itemData = dataObject;
    };

    obj.getBillTotalData = function () {
      return obj.billTotal;
    };

    obj.setBillTotalData = function (dataObject) {
      obj.billTotal = dataObject;
    };

    return obj;
  })

  .directive("scrollToBottom", function ($timeout, $window) {
    return {
      scope: {
        scrollToBottom: "=",
      },
      restrict: "A",
      link: function (scope, element, attr) {
        scope.$watchCollection("scrollToBottom", function (newVal) {
          if (newVal) {
            $timeout(function () {
              element[0].scrollTop = element[0].scrollHeight;
            }, 0);
          }
        });
      },
    };
  })

  .controller(
    "so1Ctrl",
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
      $mdDialog
    ) {
      let vm = this;

      $scope.soAdd = function () {
        $state.go("app.soadd", { nbr: "", mode: "add" });
      };

      function onStart() {
        let req = {
          mode: "getsoList",
        };
        fachttp.model("so.php", req).then(
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

      vm.soEdit = function (e) {
        $state.go("app.soadd", { nbr: e.so_nbr, mode: "edit" });
      };
    }
  )

  .controller(
    "soAddCtrl",
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
      $ionicPopup,
      $ionicSlideBoxDelegate,
      $ionicScrollDelegate,
      $stateParams,
      soParam
    ) {
      var vm = this;

      $scope.addressModalMode = "";
      $scope.isLoading = false;

      $scope.mode = $stateParams.mode;

      $scope.goBack = function () {
        if ($stateParams.mode == "add") {
          var confirm = $mdDialog
            .confirm()
            .title("แจ้งเตือน")
            .textContent("ต้องการยกเลิกการสร้างใบสั่งขายหรือไม่ ?")
            .ariaLabel("Lucky day")
            .targetEvent()
            .ok("ยืนยัน")
            .cancel("ยกเลิก");

          $mdDialog.show(confirm).then(function (result) {
            if (result) {
              $ionicHistory.goBack();
            } else {
            }
          });
        } else {

          
          $ionicHistory.goBack();

          // $ionicHistory.clearHistory();

        }
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
        .fromTemplateUrl("address-modal.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.modalAddress = modal;
        });

      $scope.openModalAddress = function () {
        $scope.modalAddress.show();
      };

      $scope.closeModalAddress = function () {
        $scope.modalAddress.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        $scope.modalAddress.remove();
      });

      $scope.address = function (e) {
        $scope.addressModalMode = e;

        $scope.addressTo = vm.data.result.filter(function (creature) {
          return creature.cm_addr == $scope.soHeader.so_cm.cm_addr;
        });

        console.log($scope.addressTo);
        $scope.openModalAddress();
      };

      $scope.selectAddress = function (e) {
        console.log(e);
        console.log($scope.addressModalMode);
        switch ($scope.addressModalMode) {
          case "saleTo":
            $scope.soHeader.so_sale_to = e;
            break;
          case "docTo":
            $scope.soHeader.so_doc_to = e;
            break;
          case "shipTo":
            $scope.soHeader.so_ship_to = e;
            break;
        }

        $scope.closeModalAddress();
      };

      $scope.loadCm = function () {
        // $ionicLoading.show();
        let req = {
          mode: "so_select_cm",
        };
        fachttp.model("so.php", req).then(
          function (response) {
            console.log(response.data);
            vm.data = response.data;
            // $ionicLoading.hide();
          },
          function err(err) {
            // $ionicLoading.hide();
            Service.timeout();
          }
        );
      };

      $scope.selectCm = function (e) {
        $scope.soHeader.so_cm = e;
        $scope.soHeader.so_sale_to = e;
        $scope.soHeader.so_doc_to = e;
        $scope.soHeader.so_ship_to = e;

        $scope.closeModalCm();
      };

      $scope.updateSo = function () {
        $ionicLoading.show();
        let req = {
          mode: "update_so",
          soHeader: $scope.soHeader,
          baseData: $scope.baseconfigData,
          financeData: $scope.financeData,
          transportData: $scope.transportData,
          itemData: $scope.itemData,
          billData: $scope.billTotal,
        };
        fachttp.model("so.php", req).then(
          function (response) {
            if (response.data.status == true) {
              Service.toast("บันทึกใบสั่งขายแล้ว", "success");
              $ionicHistory.goBack();
            } else {
              $mdDialog.show(
                $mdDialog
                  .alert()
                  .parent(
                    angular.element(document.querySelector("#popupContainer"))
                  )
                  .clickOutsideToClose(false)
                  .title("แจ้งเตือน")
                  .textContent("ไม่สามารถบันทึกข้อมูลได้โปรดลองใหม่อีกครั้ง")
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
      };

      $scope.confirm = function (ev) {
        if ($scope.mode == "add") {
          var confirm = $mdDialog
            .confirm()
            .title("แจ้งเตือน")
            .textContent("ยืนยันการสร้างใบสั่งขาย")
            .ariaLabel("Lucky day")
            .targetEvent()
            .ok("ยืนยัน")
            .cancel("ยกเลิก");

          $mdDialog.show(confirm).then(function (result) {
            if (result) {
              $ionicLoading.show();
              let req = {
                mode: "confirmCreateSo",
                soHeader: $scope.soHeader,
                baseData: $scope.baseconfigData,
                financeData: $scope.financeData,
                transportData: $scope.transportData,
                itemData: $scope.itemData,
                billData: $scope.billTotal,
              };
              fachttp.model("so.php", req).then(
                function (response) {
                  if (response.data.status == true) {
                    Service.toast("เพิ่มใบสั่งขายแล้ว", "success");
                    $ionicHistory.goBack();
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
                          "ไม่สามารเพิ่มใบสั่งขายได้โปรดลองใหม่อีกครั้ง"
                        )
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
            } else {
            }
          });
        } else {
          $scope.updateSo();
        }
      };

      $scope.sotab = function (e) {
        $state.go(e);
      };

      $scope.$on("$ionicView.enter", function (a, b, c, d) {
        $scope.baseconfigData = soParam.getBaseData();
        $scope.financeData = soParam.getFinanceData();
        $scope.transportData = soParam.getTransportData();
        $scope.itemData = soParam.getItemData();
        $scope.billTotal = soParam.getBillTotalData();
        // console.log($scope.data);
      });

      console.log($stateParams);
      function CreatesoMstr() {
        $ionicLoading.show();
        let req = {
          mode: "createSomstr",
          data: $scope.model,
        };
        fachttp.model("so.php", req).then(
          function (response) {
            $scope.isLoading = true;

            $scope.soHeader = {
              so_nbr: "",
            };

            $scope.baseconfigData = [];
            $scope.financeData = [];
            $scope.transportData = [];
            $scope.itemData = [];
            $scope.billTotal = {
              total: "",
              discount: "",
              discountValue: "",
              totalAfterDiscount: "",
              beforeVat: "",
              vatValue: "",
              netTotal: "",
              otherValue: "",
            };

            $scope.baseconfigData = response.data.baseConfig;
            $scope.financeData = response.data.financeConfig;
            $scope.transportData = response.data.transportConfig;

            soParam.setItemData($scope.itemData);
            soParam.setBillTotalData($scope.billTotal);
            soParam.setBaseData($scope.baseconfigData);
            soParam.setFinanceData($scope.financeData);
            soParam.setTransportData($scope.transportData);

            if (response.data.so_nbr.status == true) {
              $scope.soHeader.so_nbr = response.data.so_nbr.so_nbr;
            } else {
            }

            setTimeout(() => {
              $ionicLoading.hide();
            }, 500);
          },
          function err(err) {
            $ionicLoading.hide();
            Service.timeout();
          }
        );
      }

      function GetsoMstr() {
        $ionicLoading.show();
        let req = {
          mode: "get_so_detail_edit",
          so_nbr: $stateParams.nbr,
        };
        fachttp.model("so.php", req).then(
          function (response) {
            $scope.isLoading = true;
            $scope.soHeader = {
              so_nbr: $stateParams.nbr,
              so_cm: response.data.soHeader.so_cm,
              so_doc_to: response.data.soHeader.so_doc_to,
              so_sale_to: response.data.soHeader.so_sale_to,
              so_ship_to: response.data.soHeader.so_ship_to,
            };

            $scope.baseconfigData = [];
            $scope.financeData = [];
            $scope.transportData = [];
            $scope.itemData = response.data.sod_det;
            $scope.billTotal = response.data.billTotal;

            $scope.baseconfigData = response.data.baseConfig;
            $scope.financeData = response.data.financeConfig;
            $scope.transportData = response.data.transportConfig;

            soParam.setItemData($scope.itemData);
            soParam.setBillTotalData($scope.billTotal);
            soParam.setBaseData($scope.baseconfigData);
            soParam.setFinanceData($scope.financeData);
            soParam.setTransportData($scope.transportData);
            $ionicLoading.hide();
          },
          function err(err) {
            $ionicLoading.hide();
            Service.timeout();
          }
        );
      }

      if ($stateParams.mode == "add") {
        CreatesoMstr();
      } else {
        GetsoMstr();
      }

      $scope.loadCm();
    }
  )

  .controller(
    "sotab1Ctrl",
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
      $ionicPopup,
      $ionicSlideBoxDelegate,
      $ionicScrollDelegate,
      $stateParams,
      soParam
    ) {
      let vm = this;
      let platform = ionic.Platform.platform();

      $scope.selectedTab = $stateParams.tab;
      $scope.baseconfigData = soParam.getBaseData();
      $scope.itemData = soParam.getItemData();
      $scope.billTotal = soParam.getBillTotalData();

      $scope.selectChange = function (selectOpened, e) {
        console.log(e);
        if (selectOpened) {
          switch (e.id) {
            case "vatType":
              $scope.discountChange();
              break;
            case "priceIncludeVat":
              $scope.discountChange();

              break;
            default:
              break;
          }
        }
      };

      $scope.discountChange = function () {
        var taxpct = $scope.baseconfigData[9].selected.tax_pct
          ? Number($scope.baseconfigData[9].selected.tax_pct)
          : 0;
        var includtax = $scope.baseconfigData[8].selected.value;
        var total = 0;
        var beforeVat = 0;
        var discountValue = 0;
        var vatValue = 0;
        var totalAfterDiscount = 0;
        var netTotal = 0;

        if ($scope.billTotal.discount >= 100) {
          $scope.billTotal.discount = 100;
        } else if ($scope.billTotal.discount < 0) {
          $scope.billTotal.discount = 0;
        } else {
          // $scope.billTotal.discount  = parseFloat($scope.billTotal.discount)
        }

        var defaultparam = {
          discount: $scope.billTotal.discount ? $scope.billTotal.discount : 0,
          otherValue: $scope.billTotal.otherValue
            ? $scope.billTotal.otherValue
            : 0,
        };

        $scope.itemData.forEach((element) => {
          total += element.item.netValue;
          console.log(element.item.netValue);
        });
        discountValue = (total * defaultparam.discount) / 100;
        totalAfterDiscount = total - discountValue;
        if (includtax == 1) {
          if (taxpct > 0) {
            vatValue = (totalAfterDiscount * taxpct) / (100 + taxpct);
            beforeVat = totalAfterDiscount - vatValue;
          } else {
            beforeVat = totalAfterDiscount;
            vatValue = 0;
          }

          netTotal = totalAfterDiscount + Number(defaultparam.otherValue);
        } else {
          beforeVat = totalAfterDiscount;
          vatValue = (beforeVat * taxpct) / 100;
          netTotal =
            totalAfterDiscount + Number(defaultparam.otherValue) + vatValue;
        }

        $scope.billTotal.total = total;
        $scope.billTotal.totalAfterDiscount = totalAfterDiscount;
        $scope.billTotal.discountValue = discountValue;
        $scope.billTotal.vatValue = vatValue;
        $scope.billTotal.beforeVat = beforeVat;
        $scope.billTotal.netTotal = netTotal;

        soParam.setBillTotalData($scope.billTotal);
      };

      $scope.checkComment = function () {
        var total = 0;
        $scope.baseconfigData[20].selected.value.forEach((element) => {
          if (element.value) {
            total++;
          }
        });
        return total;
      };

      $ionicModal
        .fromTemplateUrl("comment-modal.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.modalComment = modal;
        });

      $scope.openModalComment = function () {
        $scope.modalComment.show();
      };

      $scope.closeModalComment = function () {
        $scope.modalComment.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        $scope.modalComment.remove();
      });

      $scope.selectDate = function (e) {
        // console.log(e);
        // e.selected.value = 1234;

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

              e.selected.value = resultvalue;
              e.selected.des = resultdesc;
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

              e.selected.value = $scope.datamodal.date;
              e.selected.des = result;
            }
          });
        }
      };

      $scope.$on(
        "$stateChangeStart",
        function (event, toState, toParams, fromState, fromParams, options) {
          soParam.setBaseData($scope.baseconfigData);
          soParam.setBillTotalData($scope.billTotal);
        }
      );
    }
  )

  .controller(
    "sotab2Ctrl",
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
      $ionicPopup,
      $ionicSlideBoxDelegate,
      $ionicScrollDelegate,
      $stateParams,
      soParam
    ) {
      let vm = this;
      $scope.selectedTab = $stateParams.tab;
      $scope.financeData = soParam.getFinanceData()
        ? soParam.getFinanceData()
        : [];

      $scope.selectChange = function (selectOpened, e) {
        console.log("change");
        if (selectOpened) {
          switch (e.id) {
            case "bankCode":
              $scope.financeData[5].selected.value = e.selected.des;
              $scope.financeData[6].selected.value = "";

              break;

            default:
              break;
          }
        }
      };

      $scope.$on(
        "$stateChangeStart",
        function (event, toState, toParams, fromState, fromParams, options) {
          soParam.setFinanceData($scope.financeData);
        }
      );
    }
  )

  .controller(
    "sotab3Ctrl",
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
      $ionicPopup,
      $ionicSlideBoxDelegate,
      $ionicScrollDelegate,
      $stateParams,
      soParam
    ) {
      let vm = this;
      $scope.selectedTab = $stateParams.tab;
      $scope.transportData = soParam.getTransportData()
        ? soParam.getTransportData()
        : [];

      $scope.$on(
        "$stateChangeStart",
        function (event, toState, toParams, fromState, fromParams, options) {
          soParam.setTransportData($scope.transportData);
        }
      );
    }
  )

  .controller(
    "sotab4Ctrl",
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
      $ionicPopup,
      $ionicSlideBoxDelegate,
      $ionicScrollDelegate,
      $stateParams,
      soParam
    ) {
      let vm = this;
      $scope.selectedTab = $stateParams.tab;
      $scope.baseconfigData = soParam.getBaseData();
      $scope.itemData = soParam.getItemData();
      $scope.billTotal = soParam.getBillTotalData();

      $scope.$on(
        "$stateChangeStart",
        function (event, toState, toParams, fromState, fromParams, options) {
          soParam.setItemData($scope.itemData);
          soParam.setBillTotalData($scope.billTotal);
        }
      );

      $ionicModal
        .fromTemplateUrl("bill-discount.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.modalBillDiscount = modal;
        });

      $scope.openModalBill = function () {
        $scope.modalBillDiscount.show();
      };

      $scope.closeModalBill = function () {
        $scope.modalBillDiscount.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        $scope.modalBillDiscount.remove();
      });

      $scope.addItem = function () {
        $state.go("app.sotab4-1");
      };

      $scope.removeItem = function (i) {
        $scope.itemData.splice(i, 1);
      };

      $scope.editItem = function (i, e) {
        console.log(e);

        $state.go("app.sotab4-2-edit", { item: JSON.stringify(e), index: i });
      };

      $scope.goBack = function () {
        $ionicHistory.goBack();
      };

      $scope.$on(
        "$stateChangeSuccess",
        function (event, toState, toParams, fromState, fromParams, options) {
          console.log("stateChangeSuccess");
          $scope.discountChange();
        }
      );

      $scope.discountChange = function () {
        var taxpct = $scope.baseconfigData[9].selected.tax_pct
          ? Number($scope.baseconfigData[9].selected.tax_pct)
          : 0;
        var includtax = $scope.baseconfigData[8].selected.value;
        var total = 0;
        var beforeVat = 0;
        var discountValue = 0;
        var vatValue = 0;
        var totalAfterDiscount = 0;
        var netTotal = 0;

        if ($scope.billTotal.discount >= 100) {
          $scope.billTotal.discount = 100;
        } else if ($scope.billTotal.discount < 0) {
          $scope.billTotal.discount = 0;
        } else {
          // $scope.billTotal.discount  = parseFloat($scope.billTotal.discount)
        }

        var defaultparam = {
          discount: $scope.billTotal.discount ? $scope.billTotal.discount : 0,
          otherValue: $scope.billTotal.otherValue
            ? $scope.billTotal.otherValue
            : 0,
        };

        $scope.itemData.forEach((element) => {
          total += element.item.netValue;
          console.log(element.item.netValue);
        });

        discountValue = (total * defaultparam.discount) / 100;
        totalAfterDiscount = total - discountValue;
        if (includtax == 1) {
          if (taxpct > 0) {
            vatValue = (totalAfterDiscount * taxpct) / (100 + taxpct);
            beforeVat = totalAfterDiscount - vatValue;
          } else {
            beforeVat = totalAfterDiscount;
            vatValue = 0;
          }
          netTotal = totalAfterDiscount + Number(defaultparam.otherValue);
        } else {
          beforeVat = totalAfterDiscount;
          vatValue = (beforeVat * taxpct) / 100;
          netTotal =
            totalAfterDiscount + Number(defaultparam.otherValue) + vatValue;
        }

        $scope.billTotal.total = total;
        $scope.billTotal.totalAfterDiscount = totalAfterDiscount;
        $scope.billTotal.discountValue = discountValue;
        $scope.billTotal.vatValue = vatValue;
        $scope.billTotal.beforeVat = beforeVat;
        $scope.billTotal.netTotal = netTotal;

        soParam.setBillTotalData($scope.billTotal);
      };

      $scope.selectText = function () {
        document.getElementById("discount-box").focus();
        document.getElementById("discount-box").select();
      };

      $scope.discountChange();
    }
  )

  .controller(
    "sotab4-1Ctrl",
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
      $ionicPopup,
      $ionicSlideBoxDelegate,
      $ionicScrollDelegate,
      $stateParams,
      soParam
    ) {
      let vm = this;

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

      $scope.loadPart();

      $scope.selectItem = function (e) {
        console.log(e);
        $state.go("app.sotab4-2", { item: JSON.stringify(e) });
      };
    }
  )

  .controller(
    "sotab4-2Ctrl",
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
      $ionicPopup,
      $ionicSlideBoxDelegate,
      $ionicScrollDelegate,
      $stateParams,
      soParam,
      goBackMany
    ) {
      let vm = this;
      $scope.itemData = soParam.getItemData() ? soParam.getItemData() : [];

      var stateParam;
      try {
        stateParam = JSON.parse($stateParams.item);
      } catch (e) {
        stateParam = {};
      }

      $scope.model = {
        item: {
          ...stateParam,
          ...{
            // price: '',
            qty: 1,
            total: "",
            discount: "",
            discountValue: 0,
            totalAfterDiscount: 0,
            netValue: 0,
          },
        },
      };

      $scope.select = {};

      function getSoDetail() {
        $ionicLoading.show();
        let req = {
          mode: "so_get_item_detail",
        };
        fachttp.model("so.php", req).then(
          function (response) {
            console.log(response.data.sale_account);
            $scope.model.item.so_date = response.data.so_date;
            $scope.model.item.promise_date = response.data.promise_date;
            $scope.model.item.setprice_date = response.data.setprice_date;
            $scope.model.item.due_date = response.data.due_date;

            // $scope.model.item.sale_account = response.data.due_date;
            // $scope.model.item.cost_center = response.data.due_date;
            // $scope.model.item.site = response.data.due_date;
            // $scope.model.item.location = response.data.due_date;

            $scope.select.sale_account = response.data.sale_account;
            $scope.select.cost_center = response.data.cost_center;
            $scope.select.site = response.data.site;
            $scope.select.location = response.data.location;

            $ionicLoading.hide();
          },
          function err(err) {
            $ionicLoading.hide();
            Service.timeout();
          }
        );
      }

      getSoDetail();

      $scope.valueChange = function () {
        if ($scope.model.item.discount > 100) {
          $scope.model.item.discount = 100;
        } else if ($scope.model.item.discount < 0) {
          $scope.model.item.discount = 0;
        }

        if ($scope.model.item.qty <= 0) {
          $scope.model.item.qty = 1;
        }

        if (!$scope.model.item.price || $scope.model.item.price < 0) {
          $scope.model.item.price = 0;
        }

        try {
          var total = $scope.model.item.price * $scope.model.item.qty;
          var discountValue =
            (Number($scope.model.item.price) *
              Number($scope.model.item.discount)) /
            100;
          var netValue = total - (total * $scope.model.item.discount) / 100;
          var totalAfterDiscount =
            Number($scope.model.item.price) - discountValue;

          $scope.model.item = {
            ...$scope.model.item,
            ...{
              total: total,
              discountValue: discountValue,
              netValue: netValue,
              totalAfterDiscount: totalAfterDiscount,
            },
          };
        } catch (error) {
          console.log(error);
        }

        console.log($scope.model.item);
      };

      $scope.valueChange();

      $scope.plusQty = function () {
        $scope.model.item.qty = Number($scope.model.item.qty) + 1;
        $scope.valueChange();
      };

      $scope.minusQty = function () {
        $scope.model.item.qty = Number($scope.model.item.qty) - 1;
        $scope.valueChange();
      };

      $scope.goBack = function () {
        $scope.itemData.push($scope.model);
        goBackMany(2);
      };

      $scope.priceChange = function () {};

      $scope.$on(
        "$stateChangeStart",
        function (event, toState, toParams, fromState, fromParams, options) {
          soParam.setItemData($scope.itemData);
        }
      );
    }
  )
  .controller(
    "sotab4-2-editCtrl",
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
      $ionicPopup,
      $ionicSlideBoxDelegate,
      $ionicScrollDelegate,
      $stateParams,
      soParam,
      goBackMany
    ) {
      let vm = this;

      $scope.itemData = soParam.getItemData() ? soParam.getItemData() : [];
      console.log($stateParams);
      var stateParam;
      var index;

      try {
        stateParam = JSON.parse($stateParams.item);
        index = $stateParams.index;
      } catch (e) {
        stateParam = {};
      }

      $scope.model = stateParam;

      console.log($scope.model);

      $scope.select = {};

      function getSoDetail() {
        $ionicLoading.show();
        let req = {
          mode: "so_get_item_detail",
        };
        fachttp.model("so.php", req).then(
          function (response) {
            console.log(response.data.sale_account);

            $scope.select.sale_account = response.data.sale_account;
            $scope.select.cost_center = response.data.cost_center;
            $scope.select.site = response.data.site;
            $scope.select.location = response.data.location;

            $ionicLoading.hide();
          },
          function err(err) {
            $ionicLoading.hide();
            Service.timeout();
          }
        );
      }

      getSoDetail();

      $scope.valueChange = function () {
        if ($scope.model.item.discount > 100) {
          $scope.model.item.discount = 100;
        } else if ($scope.model.item.discount < 0) {
          $scope.model.item.discount = 0;
        }

        if ($scope.model.item.qty <= 0) {
          $scope.model.item.qty = 1;
        }

        if (!$scope.model.item.price || $scope.model.item.price < 0) {
          $scope.model.item.price = 0;
        }

        try {
          var total = $scope.model.item.price * $scope.model.item.qty;
          var discountValue =
            ($scope.model.item.price * $scope.model.item.discount) / 100;
          var netValue = total - (total * $scope.model.item.discount) / 100;
          var totalAfterDiscount = $scope.model.item.price - discountValue;

          $scope.model.item = {
            ...$scope.model.item,
            ...{
              total: total,
              discountValue: discountValue,
              netValue: netValue,
              totalAfterDiscount: totalAfterDiscount,
            },
          };
        } catch (error) {
          console.log(error);
        }

        console.log($scope.model.item);
      };

      $scope.plusQty = function () {
        $scope.model.item.qty = Number($scope.model.item.qty) + 1;
        $scope.valueChange();
      };

      $scope.minusQty = function () {
        $scope.model.item.qty = Number($scope.model.item.qty) - 1;
        // if( $scope.model.item.qty <= 0){
        //   $scope.model.item.qty = 1;
        // }

        $scope.valueChange();
      };

      $scope.goBack = function () {
        console.log($scope.model);
        console.log($scope.itemData);
        $scope.itemData[index] = $scope.model;
        goBackMany(1);
      };

      $scope.removeItem = function () {
        $scope.itemData.splice(index, 1);
        Service.toast("ลบรายการแล้ว", "info");
        goBackMany(1);
      };

      $scope.priceChange = function () {};
      $scope.$on(
        "$stateChangeStart",
        function (event, toState, toParams, fromState, fromParams, options) {
          soParam.setItemData($scope.itemData);
          // event.preventDefault(); // block transition from happening
        }
      );
      $scope.valueChange();
    }
  );
