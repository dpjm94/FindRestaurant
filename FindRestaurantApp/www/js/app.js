
angular.module('starter', ['ionic', 'starter.controllers','leaflet-directive','ngCordova','services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {


  $stateProvider
    .state('welcome', {
      url: '/welcome',
      templateUrl: 'templates/login.html',
      controller: 'WelcomeCtrl'
    })

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    controller: 'TabCtrl'
  })


    .state('tab.nearby', {
      url: '/nearby',
      views: {
        'tab-nearby': {
          templateUrl: 'templates/tab-nearby.html',
          controller: 'NearbyCtrl'
        }
      }
    })

  .state('tab.search', {
      url: '/search',
      views: {
        'tab-search': {
          templateUrl: 'templates/tab-search.html',
          controller: 'SearchCtrl'
        }
      }
    })
    .state('map', {
      url: '/map',
      views: {
        'menuMap': {
          templateUrl: 'templates/map.html',
          controller: 'MapSearchCntl'
        }
      }
    })

    // .state('map', {
    //   url: '/map',
    //   templateUrl: 'templates/map.html',
    //   controller: 'MapTest'
    // })

    .state('tab.detail', {
      url: '/search/:restId',
      views: {
        'tab-search': {
          templateUrl: 'templates/detail.html',
          controller: 'DetailCtrl'
        }
      }
    });




  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/map');

});


