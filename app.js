(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService',MenuSearchService)
.directive('foundItems', FoundItemsDirective);

function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      items: '<',
      onRemove: '&'
    },
     controller: FoundItemsDirectiveController,
     controllerAs: 'list',
     bindToController: true
  };
  return ddo;
}

function FoundItemsDirectiveController() {
  var list = this;
}

MenuSearchService.$inject = ['$http'];
function MenuSearchService($http) {
  var service = this;

  service.getMatchedMenuItems = function (shortName) {
    var foundItems = $http({
      method: "GET",
      url: ("https://davids-restaurant.herokuapp.com" + "/menu_items.json"),
      params: {
        category: shortName
      }
    });
  console.log(foundItems);
    return foundItems;
  };
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var list = this;
  var menuItems;

  list.removeItem = function (itemIndex) {
    list.items.menu_items.splice(itemIndex,1);
  };

  list.logMenuItems = function (shortName) {
     var promise = MenuSearchService.getMatchedMenuItems(shortName);

     promise.then(function (response) {
       list.items = response.data;
     })
     .catch(function (error) {
       console.log(error);
     })
   };
}

})();
