angular.module('services', [])

  .factory('Restaurants', function() {
    // Might use a resource here that returns a JSON array

    // Some testing data
    var search = [{
      id: 0,
      name: 'The Smoke House',
      lastText: 'Steakhouses, Seafood Restaurants',
      image: 'img/smoke.jpg',
      address:'8 High Street, Killarney',
      number: '0863726093',
      latitude : "52.5711232",
      longitude : "-9.3762617"

    }, {
      id: 1,
      name: 'Bricin',
      lastText: 'Irish Restaurants',
      image: 'img/bricin.jpg',
      address:'26 High Street, Killarney',
      number: '0863726093',
      latitude : "52.5711232",
      longitude : "-9.3762617"
    }, {
      id: 2,
      name: 'Cronins Restaurant',
      lastText: 'Irish Restaurant',
      image: 'img/cronins.jpg',
      address:'24 Plunkett Street, Killarney',
      number: '0863726093',
      latitude : "52.5711232",
      longitude : "-9.3762617"
    }, {
      id: 3,
      name: 'Quinlans Seafood Bar',
      lastText: 'Seafood Restaurants',
      image: 'img/sea.jpg',
      address:'77 High Street, Killarney',
      number: '0863726093',
      latitude : "52.5711232",
      longitude : "-9.3762617"
    }, {
      id: 4,
      name: 'Murphys',
      lastText: 'Irish Restaurants',
      image: 'img/murphys.jpg',
      address:'58 New Street, Killarny',
      number: '0863726093',
      latitude : "52.5711232",
      longitude : "-9.3762617"
    }];

    return {
      all: function() {
        return search;
      },
      remove: function(search) {
        search.splice(search.indexOf(rest), 1);
      },
      get: function(restId) {
        for (var i = 0; i < search.length; i++) {
          if (search[i].id === parseInt(restId)) {
            return search[i];
          }
        }
        return null;
      }
    };
  })


  .service('UserService', function() {
    // For the purpose of this example I will store user data on ionic local storage but you should save it on a database
    var setUser = function(user_data) {
      window.localStorage.starter_facebook_user = JSON.stringify(user_data);
    };

    var getUser = function(){
      return JSON.parse(window.localStorage.starter_facebook_user || '{}');
    };

    return {
      getUser: getUser,
      setUser: setUser
    };
  });


