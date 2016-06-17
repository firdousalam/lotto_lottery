angular.module('car_controller',['angularUtils.directives.dirPagination','angularFileUpload'])

// Car controller for car listing and add
.controller('car', function ($scope, $http, $rootScope, $location, API, $http, $window, $timeout, $upload, $cookieStore, $timeout, $sessionStorage, $localStorage)
{
	// Check login status.
	if (localStorage.getItem('loginStatus') != 1 ||  $sessionStorage.loginStatus == 0 || $sessionStorage.userId == 0)
	{
		$location.path('/login');
	}
	var range = [];
	for(var i=1;i<=100;i++) {
	  range.push(i);
	}
	$scope.currency = $rootScope.currency_symbol;
	$scope.range = range;
	// Hide the listing table.
	$scope.carRes = false;
	// Show the loader.
	$scope.carLoader = true;
	// Get the URL of the page.
	var page_url = $window.location.href;
	// Get the database name of the client from the URL of the page.
	var url_path = page_url.split('/');
	$rootScope.data_base_name =	url_path[4];
	// Add the database name to the array.
	$scope.car_listing = {"database_name" : $rootScope.data_base_name, "webservice_case" : "client_application_admin_car_type_list"};
	// Get car listing.
	$scope.getCarListing = function()
	{
		// Call API to get car listing.
		API.getListing($scope.car_listing).success(function(data)
		{
			// Check if API successfully works.
			if( data.response_code == 200 )
			{
				$rootScope.car_listing_data = data.response_data;
				$rootScope.currency_data = data.response_currency;
				// Show the listing table.
				$scope.carRes = true;
				// Hide the loader.
				$scope.carLoader = false;
			}
			else
			{
				$scope.error_message = data.response_message;
			}
		})
	}
	$scope.getCarListing();
	$scope.add_new_car = {};
	// Hide add car modal.
	$scope.add_car_modal = false;
	$scope.openAddNewCar = function()
	{
		// Reset error and success messages.
		$scope.alert_message_success = '';
		$scope.alert_message_error = '';
		// Toggle modal.
		$scope.add_car_modal = !$scope.add_car_modal;
	}
	// Function to add new car.
	$scope.addNewCar = function(isValid)
	{
		$scope.loading = true;
		if( isValid == false )
		{
			if( !$scope.add_new_car.car_class )
			{
				$scope.car_class = true;
			}
			if( !$scope.add_new_car.order_id )
			{
				$scope.order_id = true;
			}
			if( !$scope.add_new_car.description )
			{
				$scope.description = true;
			}
			if( !$scope.add_new_car.distance_fare )
			{
				$scope.distance_fare = true;
			}
			if( !$scope.add_new_car.minimum_fare )
			{
				$scope.minimum_fare = true;
			}
			if( !$scope.add_new_car.per_min_waiting_charges )
			{
				$scope.per_min_waiting_charges = true;
			}
			if( !$scope.add_new_car.hourly_fare )
			{
				$scope.hourly_fare = true;
			}
			if( !$scope.add_new_car.minimum_number_of_hours )
			{
				$scope.minimum_number_of_hours = true;
			}
			if( !$scope.add_new_car.maximum_passengers )
			{
				$scope.maximum_passengers = true;
			}
			if( !$scope.add_new_car.maximum_suitcases )
			{
				$scope.maximum_suitcases = true;
			}
			$scope.loading = false;
			return false;
		}
		// Add database name and webservice case to add_new_car array.
		$scope.add_new_car.database_name = $rootScope.data_base_name;
		$scope.add_new_car.webservice_case = 'client_application_admin_add_car_type';
		// Add required fields to add_new_car array.
		$scope.add_new_car.required_fields = [{'name':'car_class'},{'name':'order_id'},{'name':'description'},{'name':'distance_fare'},{'name':'minimum_fare'},{'name':'per_min_waiting_charges'},{'name':'hourly_fare'},{'name':'minimum_number_of_hours'},{'name':'maximum_suitcases'},{'name':'maximum_passengers'}];
		// Call API to add the car.
		if( !$scope.add_new_car.image_name )
		{
			API.car($scope.add_new_car).success(function(data)
			{
				// Check if successful.
				if( data.response_code == 200 )
				{
					$scope.alert_message_error = '';
					$scope.alert_message_success = 'Car details successfully added.';
					$scope.success_error_message = true;
					// Get admin user listing.
					$scope.getCarListing();
					$timeout(function() 
					{
						$scope.success_error_message = false;
					}, 2000);
					$scope.loading = false;
					// Toggle modal.
					$scope.add_car_modal = false;
				}
				else
				{
					$scope.alert_message_success = '';
					$scope.alert_message_error = data.response_message;
					// Get admin user listing.
					$scope.getCarListing();
					$scope.loading = false;
				}
			});
		}
		else
		{
			$upload.upload(
			{
				url: 'http://www.limotool.com:3400/car',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: $scope.add_new_car,
				file: $scope.add_new_car.image_name,
				fileFormDataName: 'myFile'
			}).then(function (response) 
			{
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'Car details successfully added.';
				$scope.success_error_message = true;
				// Get admin user listing.
				$scope.getCarListing();
				$timeout(function() 
				{
					$scope.success_error_message = false;
				}, 2000);
				$scope.loading = false;
				// Toggle modal.
				$scope.add_car_modal = false;
				
			}, null, function (evt) 
			{
			});
		}
	}
	$scope.edit_new_car = {};
	// Hide edit car modal.
	$scope.edit_car_modal = false;
	$scope.openEditCar = function(car)
	{
		// Reset error and success messages.
		$scope.alert_message_success = '';
		$scope.alert_message_error = '';
		// Toggle modal.
		$scope.edit_car_modal = !$scope.edit_car_modal;
		$scope.edit_new_car = car;
		$scope.edit_new_car.id = car._id
		$scope.edit_new_car.descriptions = car.description;
	}
	// Function to edit car.
	$scope.editCar = function(isValid)
	{
		$scope.loading = true;
		if( isValid == false )
		{
			if( !$scope.edit_new_car.car_class )
			{
				$scope.car_class = true;
			}
			if( !$scope.edit_new_car.order_id )
			{
				$scope.order_id = true;
			}
			if( !$scope.edit_new_car.description )
			{
				$scope.description = true;
			}
			if( !$scope.edit_new_car.distance_fare )
			{
				$scope.distance_fare = true;
			}
			if( !$scope.edit_new_car.minimum_fare )
			{
				$scope.minimum_fare = true;
			}
			if( !$scope.edit_new_car.per_min_waiting_charges )
			{
				$scope.per_min_waiting_charges = true;
			}
			if( !$scope.edit_new_car.hourly_fare )
			{
				$scope.hourly_fare = true;
			}
			if( !$scope.edit_new_car.minimum_number_of_hours )
			{
				$scope.minimum_number_of_hours = true;
			}
			if( !$scope.edit_new_car.maximum_passengers )
			{
				$scope.maximum_passengers = true;
			}
			if( !$scope.edit_new_car.maximum_suitcases )
			{
				$scope.maximum_suitcases = true;
			}
			$scope.loading = false;
			return false;
		}
		// Add database name and webservice case to edit_new_car array.
		$scope.edit_new_car.database_name = $rootScope.data_base_name;
		$scope.edit_new_car.webservice_case = 'client_application_edit_car_type';
		// Add required fields to edit_new_car array.
		$scope.edit_new_car.required_fields = [{'name':'car_class'},{'name':'order_id'},{'name':'description'},{'name':'distance_fare'},{'name':'minimum_fare'},{'name':'per_min_waiting_charges'},{'name':'hourly_fare'},{'name':'minimum_number_of_hours'},{'name':'maximum_suitcases'},{'name':'maximum_passengers'}];
		// Call API to edit the car.
		if( !$scope.edit_new_car.image_name )
		{
			API.common_api($scope.edit_new_car,'update').success(function(data)
			{
				// Check if successful.
				if( data.response_code == 200 )
				{
					$scope.alert_message_error = '';
					$scope.alert_message_success = 'Car details successfully updated.';
					$scope.success_error_message = true;
					// Get admin user listing.
					$scope.getCarListing();
					$timeout(function() 
					{
						$scope.success_error_message = false;
					}, 2000);
					$scope.loading = false;
					// Toggle modal.
					$scope.edit_car_modal = false;
				}
				else
				{
					$scope.alert_message_success = '';
					$scope.alert_message_error = data.response_message;
					// Get admin user listing.
					$scope.getCarListing();
					$scope.loading = false;
				}
			});
		}
		else
		{
			$upload.upload(
			{
				url: 'http://www.limotool.com:3400/update',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: $scope.edit_new_car,
				file: $scope.edit_new_car.image_name,
				fileFormDataName: 'myFile'
			}).then(function (response) 
			{
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'Car details successfully updated.';
				$scope.success_error_message = true;
				// Get admin user listing.
				$scope.getCarListing();
				$timeout(function() 
				{
					$scope.success_error_message = false;
				}, 2000);
				$scope.loading = false;
				// Toggle modal.
				$scope.edit_car_modal = false;
								
			}, null, function (evt) 
			{
				
			});
			// Toggle modal.
			$scope.edit_car_modal = false;
		}
	}
	// Hide add car extra modal.
	$scope.show_add_extra_model = false;
	$scope.openAddNewExtraToCar = function(id)
	{
		// Reset error and success messages.
		$scope.alert_message_success = '';
		$scope.alert_message_error = '';
		$scope.add_extra_form = {};
		// Toggle modal.
		$scope.show_add_extra_model = !$scope.show_add_extra_model;
		$scope.add_extra_form.id = id;
	}
	// Function to add new car extra.
	$scope.addNewExtraToCar = function(isValid)
	{
		$scope.loading = true;
		if( isValid == false )
		{
			if( !$scope.add_extra_form.name )
			{
				$scope.name = true;
			}
			if( !$scope.add_extra_form.price )
			{
				$scope.price = true;
			}
			$scope.loading = false;
			return false;
		}
		// Add database name and webservice case to add_extra_form array.
		$scope.add_extra_form.database_name = $rootScope.data_base_name;
		$scope.add_extra_form.webservice_case = 'client_application_add_car_extra';
		// Add required fields to add_extra_form array.
		$scope.add_extra_form.required_fields = [{'name':'price'},{'name':'name'}];
		// Call API to add the car extra.
		API.common_api($scope.add_extra_form,'update').success(function(data)
		{
			// Check if successful.
			if( data.response_code == 200 )
			{
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'Car extra successfully added.';
				$scope.success_error_message = true;
				// Get admin user listing.
				$scope.getCarListing();
				$timeout(function() 
				{
					$scope.success_error_message = false;
				}, 2000);
				$scope.loading = false;
				// Toggle modal.
				$scope.show_add_extra_model = false;
			}
			else
			{
				$scope.alert_message_success = '';
				$scope.alert_message_error = data.response_message;
				// Get admin user listing.
				$scope.getCarListing();
				$scope.loading = false;
			}
			
		});
	}
	// Edit car extra.
	$scope.edit_extra_form = {};
	$scope.show_edit_extra_model = false;
	$scope.openEditCarExtra = function(id, extra_id, extras)
	{
		// Reset error and success messages.
		$scope.alert_message_success = '';
		$scope.alert_message_error = '';
		$scope.edit_extra_form = extras;
		$scope.edit_extra_form.id = extra_id;
		//$scope.edit_extra_form.extra_id = extra_id;
		$scope.show_edit_extra_model = !$scope.show_edit_extra_model;
	}
	$scope.editCarExtra = function(isValid)
	{
		$scope.loading = true;
		if( isValid == false )
		{
			if( !$scope.edit_extra_form.name )
			{
				$scope.name = true;
			}
			if( !$scope.edit_extra_form.price )
			{
				$scope.price = true;
			}
			$scope.loading = false;
			return false;
		}
		$scope.edit_extra_form.database_name = $rootScope.data_base_name;
		$scope.edit_extra_form.webservice_case = 'client_application_edit_car_extra';
		API.common_api($scope.edit_extra_form, 'update').success(function(data)
		{
			if( data.response_code == 200 )
			{
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'Car extra successfully updated.';
				$scope.success_error_message = true;
				// Get admin user listing.
				$scope.getCarListing();
				$timeout(function() 
				{
					$scope.success_error_message = false;
				}, 2000);
				$scope.loading = false;
				$scope.show_edit_extra_model = false;
			}
			else
			{
				$scope.alert_message_success = '';
				$scope.alert_message_error = data.response_message;
				// Get admin user listing.
				$scope.getCarListing();
				$scope.loading = false;
			}
		});
	}
	// Delete car extras.
	$scope.deleteCarExtra = function(id, extra_id)
	{
		$scope.delete_extra = {'database_name' : $rootScope.data_base_name, 'webservice_case' : 'client_application_remove_car_extra', 'id' : id, 'extra_id' : extra_id};
		API.common_api($scope.delete_extra, 'delete').success(function(data)
		{
			if( data.response_code == 200 )
			{
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'Extra successfully deleted.';
				$scope.success_error_message = true;
				// Get admin user listing.
				$scope.getCarListing();
				$timeout(function() 
				{
					$scope.success_error_message = false;
				}, 2000);
			}
		});
	}
	// Sorting functionality for the grid.
	//$scope.sort_table='id';
	// Sort table function
	$scope.sortCarTableBy = function (keyname)
	{	
		$scope.sortKey = keyname; //set the sortKey to the param passed
		$scope.reverse = !$scope.reverse; //if true make it false and vice versa
		$scope.sort_table = keyname
	}
	// Pagination for the grid.
	$scope.selected_page_pagination = '25';
	$scope.page_per_pagination = [
									{name:'5', value: '5'}, 
									{name:'10', value: '10'}, 
									{name:'25', value: '25'}, 
									{name:'50', value: '50'}, 
									{name:'100', value: '100'}					
								 ];
})

// Car extra controller for extra listing and add
.controller('extra',function($scope,$http,$rootScope,$location,API,$http,$window,$timeout,$cookieStore, $sessionStorage)
{
	// Check login status.
	if (localStorage.getItem('loginStatus') != 1 ||  $sessionStorage.loginStatus == 0 || $sessionStorage.userId == 0)
	{
		$location.path('/login');
	}
	// Hide the listing table.
	$scope.extraRes = false;
	// Show the loader.
	$scope.extraLoader = true;
	// Get the URL of the page.
	var page_url = $window.location.href;
	// Get the database name of the client from the URL of the page.
	var url_path = page_url.split('/');
	$rootScope.data_base_name =	url_path[4];
	// Add the database name to the array.
	$scope.car_extra_listing = {"database_name" : $rootScope.data_base_name, "webservice_case" : "client_application_car_type_extra_list"};
	// Get listing.
	$scope.getExtraListing = function()
	{
		// Call API to get car listing.
		API.getListing($scope.car_extra_listing).success(function(data)
		{
			// Check if API successfully works.
			if( data.response_code == 200 )
			{
				$rootScope.car_extra_listing_data = data.response_data;
				// Show the listing table.
				$scope.extraRes = true;
				// Hide the loader.
				$scope.extraLoader = false;
			}
			else
			{
				$scope.error_message = data.response_message;
			}
		})
	}
	$scope.getExtraListing();
	// Call API to get currency from business settings. 
	$scope.business_settings = {"webservice_case" : "client_application_business_setting_list", "database_name" : $rootScope.data_base_name};
	API.common_api($scope.business_settings, 'listing').success(function(data)
	{
		if( data.response_code == 200 )
		{
			$scope.currency = data.response_data[0].currency.symbol;
		}
	})
	$scope.add_new_extra = {};
	// Hide add car extra modal.
	$scope.add_car_extra_modal = false;
	$scope.openAddExtra = function()
	{
		// Reset error and success messages.
		$scope.alert_message_success = '';
		$scope.alert_message_error = '';
		// Toggle modal.
		$scope.add_car_extra_modal = true;
	}
	// Function to add new car extra.
	$scope.addExtra = function(isValid)
	{
		$scope.loading = true;
		if( isValid == false )
		{
			if( !$scope.add_new_extra.name )
			{
				$scope.name = true;
			}
			if( !$scope.add_new_extra.price )
			{
				$scope.price = true;
			}
			$scope.loading = false;
			return false;
		}
		// Add database name and webservice case to add_new_extra array.
		$scope.add_new_extra.database_name = $rootScope.data_base_name;
		$scope.add_new_extra.webservice_case = 'client_application_admin_add_extra';
		// Add required fields to add_new_extra array.
		$scope.add_new_extra.required_fields = [{'name':'name'},{'name':'price'}];
		// Call API to add the extra.
		API.extra($scope.add_new_extra).success(function(data)
		{
			// Check if successful.
			if( data.response_code == 200 )
			{
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'Extra successfully added.';
				$scope.success_error_message = true;
				// Get extra listing.
				$scope.getExtraListing();
				$timeout(function() 
				{
					$scope.success_error_message = false;
				}, 2000);
				$scope.loading = false;
				// Toggle modal.
				$scope.add_car_extra_modal = false;
			}
			else
			{
				$scope.alert_message_success = '';
				$scope.alert_message_error = data.response_message;
				// Get admin user listing.
				$scope.getExtraListing();
				$scope.loading = false;
			}
			
		});
	}
	// Edit extras.
	$scope.edit_car_extra_modal = false;
	$scope.edit_extra = {};
	$scope.openEditExtra = function(extra)
	{
		// Reset error and success messages.
		$scope.alert_message_success = '';
		$scope.alert_message_error = '';
		$scope.edit_extra = extra;
		$scope.edit_extra.id = extra._id;
		$scope.edit_car_extra_modal = !$scope.edit_car_extra_modal;
	}
	$scope.editExtra = function(isValid)
	{
		$scope.loading = true;
		if( isValid == false )
		{
			if( !$scope.edit_extra.name )
			{
				$scope.name = true;
			}
			if( !$scope.edit_extra.price )
			{
				$scope.price = true;
			}
			$scope.loading = false;
			return false;
		}
		$scope.edit_extra.database_name = $rootScope.data_base_name;
		$scope.edit_extra.webservice_case = 'client_application_extra_update';
		API.common_api($scope.edit_extra, 'update').success(function(data)
		{
			if( data.response_code == 200 )
			{
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'Extra successfully updated.';
				$scope.success_error_message = true;
				// Get admin user listing.
				$scope.getExtraListing();
				$timeout(function() 
				{
					$scope.success_error_message = false;
				}, 2000);
				$scope.loading = false;
				$scope.edit_car_extra_modal = false;
			}
			else
			{
				$scope.alert_message_success = '';
				$scope.alert_message_error = data.response_message;
				// Get admin user listing.
				$scope.getExtraListing();
				$scope.loading = false;
			}
		});
	}
	// Delete extras.
	$scope.deleteExtras = function(extra_id)
	{
		$scope.delete_extra = {'database_name' : $rootScope.data_base_name, 'webservice_case' : 'client_application_extra_delete', 'id' : extra_id};
		API.common_api($scope.delete_extra, 'delete').success(function(data)
		{
			if( data.response_code == 200 )
			{
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'Extra successfully deleted.';
				$scope.success_error_message = true;
				// Get admin user listing.
				$scope.getExtraListing();
				$timeout(function() 
				{
					$scope.success_error_message = false;
				}, 2000);
			}
		});
	}
	// Sorting functionality for the grid.
	// Sort table function
	$scope.sortExtraTableBy = function (keyname)
	{	
		$scope.sortKey = keyname; //set the sortKey to the param passed
		$scope.reverse = !$scope.reverse; //if true make it false and vice versa
		$scope.sort_table = keyname
	}
	// Pagination for the grid.
	$scope.selected_page_pagination = '25';
	$scope.page_per_pagination = [
									{name:'5', value: '5'}, 
									{name:'10', value: '10'}, 
									{name:'25', value: '25'}, 
									{name:'50', value: '50'}, 
									{name:'100', value: '100'}					
								 ];
		
})
