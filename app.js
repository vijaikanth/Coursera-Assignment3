(function () {
'use strict';

angular.module('MenuApp', [])
.controller('MenuController', MenuController)
.service('MenuService', MenuService)
.directive('foundItems', FoundItemsDirective);

MenuController.$inject = ['MenuService'];
function MenuController (MenuService) {
  var menu = this;

  menu.menuFilter = "";
  menu.found = [];
  menu.errorMessage = "";

  menu.getMenu = function() {
    menu.found = [];
    menu.errorMessage = "";

    if(menu.menuFilter.length == 0) {
      menu.errorMessage = "Nothing found"
      return;
    }

    var promise = MenuService.getMenuItems();
    promise.then(function (response) {
      var items = response.data.menu_items;
      for (var j = 0; j < items.length; j++) {
        var item = items[j];
        if(item.description.indexOf(menu.menuFilter) >= 0) {
          menu.found.push(item);
        }
      }
      if(menu.found.length == 0) {
        menu.errorMessage = "Nothing found";
      }
    })
    .catch(function (error) {
      console.log("Something went terribly wrong.");
    });
  }

  menu.removeItem = function(index) {
    menu.found.splice(index, 1);
    if ( menu.found.length == 0) {
      menu.errorMessage = "List is empty!";
    }
  }
}

MenuService.$inject = ['$http'];
function MenuService($http) {
  var service = this;

  service.getMenuItems = function () {
    var response = $http({
      method: "GET",
      url: ("https://davids-restaurant.herokuapp.com/menu_items.json"),
      params: {
      }
    });

    return response;
  };
}


function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      itemList: '<',
      onRemove: '&',
      errorMessage: '<'
    },
    controller: FoundItemsController,
    controllerAs: 'list',
    bindToController: true
  };

  return ddo;
}

function FoundItemsController() {
  var list = this;

}

})();
