angular.module('profile.controller', ['limo_client.services', 'angularUtils.directives.dirPagination', 'ngMessages', 'angularFileUpload', 'date-picker', 'date-pick'])
// Admin controller.
.controller('admin', function ($scope, $rootScope, API, $location, $window, $sessionStorage, $cookieStore, $timeout)
{
	// Check login status.
	if (localStorage.getItem('loginStatus') != 1 ||  $sessionStorage.loginStatus == 0 || $sessionStorage.userId == 0)
	{
		$location.path('/login');
	}
	// Hide the listing table.
	$scope.adminRes = false;
	// Show the loader.
	$scope.adminLoader = true;
	// Get the URL of the page.
	var page_url = $window.location.href;
	// Get the database name of the client from the URL of the page.
	var url_path = page_url.split('/');
	$rootScope.data_base_name =	url_path[4];
	// Set the roles for listing.
	if( $location.url() == '/admin_user' )
	{
		$rootScope.listing_role = 'admin';
	}
	$scope.success_error_message = false;
	// Add the database name to the array.
	$scope.admin_user_listing = {"database_name" : $rootScope.data_base_name, "webservice_case" : "client_application_user_listing", "role" : $rootScope.listing_role};
	// Function to get listing.
	$scope.getUsersListing = function()
	{
		// Call API to get admin user listing.
		API.getListing($scope.admin_user_listing).success(function(data)
		{
			// Check if API successfully works.
			if( data.response_code == 200 )
			{
				$rootScope.admin_user_listing_data = data.response_data;
				// Show the listing table.
				$scope.adminRes = true;
				// Hide the loader.
				$scope.adminLoader = false;
			}
			else
			{
				$scope.error_message = data.response_message;
			}
		})
	}
	// Get admin user listing.
	$scope.getUsersListing();
	// Add the database name to the array.
	$scope.country_listing = {webservice_case : 'country_listing', database_name : 'a_limokit'};
	// Call API to get country listing.
	/*API.getCountry($scope.country_listing).success(function(data)
    {  
        $rootScope.country_data	= data.response_data;
	});*/
	$scope.business_settings = {"database_name" : $rootScope.data_base_name, "webservice_case" : "client_application_business_setting_list" , "required_fields" : []};
	// Call API to get currency from business settings. 
	API.common_api($scope.business_settings, 'listing').success(function(data)
	{
		if( data.response_code == 200 )
		{
			$scope.callng_code = data.response_data[0].country.calling_code;
		}
	})
	$scope.edit_admin_user_details = {};
	// Hide edit admin user modal.
	$scope.edit_admin_user_modal = false;
	// Toggle modal.
	$scope.openEditAdminUserDetail = function(user)
	{
		// Reset error and success messages.
		$scope.alert_message_success = '';
		$scope.alert_message_error = '';
		$scope.edit_admin_user_modal = !$scope.edit_admin_user_modal;
		$scope.edit_admin_user_details = user;
		$scope.edit_admin_user_details.id = user._id;
	}
	// Function to edit admin user.
	$scope.editAdminUserDetail = function(isValid)
	{
		// Loader start.
		$scope.loading = true;
		// Validations.
		if( isValid==false ) 
		{
			if( !$scope.edit_admin_user_details.first_name )
			{
				$scope.first_name = true;
			}
			if( !$scope.edit_admin_user_details.last_name )
			{
				$scope.last_name = true;
			}
			if( !$scope.edit_admin_user_details.title )
			{
				$scope.title = true;
			}
			if( !$scope.edit_admin_user_details.email )
			{
				$scope.email = true;
			}
			if( !$scope.edit_admin_user_details.status )
			{
				$scope.status = true;
			}
			if( !$scope.edit_admin_user_details.role )
			{
				$scope.role = true;
			}
			$scope.loading = false;
			return false;
		}
		// Add database name and webservice case to edit_admin_user_details array.
		$scope.edit_admin_user_details.database_name = $rootScope.data_base_name;
		$scope.edit_admin_user_details.webservice_case = 'client_application_update_user_detail';
		// Add required fields to edit_admin_user_details array.
		$scope.edit_admin_user_details.required_fields = [];
		// Call API to edit the admin.
		API.updateUserByAdmin($scope.edit_admin_user_details).success(function(data)
		{
			// Check if successful.
			if( data.response_code == 200 )
			{
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'User details successfully updated.';
				$scope.success_error_message = true;
				// Get admin user listing.
				$scope.getUsersListing();
				$timeout(function() 
				{
					$scope.success_error_message = false;
				}, 2000);
				// Toggle modal.
				$scope.loading = false;
				$scope.edit_admin_user_modal = false;
			}
			else
			{
				$scope.alert_message_success = '';
				$scope.alert_message_error = data.response_message;
				// Get admin user listing.
				$scope.getUsersListing();
				$scope.loading = false;
			}
		});
	}
	$rootScope.edit_admin_user_phone_details = {};
	// Hide edit admin user phone details modal.
	$scope.edit_admin_user_phone_edit_modal = false;
	$scope.openEditAdminUserPhoneDetail = function(userPhone)
	{
		// Reset error and success messages.
		$scope.alert_message_success = '';
		$scope.alert_message_error = '';
		//Toggle modal.
		$scope.edit_admin_user_phone_edit_modal = !$scope.edit_admin_user_phone_edit_modal;
		$rootScope.edit_admin_user_phone_details = userPhone;
		$scope.edit_admin_user_phone_details.id = userPhone._id;
	}
	// Function to edit admin user phone details.
	$scope.editAdminUserPhoneDetail = function(isValid)
	{
		$scope.loading = true;
		// Validations.
		if( isValid==false ) 
		{
			if( !$scope.edit_admin_user_phone_details.type )
			{
				$scope.type = true;
			}
			if( !$scope.edit_admin_user_phone_details.calling_code )
			{
				$scope.calling_code = true;
			}
			if( !$scope.edit_admin_user_phone_details.number )
			{
				$scope.number = true;
			}
			$scope.loading = false;
			return false;
		}
		// Add database name and webservice case to edit_admin_user_phone_details array.
		$scope.edit_admin_user_phone_details.database_name = $rootScope.data_base_name;
		$scope.edit_admin_user_phone_details.webservice_case = 'client_application_update_user_phone_detail';
		// Add required fields to edit_admin_user_phone_details array.
		$scope.edit_admin_user_phone_details.required_fields = [];
		// Call API to edit the admin phone.
		API.updateUserByAdmin($scope.edit_admin_user_phone_details).success(function(data)
		{
			// Check if successful.
			if( data.response_code == 200 )
			{
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'Phone number successfully updated.';
				$scope.success_error_message = true;
				// Get admin user listing.
				$scope.getUsersListing();
				$timeout(function() 
				{
					$scope.success_error_message = false;
				}, 2000);
				// Toggle modal.
				$scope.loading = false;
				$scope.edit_admin_user_phone_edit_modal = false;
			}
			else
			{
				$scope.alert_message_success = '';
				$scope.alert_message_error = data.response_message;
				// Get admin user listing.
				$scope.getUsersListing();
				$scope.loading = false;
			}
		});
	}
	// Hide add admin user details modal.
	$scope.add_admin_user_modal = false;
	// Toggle modal.
	$scope.openAddAdminUser = function()
	{
		// Reset error and success messages.
		$scope.alert_message_success = '';
		$scope.alert_message_error = '';
		$scope.add_admin_user_modal = !$scope.add_admin_user_modal;
	}
	// Function to add new admin users.
	$scope.add_admin = {};
	$scope.addAdminUser = function(isValid)
	{
		// Loader start.
		$scope.loading = true;
		// Validations.
		if( isValid == false ) 
		{
			if( !$scope.add_admin.first_name )
			{
				$scope.first_name = true;
			}
			if( !$scope.add_admin.last_name )
			{
				$scope.last_name = true;
			}
			if( !$scope.add_admin.title )
			{
				$scope.title = true;
			}
			if( !$scope.add_admin.email )
			{
				$scope.email = true;
			}
			if( !$scope.add_admin.password )
			{
				$scope.password = true;
			}
			if( !$scope.add_admin.calling_code )
			{
				$scope.calling_code = true;
			}
			if( !$scope.add_admin.number )
			{
				$scope.number = true;
			}
			if( !$scope.add_admin.role )
			{
				$scope.roles = true;
			}
			$scope.loading = false;
			return false;
		}
		// Add database name and webservice case to add_admin array.
		$scope.add_admin.database_name = $rootScope.data_base_name;
		$scope.add_admin.webservice_case = 'client_application_admin_registration';
		// Add required fields to add_admin array.
		$scope.add_admin.required_fields = [{'name':'title'},{'name':'first_name'},{'name':'last_name'},{'name':'email'},{'name':'password'},{'name':'role'}];
		// Call API to add the admin.
		API.addUserByAdmin($scope.add_admin).success(function(data)
		{
			// Check if successful.
			if( data.response_code == 200 )
			{
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'User successfully added.';
				$scope.success_error_message = true;
				// Get admin user listing.
				$scope.getUsersListing();
				$timeout(function() 
				{
					$scope.success_error_message = false;
				}, 2000);
				$scope.loading = false;
				// Toggle modal.
				$scope.add_admin_user_modal = false;
			}
			else
			{
				$scope.alert_message_success = '';
				$scope.alert_message_error = data.response_message;
				// Get admin user listing.
				$scope.getUsersListing();
				$scope.loading = false;
			}
		});
	}
	$scope.add_admin_phone = {};
	// Hide add admin user phone details modal.
	$scope.add_admin_user_phone_modal = false;
	$scope.openAddAdminUserPhone = function(id)
	{
		// Reset error and success messages.
		$scope.alert_message_success = '';
		$scope.alert_message_error = '';
		$scope.add_admin_user_phone_modal = !$scope.add_admin_user_phone_modal;
		// Store customers mongo ID.
		$scope.add_admin_phone.id = id;
		$scope.add_admin_phone.calling_code = $scope.callng_code;
	}
	// Function to add new admin Phone.
	$scope.addAdminUserPhone = function(isValid)
	{
		$scope.loading = true;
		// Validations.
		if( isValid == false ) 
		{
			if( !$scope.add_admin_phone.type )
			{
				$scope.type = true;
			}
			if( !$scope.add_admin_phone.calling_code )
			{
				$scope.calling_codes = true;
			}
			if( !$scope.add_admin_phone.number )
			{
				$scope.number = true;
			}
			$scope.loading = false;
			return false;
		}
		// Add database name and webservice case to add_admin_phone array.
		$scope.add_admin_phone.database_name = $rootScope.data_base_name;
		$scope.add_admin_phone.webservice_case = 'client_application_user_add_detail';
		$scope.add_admin_phone.update_type = 'phone';
		// Add required fields to add_admin array.
		$scope.add_admin_phone.required_fields = [];//{'name':'type'}{'name':'calling_code'},{'name':'number'}];
		// Call API to add the admin.
		API.updateUserByAdmin($scope.add_admin_phone).success(function(data)
		{
			// Check if successful.
			if( data.response_code == 200 )
			{
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'Phone number successfully added.';
				$scope.success_error_message = true;
				// Get admin user listing.
				$scope.getUsersListing();
				$timeout(function()  
				{
					$scope.success_error_message = false;
				}, 2000);
				$scope.loading = false;
				// Toggle modal.
				$scope.add_admin_user_phone_modal = false;
			}
			else
			{
				$scope.alert_message_success = '';
				$scope.alert_message_error = data.response_message;
				// Get admin user listing.
				$scope.getUsersListing();
				$scope.loading = false;
			}
		});
	}
	// Delete user phone number.
	$scope.delete_user_phone = {};
	$scope.deleteAdminPhone = function(id, phone_id)
	{
		$scope.delete_user_phone = {'database_name' : $rootScope.data_base_name, 'webservice_case' : 'client_application_user_remove_phone', 'id' : id, 'phone_id' : phone_id};
		API.common_api($scope.delete_user_phone, 'delete').success(function(data)
		{
			if( data.response_code == 200 )
			{
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'Phone number deleted successfully.';
				$scope.success_error_message = true;
				// Get admin user listing.
				$scope.getUsersListing();
				$timeout(function() 
				{
					$scope.success_error_message = false;
				}, 2000);
			}
		});
	}
	// Sorting.
	$scope.sortAdminTableBy = function (keyname)
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
// Driver controller.
.controller('driver',function($scope,$rootScope,API,$location,$window,$sessionStorage,$timeout,$upload,$cookieStore,orderByFilter)
{
	
	// Check login status.
	if (localStorage.getItem('loginStatus') != 1 ||  $sessionStorage.loginStatus == 0 || $sessionStorage.userId == 0)
	{
		$location.path('/login');
	}
	// Hide the listing table.
	$scope.driverRes = false;
	// Show the loader.
	$scope.driverLoader = true;
	// Get the URL of the page.
	var page_url = $window.location.href;
	// Get the database name of the client from the URL of the page.
	var url_path = page_url.split('/');
	$rootScope.data_base_name =	url_path[4];
	// Add the database name to the array.
	$scope.driver_listing = {"database_name" : $rootScope.data_base_name, "webservice_case" : "client_application_driver_list"};
	// Get driver listing.
	$scope.getDriverListing = function()
	{
		// Call API to get driver listing.
		API.getListing($scope.driver_listing).success(function(data)
		{
			// Check if success.
			if( data.response_code == 200 )
			{
				$rootScope.driver_listing_data = data.response_data;
				// Show the listing table.
				$scope.driverRes = true;
				// Hide the loader.
				$scope.driverLoader = false;
				$scope.sort_table = 'first_name';
				$scope.reverse = false;
			}
			else
			{
				$scope.error_message = data.response_message;
			}
		})
	}
	$scope.getDriverListing();
	// Get expense types from business settings.
	$scope.getExpenseTypesListing = function()
	{
		$scope.expense_type_listing = {'database_name':$rootScope.data_base_name,'webservice_case':'client_application_business_settings_list_expense_type'};
		// Call the API to get the listing.
		API.common_api($scope.expense_type_listing,'listing').success(function(data)
		{
			$scope.expense_types_list = data.response_data[0].expense;
		})
		console.log(466,$scope.expense_types_list);
	}
	$scope.getExpenseTypesListing();
	// List driver account details using id.
	$scope.showListAccountDetails = function(id, showBalance)
	{
		if( showBalance )
		{
			$scope.business_settings = {"database_name" : $rootScope.data_base_name, "webservice_case" : "client_application_business_setting_list" , "required_fields" : []};
			// Call API to get currency from business settings. 
			API.common_api($scope.business_settings, 'listing').success(function(data)
			{
				if( data.response_code == 200 )
				{
					$scope.currency = data.response_data[0].currency.symbol;
				}
			})
			$scope.account_details = {"database_name" : $rootScope.data_base_name, "webservice_case" : "client_application_accounting_driver_account_details", "driver_id" : id};
			// Call API to get account data of the driver.
			API.common_api($scope.account_details, 'accounting/listing').success(function(data)
			{
				if( data.response_code == 200 )
				{
					$rootScope.driver_account_details = data.response_data;
					// Calculate total debit, credit and account balance.
					$scope.total_debit = 0;
					$scope.total_credit = 0;
					$scope.account_balance = 0;
					for(i=0;i<$rootScope.driver_account_details.length;i++)
					{
						$scope.total_debit = $scope.total_debit + $rootScope.driver_account_details[i].amount_debit;
						$scope.total_credit = $scope.total_credit + $rootScope.driver_account_details[i].amount_credit;
					}
					$scope.account_balance = $scope.total_credit - $scope.total_debit;
				}
			})
		}
	}
	
	$scope.business_settings = {"database_name" : $rootScope.data_base_name, "webservice_case" : "client_application_business_setting_list" , "required_fields" : []};
	// Call API to get currency from business settings. 
	API.common_api($scope.business_settings, 'listing').success(function(data)
	{
		if( data.response_code == 200 )
		{
			$scope.callng_code = data.response_data[0].country.calling_code;
			$scope.country_name = $scope.getCountryName($scope.callng_code);
		}
	})
	// Store country name.
	$scope.getCountryName = function(callng_code)
	{
		for(c=0;c<$rootScope.country_data.length;c++)
		{
			if( $rootScope.country_data[c].calling_code == callng_code )
			{
				return $rootScope.country_data[c].name;
				//return;
			}
		}
	}
	// Country wise bank parameters.
	$scope.getBankDetails = function(code)
	{
		$scope.params = {};
		$rootScope.country_data.forEach(function(value, index, _ary) 
		{
			if( value.calling_code == code)
			{
				$scope.params = value.bank_parameters;
				$scope.add_driver.bank_parameters_name = value.bank_parameters;
				$scope.edit_driver.bank_parameters_name = value.bank_parameters;
				return false;
			}
		});
	}
	// Add the database name to the array.
	$scope.car_class_listing = {webservice_case : 'client_application_admin_car_type_list', database_name : $rootScope.data_base_name};
	// Call API to get car class listing.
	API.getListing($scope.car_class_listing).success(function(data)
    {  
        $rootScope.car_class_listing_data = data.response_data;
	});
	// Hide add driver modal.
	$scope.add_driver_modal = false;
	// Toggle modal.
	$scope.openAddDriver = function()
	{
		// Reset error and success messages.
		$scope.alert_message_success = '';
		$scope.alert_message_error = '';
		$scope.add_driver_modal = !$scope.add_driver_modal;
	}
	// Function to add new driver.
	$scope.add_driver = {};
	$scope.bank_details={};
	$scope.bank_parameter={};
	$scope.addDriver = function(isValid)
	{	
		$scope.loading = true;
		if(isValid == false)
		{
			if( !$scope.add_driver.title )
			{
				$scope.title = true;
			}
			if( !$scope.add_driver.first_name )
			{
				$scope.first_name = true;
			}
			if( !$scope.add_driver.email )
			{
				$scope.email = true;
			}
			if( !$scope.add_driver.driver_type )
			{
				$scope.driver_type = true;
			}
			$scope.loading = false;
			return false;
		}
		// Add database name and webservice case to add_driver array.
		$scope.add_driver.database_name = $rootScope.data_base_name;
		$scope.add_driver.webservice_case = 'client_application_driver_registration';
		// Add required fields.
		$scope.add_driver.required_fields = [];
		// step one 
		var driver_bank_details = $scope.add_driver.bank_parameters_value;
		var arr = [];
		var driver_bank_json=''
		for (var prop in driver_bank_details) {
			driver_bank_json={
				value:driver_bank_details[prop]
			}
			arr.push(driver_bank_json);
		}
		$scope.add_driver.bank_parameters_value = arr;
		// Call API to add the driver.
		if( !$scope.add_driver.image_name )
		{
			API.addUserByAdmin($scope.add_driver).success(function(data)
			{
				// Check if successful.
				if( data.response_code == 200 )
				{
					$scope.alert_message_error = '';
					$scope.alert_message_success = 'Driver successfully added.';
					$scope.success_error_message = true;
					// Get admin user listing.
					$scope.getDriverListing();
					$timeout(function() 
					{
						$scope.success_error_message = false;
					}, 2000);
					$scope.loading = false;
					// Toggle modal.
					$scope.add_driver_modal = false;
				}
				else
				{
					$scope.alert_message_success = '';
					$scope.alert_message_error = data.response_message;
					// Get admin user listing.
					$scope.getDriverListing();
					$scope.loading = false;
				}
			})
		}
		else
		{
			$upload.upload(
			{
				url: 'http://www.limotool.com:3400/registration',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: $scope.add_driver,
				file: $scope.add_driver.image_name,
				fileFormDataName: 'myFile'
			}).then(function (response) 
			{
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'Driver successfully added.';
				$scope.success_error_message = true;
				// Get admin user listing.
				$scope.getDriverListing();
				$timeout(function() 
				{
					$scope.success_error_message = false;
				}, 2000);
				$scope.loading = false;
				// Toggle modal.
				$scope.add_driver_modal = false;
			}, null, function (evt) 
			{});
		}
	}
	$scope.edit_driver = {};
	// Hide edit driver modal.
	$scope.edit_driver_modal = false;
	// Toggle modal.
	$scope.openEditDriver = function(driver)
	{
		// Reset error and success messages.
		$scope.alert_message_success = '';
		$scope.alert_message_error = '';
		$scope.edit_driver_modal = !$scope.edit_driver_modal;
		$scope.drivers = driver;
		$scope.edit_driver = $scope.drivers;
		$scope.edit_driver.driver_id = driver._id;
	}
	// Function to edit new driver.
	$scope.editDriver = function(isValid)
	{	
		$scope.loading = true;
		if( typeof $scope.edit_driver.bank_details != 'undefined' && $scope.edit_driver.bank_details != null )
		{
			for (i = 0; i < $scope.edit_driver.bank_details.length; i++)
			{
				var updated_bank_value = document.getElementById("updated_bank_detail_value" + i).value;
				$scope.edit_driver.bank_details[i].value = updated_bank_value;
			}
		}
		else
		{
			// step one 
			var driver_bank_details = $scope.edit_driver.bank_parameters_value;
			var arr = [];
			var driver_bank_json=''
			for (var prop in driver_bank_details) {
				driver_bank_json={
					value:driver_bank_details[prop]
				}
				arr.push(driver_bank_json);
			}
			$scope.edit_driver.bank_parameters_value = arr;
			$scope.edit_driver.bank_details = [];
			for(b in $scope.edit_driver.bank_parameters_name)
			{
				var field_name = $scope.edit_driver.bank_parameters_name[b].name;
				var value = $scope.edit_driver.bank_parameters_value[b].value;
				$scope.edit_driver.bank_details.push({"field_name":field_name, "value":value});
			}
		}
		if(isValid == false)
		{
			if( !$scope.edit_driver.title )
			{
				$scope.title = true;
			}
			if( !$scope.edit_driver.first_name )
			{
				$scope.first_name = true;
			}
			if( !$scope.edit_driver.email )
			{
				$scope.email = true;
			}
			if( !$scope.edit_driver.driver_type )
			{
				$scope.driver_type = true;
			}
			$scope.loading = false;
			return false;
		}
		// Add database name and webservice case to edit_driver array.
		$scope.edit_driver.database_name = $rootScope.data_base_name;
		$scope.edit_driver.webservice_case = 'client_application_driver_update_detail';
		$scope.edit_driver.update_type = 'personal_details';
		// Add required fields.
		$scope.edit_driver.required_fields = [];
		// Call API to add the driver.
		if( !$scope.edit_driver.image_name )
		{
			API.updateUserByAdmin($scope.edit_driver).success(function(data)
			{
				// Check if successful.
				if( data.response_code == 200 )
				{
					$scope.alert_message_error = '';
					$scope.alert_message_success = 'Driver successfully updated.';
					$scope.success_error_message = true;
					// Get admin user listing.
					$scope.getDriverListing();
					$timeout(function() 
					{
						$scope.success_error_message = false;
					}, 2000);
					$scope.loading = false;
					// Toggle modal.
					$scope.edit_driver_modal = false;
				}
				else
				{
					$scope.alert_message_success = '';
					$scope.alert_message_error = data.response_message;
					// Get admin user listing.
					$scope.getDriverListing();
					$scope.loading = false;
				}
			})
		}
		else
		{
			$upload.upload(
			{
				url: 'http://www.limotool.com:3400/update',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				data: $scope.edit_driver,
				file: $scope.edit_driver.image_name,
				fileFormDataName: 'myFile'
			}).then(function (response) 
			{
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'Driver successfully updated.';
				$scope.success_error_message = true;
				// Get admin user listing.
				$scope.getDriverListing();
				$timeout(function() 
				{
					$scope.success_error_message = false;
				}, 2000);
				$scope.loading = false;
				// Toggle modal.
				$scope.edit_driver_modal = false;
			}, null, function (evt) 
			{});
		}
	}
	$scope.add_driver_phone = {};
	// Hide add driver phone modal.
	$scope.add_driver_phone_modal = false;
	// Toggle Modal.
	$scope.openAddDriverPhone = function(driver_id)
	{
		// Reset error and success messages.
		$scope.alert_message_success = '';
		$scope.alert_message_error = '';
		$scope.add_driver_phone_modal = !$scope.add_driver_phone_modal;
		$scope.add_driver_phone.id = driver_id;
		$scope.add_driver_phone.calling_code = $scope.callng_code;
	}
	// Function to add new driver phone.
	$scope.addDriverPhone = function(isValid)
	{
		$scope.loading = true;
		if(isValid == false)
		{
			if( !$scope.add_driver_phone.type )
			{
				$scope.type = true;
			}
			if( !$scope.add_driver_phone.calling_code )
			{
				$scope.calling_code = true;
			}
			if( !$scope.add_driver_phone.number )
			{
				$scope.number = true;
			}
			$scope.loading = false;
			return false;
		}
		// Add database name and webservice case to add_driver_phone array.
		$scope.add_driver_phone.database_name = $rootScope.data_base_name;
		$scope.add_driver_phone.webservice_case = 'client_application_add_driver_contact_detail';
		$scope.add_driver_phone.update_type = 'phone';
		// Add required fields to add_driver_phone array.
		$scope.add_driver_phone.required_fields = [{'name':'type'},{'name':'calling_code'},{'name':'number'}];
		// Call API to add the phone.
		API.updateUserByAdmin($scope.add_driver_phone).success(function(data)
		{
			// Check if successful.
			if( data.response_code == 200 )
			{
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'Phone number successfully added.';
				$scope.success_error_message = true;
				// Get admin user listing.
				$scope.getDriverListing();
				$timeout(function() 
				{
					$scope.success_error_message = false;
				}, 2000);
				$scope.loading = false;
				// Toggle modal.
				$scope.add_driver_phone_modal = false;
			}
			else
			{
				$scope.alert_message_success = '';
				$scope.alert_message_error = data.response_message;
				// Get admin user listing.
				$scope.getDriverListing();
				$scope.loading = false;
			}
		});
	}
	$scope.edit_driver_phone = {};
	// Hide edit driver phone modal.
	$scope.edit_driver_phone_modal = false;
	// Toggle Modal.
	$scope.openEditDriverPhone = function(driver_id, phone)
	{
		// Reset error and success messages.
		$scope.alert_message_success = '';
		$scope.alert_message_error = '';
		$scope.edit_driver_phone_modal = !$scope.edit_driver_phone_modal;
		$scope.edit_driver_phone = phone;
		$scope.edit_driver_phone.driver_id = driver_id;
		$scope.edit_driver_phone.id = phone._id;
	}
	// Function to add new driver phone.
	$scope.editDriverPhone = function(isValid)
	{
		$scope.loading = true;
		if(isValid == false)
		{
			if( !$scope.edit_driver_phone.type )
			{
				$scope.type = true;
			}
			if( !$scope.edit_driver_phone.calling_code )
			{
				$scope.calling_code = true;
			}
			if( !$scope.edit_driver_phone.number )
			{
				$scope.number = true;
			}
			$scope.loading = false;
			return false;
		}
		// Add database name and webservice case to edit_driver_phone array.
		$scope.edit_driver_phone.database_name = $rootScope.data_base_name;
		$scope.edit_driver_phone.webservice_case = 'client_application_driver_update_detail';
		$scope.edit_driver_phone.update_type = 'phone';
		// Add required fields to edit_driver_phone array.
		$scope.edit_driver_phone.required_fields = [{'name':'type','name':'calling_code','name':'number'}];
		// Call API to add the phone.
		API.updateUserByAdmin($scope.edit_driver_phone).success(function(data)
		{
			// Check if successful.
			if( data.response_code == 200 )
			{
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'Phone number successfully updated.';
				$scope.success_error_message = true;
				// Get admin user listing.
				$scope.getDriverListing();
				$timeout(function() 
				{
					$scope.success_error_message = false;
				}, 2000);
				$scope.loading = false;
				// Toggle modal.
				$scope.edit_driver_phone_modal = false;
			}
			else
			{
				$scope.alert_message_success = '';
				$scope.alert_message_error = data.response_message;
				// Get admin user listing.
				$scope.getDriverListing();
				$scope.loading = false;
			}
		});
	}
	// Delete driver phone number.
	$scope.delete_driver_phone = {};
	$scope.deleteDriverPhone = function(id, phone_id)
	{
		$scope.delete_driver_phone = {'database_name' : $rootScope.data_base_name, 'webservice_case' : 'client_application_remove_driver_contact_detail', 'update_type' : 'phone', 'id' : id, 'phone_id' : phone_id};
		API.common_api($scope.delete_driver_phone, 'delete').success(function(data)
		{
			if( data.response_code == 200 )
			{
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'Phone number deleted successfully.';
				$scope.success_error_message = true;
				// Get admin user listing.
				$scope.getDriverListing();
				$timeout(function() 
				{
					$scope.success_error_message = false;
				}, 2000);
			}
		});
	}
	$scope.add_driver_car = {};
	// Hide add driver car modal.
	$scope.add_driver_car_modal = false;
	// Toggle Modal.
	$scope.openAddDriverCar = function(driver_id)
	{
		// Reset error and success messages.
		$scope.alert_message_success = '';
		$scope.alert_message_error = '';
		$scope.add_driver_car_modal = !$scope.add_driver_car_modal;
		$scope.add_driver_car.id = driver_id;
	}
	// Function to add new driver car.
	$scope.addDriverCar = function(isValid)
	{
		$scope.loading = true;
		if(isValid == false)
		{
			if( !$scope.add_driver_car.class_id )
			{
				$scope.class_id = true;
			}
			if( !$scope.add_driver_car.make_name )
			{
				$scope.make_name = true;
			}
			if( !$scope.add_driver_car.model_name )
			{
				$scope.model_name = true;
			}
			if( !$scope.add_driver_car.color )
			{
				$scope.color = true;
			}
			if( !$scope.add_driver_car.plate_no )
			{
				$scope.plate_no = true;
			}
			$scope.loading = false;
			return false;
		}
		// Add database name and webservice case to add_driver_car array.
		$scope.add_driver_car.database_name = $rootScope.data_base_name;
		$scope.add_driver_car.webservice_case = 'client_application_add_driver_contact_detail';
		$scope.add_driver_car.update_type = 'cars';
		// Add required fields to add_driver_car array.
		$scope.add_driver_car.required_fields = [];
		// Call API to add the car.
		API.updateUserByAdmin($scope.add_driver_car).success(function(data)
		{
			// Check if successful.
			if( data.response_code == 200 )
			{
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'Car successfully added.';
				$scope.success_error_message = true;
				// Get admin user listing.
				$scope.getDriverListing();
				$timeout(function() 
				{
					$scope.success_error_message = false;
				}, 2000);
				$scope.loading = false;
				// Toggle modal.
				$scope.add_driver_car_modal = false;
			}
			else
			{
				$scope.alert_message_success = '';
				$scope.alert_message_error = data.response_message;
				// Get admin user listing.
				$scope.getDriverListing();
				$scope.loading = false;
			}
		});
	}
	$scope.edit_driver_car = {};
	// Hide edit driver car modal.
	$scope.edit_driver_car_modal = false;
	// Toggle Modal.
	$scope.openEditDriverCar = function(driver_id, cars)
	{
		// Reset error and success messages.
		$scope.alert_message_success = '';
		$scope.alert_message_error = '';
		$scope.edit_driver_car_modal = !$scope.edit_driver_car_modal;
		$scope.edit_driver_car = cars;
		$scope.edit_driver_car.driver_id = driver_id;
		$scope.edit_driver_car.id = cars._id;
	}
	// Function to edit new driver car.
	$scope.editDriverCar = function(isValid)
	{
		$scope.loading = true;
		if(isValid == false)
		{
			if( !$scope.edit_driver_car.class_id )
			{
				$scope.class_id = true;
			}
			if( !$scope.edit_driver_car.make_name )
			{
				$scope.make_name = true;
			}
			if( !$scope.edit_driver_car.model_name )
			{
				$scope.model_name = true;
			}
			if( !$scope.edit_driver_car.color )
			{
				$scope.color = true;
			}
			if( !$scope.edit_driver_car.plate_no )
			{
				$scope.plate_no = true;
			}
			$scope.loading = false;
			return false;
		}
		// Add database name and webservice case to edit_driver_car array.
		$scope.edit_driver_car.database_name = $rootScope.data_base_name;
		$scope.edit_driver_car.webservice_case = 'client_application_driver_update_detail';
		$scope.edit_driver_car.update_type = 'cars';
		// Add required fields to edit_driver_car array.
		$scope.edit_driver_car.required_fields = [];
		// Call API to edit the car.
		API.updateUserByAdmin($scope.edit_driver_car).success(function(data)
		{
			// Check if successful.
			if( data.response_code == 200 )
			{
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'Car detsils successfully updated.';
				$scope.success_error_message = true;
				// Get admin user listing.
				$scope.getDriverListing();
				$timeout(function() 
				{
					$scope.success_error_message = false;
				}, 2000);
				$scope.loading = false;
				// Toggle modal.
				$scope.edit_driver_car_modal = false;
			}
			else
			{
				$scope.alert_message_success = '';
				$scope.alert_message_error = data.response_message;
				// Get admin user listing.
				$scope.getDriverListing();
				$scope.loading = false;
			}
		});
	}
	// Delete driver car.
	$scope.delete_driver_car = {};
	$scope.deleteDriverCar = function(id, car_id)
	{
		$scope.delete_driver_car = {'database_name' : $rootScope.data_base_name, 'webservice_case' : 'client_application_remove_driver_contact_detail', 'update_type' : 'cars', 'id' : id, 'car_id' : car_id};
		API.common_api($scope.delete_driver_car, 'delete').success(function(data)
		{
			if( data.response_code == 200 )
			{
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'Car deleted successfully.';
				$scope.success_error_message = true;
				// Get admin user listing.
				$scope.getDriverListing();
				$timeout(function() 
				{
					$scope.success_error_message = false;
				}, 2000);
			}
		});
	}
	$scope.add_address = {};
	// Hide add driver address modal.
	$scope.add_driver_address_modal = false;
	// Toggle Modal.
	$scope.openAddDriverAddress = function(driver_id)
	{
		// Reset error and success messages.
		$scope.alert_message_success = '';
		$scope.alert_message_error = '';
		$scope.add_driver_address_modal = !$scope.add_driver_address_modal;
		$scope.add_address.id = driver_id;
		$scope.add_address.country = $scope.country_name;
	}
	// Function to add new driver address.
	$scope.addDriverAddress = function(isValid)
	{
		$scope.loading = true;
		if(isValid == false)
		{
			if( !$scope.add_address.type )
			{
				$scope.type = true;
			}
			if( !$scope.add_address.line_1 )
			{
				$scope.line_1 = true;
			}
			if( !$scope.add_address.city )
			{
				$scope.city = true;
			}
			if( !$scope.add_address.suburb_district )
			{
				$scope.suburb_district = true;
			}
			if( !$scope.add_address.state )
			{
				$scope.state = true;
			}
			if( !$scope.add_address.post_code )
			{
				$scope.post_code = true;
			}
			if( !$scope.add_address.country )
			{
				$scope.country = true;
			}
			$scope.loading = false;
			return false;
		}
		// Add database name and webservice case to add_address array.
		$scope.add_address.database_name = $rootScope.data_base_name;
		$scope.add_address.webservice_case = 'client_application_add_driver_contact_detail';
		$scope.add_address.update_type = 'address';
		// Add required fields to add_address array.
		$scope.add_address.required_fields = [{'name':'type'},{'name':'line_1'},{'name':'line_2'},{'name':'city'},{'name':'state'},{'name':'suburb_district'},{'name':'post_code'},{'name':'country'}];
		// Call API to add address.
		API.updateUserByAdmin($scope.add_address).success(function (data)
		{
			// Check if successful.
			if( data.response_code == 200 )
			{
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'Driver address successfully added.';
				$scope.success_error_message = true;
				// Get admin user listing.
				$scope.getDriverListing();
				$timeout(function() 
				{
					$scope.success_error_message = false;
				}, 2000);
				$scope.loading = false;
				// Toggle modal.
				$scope.add_driver_address_modal = false;
			}
			else
			{
				$scope.alert_message_success = '';
				$scope.alert_message_error = data.response_message;
				// Get admin user listing.
				$scope.getDriverListing();
				$scope.loading = false;
			}
		});
	}
	$scope.edit_address = {};
	// Hide edit driver address modal.
	$scope.edit_driver_address_modal = false;
	// Toggle Modal.
	$scope.openEditDriverAddress = function (driver_id, address)
	{
		// Reset error and success messages.
		$scope.alert_message_success = '';
		$scope.alert_message_error = '';
		$scope.edit_driver_address_modal = !$scope.edit_driver_address_modal;
		$scope.edit_address = address;
		$scope.edit_address.driver_id = driver_id;
		$scope.edit_address.id = address._id;
	}
	// Function to edit new driver address.
	$scope.editDriverAddress = function (isValid)
	{
		$scope.loading = true;
		if( isValid == false )
		{
			if( !$scope.edit_address.type )
			{
				$scope.type = true;
			}
			if( !$scope.edit_address.line_1 )
			{
				$scope.line_1 = true;
			}
			if( !$scope.edit_address.city )
			{
				$scope.city = true;
			}
			if( !$scope.edit_address.suburb_district )
			{
				$scope.suburb_district = true;
			}
			if( !$scope.edit_address.state )
			{
				$scope.state = true;
			}
			if( !$scope.edit_address.post_code )
			{
				$scope.post_code = true;
			}
			if( !$scope.edit_address.country )
			{
				$scope.country = true;
			}
			$scope.loading = false;
			return false;
		}
		// Add database name and webservice case to edit_address array.
		$scope.edit_address.database_name = $rootScope.data_base_name;
		$scope.edit_address.webservice_case = 'client_application_driver_update_detail';
		$scope.edit_address.update_type = 'address';
		// Add required fields to edit_address array.
		$scope.edit_address.required_fields = [{'name':'type'},{'name':'line_1'},{'name':'line_2'},{'name':'city'},{'name':'state'},{'name':'suburb_district'},{'name':'post_code'},{'name':'country'}];
		// Call API to edit address.
		API.updateUserByAdmin($scope.edit_address).success(function (data)
		{
			// Check if successful.
			if( data.response_code == 200 )
			{
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'Driver address successfully updated.';
				$scope.success_error_message = true;
				// Get admin user listing.
				$scope.getDriverListing();
				$timeout(function() 
				{
					$scope.success_error_message = false;
				}, 2000);
				$scope.loading = false;
				// Toggle modal.
				$scope.edit_driver_address_modal = false;
			}
			else
			{
				$scope.alert_message_success = '';
				$scope.alert_message_error = data.response_message;
				// Get admin user listing.
				$scope.getDriverListing();
				$scope.loading = false;
			}
		});
	}
	// Delete driver address.
	$scope.delete_driver_address = {};
	$scope.deleteDriverAddress = function(id, address_id)
	{
		$scope.delete_driver_address = {'database_name' : $rootScope.data_base_name, 'webservice_case' : 'client_application_remove_driver_contact_detail', 'update_type' : 'address', 'id' : id, 'address_id' : address_id};
		API.common_api($scope.delete_driver_address, 'delete').success(function(data)
		{
			if( data.response_code == 200 )
			{
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'Address deleted successfully.';
				$scope.success_error_message = true;
				// Get admin user listing.
				$scope.getDriverListing();
				$timeout(function() 
				{
					$scope.success_error_message = false;
				}, 2000);
			}
		});
	}
	// Percentage select box.
	var perc_arr = [];
	for( f=0;f<=100;f=f+5 )
	{
		perc_arr.push(f);
	}
	$scope.percent_arr = perc_arr;
	$scope.loading = false;
	// Driver income split.
	$scope.edit_driver_income = {};
	// Hide edit driver income split modal.
	$scope.edit_driver_income_split_model = false;
	// Toggle Modal.
	$scope.openEditDriverIncomeSplit = function (driver)
	{
		// Reset error and success messages.
		$scope.alert_message_success = '';
		$scope.alert_message_error = '';
		$scope.edit_driver_income_split_model = !$scope.edit_driver_income_split_model;
		
	}
	// Function to edit driver income split.
	$scope.editDriverIncomeSplit = function(isValid)
	{
		$scope.loading = true;
		$scope.edit_driver_income.database_name = $rootScope.data_base_name;
		$scope.edit_driver_income.webservice_case = '';
		// Call the api to edit expense.
		API.common_api($scope.edit_driver_income,'').success(function(data)
		{
			if( data.response_code == 200 )
			{
				$scope.getDriverListing();
				// Get success message
				$scope.alert_message_error = '';
				$scope.alert_message_success = data.response_message;
				$scope.success_error_message = true;
				$timeout(function ()
				{
					$scope.success_error_message = false;
				}, 2000);
				$scope.edit_driver_income_split_model = false;
			}
			else
			{
				$scope.loading = false;
				if( data.response_code > 199 && data.response_code < 499 )
				{
					// Get error message
					$scope.alert_message_success = '';
					$scope.alert_message_error = data.response_message;
					$scope.success_error_message = true;
				}
			}
		})
	}
	// Driver expense split.
	$scope.edit_driver_expense = {};
	// Hide edit driver expense split modal.
	$scope.edit_driver_expense_split_model = false;
	// Toggle Modal.
	$scope.openEditDriverExpenseSplit = function (driver)
	{
		// Reset error and success messages.
		$scope.alert_message_success = '';
		$scope.alert_message_error = '';
		$scope.edit_driver_expense_split_model = !$scope.edit_driver_expense_split_model;
		
	}
	// Function to edit driver expense split.
	$scope.editDriverExpenseSplit = function(isValid)
	{
		$scope.loading = true;
		$scope.edit_driver_expense.database_name = $rootScope.data_base_name;
		$scope.edit_driver_expense.webservice_case = '';
		// Call the api to edit expense.
		API.common_api($scope.edit_driver_expense,'').success(function(data)
		{
			if( data.response_code == 200 )
			{
				$scope.getDriverListing();
				// Get success message
				$scope.alert_message_error = '';
				$scope.alert_message_success = data.response_message;
				$scope.success_error_message = true;
				$timeout(function ()
				{
					$scope.success_error_message = false;
				}, 2000);
				$scope.edit_driver_expense_split_model = false;
			}
			else
			{
				$scope.loading = false;
				if( data.response_code > 199 && data.response_code < 499 )
				{
					// Get error message
					$scope.alert_message_success = '';
					$scope.alert_message_error = data.response_message;
					$scope.success_error_message = true;
				}
			}
		})
	}
	// CSV export.
	$scope.generateDriverCSVData = function()
	{
		$scope.driver_listing_data_csv = orderByFilter($rootScope.driver_listing_data, $scope.sort_table, $scope.reverse);
		var data = [];
		data.push(["DRIVER NAME","PHONE NUMBER","EMAIL"]);
		data.push(["","",""]);
		for(i=0;i<$scope.driver_listing_data_csv.length;i++)
		{
			try
			{
				var phone_number = "(+"+$scope.driver_listing_data_csv[i].phone[0].calling_code+")"+$scope.driver_listing_data_csv[i].phone[0].number;
			}
			catch(err)
			{
				var phone_number = "";
			}
			var driver_title = ( typeof $scope.driver_listing_data_csv[i].title !== 'undefined' )?$scope.driver_listing_data_csv[i].title:"";
			var driver_first_name = ( typeof $scope.driver_listing_data_csv[i].first_name !== 'undefined' )?$scope.driver_listing_data_csv[i].first_name:"";
			var driver_last_name = ( typeof $scope.driver_listing_data_csv[i].last_name !== 'undefined' )?$scope.driver_listing_data_csv[i].last_name:"";
			var driver_name = driver_title+" "+driver_first_name+" "+driver_last_name;
			data.push([driver_name,phone_number,$scope.driver_listing_data_csv[i].email]);
		}
		var csvContent = "data:text/csv;charset=utf-8,";
		data.forEach(function(infoArray, index){

		   dataString = infoArray.join(",");
		   csvContent += index < data.length ? dataString+ "\n" : dataString;

		}); 
		var encodedUri = encodeURI(csvContent);
		var link = document.createElement("a");
		document.body.appendChild(link);
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", "driver-data.csv");

		link.click(); // This will download the data file named "my_data.csv".
	}
	// Generate driver pdf data and open modal.
	$scope.driver_pdf_data_modal = false;
	$scope.openGenerateDriverPDFData = function()
	{
		$scope.driver_pdf_data_modal = true;
		
	}
	// Sorting.
	$scope.sortDriverTableBy = function (keyname)
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
// Customer controller.
.controller('customer', function ($scope, $rootScope, API, $location, $window, $sessionStorage, $cookieStore, $timeout, orderByFilter)
{
	// Check login status.
	if (localStorage.getItem('loginStatus') != 1 ||  $sessionStorage.loginStatus == 0 || $sessionStorage.userId == 0)
	{
		$location.path('/login');
	}
	// Hide the listing table.
	$scope.custRes = false;
	// Show the loader.
	$scope.custLoader = true;
	// Get the URL of the page.
	var page_url = $window.location.href;
	// Get the database name of the client from the URL of the page.
	var url_path = page_url.split('/');
	$rootScope.data_base_name =	url_path[4];
	// Add the database name to the array.
	$scope.customer_listing = {"database_name" : $rootScope.data_base_name, "webservice_case" : "client_application_customer_listing"};
	// Get customer listing.
	$scope.getCustomerListing = function()
	{
		// Call API to get customer listing.
		API.getListing($scope.customer_listing).success(function (data)
		{
			// Check if success.
			if( data.response_code == 200 )
			{
				$scope.customer_listing_data = data.response_data;
				// Show the listing table.
				$scope.custRes = true;
				// Hide the loader.
				$scope.custLoader = false;
				$scope.sort_table = 'name';
				$scope.reverse = false;
			}
		});
	}
	$scope.getCustomerListing();
	$scope.business_settings = {"database_name" : $rootScope.data_base_name, "webservice_case" : "client_application_business_setting_list" , "required_fields" : []};
	// Call API to get business settings. 
	API.common_api($scope.business_settings, 'listing').success(function(data)
	{
		if( data.response_code == 200 )
		{
			$scope.country_code = data.response_data[0].country.calling_code;
			$scope.callng_code = data.response_data[0].country.calling_code;
			$scope.country_name = $scope.getCountryName($scope.callng_code);
		}
	})
	// Store country name.
	$scope.getCountryName = function(callng_code)
	{
		for(c=0;c<$rootScope.country_data.length;c++)
		{
			if( $rootScope.country_data[c].calling_code == callng_code )
			{
				return $rootScope.country_data[c].name;
				//return;
			}
		}
	}
	// Hide add customer modal.
	$scope.add_customer_modal = false;
	$scope.openAddCustomer = function()
	{
		// Reset error and success messages.
		$scope.alert_message_success = '';
		$scope.alert_message_error = '';
		$scope.add_customer = {};
		// Toggle modal.
		$scope.add_customer_modal = !$scope.add_customer_modal;
	}
	// Function to add new customer.
	$scope.addCustomer = function(isValid)
	{	
		$scope.loading = true;
		// Validations.
		if( isValid == false )
		{
			if( !$scope.add_customer.customer_type )
			{
				$scope.customer_type = true;
			}
			if( !$scope.add_customer.name )
			{
				$scope.name = true;
			}
			if( !$scope.add_customer.payment_type )
			{
				$scope.payment_type = true;
			}
			$scope.loading = false;
			return false;
		}
		else
		{
			if( $scope.add_customer.payment_type == 'invoice' )
			{	
				if( !$scope.add_customer.invoice_frequency )
				{
					$scope.invoice_frequency_err = true;
					$scope.loading = false;
					return false;
				}
				else
				{
					$scope.invoice_frequency_err = false;
				}
			}
		}
		// Add database name and webservice case to add_customer array.
		$scope.add_customer.database_name = $rootScope.data_base_name;
		$scope.add_customer.webservice_case = 'client_application_customer_registration';
		// Add reuired fields.
		$scope.add_customer.required_fields = [{'name':'customer_type'},{'name':'name'},{'name':'payment_type'}];
		// Call API to add the admin.
		API.addUserByAdmin($scope.add_customer).success(function (data)
		{
			// Check if successful.
			if( data.response_code == 200 )
			{
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'Customer successfully added.';
				$scope.success_error_message = true;
				// Get admin user listing.
				$scope.getCustomerListing();
				$timeout(function() 
				{
					$scope.success_error_message = false;
				}, 2000);
				$scope.loading = false;
				// Toggle modal.
				$scope.add_customer_modal = false;
			}
			else
			{
				$scope.alert_message_success = '';
				$scope.alert_message_error = data.response_message;
				// Get admin user listing.
				$scope.getCustomerListing();
				$scope.loading = false;
			}
		});
	}
	// Hide edit customer modal.
	$scope.edit_customer_modal = false;
	$scope.edit_customer = {};
	$scope.openEditCustomer = function (customer)
	{
		// Reset error and success messages.
		$scope.alert_message_success = '';
		$scope.alert_message_error = '';
		
		// Toggle modal.
		$scope.edit_customer_modal = !$scope.edit_customer_modal;
		$scope.edit_customer = customer;
		$scope.edit_customer.id = customer._id;
	}
	// Function to edit customer.
	$scope.editCustomer = function(isValid)
	{	
		$scope.loading = true;
		// Validations.
		if( isValid == false )
		{
			if( !$scope.edit_customer.customer_type )
			{
				$scope.customer_type = true;
			}
			if( !$scope.edit_customer.name )
			{
				$scope.name = true;
			}
			if( !$scope.edit_customer.payment_type )
			{
				$scope.payment_type = true;
			}
			$scope.loading = false;
			return false;
		}
		else
		{
			if( $scope.edit_customer.payment_type == 'invoice' )
			{	
				if( !$scope.edit_customer.invoice_frequency )
				{
					$scope.invoice_frequency_err = true;
					$scope.loading = false;
					return false;
				}
				else
				{
					$scope.invoice_frequency_err = false;
				}
			}
		}
		// Add database name and webservice case to edit_customer array.
		$scope.edit_customer.database_name = $rootScope.data_base_name;
		$scope.edit_customer.webservice_case = 'client_application_update_customer_details';
		// Add reuired fields.
		$scope.edit_customer.required_fields = [{'name':'customer_type'},{'name':'name'},{'name':'payment_type'},{'name':'invoice_frequency'},{'name':'invoice_surcharge_percentage'},{'name':'invoice_discount_percentage'}];
		// Call API to edit the customer.
		API.updateUserByAdmin($scope.edit_customer).success(function (data)
		{
			// Check if successful.
			if( data.response_code == 200 )
			{
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'Customer details successfully updated.';
				$scope.success_error_message = true;
				// Get admin user listing.
				$scope.getCustomerListing();
				$timeout(function() 
				{
					$scope.success_error_message = false;
				}, 2000);
				$scope.loading = false;
				// Toggle modal.
				$scope.edit_customer_modal = false;
			}
			else
			{
				$scope.alert_message_success = '';
				$scope.alert_message_error = data.response_message;
				// Get admin user listing.
				$scope.getCustomerListing();
				$scope.loading = false;
			}
		});
	}
	$scope.add_customer_contacts = {};
	// Hide add customer contacts modal.
	$scope.add_customer_contacts_modal = false;
	$scope.openAddCustomerContacts = function(customer_id)
	{
		// Reset error and success messages.
		$scope.alert_message_success = '';
		$scope.alert_message_error = '';
		// Toggle modal.
		$scope.add_customer_contacts_modal = !$scope.add_customer_contacts_modal;
		$scope.add_customer_contacts.id = customer_id;
	}
	// Function to add new contacts to customer.
	$scope.addCustomerContacts = function(isValid)
	{
		$scope.loading = true;
		// Validations.
		if( isValid == false )
		{
			if( !$scope.add_customer_contacts.contact_type )
			{
				$scope.contact_type = true;
			}
			if( !$scope.add_customer_contacts.title )
			{
				$scope.title = true;
			}
			if( !$scope.add_customer_contacts.first_name )
			{
				$scope.first_name = true;
			}
			$scope.loading = false;
			return false;
		}
		// Add database name and webservice case to array.
		$scope.add_customer_contacts.database_name = $rootScope.data_base_name;
		$scope.add_customer_contacts.webservice_case = 'client_application_add_customer_contact';
		// Add required fields.
		$scope.add_customer_contacts.required_fields = [{'name':'title'},{'name':'first_name'},{'name':'contact_type'}];
		// Call API to add the contacts.
		API.updateUserByAdmin($scope.add_customer_contacts).success(function (data)
		{
			// Check if successful.
			if( data.response_code == 200 )
			{
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'Customer contact successfully added.';
				$scope.success_error_message = true;
				// Get admin user listing.
				$scope.getCustomerListing();
				$timeout(function() 
				{
					$scope.success_error_message = false;
				}, 2000);
				$scope.loading = false;
				// Toggle modal.
				$scope.add_customer_contacts_modal = false;
			}
			else
			{
				$scope.alert_message_success = '';
				$scope.alert_message_error = data.response_message;
				// Get admin user listing.
				$scope.getCustomerListing();
				$scope.loading = false;
			}
		});
	}
	// Hide edit customer contacts modal.
	$scope.edit_customer_contacts_modal = false;
	$scope.edit_customer_contacts = {};
	$scope.openEditCustomerContacts = function(contacts)
	{
		// Reset error and success messages.
		$scope.alert_message_success = '';
		$scope.alert_message_error = '';
		// Toggle modal.
		$scope.edit_customer_contacts_modal = !$scope.edit_customer_contacts_modal;
		$scope.edit_customer_contacts = contacts;
		$scope.edit_customer_contacts.id = contacts._id;
		$scope.edit_customer_contacts.title = contacts.name.title;
		$scope.edit_customer_contacts.first_name = contacts.name.first_name;
		$scope.edit_customer_contacts.last_name = contacts.name.last_name;
	}
	// Function to edit customer contacts.
	$scope.editCustomerContacts = function(isValid)
	{	
		$scope.loading = true;
		// Validations.
		if( isValid == false )
		{
			if( !$scope.edit_customer_contacts.contact_type )
			{
				$scope.contact_type = true;
			}
			if( !$scope.edit_customer_contacts.title )
			{
				$scope.title = true;
			}
			if( !$scope.edit_customer_contacts.first_name )
			{
				$scope.first_name = true;
			}
			$scope.loading = false;
			return false;
		}
		// Add database name and webservice case to edit_customer_contacts array.
		$scope.edit_customer_contacts.database_name = $rootScope.data_base_name;
		$scope.edit_customer_contacts.webservice_case = 'client_application_customer_contact_update';
		// Add required fields.
		$scope.edit_customer_contacts.required_fields = [{'name':'title'},{'name':'first_name'},{'name':'contact_type'}];
		// Call API to edit the contacts.
		API.updateUserByAdmin($scope.edit_customer_contacts).success(function (data)
		{
			// Check if successful.
			if( data.response_code == 200 )
			{
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'Customer contact successfully updated.';
				$scope.success_error_message = true;
				// Get admin user listing.
				$scope.getCustomerListing();
				$timeout(function() 
				{
					$scope.success_error_message = false;
				}, 2000);
				$scope.loading = false;
				// Toggle modal.
				$scope.edit_customer_contacts_modal = false;
			}
			else
			{
				$scope.alert_message_success = '';
				$scope.alert_message_error = data.response_message;
				// Get admin user listing.
				$scope.getCustomerListing();
				$scope.loading = false;
			}
		});
	}
	$scope.add_customer_contact_phone = {};
	// Hide add customer contact phone modal.
	$scope.add_customer_contact_phone_modal = false;
	$scope.openAddCustomerContactPhone = function (contact_id)
	{
		// Reset error and success messages.
		$scope.alert_message_success = '';
		$scope.alert_message_error = '';
		// Toggle modal.
		$scope.add_customer_contact_phone_modal = !$scope.add_customer_contact_phone_modal;
		// Store contacts mongo ID.
		$scope.add_customer_contact_phone.id = contact_id;
		$scope.add_customer_contact_phone.calling_code = $scope.callng_code;
	}
	// Function to add phone number to customer contacts.
	$scope.addCustomerContactPhone = function (isValid)
	{
		$scope.loading = true;
		// Validations.
		if( isValid == false )
		{
			if( !$scope.add_customer_contact_phone.type )
			{
				$scope.type = true;
			}
			if( !$scope.add_customer_contact_phone.calling_code )
			{
				$scope.calling_code = true;
			}
			if( !$scope.add_customer_contact_phone.number )
			{
				$scope.number = true;
			}
			$scope.loading = false;
			return false;
		}
		// Add database name and webservice case to add_customer_contact_phone array.
		$scope.add_customer_contact_phone.database_name = $rootScope.data_base_name;
		$scope.add_customer_contact_phone.webservice_case = 'client_application_add_customer_contact_detail';
		$scope.add_customer_contact_phone.update_type = 'phone';
		// Add reuired fields.
		$scope.add_customer_contact_phone.required_fields = [{'name':'type'},{'name':'number'},{'name':'calling_code'}];
		// Call API to add the phone.
		API.updateUserByAdmin($scope.add_customer_contact_phone).success(function (data)
		{
			// Check if successful.
			if( data.response_code == 200 )
			{
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'Contact phone successfully added.';
				$scope.success_error_message = true;
				// Get admin user listing.
				$scope.getCustomerListing();
				$timeout(function() 
				{
					$scope.success_error_message = false;
				}, 2000);
				$scope.loading = false;
				// Toggle modal.
				$scope.add_customer_contact_phone_modal = false;
			}
			else
			{
				$scope.alert_message_success = '';
				$scope.alert_message_error = data.response_message;
				// Get admin user listing.
				$scope.getCustomerListing();
				$scope.loading = false;
			}
		});
	}
	$scope.edit_customer_contact_phone = {};
	// Hide edit customer contacts phone modal.
	$scope.edit_customer_contact_phone_modal = false;
	$scope.openEditCustomerContactPhone = function (phone, contact_id, customer_id)
	{
		// Reset error and success messages.
		$scope.alert_message_success = '';
		$scope.alert_message_error = '';
		// Toggle modal.
		$scope.edit_customer_contact_phone_modal = !$scope.edit_customer_contact_phone_modal;
		$scope.edit_customer_contact_phone = phone;
		$scope.edit_customer_contact_phone.phone_id = phone._id;
		$scope.edit_customer_contact_phone.contact_id = contact_id;
		$scope.edit_customer_contact_phone.id = customer_id;
	}
	// Function to edit customer contacts phone.
	$scope.editCustomerContactPhone = function (isValid)
	{	
		$scope.loading = true;
		// Validations.
		if( isValid == false )
		{
			if( !$scope.add_customer_contact_phone.type )
			{
				$scope.type = true;
			}
			if( !$scope.add_customer_contact_phone.calling_code )
			{
				$scope.calling_code = true;
			}
			if( !$scope.add_customer_contact_phone.number )
			{
				$scope.number = true;
			}
			$scope.loading = false;
			return false;
		}
		// Add database name and webservice case to edit_customer_contact_phone array.
		$scope.edit_customer_contact_phone.database_name = $rootScope.data_base_name;
		$scope.edit_customer_contact_phone.webservice_case = 'client_application_update_customer_contact_address_and_phone_detail';
		$scope.edit_customer_contact_phone.update_type = 'phone';
		// Add required fields.
		$scope.edit_customer_contact_phone.required_fields = [{'name':'type'},{'name':'number'},{'name':'calling_code'}];
		// Call API to edit the contacts.
		API.updateUserByAdmin($scope.edit_customer_contact_phone).success(function (data)
		{
			// Check if successful.
			if( data.response_code == 200 )
			{
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'Contact phone successfully updated.';
				$scope.success_error_message = true;
				// Get admin user listing.
				$scope.getCustomerListing();
				$timeout(function() 
				{
					$scope.success_error_message = false;
				}, 2000);
				$scope.loading = false;
				// Toggle modal.
				$scope.edit_customer_contact_phone_modal = false;
			}
			else
			{
				$scope.alert_message_success = '';
				$scope.alert_message_error = data.response_message;
				// Get admin user listing.
				$scope.getCustomerListing();
				$scope.loading = false;
			}
		});
	}
	// Delete contact phone number.
	$scope.delete_contact_phone = {};
	$scope.deleteCustomerContactPhone = function(id, phone_id)
	{
		$scope.delete_contact_phone = {'database_name' : $rootScope.data_base_name, 'webservice_case' : 'client_application_remove_customer_contact_detail', 'update_type' : 'phone', 'id' : id, 'phone_id' : phone_id};
		API.common_api($scope.delete_contact_phone, 'delete').success(function(data)
		{
			if( data.response_code == 200 )
			{
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'Phone number deleted successfully.';
				$scope.success_error_message = true;
				// Get admin user listing.
				$scope.getCustomerListing();
				$timeout(function() 
				{
					$scope.success_error_message = false;
				}, 2000);
			}
		});
	}
	$scope.add_customer_contact_address = {};
	// Hide add customer contact address modal.
	$scope.add_customer_contact_address_modal = false;
	$scope.openAddCustomerContactAddress = function(id)
	{
		// Reset error and success messages.
		$scope.alert_message_success = '';
		$scope.alert_message_error = '';
		// Toggle modal.
		$scope.add_customer_contact_address_modal = !$scope.add_customer_contact_address_modal;
		// Store contacts mongo ID.
		$scope.add_customer_contact_address.id = id;
		$scope.add_customer_contact_address.country = $scope.country_name;
	}
	// Function to add contact address.
	$scope.addCustomerContactAddress = function(isValid)
	{
		$scope.loading = true;
		if( isValid == false )
		{
			/*if( !$scope.add_customer_contact_address.type )
			{
				$scope.type = true;
			}*/
			if( !$scope.add_customer_contact_address.label )
			{
				$scope.label = true;
			}
			if( !$scope.add_customer_contact_address.line_1 )
			{
				$scope.line_1 = true;
			}
			if( !$scope.add_customer_contact_address.city )
			{
				$scope.city = true;
			}
			/*if( !$scope.add_customer_contact_address.suburb_district )
			{
				$scope.suburb_district = true;
			}*/
			if( !$scope.add_customer_contact_address.state )
			{
				$scope.state = true;
			}
			if( !$scope.add_customer_contact_address.post_code )
			{
				$scope.post_code = true;
			}
			if( !$scope.add_customer_contact_address.country )
			{
				$scope.country = true;
			}
			$scope.loading = false;
			return false;
		}
		// Add database name and webservice case to add_customer_contact_address array.
		$scope.add_customer_contact_address.database_name = $rootScope.data_base_name;
		$scope.add_customer_contact_address.webservice_case = 'client_application_add_customer_contact_detail';
		$scope.add_customer_contact_address.update_type = 'address';
		// Add reuired fields.
		$scope.add_customer_contact_address.required_fields = [{'name':'line_1'},{'name':'country'},{'name':'city'},{'name':'label'},{'name':'state'},{'name':'post_code'}];
		// Call API to add the address.
		API.updateUserByAdmin($scope.add_customer_contact_address).success(function(data)
		{
			// Check if successful.
			if( data.response_code == 200 )
			{
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'Contact address successfully added.';
				$scope.success_error_message = true;
				// Get admin user listing.
				$scope.getCustomerListing();
				$timeout(function() 
				{
					$scope.success_error_message = false;
				}, 2000);
				$scope.loading = false;
				// Toggle modal.
				$scope.add_customer_contact_address_modal = false;
			}
			else
			{
				$scope.alert_message_success = '';
				$scope.alert_message_error = data.response_message;
				// Get admin user listing.
				$scope.getCustomerListing();
				$scope.loading = false;
			}
		});
	}
	$scope.edit_customer_contact_address = {};
	// Hide edit customer contacts address modal.
	$scope.edit_customer_contact_address_modal = false;
	$scope.openEditCustomerContactAddress = function(address, contact_id, customer_id)
	{
		// Reset error and success messages.
		$scope.alert_message_success = '';
		$scope.alert_message_error = '';
		// Toggle modal.
		$scope.edit_customer_contact_address_modal = !$scope.edit_customer_contact_address_modal;
		$scope.edit_customer_contact_address = address;
		$scope.edit_customer_contact_address.address_id = address._id;
		$scope.edit_customer_contact_address.contact_id = contact_id;
		$scope.edit_customer_contact_address.id = customer_id;
	}
	// Function to edit customer contacts address.
	$scope.editCustomerContactAddress = function(isValid)
	{
		$scope.loading = true;
		if( isValid == false )
		{
			/*if( !$scope.edit_customer_contact_address.type )
			{
				$scope.type = true;
			}*/
			if( !$scope.edit_customer_contact_address.label )
			{
				$scope.label = true;
			}
			if( !$scope.edit_customer_contact_address.line_1 )
			{
				$scope.line_1 = true;
			}
			if( !$scope.edit_customer_contact_address.city )
			{
				$scope.city = true;
			}
			/*if( !$scope.edit_customer_contact_address.suburb_district )
			{
				$scope.suburb_district = true;
			}*/
			if( !$scope.edit_customer_contact_address.state )
			{
				$scope.state = true;
			}
			if( !$scope.edit_customer_contact_address.post_code )
			{
				$scope.post_code = true;
			}
			if( !$scope.edit_customer_contact_address.country )
			{
				$scope.country = true;
			}
			$scope.loading = false;
			return false;
		}
		// Add database name and webservice case to edit_customer_contact_address array.
		$scope.edit_customer_contact_address.database_name = $rootScope.data_base_name;
		$scope.edit_customer_contact_address.webservice_case = 'client_application_update_customer_contact_address_and_phone_detail';
		$scope.edit_customer_contact_address.update_type = 'address';
		// Add required fields.
		$scope.edit_customer_contact_address.required_fields = [{'name':'line_1'},{'name':'country'},{'name':'city'},{'name':'label'},{'name':'state'},{'name':'post_code'}];
		// Call API to edit the contacts.
		API.updateUserByAdmin($scope.edit_customer_contact_address).success(function(data)
		{
			// Check if successful.
			if( data.response_code == 200 )
			{
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'Contact address successfully updated.';
				$scope.success_error_message = true;
				// Get admin user listing.
				$scope.getCustomerListing();
				$timeout(function() 
				{
					$scope.success_error_message = false;
				}, 2000);
				$scope.loading = false;
				// Toggle modal.
				$scope.edit_customer_contact_address_modal = false;
			}
			else
			{
				$scope.alert_message_success = '';
				$scope.alert_message_error = data.response_message;
				// Get admin user listing.
				$scope.getCustomerListing();
				$scope.loading = false;
			}
		});
	}
	// Delete contact address.
	$scope.delete_contact_address = {};
	$scope.deleteCustomerContactAddress = function(id, address_id)
	{
		$scope.delete_contact_address = {'database_name' : $rootScope.data_base_name, 'webservice_case' : 'client_application_remove_customer_contact_detail', 'update_type' : 'address', 'id' : id, 'address_id' : address_id};
		API.common_api($scope.delete_contact_address, 'delete').success(function(data)
		{
			if( data.response_code == 200 )
			{
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'Address deleted successfully.';
				$scope.success_error_message = true;
				// Get admin user listing.
				$scope.getCustomerListing();
				$timeout(function() 
				{
					$scope.success_error_message = false;
				}, 2000);
			}
		});
	}
	// Generate customer pdf data and open modal.
	$scope.customer_pdf_data_modal = false;
	$scope.openGenerateCustomerPDFData = function()
	{
		$scope.customer_pdf_data_modal = true;
		
	}
	// Generate customer csv data and download.
	$scope.generateCustomerCSVData = function()
	{
		$scope.customer_listing_data_csv = orderByFilter($scope.customer_listing_data, $scope.sort_table, $scope.reverse);
		var data = [];
		data.push(["CUSTOMER NAME","CONTACT NAME","PHONE NUMBER","EMAIL"]);
		data.push([""]);
		for(i=0;i<$scope.customer_listing_data_csv.length;i++)
		{
			for(j=0;j<$scope.customer_listing_data_csv[i].contacts.length;j++)
			{
				var contact_title = (typeof $scope.customer_listing_data_csv[i].contacts[j].name.title !== 'undefined')?$scope.customer_listing_data_csv[i].contacts[j].name.title:'';
				var contact_name = contact_title+" "+$scope.customer_listing_data_csv[i].contacts[j].name.first_name+" "+$scope.customer_listing_data_csv[i].contacts[j].name.last_name;
				try
				{
					var contact_phone = (typeof $scope.customer_listing_data_csv[i].contacts[j].phone[0].calling_code !== 'undefined')?"(+"+$scope.customer_listing_data_csv[i].contacts[j].phone[0].calling_code+")"+$scope.customer_listing_data_csv[i].contacts[j].phone[0].number:$scope.customer_listing_data_csv[i].contacts[j].phone[0].number;
				}
				catch(err)
				{
					var contact_phone = "";
				}
				var contact_email = $scope.customer_listing_data_csv[i].contacts[j].email;
				if( j == 0 )
				{
					data.push([$scope.customer_listing_data_csv[i].name,contact_name,contact_phone,contact_email]);
				}
				else
				{
					data.push(["",contact_name,contact_phone,contact_email]);
				}
			}
			data.push(["","","",""]);
		}
		var csvContent = "data:text/csv;charset=utf-8,";
		data.forEach(function(infoArray, index){

		   dataString = infoArray.join(",");
		   csvContent += index < data.length ? dataString+ "\n" : dataString;
		}); 
		var encodedUri = encodeURI(csvContent);
		var link = document.createElement("a");
		document.body.appendChild(link);
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", "customer-data.csv");

		link.click(); // This will download the data file named "my_data.csv".
	}
	//Sorting.
	$scope.sortCustomerTableBy = function (keyname)
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
// Manage(edit) profile of all type of user
.controller('manageProfile', function ($scope, $rootScope, API, $localStorage, $location, $window, $sessionStorage, $upload, $cookieStore, $timeout)
{	
	// Check login status.
	if (localStorage.getItem('loginStatus') != 1 ||  $sessionStorage.loginStatus == 0 || $sessionStorage.userId == 0)
	{
		$location.path('/login');
		return;
	}
	// Start page loader 
	$scope.profile_setting_loader = true;
	// Set user id from session 
	if ($sessionStorage.userId)
	{
		$rootScope.user_id = $sessionStorage.userId;
	}
	// Check customer id
	if ($sessionStorage.customer_id)
	{
		$rootScope.customer_id = $sessionStorage.customer_id;
	}
	else
	{
		$rootScope.customer_id = localStorage.getItem("customer_id");
	}
	// Get the database name of the client from the URL of the page.
	$rootScope.data_base_name =	$location.absUrl().split('/')[4]||"Unknown"; 
	// Add the database name to the array.
	$scope.country_listing =
	{
		webservice_case : 'country_listing',
		database_name : 'a_limokit'
	};
	// Call API to get country listing.
	API.getCountry($scope.country_listing).success(function (data)
    {  
        $rootScope.country_data	= data.response_data;
	});
	// Below messages show or hide as per success failure of API
	$scope.disable_success_message   = true;
	$scope.disable_error_message     = true;
	$scope.hide_change_password_panel= true;
	$scope.disable_success_msg       = true;
	$scope.disable_error_msg         = true;
	// Show password change panel after click this function by contact
	$scope.showPasswordModal = function()
	{
		$scope.show_change_password_model= !$scope.show_change_password_model;
		$scope.hide_change_password_panel= false;
		$scope.disable_error_message     = true;
		$scope.disable_success_message   = true;
		$scope.edit_password.current_password = '';
		$scope.edit_password.new_password = '';
		$scope.edit_password.confirm_password = '';
	}
	// To show image upload div for admin and contact
	$scope.showImageUploadPanel = function()
	{
		$scope.upload_profile_image = !$scope.upload_profile_image;
	}
	if (localStorage.getItem('userType') == 'Customer')
	{	
		$scope.profileData = function ()
		{
			$scope.contact_profile = {
										'webservice_case'	: 	"client_application_contact_listing", 
										'database_name'		:	$rootScope.data_base_name, 
										'id'				:	$rootScope.user_id
									};
			// This API use for fetch contact details 
			API.common_api($scope.contact_profile,'listing').success(function(contact_profile_data)
			{  
				$scope.profile	=  contact_profile_data.response_data[0];
				// Dynamically set user name, image if user change from edit prifile page
				$sessionStorage.user_name = contact_profile_data.response_data[0].title + ' ' + contact_profile_data.response_data[0].first_name + ' ' + contact_profile_data.response_data[0].last_name;
				$rootScope.user_name = $sessionStorage.user_name;
				$cookieStore.put("user_name",$sessionStorage.user_name);
				$rootScope.user_name = $cookieStore.get("user_name");
				if (typeof contact_profile_data.response_data[0].phone != 'undefined' && contact_profile_data.response_data[0].phone.length)
				{
					$sessionStorage.user_phone_number = '+' + contact_profile_data.response_data[0].phone[0].calling_code + '-' + contact_profile_data.response_data[0].phone[0].number;
					$rootScope.user_phone_number = $sessionStorage.user_phone_number;
					$cookieStore.put("user_phone_number",$sessionStorage.user_phone_number);
					$rootScope.user_phone_number = $cookieStore.get("user_phone_number");
				}
				else
				{
					$sessionStorage.user_phone_number = '';
					$cookieStore.put("user_phone_number",'');
					$rootScope.user_phone_number = '';
				}
				if (typeof contact_profile_data.response_data[0].image != 'undefined' && contact_profile_data.response_data[0].image.length)
				{
					$sessionStorage.user_profile_image = contact_profile_data.response_data[0].image[0].image_path;
					$rootScope.user_profile_image = $sessionStorage.user_profile_image;
					$cookieStore.put("user_profile_image",$sessionStorage.user_profile_image);
					$rootScope.user_profile_image = $cookieStore.get("user_profile_image");
				}
				else
				{
					$sessionStorage.user_profile_image = '';
					$cookieStore.put("user_profile_image",'');
					$rootScope.user_profile_image = '';
				}
				// End page loader 
				$scope.profile_setting_loader = false;
			});
		}
		$scope.profileData();
		// This json use when contact try to change own password after login
		$scope.edit_password = {
								'database_name'		:	$rootScope.data_base_name,
								'webservice_case'	:	"client_application_customer_password_change",
								'id'				:	$rootScope.user_id,
								'customer_id'		:	$rootScope.customer_id,
								'created_by'		:	$rootScope.user_id,
								'created_by_type'	:	'Customer',
								'required_fields'	: 	[
															{'name' : "current_password"},
															{'name' : "new_password"},
															{'name' : "confirm_password"}
														]
								};
		// Use for profile edit by contact 
		$scope.profile_edit = {
								'database_name'		:	$rootScope.data_base_name,
								'webservice_case'	:	"client_application_customer_contact_profile_update",
								'id'				:	$rootScope.user_id,
								'created_by'		:	$rootScope.user_id,
								'created_by_type'	:	'Customer',
								'required_fields'	: 	[
															{'name' : "title"},
															{'name' : "first_name"},
															{'name' : "last_name"},
															{'name' : "email"},
															{'name' : "calling_code"},
															{'name' : "number"}
														]
								};
	}
	// Below condition execute for driver profile
	if (localStorage.getItem('userType') == 'Driver')
	{	
		// Define an array to hold bank parameters value
		$scope.bank_param_ = [];
		$scope.profileData = function ()
		{
			$scope.driver_profile = {
										'webservice_case' 	: "client_application_driver_list",
										'database_name' 	: $rootScope.data_base_name,
										'id' 				: $rootScope.user_id
									};
			// This API use for fetch admin details 
			API.common_api($scope.driver_profile, 'listing').success(function (driver_profile_data)
			{  	
				$scope.profile	=  driver_profile_data.response_data[0];
				// Dynamically set user name, image if user change from edit prifile page
				$sessionStorage.user_name = driver_profile_data.response_data[0].title + ' ' + driver_profile_data.response_data[0].first_name + ' ' + driver_profile_data.response_data[0].last_name;
				$rootScope.user_name = $sessionStorage.user_name;
				$cookieStore.put("user_name",$sessionStorage.user_name);
				$rootScope.user_name = $cookieStore.get("user_name");
				if (typeof driver_profile_data.response_data[0].phone != 'undefined' && driver_profile_data.response_data[0].phone.length)
				{
					$sessionStorage.user_phone_number = '+' + driver_profile_data.response_data[0].phone[0].calling_code + '-' + driver_profile_data.response_data[0].phone[0].number;
					$rootScope.user_phone_number = $sessionStorage.user_phone_number;
					$cookieStore.put("user_phone_number",$sessionStorage.user_phone_number);
					$rootScope.user_phone_number = $cookieStore.get("user_phone_number");
				}
				else
				{
					$sessionStorage.user_phone_number = '';
					$cookieStore.put("user_phone_number", '');
					$rootScope.user_phone_number = '';
				}
				if (typeof driver_profile_data.response_data[0].image != 'undefined' && driver_profile_data.response_data[0].image.length)
				{
					$sessionStorage.user_profile_image = driver_profile_data.response_data[0].image[0].image_path;
					$rootScope.user_profile_image = $sessionStorage.user_profile_image;
					$cookieStore.put("user_profile_image",$sessionStorage.user_profile_image);
					$rootScope.user_profile_image = $cookieStore.get("user_profile_image");
				}
				else
				{
					$sessionStorage.user_profile_image = '';
					$cookieStore.put("user_profile_image",'');
					$rootScope.user_profile_image = '';
				}
				if (typeof $scope.profile.bank_details != 'undefined' && $scope.profile.bank_details.length)
				{
					for (var i = 0; i < $scope.profile.bank_details.length; i++)
					{
						$scope.bank_param_[i] = $scope.profile.bank_details[i].value;
					}
				}
				// End page loader 
				$scope.profile_setting_loader = false;
			});
		}
		// Call below function to get profile data of driver
		$scope.profileData();
		// This json use when admin try to change own password after login
		$scope.edit_password = {
									'database_name'		:	$rootScope.data_base_name,
									'webservice_case'	:	"client_application_driver_password_change",
									'id'				:	$rootScope.user_id,
									'created_by'		:	$rootScope.user_id,
									'created_by_type'	:	'Driver',
									'required_fields'	: 	[
																{'name' : "current_password"},
																{'name' : "new_password"},
																{'name' : "confirm_password"}
															]
								};
		// Use for profile edit by driver 
		$scope.profile_edit = {
								'update_type'		:	"personal_details",
								'webservice_case'	:	"client_application_driver_update_detail",
								'driver_id'			:	$rootScope.user_id,
								'created_by'		:	$rootScope.user_id,
								'created_by_type'	:	'Driver',
								'database_name'		:	$rootScope.data_base_name,
								'required_fields'	: 	[
															{'name' : "title"},
															{'name' : "first_name"},
															{'name' : "last_name"},
															{'name' : "email"}
														]
							};
		$scope.profile_edit.bank_details = [];
	}
	// Change password by user
	$scope.changePasswordByUser = function (change_password)
	{
		$scope.change_password_success_messages = [];
		$scope.change_password_error_messages = [];
		// form validation of change password by customer
		if (angular.isUndefined(change_password.current_password.$modelValue) || change_password.current_password.$modelValue == '')
		{
			change_password.current_password.$dirty = true;
			$('input.ng-invalid').first().focus();
			return false;
		}
		if (angular.isUndefined(change_password.new_password.$modelValue) || change_password.new_password.$modelValue == '')
		{
			change_password.new_password.$dirty = true;
			$('input.ng-invalid').first().focus();
			return false;
		}
		if (angular.isUndefined(change_password.confirm_password.$modelValue) || change_password.confirm_password.$modelValue == '')
		{
			change_password.confirm_password.$dirty = true;
			$('input.ng-invalid').first().focus();
			return false;
		}
		if (!angular.equals($scope.edit_password.new_password, $scope.edit_password.confirm_password))
		{
			change_password.confirm_password.$error.pattern = true;
			$('input.ng-invalid').first().focus();
			return false;
		}
		$scope.password_update_loader = true;
		if (localStorage.getItem('userType') == 'Customer')
		{
			// This json use when contact try to change own password after login
			$scope.edit_password.database_name = $rootScope.data_base_name;
			$scope.edit_password.webservice_case = "client_application_customer_password_change";
			$scope.edit_password.id = $rootScope.user_id;
			$scope.edit_password.created_by = $rootScope.user_id;
			$scope.edit_password.created_by_type = 'Customer';
			$scope.edit_password.required_fields = [{'name' : "current_password"},{'name' : "new_password"},{'name' : "confirm_password"}];
		}
		if (localStorage.getItem('userType') == 'Driver')
		{
			$scope.edit_password.database_name = $rootScope.data_base_name;
			$scope.edit_password.webservice_case = "client_application_driver_password_change";
			$scope.edit_password.id = $rootScope.user_id;
			$scope.edit_password.created_by = $rootScope.user_id;
			$scope.edit_password.created_by_type = 'Driver';
			$scope.edit_password.required_fields = [{'name' : "current_password"},{'name' : "new_password"},{'name' : "confirm_password"}];
		} 
		API.common_api($scope.edit_password, 'update').success(function (data)
		{
			// If API.common_api() function return success then execute below condition
			if (data)
			{
				$scope.password_update_loader = false;
				// If API.common_api() function return response_code 200 then execute below condition
				if (data.response_code == 200)
				{
					// Below code will be execute after successfully getting success msg
					$scope.disable_success_message 	= false;
					data.response_message = "Password changed successfully.";
					$scope.change_password_success_messages.push(data.response_message);  
					$timeout(function ()
					{
						$scope.show_change_password_model = false;   
					}, 2000);
					// For form validation hide
					change_password.current_password.$dirty	= false;
					change_password.new_password.$dirty		= false;
					change_password.confirm_password.$dirty	= false;
					change_password.confirm_password.$error.pattern = false;
					$scope.hide_change_password_panel		= true;
				}
				else
				{	if (data.response_code > 199 && data.response_code < 499)
					{
						// If API.common_api() function return response_code rather then 200 means error msg then execute below condition
						$scope.disable_success_message 	= true;
						$scope.disable_error_message	= false;
						$scope.change_password_error_messages.push(data.response_message);
						$scope.hide_change_password_panel	= false;
					}
				}
			}
		});
	}
	$scope.add_driver_phone = {};
	// For edit customer profile by Admin or Customer
	$scope.editProfileByUser = function (edit_profile, user)
	{	
		$scope.success_messages = [];
		$scope.error_messages = [];
		if (angular.isUndefined(edit_profile.title.$modelValue) || edit_profile.title.$modelValue == '')
		{
			edit_profile.title.$dirty = true;
			$('input.ng-invalid').first().focus();
			return false;
		}
		if (angular.isUndefined(edit_profile.first_name.$modelValue) || edit_profile.first_name.$modelValue == '')
		{
			edit_profile.first_name.$dirty = true;
			$('input.ng-invalid').first().focus();
			return false;
		}
		if (angular.isUndefined(edit_profile.last_name.$modelValue)  || edit_profile.last_name.$modelValue == '')
		{
			edit_profile.last_name.$dirty = true;
			$('input.ng-invalid').first().focus();
			return false;
		}
		if (angular.isUndefined(edit_profile.phone_type.$modelValue) || edit_profile.phone_type.$modelValue == '')
		{
			edit_profile.phone_type.$dirty = true;
			$('input.ng-invalid').first().focus();
			return false;
		}
		if (angular.isUndefined(edit_profile.calling_code.$modelValue) || edit_profile.calling_code.$modelValue == '')
		{
			edit_profile.calling_code.$dirty = true;
			$('select.ng-invalid').first().focus();
			return false;
		}
		if (angular.isUndefined(edit_profile.number.$modelValue) || edit_profile.number.$modelValue == '')
		{
			edit_profile.number.$dirty = true;
			edit_profile.number.$invalid = true;
			$('input.ng-invalid').first().focus();
			return false;
		}
		if (angular.isUndefined(edit_profile.email.$modelValue) || edit_profile.email.$modelValue == '')
		{
			edit_profile.email.$dirty = true;
			$('input.ng-invalid').first().focus();
			return false;
		}
		if (user == 'driver')
		{
			if (angular.isUndefined(edit_profile.licence_number.$modelValue) || edit_profile.licence_number.$modelValue == '')
			{
				edit_profile.licence_number.$dirty = true;
				$('input.ng-invalid').first().focus();
				return false;
			}
			if (angular.isUndefined(edit_profile.licence_expire.$modelValue) || edit_profile.licence_expire.$modelValue == '')
			{
				edit_profile.licence_expire.$dirty = true;
				$('input.ng-invalid').first().focus();
				return false;
			}
			for (var i = 0; i < $scope.profile.bank_details.length; i++)
			{
				$scope.profile_edit.bank_details.push({_id : $scope.profile.bank_details[i]._id, field_name : $scope.profile.bank_details[i].field_name, value : $scope.bank_param_[i]});
			}
		}
		$scope.update_profile_loader = true;
		$scope.profile_edit.title       = $scope.profile.title;
		$scope.profile_edit.first_name  = $scope.profile.first_name;
		$scope.profile_edit.last_name   = $scope.profile.last_name;
		$scope.profile_edit.email       = $scope.profile.email;
		if (user == 'driver')
		{
			$scope.profile_edit.dc = $scope.profile.dc;
			$scope.profile_edit.dc_expire = $scope.profile.dc_expire;
			$scope.profile_edit.licence_number = $scope.profile.licence_number;
			$scope.profile_edit.licence_expire = $scope.profile.licence_expire;
			$scope.profile_edit.notes = $scope.profile.notes;
		}
		if (user == 'contact')
		{
			if ($scope.profile.phone[0]._id)
			{
				$scope.profile_edit.phone_id = $scope.profile.phone[0]._id;
			}
			$scope.profile_edit.type = $scope.profile.phone[0].type;
			$scope.profile_edit.calling_code = $scope.profile.phone[0].calling_code;
			$scope.profile_edit.number = $scope.profile.phone[0].number;
		}
		// When Customer or Admin has no profile image then execute below if condition
		if (angular.isUndefined(edit_profile.image.$modelValue) || edit_profile.image.$modelValue == '')
		{	
			API.common_api($scope.profile_edit, 'update').success(function (data)
			{	
				// If API.common_api() function return success then execute below condition
				if (data)
				{   
					$scope.update_profile_loader = false;
					// If API.common_api() function return response_code 200 then execute below condition
					if (data.response_code == 200)
					{	
						$scope.add_driver_phone.type		=  $scope.profile.phone[0].type;
						$scope.add_driver_phone.calling_code=  $scope.profile.phone[0].calling_code;
						$scope.add_driver_phone.number      =  $scope.profile.phone[0].number;
						// Add database name and webservice case to add_driver_phone array.
						$scope.add_driver_phone.database_name = $rootScope.data_base_name;
						$scope.add_driver_phone.update_type = 'phone';
						$scope.add_driver_phone.required_fields = [{'name' : 'calling_code'},{'name' : 'number'}];
						// Add required fields to add_driver_phone array.
						if(user == 'driver')
						{	
							if ($scope.profile.phone[0]._id)
							{ 
								$scope.add_driver_phone.driver_id = $rootScope.user_id;
								$scope.add_driver_phone.webservice_case = 'client_application_driver_update_detail';
								$scope.add_driver_phone.id    =  $scope.profile.phone[0]._id;
							}
							else
							{ 
								$scope.add_driver_phone.id = $rootScope.user_id;
								$scope.add_driver_phone.webservice_case = 'client_application_add_driver_contact_detail';
							} 
							// Call API to add the phone.
							API.updateUserByAdmin($scope.add_driver_phone).success(function (data)
							{
								// Check if successful.
								$scope.profile_edit.bank_details = [];
								if (data.response_code == 200)
								{
									// Below code will be execute after successfully getting success msg
									$scope.disable_success_msg = false;
									$scope.disable_error_msg = true; 
									data.response_message = "Profile updated successfully.";  
									$timeout(function ()
									{
										$scope.disable_success_msg = true;
									}, 2000);
									$scope.success_messages.push(data.response_message);
									// Below functions call for get updated profile data from client DB
									$scope.profileData();
									$scope.upload_profile_image = false;
								}
								else
								{
									if (data.response_code > 199 && data.response_code < 499)
									{
										// If API.common_api() function return response_code rather then 200 means error msg then execute below condition
										$scope.disable_success_msg = true;
										$scope.disable_error_msg = false;
										$scope.error_messages.push(data.response_message);
									}
								}
							});
						}
						else
						{
							// Below code will be execute after successfully getting success msg
							$scope.disable_success_msg = false;
							$scope.disable_error_msg = true;
							data.response_message = "Profile updated successfully.";
							$scope.success_messages.push(data.response_message);
							$timeout(function ()
							{
								$scope.disable_success_msg = true;
							}, 2000);
							// Below functions call for get updated profile data from client DB
							$scope.profileData();
							$scope.upload_profile_image = false;
						}
					}
					else
					{
						if (data.response_code > 199 && data.response_code < 499)
						{
							// If API.common_api() function return response_code rather then 200 means error msg then execute below condition
							$scope.disable_success_msg = true;
							$scope.disable_error_msg = false;
							$scope.error_messages.push(data.response_message);
							$scope.profile_edit.bank_details = [];
						}
					}
				}
			});
		}
		// When Customer or Admin has profile image then execute below else condition
		else
		{	
			$upload.upload(
			{
				url : 'http://www.limotool.com:3400/update',
				headers :
				{
					'Content-Type' : 'application/x-www-form-urlencoded'
				},
				// headers: {'myHeaderKey': 'myHeaderVal'},
				data : $scope.profile_edit,
				file : $scope.profile.image_name,
				fileFormDataName : 'myFile'
			}
			).then(function (response)
			{
				$scope.update_profile_loader = false;
				if (response.data.response_code == 200)
				{
					$scope.add_driver_phone.type = $scope.profile.phone[0].type;
					$scope.add_driver_phone.calling_code = $scope.profile.phone[0].calling_code;
					$scope.add_driver_phone.number = $scope.profile.phone[0].number;
					// Add database name and webservice case to add_driver_phone array.
					$scope.add_driver_phone.database_name = $rootScope.data_base_name;
					$scope.add_driver_phone.update_type = 'phone';
					$scope.add_driver_phone.required_fields = [{'name' : 'calling_code'},{'name' : 'number'}];
					// Add required fields to add_driver_phone array.
					if(user == 'driver')
					{
						if ($scope.profile.phone[0]._id == '')
						{
							$scope.add_driver_phone.id = $rootScope.user_id;
							$scope.add_driver_phone.webservice_case = 'client_application_add_driver_contact_detail';
						}
						else if ($scope.profile.phone[0]._id != '')
						{
							$scope.add_driver_phone.driver_id = $rootScope.user_id;
							$scope.add_driver_phone.webservice_case = 'client_application_driver_update_detail';
							$scope.add_driver_phone.id    =  $scope.profile.phone[0]._id;
						}
						else{}
						// Call API to add the phone.
						API.updateUserByAdmin($scope.add_driver_phone).success(function (data)
						{
							// Check if successful.
							$scope.profile_edit.bank_details = [];
							if (data.response_code == 200)
							{
								// Below code will be execute after successfully getting success msg
								$scope.disable_success_msg = false;
								$scope.disable_error_msg = true;
								response.data.response_message = "Profile edited successfully.";
								$scope.success_messages.push(response.data.response_message);
								$timeout(function ()
								{
									$scope.disable_success_msg = true;
								}, 2000);
								// Below functions call for get updated profile data from client DB
								$scope.profileData();
								$scope.upload_profile_image = false;
							}
							else
							{
								if (data.response_code > 199 && data.response_code < 499)
								{
									// If API.common_api() function return response_code rather then 200 means error msg then execute below condition
									$scope.disable_success_msg = true;
									$scope.disable_error_msg = false;
									$scope.error_messages.push(data.response_message);
								}
							}
						});
					}
					else
					{
						// Below code will be execute after successfully getting success msg
						$scope.disable_success_msg = false;
						$scope.disable_error_msg = true;
						response.data.response_message = "Profile edited successfully.";
						$scope.success_messages.push(response.data.response_message);
						$timeout(function ()
						{
							$scope.disable_success_msg = true;
						}, 2000);
						// Below functions call for get updated profile data from client DB
						$scope.profileData();
						$scope.upload_profile_image = false;
					}
				}
				else
				{	// If error occar on image uploading
					if (response.data.response_code > 199 && response.data.response_code < 499)
					{
						// If API.common_api() function return response_code rather then 200 means error msg then execute below condition
						$scope.disable_success_msg = true;
						$scope.disable_error_msg = false;
						$scope.error_messages.push(response.data.response_message);
						$scope.profile_edit.bank_details = [];
					}
				}
			}, null, function (evt)  {}

			);
		}
	}
})
.directive('modal', function () {
    return {
		template: 	'<div class="modal fade">' + 
						'<div class="modal-dialog">' + 
							'<div class="modal-content">' + 
								'<div class="modal-header">' + 
									'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + 
									'<h4 class="modal-title">{{ title }}</h4>' + 
								'</div>' + 
								'<div class="modal-body" ng-transclude></div>' + 
							'</div>' + 
						'</div>' + 
					'</div>',
					restrict: 'E',
					transclude: true,
					replace:true,
					scope:true,
		link : function postLink(scope, element, attrs)
		{
			scope.title = attrs.title;
			scope.$watch(attrs.visible, function (value)
			{
				if (value == true)
					$(element).modal('show');
				else
					$(element).modal('hide');
			}
			);
			$(element).on('shown.bs.modal', function ()
			{
				scope.$apply(function ()
				{
					scope.$parent[attrs.visible] = true;
				}
				);
			}
			);
			$(element).on('hidden.bs.modal', function ()
			{
				scope.$apply(function ()
				{
					scope.$parent[attrs.visible] = false;
				}
				);
			}
			);
		}
    };
  })
  .directive('ngConfirmClick', [
        function(){
            return {
                priority: 1,
                terminal: true,
                link: function (scope, element, attr) {
                    var msg = attr.ngConfirmClick || "Are you sure?";
                    var clickAction = attr.ngClick;
                    element.bind('click',function (event) {
                        if ( window.confirm(msg) ) {
                            scope.$eval(clickAction)
                        }
                    });
                }
            };
    }])    
.directive('file', function() {
    return {
        restrict: 'E',
        template: '<input type="file" />',
        replace: true,
        require: 'ngModel',
        link: function(scope, element, attr, ctrl) {
            var listener = function() {
                scope.$apply(function() {
                    attr.multiple ? ctrl.$setViewValue(element[0].files) : ctrl.$setViewValue(element[0].files[0]);
                });
            }
            element.bind('change', listener);
        }
    }
})
 