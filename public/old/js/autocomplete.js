/*
 * angular-google-places-autocomplete
 *
 * Copyright (c) 2014 "kuhnza" David Kuhn
 * Licensed under the MIT license.
 * https://github.com/kuhnza/angular-google-places-autocomplete/blob/master/LICENSE
 */

 'use strict';

angular.module('google.places', [])

.directive('googlePlaces', function ($timeout,$rootScope) 
{
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		scope: {location: '='},
		template: '<div class="form-group"><input id="google_places_ac" name="google_places_ac"   type="text" class="form-control"  ng-focus="disableTap()"/></div>',
		link: function ($scope, elm, attrs) {
			var autocomplete = new google.maps.places.Autocomplete($("#google_places_ac")[0], {});
			$scope.disableTap = function () {
				var container = document.getElementsByClassName('pac-container');
				angular.element(container).attr('data-tap-disabled', 'true');
				angular.element(container).on("click", function () {
					$('#type-google_places_ac').blur();
					$('#make_blur_so_value_get_added').css("visibility", "visible");
					$('#make_blur_so_value_get_added').focus();
					$('#make_blur_so_value_get_added').css("visibility", "hidden");
				});
			}
			$scope.booking_form = {};
			$scope.booking_form.from_address_line_1 = '';
			google.maps.event.addListener(autocomplete, 'place_changed', function () {
				//$scope.booking_form ={};
				var place = autocomplete.getPlace();
				console.log(place);
				var i;
				
				for(i=0;i<place.address_components.length;i++)
				{
					if(place.address_components[i].types[0]=='street_number')
					{
						//$scope.booking_form.from_address_line_1 = place.address_components[i].long_name;
						//console.log($scope.address1);
						//console.log('come');
						//console.log(place.address_components[i].long_name);
					}
					if(place.address_components[i].types[0]=='route')
					{
						console.log('uu');
						$rootScope.booking_form.from_address_line_1 = place.address_components[i].long_name;
						//console.log(place.address_components[i].long_name);
						console.log($rootScope.booking_form.from_address_line_1);
					}
					if(place.address_components[i].types[0]=='locality')
					{
						console.log(place.address_components[i].long_name);
					}
					if(place.address_components[i].types[0]=='administrative_area_level_1')
					{
						console.log(place.address_components[i].long_name);
					}
					if(place.address_components[i].types[0]=='country')
					{
						//document.getElementById('country_data_populate').value = val;
					}
					if(place.address_components[i].types[0]=='postal_code')
					{
						console.log(place.address_components[i].long_name);
					}
				}
				$rootScope.google_latitute	 			= place.geometry.location.lat();
				$rootScope.google_longitude	 			= place.geometry.location.lng();
				$rootScope.google_autocomplete_address 	= place.formatted_address;
				//console.log(place.formatted_address);
				//console.log(place.length);
				$scope.$apply();
			});
		}
	}
})
.directive('googlePlaces2', function ($timeout,$rootScope) 
{
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		scope: {location: '='},
		template: '<div class="form-group"><input id="google_places_ac2" name="google_places_ac2"  type="text" class="form-control"   ng-focus="disableTap()"/></div>',
		link: function ($scope, elm, attrs) {
			var autocomplete = new google.maps.places.Autocomplete($("#google_places_ac2")[0], {});
			$scope.disableTap = function () {
				var container = document.getElementsByClassName('pac-container');
				angular.element(container).attr('data-tap-disabled', 'true');
				angular.element(container).on("click", function () {
					$('#type-google_places_ac2').blur();
					$('#make_blur_so_value_get_added').css("visibility", "visible");
					$('#make_blur_so_value_get_added').focus();
					$('#make_blur_so_value_get_added').css("visibility", "hidden");
				});
			}
			google.maps.event.addListener(autocomplete, 'place_changed', function () {
				var place = autocomplete.getPlace();
				console.log(place);
				$rootScope.google_latitute2	 			= place.geometry.location.lat();
				$rootScope.google_longitude2	 			= place.geometry.location.lng();
				$rootScope.google_autocomplete_address2 	= place.formatted_address;
				//console.log($rootScope.google_autocomplete_address2);
				$scope.$apply();
			});
		}
	}
})
.directive('googlePlaces3', function ($timeout,$rootScope) 
{
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		scope: {location: '='},
		template: '<div class="form-group"><input id="google_places_ac2" name="google_places_ac2"   type="text" class="form-control"  ng-focus="disableTap()"/></div>',
		link: function ($scope, elm, attrs) {
			var autocomplete = new google.maps.places.Autocomplete($("#google_places_ac2")[0], {});
			$scope.disableTap = function () {
				var container = document.getElementsByClassName('pac-container');
				angular.element(container).attr('data-tap-disabled', 'true');
				angular.element(container).on("click", function () {
					$('#type-google_places_ac').blur();
					$('#make_blur_so_value_get_added').css("visibility", "visible");
					$('#make_blur_so_value_get_added').focus();
					$('#make_blur_so_value_get_added').css("visibility", "hidden");
				});
			}
			google.maps.event.addListener(autocomplete, 'place_changed', function () {
				var place = autocomplete.getPlace();
				console.log(place);
				var i;
				//console.log(place.name);
				$rootScope.poi_lable=place.name;
				for(i=0;i<place.address_components.length;i++)
				{
					if(place.address_components[i].types[0]=='street_number')
					{
						//console.log(place.address_components[i].long_name);
						$rootScope.line_1=place.address_components[i].long_name;
					}
					if(place.address_components[i].types[0]=='route')
					{
						//console.log(place.address_components[i].long_name);
						$rootScope.line_2=place.address_components[i].long_name;
					}
					if(place.address_components[i].types[0]=='locality')
					{
						//console.log(place.address_components[i].long_name);
						$rootScope.locality=place.address_components[i].long_name;
					}
					if(place.address_components[i].types[0]=='administrative_area_level_1')
					{
						//console.log(place.address_components[i].long_name);
						$rootScope.state=place.address_components[i].long_name;
					}
					if(place.address_components[i].types[0]=='country')
					{
						//console.log(place.address_components[i].long_name);
						$rootScope.country=place.address_components[i].long_name;
					}
					if(place.address_components[i].types[0]=='postal_code')
					{
						//console.log(place.address_components[i].long_name);
						$rootScope.pin_code=place.address_components[i].long_name;
					}
				}
				$rootScope.google_latitute3	 				= place.geometry.location.lat();
				$rootScope.google_longitude3	 			= place.geometry.location.lng();
				$rootScope.google_autocomplete_address3 	= place.formatted_address;
				
				$scope.$apply();
			});
		}
	}
})

app.directive('autocomplete', function() {
  var index = -1;

  return {
    restrict: 'E',
    scope: {
      searchParam: '=ngModel',
      suggestions: '=data',
      onType: '=onType',
      onSelect: '=onSelect',
      autocompleteRequired: '='
    },
    controller: ['$scope', function($scope){
      // the index of the suggestions that's currently selected
      $scope.selectedIndex = -1;

      $scope.initLock = true;

      // set new index
      $scope.setIndex = function(i){
        $scope.selectedIndex = parseInt(i);
      };

      this.setIndex = function(i){
        $scope.setIndex(i);
        $scope.$apply();
      };

      $scope.getIndex = function(i){
        return $scope.selectedIndex;
      };

      // watches if the parameter filter should be changed
      var watching = true;

      // autocompleting drop down on/off
      $scope.completing = false;

      // starts autocompleting on typing in something
      $scope.$watch('searchParam', function(newValue, oldValue){

        if (oldValue === newValue || (!oldValue && $scope.initLock)) {
          return;
        }

        if(watching && typeof $scope.searchParam !== 'undefined' && $scope.searchParam !== null) {
          $scope.completing = true;
          $scope.searchFilter = $scope.searchParam;
          $scope.selectedIndex = -1;
        }

        // function thats passed to on-type attribute gets executed
        if($scope.onType)
          $scope.onType($scope.searchParam);
      });

      // for hovering over suggestions
      this.preSelect = function(suggestion){

        watching = false;

        // this line determines if it is shown
        // in the input field before it's selected:
        //$scope.searchParam = suggestion;

        $scope.$apply();
        watching = true;

      };

      $scope.preSelect = this.preSelect;

      this.preSelectOff = function(){
        watching = true;
      };

      $scope.preSelectOff = this.preSelectOff;

      // selecting a suggestion with RIGHT ARROW or ENTER
      $scope.select = function(suggestion){
        if(suggestion){
          $scope.searchParam = suggestion;
          $scope.searchFilter = suggestion;
          if($scope.onSelect)
            $scope.onSelect(suggestion);
        }
        watching = false;
        $scope.completing = false;
        setTimeout(function(){watching = true;},1000);
        $scope.setIndex(-1);
      };


    }],
    link: function(scope, element, attrs){

      setTimeout(function() {
        scope.initLock = false;
        scope.$apply();
      }, 250);

      var attr = '';

      // Default atts
      scope.attrs = {
        "placeholder": "start typing...",
        "class": "",
        "id": "",
        "inputclass": "",
        "inputid": ""
      };

      for (var a in attrs) {
        attr = a.replace('attr', '').toLowerCase();
        // add attribute overriding defaults
        // and preventing duplication
        if (a.indexOf('attr') === 0) {
          scope.attrs[attr] = attrs[a];
        }
      }

      if (attrs.clickActivation) {
        element[0].onclick = function(e){
          if(!scope.searchParam){
            setTimeout(function() {
              scope.completing = true;
              scope.$apply();
            }, 200);
          }
        };
      }

      var key = {left: 37, up: 38, right: 39, down: 40 , enter: 13, esc: 27, tab: 9};

      document.addEventListener("keydown", function(e){
        var keycode = e.keyCode || e.which;

        switch (keycode){
          case key.esc:
            // disable suggestions on escape
            scope.select();
            scope.setIndex(-1);
            scope.$apply();
            e.preventDefault();
        }
      }, true);

      document.addEventListener("blur", function(e){
        // disable suggestions on blur
        // we do a timeout to prevent hiding it before a click event is registered
        setTimeout(function() {
          scope.select();
          scope.setIndex(-1);
          scope.$apply();
        }, 150);
      }, true);

      element[0].addEventListener("keydown",function (e){
        var keycode = e.keyCode || e.which;

        var l = angular.element(this).find('li').length;

        // this allows submitting forms by pressing Enter in the autocompleted field
        if(!scope.completing || l == 0) return;

        // implementation of the up and down movement in the list of suggestions
        switch (keycode){
          case key.up:

            index = scope.getIndex()-1;
            if(index<-1){
              index = l-1;
            } else if (index >= l ){
              index = -1;
              scope.setIndex(index);
              scope.preSelectOff();
              break;
            }
            scope.setIndex(index);

            if(index!==-1)
              scope.preSelect(angular.element(angular.element(this).find('li')[index]).text());

            scope.$apply();

            break;
          case key.down:
            index = scope.getIndex()+1;
            if(index<-1){
              index = l-1;
            } else if (index >= l ){
              index = -1;
              scope.setIndex(index);
              scope.preSelectOff();
              scope.$apply();
              break;
            }
            scope.setIndex(index);

            if(index!==-1)
              scope.preSelect(angular.element(angular.element(this).find('li')[index]).text());

            break;
          case key.left:
            break;
          case key.right:
          case key.enter:
          case key.tab:

            index = scope.getIndex();
            // scope.preSelectOff();
            if(index !== -1) {
              scope.select(angular.element(angular.element(this).find('li')[index]).text());
              if(keycode == key.enter) {
                e.preventDefault();
              }
            } else {
              if(keycode == key.enter) {
                scope.select();
              }
            }
            scope.setIndex(-1);
            scope.$apply();

            break;
          case key.esc:
            // disable suggestions on escape
            scope.select();
            scope.setIndex(-1);
            scope.$apply();
            e.preventDefault();
            break;
          default:
            return;
        }

      });
    },
    template: '\
        <div class="autocomplete {{ attrs.class }}" id="{{ attrs.id }}">\
          <input\
            type="text"\
            ng-model="searchParam"\
            placeholder="{{ attrs.placeholder }}"\
            class="{{ attrs.inputclass }}"\
            id="{{ attrs.inputid }}"\
            ng-required="{{ autocompleteRequired }}"  />\
          <ul ng-show="completing && (suggestions | filter:searchFilter).length > 0">\
            <li\
              suggestion\
              ng-repeat="suggestion in suggestions | filter:searchFilter | orderBy:\'toString()\' track by $index"\
              index="{{ $index }}"\
              val="{{ suggestion }}"\
              ng-class="{ active: ($index === selectedIndex) }"\
              ng-click="select(suggestion)"\
              ng-bind-html="suggestion | highlight:searchParam" style="cursor:pointer"></li>\
          </ul>\
        </div>'
  };
});

app.filter('highlight', ['$sce', function ($sce) {
  return function (input, searchParam) {
    if (typeof input === 'function') return '';
    if (searchParam) {
      var words = '(' +
            searchParam.split(/\ /).join(' |') + '|' +
            searchParam.split(/\ /).join('|') +
          ')',
          exp = new RegExp(words, 'gi');
      if (words.length) {
        input = input.replace(exp, "<span class=\"highlight\">$1</span>");
      }
    }
    return $sce.trustAsHtml(input);
  };
}]);

app.directive('suggestion', function(){
  return {
    restrict: 'A',
    require: '^autocomplete', // ^look for controller on parents element
    link: function(scope, element, attrs, autoCtrl){
      element.bind('mouseenter', function() {
        autoCtrl.preSelect(attrs.val);
        autoCtrl.setIndex(attrs.index);
      });

      element.bind('mouseleave', function() {
        autoCtrl.preSelectOff();
      });
    }
  };
});
