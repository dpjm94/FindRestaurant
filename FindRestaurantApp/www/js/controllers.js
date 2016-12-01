angular.module('starter.controllers', [])


  .controller('WelcomeCtrl', function($scope, $state, $q, UserService, $ionicLoading) {
    // This is the success callback from the login method
    var fbLoginSuccess = function(response) {
      if (!response.authResponse){
        fbLoginError("Cannot find the authResponse");
        return;
      }

      var authResponse = response.authResponse;

      getFacebookProfileInfo(authResponse)
        .then(function(profileInfo) {
          // For the purpose of this example I will store user data on local storage
          UserService.setUser({
            authResponse: authResponse,
            userID: profileInfo.id,
            name: profileInfo.name,
            email: profileInfo.email,
            picture : "http://graph.facebook.com/" + authResponse.userID + "/picture?type=large"
          });
          $ionicLoading.hide();
          $state.go('tab.nearby');
        }, function(fail){
          // Fail get profile info
          console.log('profile info fail', fail);
        });
    };

    // This is the fail callback from the login method
    var fbLoginError = function(error){
      console.log('fbLoginError', error);
      $ionicLoading.hide();
    };

    // This method is to get the user profile info from the facebook api
    var getFacebookProfileInfo = function (authResponse) {
      var info = $q.defer();

      facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
        function (response) {
          console.log(response);
          info.resolve(response);
        },
        function (response) {
          console.log(response);
          info.reject(response);
        }
      );
      return info.promise;
    };

    //This method is executed when the user press the "Login with facebook" button
    $scope.facebookSignIn = function() {
      facebookConnectPlugin.getLoginStatus(function(success){
        if(success.status === 'connected'){
          // The user is logged in and has authenticated your app, and response.authResponse supplies
          // the user's ID, a valid access token, a signed request, and the time the access token
          // and signed request each expire
          console.log('getLoginStatus', success.status);

          // Check if we have our user saved
          var user = UserService.getUser('facebook');

          if(!user.userID){
            getFacebookProfileInfo(success.authResponse)
              .then(function(profileInfo) {
                // For the purpose of this example I will store user data on local storage
                UserService.setUser({
                  authResponse: success.authResponse,
                  userID: profileInfo.id,
                  name: profileInfo.name,
                  email: profileInfo.email,
                  picture : "http://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large"
                });

                $state.go('tab.nearby');
              }, function(fail){
                // Fail get profile info
                console.log('profile info fail', fail);
              });
          }else{
            $state.go('tab.nearby');
          }
        } else {
          // If (success.status === 'not_authorized') the user is logged in to Facebook,
          // but has not authenticated your app
          // Else the person is not logged into Facebook,
          // so we're not sure if they are logged into this app or not.

          console.log('getLoginStatus', success.status);

          $ionicLoading.show({
            template: 'Logging in...'
          });

          // Ask the permissions you need. You can learn more about
          // FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
          facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
        }
      });
    };
  })


  .controller('TabCtrl', function($scope){

})

  .controller('NearbyCtrl', function($scope, UserService, $ionicActionSheet, $state, $ionicLoading){
    $scope.user = UserService.getUser();

    $scope.showLogOutMenu = function() {
      var hideSheet = $ionicActionSheet.show({
        destructiveText: 'Logout',
        titleText: 'Are you sure you want to logout? This app is awesome so I recommend you to stay.',
        cancelText: 'Cancel',
        cancel: function() {},
        buttonClicked: function(index) {
          return true;
        },
        destructiveButtonClicked: function(){
          $ionicLoading.show({
            template: 'Logging out...'
          });

          // Facebook logout
          facebookConnectPlugin.logout(function(){
              $ionicLoading.hide();
              $state.go('welcome');
            },
            function(fail){
              $ionicLoading.hide();
            });
        }
      });
    };
  })




.controller('SearchCtrl', function($scope, Restaurants) {


  $scope.search = Restaurants.all();
  $scope.remove = function(rest) {
    Restaurants.remove(rest);
  };
})

  .controller('DetailCtrl', function($scope, $stateParams, Restaurants) {
    $scope.rest =Restaurants.get($stateParams.restId);
  })



.controller('MapSearchCntr', function($scope, $ionicModal,$ionicActionSheet, $timeout, $http, $log,$state, $location, $ionicPopup, $compile,geolocationService,geofenceService,$ionicLoading) {
  console.log("Map Search Ctrlers");
  $scope.latLang={
    lat:'',
    lang:'',
    location:''
  };

  $ionicLoading.show({
    template: 'Getting geofences from device...',
    duration: 5000
  });

  $scope.geofences = [];

  geofenceService.getAll().then(function (geofences) {
    $ionicLoading.hide();
    $scope.geofences = geofences;
  }, function (reason) {
    $ionicLoading.hide();
    $log.log('An Error has occured', reason);
  });


  $scope.GetGeoLocation = function () {

    $log.log('Tracing current location...');
    $ionicLoading.show({
      template: 'Tracing current location...'
    });
    geolocationService.getCurrentPosition()
      .then(function (position) {
        $log.log('Current location found');
        $log.log('Current location Latitude'+position.coords.latitude);
        $log.log('Current location Longitude'+position.coords.longitude);

        $ionicLoading.hide();
        $scope.latLang.lat=parseFloat(position.coords.latitude);
        $scope.latLang.lang=parseFloat(position.coords.longitude);
        var lat =$scope.latLang.lat;
        var lang =$scope.latLang.lang;
        //You can hit request upto 2500 per day on free of cost.
        var mrgdata='http://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lang+'&sensor=true'
        $http.get(mrgdata)
          .success(function (response) {
            /* console.log(response.results[0].formatted_address); */
            $scope.latLang.location=response.results[0].formatted_address;
            console.log("Your Current Location is : " +$scope.latLang.location)

            var myLatlng = new google.maps.LatLng(lat,lang);

            var mapOptions = {
              center: myLatlng,
              zoom: 16,
              mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("map"),
              mapOptions);


            var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
            var compiled = $compile(contentString)($scope);

            var infowindow = new google.maps.InfoWindow({

            });
            infowindow.setContent($scope.latLang.location);
            infowindow.open(map, marker);

            var marker = new google.maps.Marker({
              position: myLatlng,
              map: map,
              title: 'Current Location'
            });

            google.maps.event.addListener(marker, 'click', function() {
              infowindow.open(map,marker);

            });

            $scope.map = map;


          }).error(function (data, status, headers, config) {
          console.log("error");

          if (status == 0)
            showalert("Error", "Errro Occured from Server site!");
          else
            showalert("Error", data);

        });

      }, function (reason) {
        $log.log('Cannot obtain current location', reason);

        $ionicLoading.show({
          template: 'Cannot obtain current location',
          duration: 1500
        });
      });
  };

  //This is default set location before fetching current location///
  //***************Start********************************//
  if($scope.latLang.lat==''){
    var myLatlng = new google.maps.LatLng(18.9750,72.8258);

    var mapOptions = {
      center: myLatlng,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map"),
      mapOptions);


    var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
    var compiled = $compile(contentString)($scope);

    var infowindow = new google.maps.InfoWindow({

    });
    infowindow.setContent($scope.latLang.location);
    infowindow.open(map, marker);

    var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      title: 'Current Location'
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map,marker);

    });

    $scope.map = map;
  }
  //***********************End**********************************///
});


