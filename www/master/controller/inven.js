angular
  .module("app")

  .controller(
    "inventory1Ctrl",
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

      //// Part modal
      {
        $ionicModal
          .fromTemplateUrl("part-modal.html", {
            scope: $scope,
            animation: "slide-in-up",
          })
          .then(function (modal) {
            $scope.modalPart = modal;
          });

        $scope.openModalPart = function () {
          $scope.modalPart.show();
        };

        $scope.closeModalPart = function () {
          $scope.modalPart.hide();
        };
        // Cleanup the modal when we're done with it!
        $scope.$on("$destroy", function () {
          $scope.modalPart.remove();
        });

        ///////////////////////////
        $ionicModal
          .fromTemplateUrl("partto-modal.html", {
            scope: $scope,
            animation: "slide-in-up",
          })
          .then(function (modal) {
            $scope.modalPartTo = modal;
          });

        $scope.openModalPartTo = function () {
          $scope.modalPartTo.show();
        };

        $scope.closeModalPartTo = function () {
          $scope.modalPartTo.hide();
        };
        // Cleanup the modal when we're done with it!
        $scope.$on("$destroy", function () {
          $scope.modalPartTo.remove();
        });
      }

      //// site modal
      {
        $ionicModal
          .fromTemplateUrl("site-modal.html", {
            scope: $scope,
            animation: "slide-in-up",
          })
          .then(function (modal) {
            $scope.modalSite = modal;
          });

        $scope.openModalSite = function () {
          $scope.modalSite.show();
        };

        $scope.closeModalSite = function () {
          $scope.modalSite.hide();
        };
        // Cleanup the modal when we're done with it!
        $scope.$on("$destroy", function () {
          $scope.modalSite.remove();
        });

        ///////////////////////////
        $ionicModal
          .fromTemplateUrl("siteto-modal.html", {
            scope: $scope,
            animation: "slide-in-up",
          })
          .then(function (modal) {
            $scope.modalSiteto = modal;
          });

        $scope.openModalSiteTo = function () {
          $scope.modalSiteto.show();
        };

        $scope.closeModalSiteTo = function () {
          $scope.modalSiteto.hide();
        };
        // Cleanup the modal when we're done with it!
        $scope.$on("$destroy", function () {
          $scope.modalSiteto.remove();
        });
      }

      //// Loc modal
      {
        $ionicModal
          .fromTemplateUrl("loc-modal.html", {
            scope: $scope,
            animation: "slide-in-up",
          })
          .then(function (modal) {
            $scope.modalLoc = modal;
          });

        $scope.openModalLoc = function () {
          $scope.modalLoc.show();
        };

        $scope.closeModalLoc = function () {
          $scope.modalLoc.hide();
        };
        // Cleanup the modal when we're done with it!
        $scope.$on("$destroy", function () {
          $scope.modalLoc.remove();
        });

        ///////////////////////////
        $ionicModal
          .fromTemplateUrl("locto-modal.html", {
            scope: $scope,
            animation: "slide-in-up",
          })
          .then(function (modal) {
            $scope.modalLocto = modal;
          });

        $scope.openModalLocTo = function () {
          $scope.modalLocto.show();
        };

        $scope.closeModalLocTo = function () {
          $scope.modalLocto.hide();
        };
        // Cleanup the modal when we're done with it!
        $scope.$on("$destroy", function () {
          $scope.modalLocto.remove();
        });
      }

      vm.search = function () {
        $state.go("app.inventory2", { search: JSON.stringify(vm.select) });
      };

      function onStart() {
        let req = {
          mode: "mstr",
        };
        fachttp.model("inven.php", req).then(
          function (response) {
            console.log(response.data);
            if (response.data.status == true) {
              vm.partItem = response.data.pt_mstr;
              vm.siteItem = response.data.si_mstr;
              vm.locItem = response.data.loc_mstr;

              // vm.os_list = response.data;
              // vm.os_statusList = response.data.os_status;
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

      vm.select = {
        part: null,
        partto: null,
        site: null,
        siteto: null,
        loc: null,
        locto: null,
      };

      $scope.selectPart = function (e) {
        vm.select.part = e;
        $scope.closeModalPart();
      };
      $scope.selectPartTo = function (e) {
        vm.select.partto = e;
        $scope.closeModalPartTo();
      };

      $scope.selectSite = function (e) {
        vm.select.site = e;
        $scope.closeModalSite();
      };
      $scope.selectSiteTo = function (e) {
        vm.select.siteto = e;
        $scope.closeModalSiteTo();
      };

      $scope.selectLoc = function (e) {
        vm.select.loc = e;
        $scope.closeModalLoc();
      };
      $scope.selectLocTo = function (e) {
        vm.select.locto = e;
        $scope.closeModalLocTo();
      };
    }
  )

  .controller(
    "inventory2Ctrl",
    function (
      $http,
      $rootScope,
      $ionicHistory,
      fachttp,
      $ionicLoading,
      Service,
      $state,
      $scope,
      $stateParams
    ) {
      let vm = this;

      // console.log(JSON.parse($stateParams.search))

      $scope.searchdata = JSON.parse($stateParams.search);

      console.log($scope.searchdata);

      if (
        $scope.searchdata.part == null &&
        $scope.searchdata.partto == null &&
        $scope.searchdata.site == null &&
        $scope.searchdata.siteto == null &&
        $scope.searchdata.loc == null &&
        $scope.searchdata.locto == null
      ) {
        $scope.textShow = {
          part: "รหัสสินค้าทั้งหมด",
          site: "Siteทั้งหมด",
          loc: "Loc ทั้งหมด",
        };
      } else {
        let partText = $scope.searchdata.part
          ? $scope.searchdata.part.pt_part == null
            ? "ทั้งหมด"
            : $scope.searchdata.part.pt_part
          : "ทั้งหมด";
        let parttoText = $scope.searchdata.partto
          ? $scope.searchdata.partto.pt_part == null ? 'ทั้งหมด' :$scope.searchdata.partto.pt_part
          : "ทั้งหมด";

        let siteText = $scope.searchdata.site
          ? $scope.searchdata.site.si_site
          : "ทั้งหมด";
        let sitetoText = $scope.searchdata.siteto
          ? $scope.searchdata.siteto.si_site
          : "ทั้งหมด";

        let locText = $scope.searchdata.loc
          ? $scope.searchdata.loc.loc_loc
          : "ALLทั้งหมด";
        let loctoText = $scope.searchdata.locto
          ? $scope.searchdata.locto.loc_loc
          : "ทั้งหมด";

        $scope.textShow = {
          part: "รหัสสินค้า " + partText + " ถึง " + parttoText,
          site: "Site " + siteText + " ถึง " + sitetoText,
          loc: "Loc " + locText + " ถึง " + loctoText,
        };

        console.log($scope.textShow);

        console.log(partText);
        console.log(parttoText);
        console.log(siteText);
        console.log(sitetoText);
        console.log(locText);
        console.log(loctoText);
      }

      console.log($scope.searchdata);

      function onStart() {
        let req = {
          mode: "lot_list",
          search: $scope.searchdata,
        };
        fachttp.model("inven.php", req).then(
          function (response) {
            console.log(response.data);
            if (response.data.status == true) {
              vm.lotlist = response.data.pt_mstr;
            } else {
              vm.lotlist = [];
            }
          },
          function err(err) {
            $ionicLoading.hide();
            Service.timeout();
          }
        );
      }
      onStart();

      console.log("inventory2Ctrl");
      vm.list = {
        result: [
          { pic: [{ path: "img/goods.png" }] },
          { pic: [{ path: "img/goods.png" }] },
          { pic: [{ path: "img/goods.png" }] },
          { pic: [{ path: "img/goods.png" }] },
          { pic: [{ path: "img/goods.png" }] },
          { pic: [{ path: "img/goods.png" }] },
        ],
      };

      console.log(vm.list.result);
    }
  )

  .controller(
    "inventory3Ctrl",
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

      console.log("inventory3Ctrl");
      vm.list = {
        result: [
          { pic: [{ path: "img/goods.png" }] },
          { pic: [{ path: "img/goods.png" }] },
          { pic: [{ path: "img/goods.png" }] },
          { pic: [{ path: "img/goods.png" }] },
          { pic: [{ path: "img/goods.png" }] },
          { pic: [{ path: "img/goods.png" }] },
        ],
      };

      console.log(vm.list.result);
    }
  );
