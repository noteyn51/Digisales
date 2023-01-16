angular
  .module("app")

  .controller(
    "postnaveCtrl",
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

      $scope.shouldHide = function () {
        // //console.log($state.current.name);
        switch ($state.current.name) {
          // case "post.menupostpect":
          //   return true;
          case "post.postpect":
            return true;
          case "post.postpectAddress":
            return true;
          case "post.postpectEdit":
            return true;
          case "post.postpectAddressEdit":
            return true;
          case "post.postpectCredit":
            return true;
          case "post.postpect2":
            return true;
          case "post.postpectAddress2":
            return true;
          case "post.postpectEdit2":
            return true;
          case "post.postpectAddressEdit2":
            return true;
          case "post.postpectCredit2":
            return true;

          default:
            return false;
        }
      };

      $scope.postSale = function () {
        console.log("postSale");
        $state.go("post.menupostpect");
      };

      $scope.addpost = function () {
        $state.go("post.menupostpect2");
      };
    }
  )

  .controller(
    "menupostpectCtrl",
    function (
      $http,
      $rootScope,
      $ionicHistory,
      fachttp,
      $ionicLoading,
      Service,
      $state,
      $scope,
      $location
    ) {
      let vm = this;

      var path = $location.path();
      console.log(path)
      vm.goBack = function () {
        $ionicHistory.goBack();
        // alert(223)
        // $state.go("app.menu");
      };

      vm.edit = function (e) {
        console.log(e);
        $state.go("post.postpectEdit", { cmaddr: e.cm_addr });
      };

      function onStart() {
        $ionicLoading.show();
        let req = {
          mode: "cm_p",
        };
        fachttp.model("postpect.php", req).then(
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
      }

      onStart();

      $scope.add = function () {
        $state.go("post.postpect");
      };
    }
  )

  .controller(
    "postpectCtrl",
    function (
      $http,
      $rootScope,
      $ionicLoading,
      Service,
      $ionicHistory,
      $state,
      $scope,
      fachttp,
      $mdDialog
    ) {
      let vm = this;

      vm.goBack = function () {
        $ionicHistory.goBack();
      };

      $scope.model = {
        user_title: "",
        user_fname: "",
        user_lname: "",
        user_nname: "",
        user_position: "",
        user_agency: "",
        user_email: "",
        user_tel_mobile: "",
        user_tel: "",
        user_social: "",
        user_line: "",
        user_event: "",
      };

      function onStart() {
        let req = {
          mode: "title",
        };
        fachttp.model("postpect.php", req).then(
          function (response) {
            console.log(response.data);
            vm.title = response.data;
          },
          function err(err) {
            $ionicLoading.hide();
            Service.timeout();
          }
        );
      }

      onStart();

      $scope.goAddress = function () {
        if (
          $scope.model.user_title &&
          $scope.model.user_fname &&
          $scope.model.user_tel_mobile &&
          $scope.model.model &&
          $scope.model.user_event
        ) {
          console.log(JSON.stringify($scope.model));
          $state.go("post.postpectAddress", {
            cust: JSON.stringify($scope.model),
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
              .textContent(
                "ไม่สามารถทำรายการต่อไปได้กรุณาระบุข้อมูลทำจำเป็นให้ครบถ้วน"
              )
              .ariaLabel("Alert Dialog Demo")
              .ok("OK")
              .targetEvent()
          );
        }
      };
    }
  )

  .controller(
    "postpectAddressCtrl",
    function (
      $http,
      $rootScope,
      $ionicHistory,
      $state,
      $scope,
      $stateParams,
      Service,
      fachttp,
      $ionicLoading,
      $mdDialog,
      $ionicModal,
      $cordovaGeolocation,
      goBackMany
    ) {
      let vm = this;
      var map;

      $ionicModal
        .fromTemplateUrl("my-map.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.modalmap = modal;
        });

      $scope.openModalMap = function () {
        $scope.modalmap.show();

        if (!map) {
          map = new google.maps.Map(document.getElementById("maps"), {
            center: {
              lat: 13.713462,
              lng: 100.478819,
            },
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            mapTypeControlOptions: {
              style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
              mapTypeIds: ["satellite", "roadmap", "hybrid"],
            },
            
            mapTypeId:google.maps.MapTypeId.ROADMAP,
            zoom: 19,
          });
        }

        google.maps.event.addListener(map, "click", function (event) {
          placeMarker(event.latLng);
        });

        var marker;

        function placeMarker(location) {
          if (marker == null) {
            marker = new google.maps.Marker({
              position: location,
              map: map,
            });
            map.panTo(location);
          } else {
            marker.setPosition(location);
            map.panTo(location);
          }
        }

        vm.here = function () {
          $ionicLoading.show({
            duration: 3000,
          });

          function callPosition() {
            var posOptions = {
              timeout: 10000,
              enableHighAccuracy: true,
            };
            return $cordovaGeolocation.getCurrentPosition(posOptions).then(
              function (position) {
                //console.log(position);
                vm.position = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                };
                let latlng =
                  "" +
                  position.coords.latitude +
                  "," +
                  position.coords.longitude +
                  "";

                return position;
              },
              function (err) {
                // error
              }
            );
          }
          let platform = ionic.Platform.platform();
          //console.log(platform);
          function onStart() {
            function checkGPS() {
              //Call status GPS from Service and return value to statusgps
              return new Promise(function (resolve, reject) {
                deviceService.checkGPS(function (e) {
                  resolve(e);
                });
              });
            }

            async function main() {
              let statusgps = await checkGPS();
              if (statusgps == "GPS_OFF") {
                if (platform == "android") {
                  deviceService.opengpsAndroid(function (e) {
                    if (e == "force_gps") {
                      return callPosition();
                    } else {
                      return callPosition();
                    }

                    return callPosition();
                  });
                } else if (platform == "ios") {
                }
              } else {
                $ionicLoading.show();
                //console.log("1324");
                vm.alert = "on";
                return callPosition();
              }
            }

            if (
              platform == "win32" ||
              platform == "ios" ||
              platform == "macintel"
            ) {
              return callPosition();
            } else if (platform == "android") {
              // Android check gps ใน function
              return main();
            }
          }
          let abc = onStart();

          abc.then(function (response) {
            vm.position = {
              lat: response.coords.latitude,
              lng: response.coords.longitude,
            };

            map.setZoom(25);
            map.panTo(vm.position);

            $ionicLoading.hide();
          });
        };

        vm.savelat = function () {
          if (marker != null) {
            $scope.address.position.lat = marker.getPosition().lat().toFixed(5);
            $scope.address.position.lng = marker.getPosition().lng().toFixed(5);
            console.log($scope.address.position);
          }
          $scope.modalmap.hide();
        };
      };
      $scope.closeModalMap = function () {
        $scope.modalmap.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        $scope.modalmap.remove();
      });

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

      console.log(JSON.parse($stateParams.cust));
      $scope.cust = JSON.parse($stateParams.cust);
      $scope.address = {
        address: "",
        moo: "",
        build: "",
        floor: "",
        soi: "",
        road: "",
        country: "",
        zip: "",
        position: { lat: null, lng: null },
      };

      vm.save = function () {
        var confirm = $mdDialog
          .confirm()
          .title("แจ้งเตือน")
          .textContent("ต้องการเพิ่มข้อมูลลูกค้าเป้าหมายใหม่ใช่หรือไม่")
          .ariaLabel("Lucky day")
          .targetEvent()
          .ok("ยืนยัน")
          .cancel("ยกเลิก");

        $mdDialog.show(confirm).then(function (result) {
          if (result) {
            $ionicLoading.show();
            console.log($scope.cust);
            console.log($scope.address);
            let pro = {
              province: vm.provinceSelect,
              aumphur: vm.aumphurSelect,
              tumbol: vm.tumbolSelect,
            };
            let req = {
              mode: "addPost",
              cust: $scope.cust,
              address: $scope.address,
              pro: pro,
            };
            fachttp.model("postpect.php", req).then(
              function (response) {
                console.log(response.data);
                $ionicLoading.hide();

                // if (response.data.status == true) {
                // } else {
                // }


                $ionicHistory.clearCache().then(function () {
                  goBackMany(2);
                });

                // $ionicHistory.nextViewOptions({
                //   historyRoot: false,
                // });

                // $ionicHistory.clearCache().then(function () {
                //   $state.go("app.menupostpect");
                // });
              },
              function err(err) {
                $ionicLoading.hide();
                Service.timeout();
              }
            );
          }
        });
      };
    }
  )

  .controller(
    "postpectEditCtrl",
    function (
      $http,
      $rootScope,
      $ionicLoading,
      Service,
      $ionicHistory,
      $state,
      $scope,
      fachttp,
      $mdDialog,
      $stateParams
    ) {
      let vm = this;
      console.log($stateParams.cmaddr);
      vm.goBack = function () {
        $ionicHistory.goBack();
      };
      // $scope.model = {
      //   user_title: "นาย",
      //   user_fname: "บรรพต",
      //   user_lname: "คล้ายศร",
      //   user_tel_mobile: "0960653655",
      //   user_tel: "022110055",
      // };

      function onStart() {
        let req = {
          mode: "cm_det",
          cmaddr: $stateParams.cmaddr,
        };
        fachttp.model("postpect.php", req).then(
          function (response) {
            console.log(response.data);
            if (response.data.status == true) {
              $scope.model = {};
              vm.title = response.data.title;
              $scope.model = response.data.model;
              $scope.address = response.data.address;
            } else {
            }
            $ionicLoading.hide();

            vm.title = response.data.title;
          },
          function err(err) {
            $ionicLoading.hide();
            Service.timeout();
          }
        );
      }

      onStart();

      $scope.goAddress = function () {
        if (
          $scope.model.user_title &&
          $scope.model.user_fname &&
          $scope.model.user_lname
        ) {
          console.log(JSON.stringify($scope.model));
          $state.go("post.postpectAddressEdit", {
            cust: JSON.stringify($scope.model),
            address: JSON.stringify($scope.address),
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
              .textContent(
                "ไม่สามารถทำรายการต่อไปได้กรุณาระบุข้อมูลทำจำเป็นให้ครบถ้วน"
              )
              .ariaLabel("Alert Dialog Demo")
              .ok("OK")
              .targetEvent()
          );
        }
      };
    }
  )

  .controller(
    "postpectAddressEditCtrl",
    function (
      $http,
      $rootScope,
      $ionicHistory,
      $state,
      $scope,
      $stateParams,
      Service,
      fachttp,
      $ionicLoading,
      $mdDialog,
      $ionicModal,
      $cordovaGeolocation,
      goBackMany
    ) {
      let vm = this;
      var map;

      $ionicModal
        .fromTemplateUrl("my-map.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.modalmap = modal;
        });

      $scope.openModalMap = function () {
       console.log($scope.address.position.lat)
       console.log($scope.address.position.lng)


     


        $scope.modalmap.show();

        if (!map) {
       
          map = new google.maps.Map(document.getElementById("maps"), {
            center: {
              lat: $scope.address.position.lat ?  Number($scope.address.position.lat ): 13.713462,
              lng: $scope.address.position.lng ? Number($scope.address.position.lng) : 100.478819,
            },
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            mapTypeControlOptions: {
              style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
              mapTypeIds: ["satellite", "roadmap", "hybrid"],
            },
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            zoom: 19,
          });


          if($scope.address.position.lng){
            var myLatlng = new google.maps.LatLng($scope.address.position.lat,$scope.address.position.lng);
            placeMarker(myLatlng)
           }
        }

        google.maps.event.addListener(map, "click", function (event) {
          placeMarker(event.latLng);
        });

        var marker;

        function placeMarker(location) {
          if (marker == null) {
            marker = new google.maps.Marker({
              position: location,
              map: map,
            });
            map.panTo(location);
          } else {
            marker.setPosition(location);
            map.panTo(location);
          }
        }

        vm.here = function () {
          $ionicLoading.show({
            duration: 3000,
          });

          function callPosition() {
            var posOptions = {
              timeout: 10000,
              enableHighAccuracy: true,
            };
            return $cordovaGeolocation.getCurrentPosition(posOptions).then(
              function (position) {
                //console.log(position);
                vm.position = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                };
                let latlng =
                  "" +
                  position.coords.latitude +
                  "," +
                  position.coords.longitude +
                  "";

                return position;
              },
              function (err) {
                // error
              }
            );
          }
          let platform = ionic.Platform.platform();
          //console.log(platform);
          function onStart() {
            function checkGPS() {
              //Call status GPS from Service and return value to statusgps
              return new Promise(function (resolve, reject) {
                deviceService.checkGPS(function (e) {
                  resolve(e);
                });
              });
            }

            async function main() {
              let statusgps = await checkGPS();
              if (statusgps == "GPS_OFF") {
                if (platform == "android") {
                  deviceService.opengpsAndroid(function (e) {
                    if (e == "force_gps") {
                      return callPosition();
                    } else {
                      return callPosition();
                    }

                    return callPosition();
                  });
                } else if (platform == "ios") {
                }
              } else {
                $ionicLoading.show();
                //console.log("1324");
                vm.alert = "on";
                return callPosition();
              }
            }

            if (
              platform == "win32" ||
              platform == "ios" ||
              platform == "macintel"
            ) {
              return callPosition();
            } else if (platform == "android") {
              // Android check gps ใน function
              return main();
            }
          }
          let abc = onStart();

          abc.then(function (response) {
            vm.position = {
              lat: response.coords.latitude,
              lng: response.coords.longitude,
            };

            map.setZoom(25);
            map.panTo(vm.position);

            $ionicLoading.hide();
          });
        };

        vm.savelat = function () {
          if (marker != null) {
            $scope.address.position.lat = marker.getPosition().lat().toFixed(5);
            $scope.address.position.lng = marker.getPosition().lng().toFixed(5);
            console.log($scope.address.position);
          }
          $scope.modalmap.hide();
        };
      };

      $scope.closeModalMap = function () {
        $scope.modalmap.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        $scope.modalmap.remove();
      });

      console.log(JSON.parse($stateParams.cust));
      console.log(JSON.parse($stateParams.address));

      $scope.cust = JSON.parse($stateParams.cust);
      $scope.address = JSON.parse($stateParams.address);

      function province() {
        $ionicLoading.show();
        let req = {
          mode: "provinceedit",
          pro: $scope.address.province,
          aumphur: $scope.address.aumphur,
          tunbol: $scope.address.tumbol,
        };

        fachttp.model("postpect.php", req).then(
          function (response) {
            console.log(response.data);

            vm.province = response.data.province;
            vm.provinceSelect = $scope.address.province;
            vm.aumphur = response.data.aumphur;
            vm.aumphurSelect = $scope.address.aumphur;
            vm.tumbol = response.data.tumbol;
            vm.tumbolSelect = $scope.address.tumbol;
            $ionicLoading.hide();
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

      vm.save = function () {
        var confirm = $mdDialog
          .confirm()
          .title("แจ้งเตือน")
          .textContent("ต้องการเพิ่มข้อมูลลูกค้าเป้าหมายใหม่ใช่หรือไม่")
          .ariaLabel("Lucky day")
          .targetEvent()
          .ok("ยืนยัน")
          .cancel("ยกเลิก");

        $mdDialog.show(confirm).then(function (result) {
          if (result) {
            $ionicLoading.show();
            console.log($scope.cust);
            console.log($scope.address);
            let pro = {
              province: vm.provinceSelect,
              aumphur: vm.aumphurSelect,
              tumbol: vm.tumbolSelect,
            };
            let req = {
              mode: "confirmEdit",
              cust: $scope.cust,
              address: $scope.address,
              pro: pro,
            };
            fachttp.model("postpect.php", req).then(
              function (response) {
                console.log(response.data);
                $ionicLoading.hide();

                if (response.data.status == true) {
                } else {
                }

                $ionicHistory.clearCache().then(function () {
                  goBackMany(2);
                });
              },
              function err(err) {
                $ionicLoading.hide();
                Service.timeout();
              }
            );
          }
        });
      };
    }
  )

  ///////////////postpect2

  .controller(
    "menupostpect2Ctrl",
    function (
      $http,
      $rootScope,
      $ionicHistory,
      fachttp,
      $ionicLoading,
      Service,
      $state,
      $scope,
      $location
    ) {
      let vm = this;
      
      $scope.path = $location.path();
      console.log($scope.path)

      // vm.goBack = function () {
      //   $state.go("app.menu");
      // };

      vm.goBack = function () {
        $ionicHistory.goBack();
        // alert(223)
        // $state.go("app.menu");
      };

      vm.edit = function (e) {
        console.log(e);
        $state.go("post.postpectEdit2", { cmaddr: e.cm_addr });
      };

      function onStart() {
        $ionicLoading.show();
        let req = {
          mode: "cm_p",
        };
        fachttp.model("postpect.php", req).then(
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
      }

      onStart();

      $scope.add = function () {
        $state.go("post.postpect2");
      };
    }
  )

  .controller(
    "postpect2Ctrl",
    function (
      $http,
      $rootScope,
      $ionicLoading,
      Service,
      $ionicHistory,
      $state,
      $scope,
      fachttp,
      $mdDialog
    ) {
      let vm = this;

      vm.goBack = function () {
        $ionicHistory.goBack();
      };

      $scope.model = {
        user_title: "",
        user_fname: "",
        user_lname: "",
        user_nname: "",
        user_position: "",
        user_agency: "",
        user_email: "",
        user_tel_mobile: "",
        user_tel: "",
        user_social: "",
        user_line: "",
        user_event: "",
      };

      function onStart() {
        let req = {
          mode: "title",
        };
        fachttp.model("postpect.php", req).then(
          function (response) {
            console.log(response.data);
            vm.title = response.data;
          },
          function err(err) {
            $ionicLoading.hide();
            Service.timeout();
          }
        );
      }

      onStart();

      $scope.goAddress = function () {
        if (
          $scope.model.user_title &&
          $scope.model.user_fname &&
          $scope.model.user_lname &&
          $scope.model.user_event
        ) {
          console.log(JSON.stringify($scope.model));
          $state.go("post.postpectAddress2", {
            cust: JSON.stringify($scope.model),
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
              .textContent(
                "ไม่สามารถทำรายการต่อไปได้กรุณาระบุข้อมูลทำจำเป็นให้ครบถ้วน"
              )
              .ariaLabel("Alert Dialog Demo")
              .ok("OK")
              .targetEvent()
          );
        }
      };
    }
  )

  .controller(
    "postpectAddress2Ctrl",
    function (
      $http,
      $rootScope,
      $ionicHistory,
      $state,
      $scope,
      $stateParams,
      Service,
      fachttp,
      $ionicLoading,
      $mdDialog,
      $ionicModal,
      $cordovaGeolocation,
      goBackMany
    ) {
      let vm = this;
      var map;

      $ionicModal
        .fromTemplateUrl("my-map.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.modalmap = modal;
        });

      $scope.openModalMap = function () {
        $scope.modalmap.show();

        if (!map) {
          map = new google.maps.Map(document.getElementById("maps"), {
            center: {
              lat: 13.713462,
              lng: 100.478819,
            },
            mapTypeControl: true,
            streetViewControl: false,
            fullscreenControl: false,
            mapTypeControlOptions: {
              style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
              mapTypeIds: ["satellite", "roadmap", "hybrid"],
            },
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            zoom: 19,
          });
        }

        google.maps.event.addListener(map, "click", function (event) {
          placeMarker(event.latLng);
        });

        var marker;

        function placeMarker(location) {
          if (marker == null) {
            marker = new google.maps.Marker({
              position: location,
              map: map,
            });
            map.panTo(location);
          } else {
            marker.setPosition(location);
            map.panTo(location);
          }
        }

        vm.here = function () {
          $ionicLoading.show({
            duration: 3000,
          });

          function callPosition() {
            var posOptions = {
              timeout: 10000,
              enableHighAccuracy: true,
            };
            return $cordovaGeolocation.getCurrentPosition(posOptions).then(
              function (position) {
                //console.log(position);
                vm.position = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                };
                let latlng =
                  "" +
                  position.coords.latitude +
                  "," +
                  position.coords.longitude +
                  "";

                return position;
              },
              function (err) {
                // error
              }
            );
          }
          let platform = ionic.Platform.platform();
          //console.log(platform);
          function onStart() {
            function checkGPS() {
              //Call status GPS from Service and return value to statusgps
              return new Promise(function (resolve, reject) {
                deviceService.checkGPS(function (e) {
                  resolve(e);
                });
              });
            }

            async function main() {
              let statusgps = await checkGPS();
              if (statusgps == "GPS_OFF") {
                if (platform == "android") {
                  deviceService.opengpsAndroid(function (e) {
                    if (e == "force_gps") {
                      return callPosition();
                    } else {
                      return callPosition();
                    }

                    return callPosition();
                  });
                } else if (platform == "ios") {
                }
              } else {
                $ionicLoading.show();
                //console.log("1324");
                vm.alert = "on";
                return callPosition();
              }
            }

            if (
              platform == "win32" ||
              platform == "ios" ||
              platform == "macintel"
            ) {
              return callPosition();
            } else if (platform == "android") {
              // Android check gps ใน function
              return main();
            }
          }
          let abc = onStart();

          abc.then(function (response) {
            vm.position = {
              lat: response.coords.latitude,
              lng: response.coords.longitude,
            };

            map.setZoom(25);
            map.panTo(vm.position);

            $ionicLoading.hide();
          });
        };

        vm.savelat = function () {
          if (marker != null) {
            $scope.address.position.lat = marker.getPosition().lat().toFixed(5);
            $scope.address.position.lng = marker.getPosition().lng().toFixed(5);
            console.log($scope.address.position);
          }
          $scope.modalmap.hide();
        };
      };
      $scope.closeModalMap = function () {
        $scope.modalmap.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        $scope.modalmap.remove();
      });

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

      console.log(JSON.parse($stateParams.cust));
      $scope.cust = JSON.parse($stateParams.cust);
      $scope.address = {
        address: "",
        moo: "",
        build: "",
        floor: "",
        soi: "",
        road: "",
        country: "",
        zip: "",
        position: { lat: null, lng: null },
      };

      vm.save = function () {
        var confirm = $mdDialog
          .confirm()
          .title("แจ้งเตือน")
          .textContent("ต้องการเพิ่มข้อมูลลูกค้าเป้าหมายใหม่ใช่หรือไม่")
          .ariaLabel("Lucky day")
          .targetEvent()
          .ok("ยืนยัน")
          .cancel("ยกเลิก");

        $mdDialog.show(confirm).then(function (result) {
          if (result) {
            $ionicLoading.show();
            console.log($scope.cust);
            console.log($scope.address);
            let pro = {
              province: vm.provinceSelect,
              aumphur: vm.aumphurSelect,
              tumbol: vm.tumbolSelect,
            };
            let req = {
              mode: "addPost",
              cust: $scope.cust,
              address: $scope.address,
              pro: pro,
            };
            fachttp.model("postpect.php", req).then(
              function (response) {
                console.log(response.data);
                $ionicLoading.hide();

                // if (response.data.status == true) {
                // } else {
                // }

                $ionicHistory.clearCache().then(function () {
                  goBackMany(2);
                });

                // $ionicHistory.nextViewOptions({
                //   historyRoot: false,
                // });

                // $ionicHistory.clearCache().then(function () {
                //   $state.go("app.menupostpect");
                // });
              },
              function err(err) {
                $ionicLoading.hide();
                Service.timeout();
              }
            );
          }
        });
      };
    }
  )

  .controller(
    "postpectEdit2Ctrl",
    function (
      $http,
      $rootScope,
      $ionicLoading,
      Service,
      $ionicHistory,
      $state,
      $scope,
      fachttp,
      $mdDialog,
      $stateParams
    ) {
      let vm = this;
      console.log($stateParams.cmaddr);
      vm.goBack = function () {
        $ionicHistory.goBack();
      };
      // $scope.model = {
      //   user_title: "นาย",
      //   user_fname: "บรรพต",
      //   user_lname: "คล้ายศร",
      //   user_tel_mobile: "0960653655",
      //   user_tel: "022110055",
      // };

      function onStart() {
        let req = {
          mode: "cm_det",
          cmaddr: $stateParams.cmaddr,
        };
        fachttp.model("postpect.php", req).then(
          function (response) {
            console.log(response.data);
            if (response.data.status == true) {
              $scope.model = {};
              vm.title = response.data.title;
              $scope.model = response.data.model;
              $scope.address = response.data.address;
            } else {
            }
            $ionicLoading.hide();

            vm.title = response.data.title;
          },
          function err(err) {
            $ionicLoading.hide();
            Service.timeout();
          }
        );
      }

      onStart();

      $scope.goAddress = function () {
        if (
          $scope.model.user_title &&
          $scope.model.user_fname &&
          $scope.model.user_lname
        ) {
          console.log(JSON.stringify($scope.model));
          $state.go("post.postpectAddressEdit2", {
            cust: JSON.stringify($scope.model),
            address: JSON.stringify($scope.address),
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
              .textContent(
                "ไม่สามารถทำรายการต่อไปได้กรุณาระบุข้อมูลทำจำเป็นให้ครบถ้วน"
              )
              .ariaLabel("Alert Dialog Demo")
              .ok("OK")
              .targetEvent()
          );
        }
      };
    }
  )

  .controller(
    "postpectAddressEdit2Ctrl",
    function (
      $http,
      $rootScope,
      $ionicHistory,
      $state,
      $scope,
      $stateParams,
      Service,
      fachttp,
      $ionicLoading,
      $mdDialog,
      $ionicModal,
      $cordovaGeolocation,
      goBackMany
    ) {
      let vm = this;
      var map;

      $ionicModal
        .fromTemplateUrl("my-map.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.modalmap = modal;
        });

      $scope.openModalMap = function () {
        $scope.modalmap.show();

        if (!map) {
          map = new google.maps.Map(document.getElementById("maps"), {
            center: {
              lat: 13.713462,
              lng: 100.478819,
            },
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            mapTypeControlOptions: {
              style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
              mapTypeIds: ["satellite", "roadmap", "hybrid"],
            },
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            zoom: 19,
          });

          if($scope.address.position.lng){
            var myLatlng = new google.maps.LatLng($scope.address.position.lat,$scope.address.position.lng);
            placeMarker(myLatlng)
           }
        }

        google.maps.event.addListener(map, "click", function (event) {
          placeMarker(event.latLng);
        });

        var marker;

        function placeMarker(location) {
          if (marker == null) {
            marker = new google.maps.Marker({
              position: location,
              map: map,
            });
            map.panTo(location);
          } else {
            marker.setPosition(location);
            map.panTo(location);
          }
        }

        vm.here = function () {
          $ionicLoading.show({
            duration: 3000,
          });

          function callPosition() {
            var posOptions = {
              timeout: 10000,
              enableHighAccuracy: true,
            };
            return $cordovaGeolocation.getCurrentPosition(posOptions).then(
              function (position) {
                //console.log(position);
                vm.position = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                };
                let latlng =
                  "" +
                  position.coords.latitude +
                  "," +
                  position.coords.longitude +
                  "";

                return position;
              },
              function (err) {
                // error
              }
            );
          }
          let platform = ionic.Platform.platform();
          //console.log(platform);
          function onStart() {
            function checkGPS() {
              //Call status GPS from Service and return value to statusgps
              return new Promise(function (resolve, reject) {
                deviceService.checkGPS(function (e) {
                  resolve(e);
                });
              });
            }

            async function main() {
              let statusgps = await checkGPS();
              if (statusgps == "GPS_OFF") {
                if (platform == "android") {
                  deviceService.opengpsAndroid(function (e) {
                    if (e == "force_gps") {
                      return callPosition();
                    } else {
                      return callPosition();
                    }

                    return callPosition();
                  });
                } else if (platform == "ios") {
                }
              } else {
                $ionicLoading.show();
                //console.log("1324");
                vm.alert = "on";
                return callPosition();
              }
            }

            if (
              platform == "win32" ||
              platform == "ios" ||
              platform == "macintel"
            ) {
              return callPosition();
            } else if (platform == "android") {
              // Android check gps ใน function
              return main();
            }
          }
          let abc = onStart();

          abc.then(function (response) {
            vm.position = {
              lat: response.coords.latitude,
              lng: response.coords.longitude,
            };

            map.setZoom(25);
            map.panTo(vm.position);

            $ionicLoading.hide();
          });
        };

        vm.savelat = function () {
          if (marker != null) {
            $scope.address.position.lat = marker.getPosition().lat().toFixed(5);
            $scope.address.position.lng = marker.getPosition().lng().toFixed(5);
            console.log($scope.address.position);
          }
          $scope.modalmap.hide();
        };
      };

      $scope.closeModalMap = function () {
        $scope.modalmap.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        $scope.modalmap.remove();
      });

      console.log(JSON.parse($stateParams.cust));
      console.log(JSON.parse($stateParams.address));

      $scope.cust = JSON.parse($stateParams.cust);
      $scope.address = JSON.parse($stateParams.address);

      function province() {
        $ionicLoading.show();
        let req = {
          mode: "provinceedit",
          pro: $scope.address.province,
          aumphur: $scope.address.aumphur,
          tunbol: $scope.address.tumbol,
        };

        fachttp.model("postpect.php", req).then(
          function (response) {
            console.log(response.data);

            vm.province = response.data.province;
            vm.provinceSelect = $scope.address.province;
            vm.aumphur = response.data.aumphur;
            vm.aumphurSelect = $scope.address.aumphur;
            vm.tumbol = response.data.tumbol;
            vm.tumbolSelect = $scope.address.tumbol;
            $ionicLoading.hide();
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

      vm.save = function () {
        var confirm = $mdDialog
          .confirm()
          .title("แจ้งเตือน")
          .textContent("ต้องการเพิ่มข้อมูลลูกค้าเป้าหมายใหม่ใช่หรือไม่")
          .ariaLabel("Lucky day")
          .targetEvent()
          .ok("ยืนยัน")
          .cancel("ยกเลิก");

        $mdDialog.show(confirm).then(function (result) {
          if (result) {
            $ionicLoading.show();
            console.log($scope.cust);
            console.log($scope.address);
            let pro = {
              province: vm.provinceSelect,
              aumphur: vm.aumphurSelect,
              tumbol: vm.tumbolSelect,
            };
            let req = {
              mode: "confirmEdit",
              cust: $scope.cust,
              address: $scope.address,
              pro: pro,
            };
            fachttp.model("postpect.php", req).then(
              function (response) {
                console.log(response.data);
                $ionicLoading.hide();

                if (response.data.status == true) {
                } else {
                }

                $ionicHistory.clearCache().then(function () {
                  goBackMany(2);
                });
              },
              function err(err) {
                $ionicLoading.hide();
                Service.timeout();
              }
            );
          }
        });
      };
    }
  );
