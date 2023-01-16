// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular
  .module("app", [
    "ionic",
    "ngCordova",
    "moment-picker",
    "datatables",
    "chart.js",
    "mobiscroll-form",
    "ngStorage",
    "ngAnimate",
    "ngMaterial",
    "easypiechart",
    "flexcalendar",
    "pascalprecht.translate",
    "ui.calendar",
  ])

  .run(function (
    $ionicPlatform,
    $rootScope,
    $localStorage,
    $location,
    $ionicPlatform,
    $ionicLoading,
    $state,
    $ionicPopup,
    $ionicHistory,
    $timeout,
    $ionicBackdrop,
    $mdDialog
  ) {
    $ionicPlatform.ready(function () {
      $rootScope.global = $localStorage.globalDIGIS;

      // if ($rootScope.global) {
      //   console.log(1);
      // } else {
      //   console.log(2);
      // }

      document.addEventListener("deviceready", function () {
        if (window.cordova && StatusBar) {
          // let status bar overlay webview
          StatusBar.overlaysWebView(false);
          // StatusBar.backgroundColorByHexString("#c5d4e8");
          // StatusBar.styleDefault();

           // Change Status Bar background bar to white
      
          // StatusBar.styleDefault();
          // StatusBar.backgroundColorByHexString("#FFFFFF");
          // StatusBar.styleDarkContent();
        }
      });

      $rootScope.ipregister =
        "https://digimove.365supplychain.com/digisalesService/";
      $rootScope.iplogin =
        "https://digimove.365supplychain.com/digisalesService/"; //365

      // $rootScope.ipregister = "http://192.168.9.58/digisalesService/";
      // $rootScope.iplogin = "http://192.168.9.58/digisalesService/"; //local

      let platform = ionic.Platform.platform();
      if (platform == "android") {
        document.addEventListener(
          "deviceready",
          function () {
            let connection;
            // listen for Online event
            $rootScope.$on(
              "$cordovaNetwork:online",
              function (event, networkState) {
                if (platform == "android") {
                  document.addEventListener("deviceready", function () {
                    var notificationOpenedCallback = function (jsonData) {};
                  });
                } else if (platform == ios) {
                }
                connection = true;
              }
            );

            // listen for Offline event
            $rootScope.$on(
              "$cordovaNetwork:offline",
              function (event, networkState) {
                connection = false;
              }
            );

            $rootScope.$watch(
              function () {
                return connection;
              },
              function (newData, oldData) {
                if (newData == false) {
                  $ionicBackdrop.retain();
                  mobiscroll.snackbar({
                    message: "Connection offline Please check your Internet.",
                    display: "top",
                    duration: false,
                  });
                }
                if (newData == true) {
                  $ionicBackdrop.release();
                  mobiscroll.snackbar({
                    message: "Connection Online",
                    display: "top",
                    color: "success",
                    duration: 3000,
                  });
                }
              }
            );
          },
          false
        );

        document.addEventListener("deviceready", function () {
          $ionicPlatform.registerBackButtonAction(function (event) {
            if (
              $state.current.name == "app.menu" ||
              $state.current.name == "app.out" ||
              $state.current.name == "app.soadd"
            ) {
            } else if ($state.current.name == "app.farmerlogin") {
              var Popup = $ionicPopup.confirm({
                title: "<b>แจ้งเตือน !!</b>",

                subTitle:
                  "<center>ต้องการออกจากแอปพลิเคชั่น<br>" +
                  " หรือไม่ ?</center>",
              });

              Popup.then(function (res) {
                if (res) {
                  ionic.Platform.exitApp();
                } else {
                }
              });
            } else {
              $ionicHistory.goBack();
            }

            return false;
          }, 101);
        });
      }

      if (window.cordova && window.Keyboard) {
        window.Keyboard.hideKeyboardAccessoryBar(false);
      }
      if (window.StatusBar) {
        // alert(2)
        // StatusBar.style(2) 
        // StatusBar.styleLightContent();
        // StatusBar.styleDefault();
        // StatusBar.backgroundColorByName("white");
        // StatusBar.styleDefault();
        // statusBar.styleDarkContent();
        // StatusBar.backgroundColorByHexString("#83D5A0");
        // StatusBar.styleDarkContent();
        // StatusBar.styleDefault();
      }
    });

    $rootScope.$on("$stateChangeStart", function () {
      $mdDialog.cancel();
      if ($localStorage.globalDIGIS) {
        $rootScope.global = $localStorage.globalDIGIS;
      } else {
        $location.path("/farmerlogin");
      }
    });
  })

  .config(function (
    $stateProvider,
    $urlRouterProvider,
    $ionicConfigProvider,
    $compileProvider
  ) {
    // $ionicConfigProvider.views.forwardCache(false);
    // $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|blob):|data:image\//)
    $compileProvider.imgSrcSanitizationWhitelist(
      /^\s*(https?|ftp|file|blob|ionic):|data:image/
    );

    $ionicConfigProvider.views.swipeBackEnabled(false);
    $ionicConfigProvider.tabs.position("bottom");
    $urlRouterProvider.otherwise("/app/menu");

    $stateProvider.state("farmerlogin", {
      url: "/farmerlogin",
      templateUrl: "templates/farmerlogin.html",
      controller: "farmerloginCtrl as vm",
    });
    ///////////////////////////////////
    $stateProvider
      .state("register", {
        url: "/register",
        abstract: true,
        templateUrl: "templates/nev/registernev.html",
      })

      .state("register.regisapp", {
        url: "/regisapp",
        views: {
          regis: {
            templateUrl: "templates/regisapp.html",
            controller: "regisAppCtrl as vm",
          },
        },
      });

    ////////////////////////////////////

    $stateProvider
      .state("app", {
        url: "/app",
        abstract: true,
        templateUrl: "templates/nev/navbar.html",
        controller: "nevCtrl as vm",
      })

      .state("app.menu", {
        url: "/menu",
        views: {
          "tab-menu": {
            templateUrl: "templates/tab/farmerMenu.html",
            controller: "farmerMenuCtrl as vm",
          },
        },
      })

      .state("app.receiveitemlist", {
        url: "/receiveitemlist",
        views: {
          "tab-menu": {
            templateUrl: "templates/receiveitem/receiveitemList.html",
            controller: "receiveitemListCtrl as vm",
          },
        },
      })

      .state("app.receiveitemdetial", {
        url: "/receiveitemdetial",
        views: {
          "tab-menu": {
            templateUrl: "templates/receiveitem/receiveitemDetial.html",
            controller: "receiveitemDetialCtrl as vm",
          },
        },
      })

      .state("app.receiveitemedit", {
        url: "/receiveitemedit",
        views: {
          "tab-menu": {
            templateUrl: "templates/receiveitem/receiveitemEdit.html",
            controller: "receiveitemEditCtrl as vm",
          },
        },
      })

      .state("app.receiveitemadd", {
        url: "/receiveitemadd",
        views: {
          "tab-menu": {
            templateUrl: "templates/receiveitem/receiveitemAdd.html",
            controller: "receiveitemAddCtrl as vm",
          },
        },
      })

      /////////////////////

      .state("app.salevisitEdit", {
        url: "/salevisitEdit/:data",
        views: {
          "tab-menu": {
            templateUrl: "templates/salevisit/salevisitEdit.html",
            controller: "salevisitEditCtrl as vm",
          },
        },
      })

      .state("app.salevisitList", {
        url: "/salevisitList",
        views: {
          "tab-menu": {
            templateUrl: "templates/salevisit/salevisitList.html",
            controller: "salevisitListCtrl as vm",
          },
        },
      })

      .state("app.salevisitHistory", {
        url: "/salevisitHistory",
        views: {
          "tab-menu": {
            templateUrl: "templates/salevisit/salevisitHistory.html",
            controller: "salevisitHistoryCtrl as vm",
          },
        },
      })

      .state("app.salevisitAdd", {
        url: "/salevisitAdd:date",
        views: {
          "tab-menu": {
            templateUrl: "templates/salevisit/salevisitAdd.html",
            controller: "salevisitAddCtrl as vm",
          },
        },
      })

      .state("app.salevisitDetail", {
        url: "/salevisitDetail/:visitNbr",
        views: {
          "tab-menu": {
            templateUrl: "templates/salevisit/salevisitDetail.html",
            controller: "salevisitDetailCtrl as vm",
          },
        },
      })

      .state("app.salevisitCalendar", {
        url: "/salevisitCalendar",
        views: {
          "tab-menu": {
            templateUrl: "templates/salevisit/salevisitCalendar.html",
            controller: "salevisitCalendarCtrl as vm",
          },
        },
      })

      .state("app.sq1", {
        url: "/sq1",
        views: {
          "tab-menu": {
            templateUrl: "templates/sq/sq1.html",
            controller: "sq1Ctrl as vm",
          },
        },
      })
      .state("app.sq2", {
        url: "/sq2/:os_nbr/:cm_nbr",
        views: {
          "tab-menu": {
            templateUrl: "templates/sq/sq2.html",
            controller: "sq2Ctrl as vm",
          },
        },
      })

      .state("app.sqadd", {
        url: "/sqadd",
        views: {
          "tab-menu": {
            templateUrl: "templates/sq/sqadd.html",
            controller: "sqAddCtrl as vm",
          },
        },
      })

      .state("app.sq2-1", {
        url: "/sq2-1",
        views: {
          "tab-menu": {
            templateUrl: "templates/sq/sq2-1.html",
            controller: "sq2-1Ctrl as vm",
          },
        },
      })

      .state("app.sq2-2", {
        url: "/sq2-2/:item",
        views: {
          "tab-menu": {
            templateUrl: "templates/sq/sq2-2.html",
            controller: "sq2-2Ctrl as vm",
          },
        },
      })

      .state("app.sq2-edit", {
        url: "/sq2-edit/:item/:index",
        views: {
          "tab-menu": {
            templateUrl: "templates/sq/sq2-edit.html",
            controller: "sq2-EditCtrl as vm",
          },
        },
      })

      .state("app.sqEdit", {
        url: "/sqEdit:nbr",
        views: {
          "tab-menu": {
            templateUrl: "templates/sq/sqEdit.html",
            controller: "sqEditCtrl as vm",
          },
        },
      })

      .state("app.sq4", {
        url: "/sq4",
        views: {
          "tab-menu": {
            templateUrl: "templates/sq/sq4.html",
            controller: "sq4Ctrl as vm",
          },
        },
      })

      .state("app.soadd", {
        url: "/soadd/:nbr/:mode",
        views: {
          "tab-menu": {
            templateUrl: "templates/so/soAdd.html",
            controller: "soAddCtrl as vm",
          },
        },
      })

      .state("app.sotab1", {
        url: "/sotab1",
        views: {
          "tab-menu": {
            templateUrl: "templates/so/soTab1.html",
            controller: "sotab1Ctrl as vm",
          },
        },
      })
      .state("app.sotab2", {
        url: "/sotab2",
        views: {
          "tab-menu": {
            templateUrl: "templates/so/soTab2.html",
            controller: "sotab2Ctrl as vm",
          },
        },
      })
      .state("app.sotab3", {
        url: "/sotab3",
        views: {
          "tab-menu": {
            templateUrl: "templates/so/soTab3.html",
            controller: "sotab3Ctrl as vm",
          },
        },
      })
      .state("app.sotab4", {
        url: "/sotab4",
        views: {
          "tab-menu": {
            templateUrl: "templates/so/soTab4.html",
            controller: "sotab4Ctrl as vm",
          },
        },
      })
      .state("app.sotab4-1", {
        url: "/sotab4-1",
        views: {
          "tab-menu": {
            templateUrl: "templates/so/soTab4-1.html",
            controller: "sotab4-1Ctrl as vm",
          },
        },
      })
      .state("app.sotab4-2", {
        url: "/sotab4-2/:item",
        views: {
          "tab-menu": {
            templateUrl: "templates/so/soTab4-2.html",
            controller: "sotab4-2Ctrl as vm",
          },
        },
      })
      .state("app.sotab4-2-edit", {
        url: "/sotab4-2-edit/:item/:index",
        views: {
          "tab-menu": {
            templateUrl: "templates/so/soTab4-2-edit.html",
            controller: "sotab4-2-editCtrl as vm",
          },
        },
      })

      .state("app.so1", {
        url: "/so1",
        views: {
          "tab-menu": {
            templateUrl: "templates/so/so1.html",
            controller: "so1Ctrl as vm",
          },
        },
      })

      .state("app.inventory1", {
        url: "/inventory1",
        views: {
          "tab-menu": {
            templateUrl: "templates/inven/inventory1.html",
            controller: "inventory1Ctrl as vm",
          },
        },
      })

      .state("app.inventory2", {
        url: "/inventory2:search",
        views: {
          "tab-menu": {
            templateUrl: "templates/inven/inventory2.html",
            controller: "inventory2Ctrl as vm",
          },
        },
      })

      .state("app.inventory3", {
        url: "/inventory3",
        views: {
          "tab-menu": {
            templateUrl: "templates/inven/inventory3.html",
            controller: "inventory3Ctrl as vm",
          },
        },
      })

      ///Sale Chance
      .state("app.saleChance1", {
        url: "/saleChance1",
        views: {
          "tab-menu": {
            templateUrl: "templates/salechance/saleChance1.html",
            controller: "saleChance1Ctrl as vm",
          },
        },
      })

      .state("app.saleChanceEdit", {
        url: "/saleChanceEdit/:osno",
        views: {
          "tab-menu": {
            templateUrl: "templates/salechance/saleChanceEdit.html",
            controller: "saleChanceEditCtrl as vm",
          },
        },
      })

      .state("app.saleChance2", {
        url: "/saleChance2",
        views: {
          "tab-menu": {
            templateUrl: "templates/salechance/saleChance2.html",
            controller: "saleChance2Ctrl as vm",
          },
        },
      })

      .state("app.saleChance3", {
        url: "/saleChance3",
        views: {
          "tab-menu": {
            templateUrl: "templates/salechance/saleChance3.html",
            controller: "saleChance3Ctrl as vm",
          },
        },
      });

    $stateProvider
      .state("post", {
        url: "/post",
        abstract: true,
        templateUrl: "templates/postpect/nev.html",
        controller: "postnaveCtrl as vm",
      })

      .state("post.menupostpect", {
        url: "/post/menupostpect",
        views: {
          "tab-1": {
            templateUrl: "templates/postpect/menupospect.html",
            controller: "menupostpectCtrl as vm",
          },
        },
      })

      .state("post.postpect", {
        url: "/post/postpect",
        views: {
          "tab-1": {
            templateUrl: "templates/postpect/pospect.html",
            controller: "postpectCtrl as vm",
          },
        },
      })
      .state("post.postpectAddress", {
        url: "/post/postpectAddress:cust",
        views: {
          "tab-1": {
            templateUrl: "templates/postpect/pospectAddress.html",
            controller: "postpectAddressCtrl as vm",
          },
        },
      })

      .state("post.postpectEdit", {
        url: "/post/postpectedit:cmaddr",
        views: {
          "tab-1": {
            templateUrl: "templates/postpect/pospectEdit.html",
            controller: "postpectEditCtrl as vm",
          },
        },
      })
      .state("post.postpectAddressEdit", {
        url: "/post/postpectAddressedit:cust:address",
        views: {
          "tab-1": {
            templateUrl: "templates/postpect/pospectAddressEdit.html",
            controller: "postpectAddressEditCtrl as vm",
          },
        },
      })

      // --------------------TAB 2

      .state("post.menupostpect2", {
        url: "/post/menupostpect2",
        views: {
          "tab-2": {
            templateUrl: "templates/postpect/menupospect.html",
            controller: "menupostpect2Ctrl as vm",
          },
        },
      })

      .state("post.postpect2", {
        url: "/post/postpect2",
        views: {
          "tab-2": {
            templateUrl: "templates/postpect/pospect.html",
            controller: "postpect2Ctrl as vm",
          },
        },
      })
      .state("post.postpectAddress2", {
        url: "/post/postpectAddress2:cust",
        views: {
          "tab-2": {
            templateUrl: "templates/postpect/pospectAddress.html",
            controller: "postpectAddress2Ctrl as vm",
          },
        },
      })

      .state("post.postpectEdit2", {
        url: "/post/postpectedit2:cmaddr",
        views: {
          "tab-2": {
            templateUrl: "templates/postpect/pospectEdit.html",
            controller: "postpectEdit2Ctrl as vm",
          },
        },
      })
      .state("post.postpectAddressEdit2", {
        url: "/post/postpectAddressedit2:cust:address",
        views: {
          "tab-2": {
            templateUrl: "templates/postpect/pospectAddressEdit.html",
            controller: "postpectAddressEdit2Ctrl as vm",
          },
        },
      })

      //////////////////////////////

      .state("app.noti", {
        url: "/appnoti",
        views: {
          "tab-noti": {
            templateUrl: "templates/tab/notification.html",
            controller: "notificationCtrl as vm",
          },
        },
      })

      .state("app.appsetting", {
        url: "/appsetting",
        views: {
          "tab-appsetting": {
            templateUrl: "templates/tab/appsetting.html",
            controller: "appsettingCtrl as vm",
          },
        },
      })

      .state("app.dashboard", {
        url: "/dashboard",
        views: {
          "tab-dashboard": {
            templateUrl: "templates/tab/dashboard.html",
            controller: "dashboardCtrl as vm",
          },
        },
      })

      .state("app.usersetting", {
        url: "/usersetting",
        views: {
          "tab-appsetting": {
            templateUrl: "templates/tab/usersetting.html",
            controller: "usersettingCtrl as vm",
          },
        },
      })

      .state("app.editpassword", {
        url: "/appsetting/editpassword",
        views: {
          "tab-appsetting": {
            templateUrl: "templates/farmer/editpassword.html",
            controller: "editpasswordCtrl as vm",
          },
        },
      })

      .state("app.deleteuser", {
        url: "/appsetting/deleteuser",
        views: {
          "tab-appsetting": {
            templateUrl: "templates/tab/deleteUser.html",
            controller: "deleteUserCtrl as vm",
          },
        },
      })

      .state("app.editsales", {
        url: "/appsetting/editsales",
        views: {
          "tab-appsetting": {
            templateUrl: "templates/farmer/editsales.html",
            controller: "editsalesCtrl as vm",
          },
        },
      });
  })

  .config(function ($mdGestureProvider) {
    // For mobile devices without jQuery loaded, do not
    // intercept click events during the capture phase.
    $mdGestureProvider.skipClickHijack();
  })

  .config(function ($mdDateLocaleProvider) {
    var shortMonths = [
      "ม.ค.",
      "ก.พ.",
      "มี.ค.",
      "เม.ย.",
      "พ.ค.",
      "มิ.ย.",
      "ก.ค.",
      "ส.ค.",
      "ก.ย.",
      "ต.ค.",
      "พ.ย.",
      "ธ.ค.",
    ];
    $mdDateLocaleProvider.months = [
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
    ];
    $mdDateLocaleProvider.shortMonths = shortMonths;
    $mdDateLocaleProvider.days = [
      "อาทิตย์",
      "จันทร์",
      "อังคาร",
      "พุธ",
      "พฤหัสบดี",
      "ศุกร์",
      "เสาร์",
    ];
    $mdDateLocaleProvider.shortDays = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];
    $mdDateLocaleProvider.monthHeaderFormatter = function (date) {
      return shortMonths[date.getMonth()] + " " + (date.getFullYear() + 543);
    };
    $mdDateLocaleProvider.formatDate = function (date) {
      return `${moment(date).format("DD/MM")}/${
        moment(date).get("year") + 543
      }`;
    };
    $mdDateLocaleProvider.parseDate = function (dateString) {
      var dateArray = dateString.split("/");
      dateString =
        dateArray[1] + "/" + dateArray[0] + "/" + (dateArray[2] - 543);
      var m = moment(dateString, "L", true);
      return m.isValid() ? m.toDate() : new Date(NaN);
    };
  })

  .factory("fachttp", function ($http, $rootScope, $timeout) {
    return {
      login: function (file, e) {
        let req = {
          global: $rootScope.global,
        };

        angular.merge(req, e);
        return $http.post(
          // "http://192.168.9.48/digisalesService/" + file,
          "https://digimove.365supplychain.com/digisalesService/" + file,
          // "http://192.168.9.58/digisalesService/" + file,
          req
        );
      },
      model: function (file, e, pms) {
        let req = {
          global: $rootScope.global,
        };
        angular.merge(req, e);
        return $http.post(
          // "http://192.168.9.48/digisalesService/model/" + file,
          "https://digimove.365supplychain.com/digisalesService/model/" + file,
          // "http://192.168.9.58/digisalesService/model/" + file,
          req,
          pms
        );
      },
    };
  })
  .service("goBackMany", function ($ionicHistory) {
    return function (depth) {
      // get the right history stack based on the current view
      var historyId = $ionicHistory.currentHistoryId();
      var history = $ionicHistory.viewHistory().histories[historyId];
      // set the view 'depth' back in the stack as the back view
      var targetViewIndex = history.stack.length - 1 - depth;
      $ionicHistory.backView(history.stack[targetViewIndex]);
      // navigate to it
      $ionicHistory.goBack();
    };
  })

  .service("returnToState", function ($ionicHistory) {
    return function (stateName) {
      var historyId = $ionicHistory.currentHistoryId();
      var history = $ionicHistory.viewHistory().histories[historyId];
      for (var i = history.stack.length - 1; i >= 0; i--) {
        if (history.stack[i].stateName == stateName) {
          $ionicHistory.backView(history.stack[i]);
          $ionicHistory.goBack();
        }
      }
    };
  });
