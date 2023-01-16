angular
  .module("app")

  .factory("sqParam", function () {
    const obj = {};
    obj.item = undefined;
    obj.billTotal = undefined;

    obj.getItemData = function () {
      return obj.item;
    };

    obj.setItemData = function (dataObject) {
      obj.item = dataObject;
    };

    obj.getBillTotalData = function () {
      return obj.billTotal;
    };

    obj.setBillTotalData = function (dataObject) {
      obj.billTotal = dataObject;
    };

    return obj;
  })

  .controller(
    "sq1Ctrl",
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

      $scope.sq2 = function () {
        $state.go("app.sq2");
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
    "sq2Ctrl",
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
      sqParam,
      $stateParams
    ) {
      let vm = this;
      console.log($stateParams);
      var defaultdate = new Date();
      
      $scope.model = {
        dateship: defaultdate.toLocaleDateString("en-CA"),
        dateprice: defaultdate.toLocaleDateString("en-CA"),
      };

      vm.itemlist = [];
      $scope.billTotal = {
        total: "",
        discount: "",
        discountBath: "",
        discountValue: "",
        totalAfterDiscount: "",
        beforeVat: "",
        vatValue: "",
        netTotal: "",
        otherValue: "",
      };
      sqParam.setItemData(vm.itemlist);
      sqParam.setBillTotalData($scope.billTotal);

      $scope.addItem = function () {
        $state.go("app.sqadd");
      };

      $scope.createSQ = function () {
        console.log(vm.itemlist);
        if (
          $scope.model.dateship &&
          $scope.model.dateprice &&
          vm.cmselect &&
          vm.taxSelect &&
          vm.termSelect &&
          vm.exSelect &&
          vm.itemlist.length > 0
        ) {
          var confirm = $mdDialog
            .confirm()
            .title("แจ้งเตือน")
            .textContent("ต้องการสร้างใบเสนอราคาหรือไม่ ?")
            .ariaLabel("Lucky day")
            .targetEvent()
            .ok("ยืนยัน")
            .cancel("ยกเลิก");

          $mdDialog.show(confirm).then(function (result) {
            if (result) {
              let req = {
                mode: "createsq",
                cm: vm.cmselect,
                tax: vm.taxSelect,
                term: vm.termSelect,
                ex: vm.exSelect,
                itemlist: vm.itemlist,
                billTotal: $scope.billTotal,
                model: $scope.model,
                os: vm.osselect,
              };

              fachttp.model("sq.php", req).then(
                function (response) {
                  console.log(response.data);
                  if (response.data.status == true) {
                  } else {
                  }
                  // $ionicHistory.goBack();
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
          $mdDialog.show(
            $mdDialog
              .alert()
              .parent(
                angular.element(document.querySelector("#popupContainer"))
              )
              .clickOutsideToClose(false)
              .title("แจ้งเตือน")
              .textContent("ข้อมูลไม่ครบถ้วน กรุณนาตรวจสอบข้อมูล")
              .ariaLabel("Alert Dialog Demo")
              .ok("OK")
              .targetEvent()
          );
        }
      };

      vm.itemAdd = {
        qty: 0,
        price: 0,
        dispct: 0,
        disbath: 0,
        total: 0,
        distype: "",
      };

      $scope.confirmitem = function () {
        let itemMerge = angular.merge(vm.partSelect, vm.itemAdd);
        console.log(itemMerge);
        vm.itemlist.push(itemMerge);

        $scope.closeModalAdd();
      };

      $scope.qtyChange = function (e) {
        let qty = parseInt(e);

        let sum = qty * vm.itemAdd.price;

        vm.itemAdd.dispct = 0;
        vm.itemAdd.disbath = 0;

        $scope.calTotal(sum);
      };

      $scope.priceChange = function (e) {
        let price = parseInt(e);

        let sum = price * vm.itemAdd.qty;

        vm.itemAdd.dispct = 0;
        vm.itemAdd.disbath = 0;

        $scope.calTotal(sum);
      };

      $scope.disbathChange = function (e) {
        let disval = parseInt(e);
        let sum = vm.itemAdd.qty * vm.itemAdd.price;

        console.log(disval);

        let pct = (disval / sum) * 100;
        console.log(pct);

        vm.itemAdd.dispct = null;
        vm.itemAdd.distype = "Amount";

        $scope.calTotal(sum - disval);
      };

      $scope.dispctChange = function (e) {
        let disval = parseInt(e);
        let sum = vm.itemAdd.qty * vm.itemAdd.price;

        console.log(disval);

        let bath = (sum * disval) / 100;
        console.log(bath);

        vm.itemAdd.disbath = null;
        vm.itemAdd.distype = "Percent";
        $scope.calTotal(sum - bath);
      };

      $scope.calTotal = function (e) {
        vm.itemAdd.total = e;
      };

      vm.selectAndNext = function (e) {
        console.log(555);
        $ionicSlideBoxDelegate.slide(1);
        vm.itemSelect = e;
      };

      vm.addItem = function () {
        vm.list.push({
          item: vm.itemSelect,
          qty: $scope.dataItem.qty,
          price: $scope.dataItem.price,
        });
        $scope.modalAdd.hide();
        //console.log(vm.list)
      };

      $scope.lockSlide = function () {
        $ionicSlideBoxDelegate.enableSlide(false);
      };

      vm.currentIndex = function () {
        return $ionicSlideBoxDelegate.currentIndex();
      };

      vm.prveSlide = function () {
        $ionicSlideBoxDelegate.previous();
      };

      $scope.toggleList = {
        T1: false,
        T2: false,
      };

      vm.selectAndNext = function (e) {
        console.log(555);
        $ionicSlideBoxDelegate.slide(1);
      };

      let platform = ionic.Platform.platform();

      vm.pickdate = function () {
        if (platform == "android" || platform == "ios") {
          document.addEventListener("deviceready", function () {
            let k = Service.pickdate();
            k.then(function suss(data) {
              $scope.model.dateship = data;
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
                    $scope.model.dateship = $scope.datamodal.date;
                  }
                },
              },
            ],
          });
        }
      };

      vm.pickdatePrice = function () {
        if (platform == "android" || platform == "ios") {
          document.addEventListener("deviceready", function () {
            let k = Service.pickdate();
            k.then(function suss(data) {
              $scope.model.dateprice = data;
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
                    $scope.model.dateprice = $scope.datamodal.date;
                  }
                },
              },
            ],
          });
        }
      };

      function onStart() {
        let req = {
          mode: "create_sq_mstr",
        };
        fachttp.model("sq.php", req).then(
          function (response) {
            console.log(response.data);
            if (response.data.status == true) {
              vm.sq = response.data;
              vm.ex = response.data.ex_mstr;
              vm.exSelect = vm.ex[0]
              vm.ct = response.data.ct_mstr;
              vm.termSelect = vm.ct[0]
              vm.taxc = response.data.taxc;
              vm.taxSelect = vm.taxc[0]
            } else {
            }
            $ionicLoading.hide();
          },
          function err(err) {
            $ionicLoading.hide();
            Service.timeout();
          }
        );
      }

      onStart();

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

      $ionicModal
        .fromTemplateUrl("add-modal.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.modalAdd = modal;
        });

      $scope.openModalAdd = function () {
        delete vm.partSelect;
        $scope.loadPart();
        vm.itemAdd = { qty: 0, price: 0, dispct: 0, disbath: 0, total: 0 };

        $ionicSlideBoxDelegate.slide(0);
        $scope.modalAdd.show();
      };

      $scope.closeModalAdd = function () {
        $scope.modalAdd.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        $scope.modalAdd.remove();
      });

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
        $ionicSlideBoxDelegate.slide(0);
        console.log(vm.partSelect);
        $ionicScrollDelegate.resize();
        $ionicScrollDelegate.scrollTop();
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
              vm.cmselect = response.data.result;
              vm.cmad_det = response.data.result;
              $scope.closeModalCm();
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
      };

      $scope.selectOs = function (e) {
        vm.osselect = e;
        $scope.closeModalOs();
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

      if ($stateParams.os_nbr && $stateParams.cm_nbr) {
        let cm = { cm_addr: $stateParams.cm_nbr };

        function selectCmFunc(e) {
          return new Promise((resolve) => {
            let req = {
              mode: "select_cm",
              cmad_addr: e.cm_addr,
            };
            fachttp.model("sq.php", req).then(
              function (response) {
                console.log(response.data);

                if (response.data.status == true) {
                  vm.cmselect = response.data.result;
                  vm.cmad_det = response.data.result;
                }

                resolve();
              },
              function err(err) {
                $ionicLoading.hide();
                Service.timeout();
              }
            );
          });
        }

        function selectOsFunc(e) {
          return new Promise((resolve) => {
            let req = {
              mode: "os_list",
              cm_select: e,
            };
            fachttp.model("sq.php", req).then(
              function (response) {
                vm.oslist = response.data;
                resolve();
              },
              function err(err) {
                $ionicLoading.hide();
                Service.timeout();
              }
            );
          });
        }

        async function f1(cm) {
          $ionicLoading.show();

          const x = await selectCmFunc(cm);
          const y = await selectOsFunc(vm.cmselect);

          var filterOs = vm.oslist.result.filter(function (creature) {
            return creature.os_nbr == $stateParams.os_nbr;
          });

          vm.osselect = filterOs[0];

          console.log(vm.osselect);

          $ionicLoading.hide();
        }

        f1(cm);
      }
    }
  )

  .controller(
    "sqAddCtrl",
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
      sqParam
    ) {
      let vm = this;
      $scope.selectedTab = $stateParams.tab;
      vm.itemlist = sqParam.getItemData();
      $scope.billTotal = sqParam.getBillTotalData();

      $scope.showTotal = function () {
        var total = 0;
        vm.itemlist.forEach((element) => {
          total += element.item.netValue;
        });
        // console.log(total)
        return total;
      };

      $scope.$on(
        "$stateChangeStart",
        function (event, toState, toParams, fromState, fromParams, options) {
          sqParam.setItemData(vm.itemlist);
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
        $state.go("app.sq2-1");
      };

      $scope.removeItem = function (i) {
        $scope.itemData.splice(i, 1);
      };

      $scope.editItem = function (i, e) {
        console.log(e);

        $state.go("app.sq2-edit", { item: JSON.stringify(e), index: i });
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

      $scope.discountChangePct = function () {
        $scope.billTotal.discountBath = "";

        $scope.discountChange();
      };

      $scope.discountChangeBath = function () {
        $scope.billTotal.discount = "";

        $scope.discountChange();
      };

      $scope.discountChange = function () {
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

        vm.itemlist.forEach((element) => {
          total += element.item.netValue;
        });

        if (Number($scope.billTotal.discountBath) > total) {
          $scope.billTotal.discountBath = total;
        } else if (Number($scope.billTotal.discountBath) < 0) {
          $scope.billTotal.discountBath = 0;
        } else {
        }

        console.log($scope.billTotal.discountBath);

        // $scope.billTotal = {total:'',discount:'',discountValue:'',totalAfterDiscount:'',totalAfterDiscount,beforeVat:'',vatValue:'',netTotal:'',otherValue:''}

        discountValue =
          (total * defaultparam.discount) / 100 +
          Number($scope.billTotal.discountBath);
        totalAfterDiscount = total - discountValue;

        vatValue = (totalAfterDiscount * 7) / 100;
        beforeVat = totalAfterDiscount - vatValue;
        netTotal = totalAfterDiscount;

        $scope.billTotal.total = total;
        $scope.billTotal.totalAfterDiscount = totalAfterDiscount;
        $scope.billTotal.discountValue = discountValue;
        $scope.billTotal.vatValue = vatValue;
        $scope.billTotal.beforeVat = beforeVat;
        $scope.billTotal.netTotal = netTotal;

        sqParam.setBillTotalData($scope.billTotal);
      };

      $scope.discountChange();
    }
  )

  .controller(
    "sq2-1Ctrl",
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
        $state.go("app.sq2-2", { item: JSON.stringify(e) });
      };
    }
  )

  .controller(
    "sq2-2Ctrl",
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
      sqParam,
      goBackMany
    ) {
      let vm = this;
      vm.itemlist = sqParam.getItemData() ? sqParam.getItemData() : [];

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
            bath: "",
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

      $scope.discountBathChange = function () {
        $scope.model.item.discount = "";
        $scope.valueChange();
      };

      $scope.discountPctChange = function () {
        $scope.model.item.bath = "";

        $scope.valueChange();
      };

      $scope.valueChange = function () {
        if ($scope.model.item.discount > 100) {
          $scope.model.item.discount = 100;
        } else if ($scope.model.item.discount < 0) {
          $scope.model.item.discount = 0;
        }

        if (Number($scope.model.item.bath) > Number($scope.model.item.price)) {
          $scope.model.item.bath = $scope.model.item.price;
        } else if (Number($scope.model.item.bath) < 0) {
          $scope.model.item.bath = 0;
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
              100 +
            $scope.model.item.bath;
          var totalAfterDiscount =
            Number($scope.model.item.price) - discountValue;

          console.log(totalAfterDiscount);
          var netValue = totalAfterDiscount * $scope.model.item.qty;

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
        vm.itemlist.push($scope.model);
        goBackMany(2);
      };

      $scope.priceChange = function () {};

      $scope.$on(
        "$stateChangeStart",
        function (event, toState, toParams, fromState, fromParams, options) {
          sqParam.setItemData(vm.itemlist);
        }
      );
    }
  )

  .controller(
    "sq2-EditCtrl",
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
      sqParam,
      goBackMany
    ) {
      let vm = this;

      vm.itemlist = sqParam.getItemData() ? sqParam.getItemData() : [];
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

      $scope.discountBathChange = function () {
        $scope.model.item.discount = "";
        $scope.valueChange();
      };

      $scope.discountPctChange = function () {
        $scope.model.item.bath = "";

        $scope.valueChange();
      };

      $scope.valueChange = function () {
        if ($scope.model.item.discount > 100) {
          $scope.model.item.discount = 100;
        } else if ($scope.model.item.discount < 0) {
          $scope.model.item.discount = 0;
        }

        console.log($scope.model.item.price);
        console.log($scope.model.item.bath);

        if (Number($scope.model.item.bath) > Number($scope.model.item.price)) {
          $scope.model.item.bath = $scope.model.item.price;
        } else if (Number($scope.model.item.bath) < 0) {
          $scope.model.item.bath = 0;
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
              100 +
            $scope.model.item.bath;
          var totalAfterDiscount =
            Number($scope.model.item.price) - discountValue;

          console.log(totalAfterDiscount);
          var netValue = totalAfterDiscount * $scope.model.item.qty;

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
        vm.itemlist[index] = $scope.model;
        goBackMany(1);
      };

      $scope.removeItem = function () {
        vm.itemlist.splice(index, 1);
        Service.toast("ลบรายการแล้ว", "info");
        goBackMany(1);
      };

      $scope.priceChange = function () {};
      $scope.$on(
        "$stateChangeStart",
        function (event, toState, toParams, fromState, fromParams, options) {
          sqParam.setItemData(vm.itemlist);
          // event.preventDefault(); // block transition from happening
        }
      );
    }
  )

  .controller(
    "sq4Ctrl",
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
    "sq4Ctrl",
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
    "sqEditCtrl",
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
      function onStart() {
        let req = {
          mode: "sq_detail",
          sq_nbr: $stateParams.nbr,
        };
        fachttp.model("sq.php", req).then(
          function (response) {
            console.log(response.data);
            if (response.data.status == true) {
              vm.sqmstr = response.data.result;
              vm.item = response.data.item;
            } else {
              vm.sqmstr = {};
              vm.item = [];
            }
          },
          function err(err) {
            $ionicLoading.hide();
            Service.timeout();
          }
        );
      }
      onStart();

      $scope.currenttab = "tab1";

      $scope.gotoTab = function (page) {
        $scope.currenttab = page;

        console.log($scope.currenttab);
      };
    }
  );
