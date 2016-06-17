angular.module('log_controller',['limo_client.services'])

// user_log controller for car listing of log of user
.controller('user_log',function($scope,$http,$rootScope,$location,API,$http,$window,$timeout,$upload,$cookieStore,$sessionStorage)
{
	// Check login status.
	if (localStorage.getItem('loginStatus') != 1 ||  $sessionStorage.loginStatus == 0 || $sessionStorage.userId == 0)
	{
		$location.path('/login');
	}
	// Get the URL of the page.
	var page_url = $window.location.href;
	// Get the database name of the client from the URL of the page.
	var url_path = page_url.split('/');
	$rootScope.data_base_name =	url_path[4];
	// Add the database name to the array.
	$scope.adminLoader=false;
	$scope.user_login_log_listing = {"database_name" : $rootScope.data_base_name, "webservice_case" : "client_application_user_log_listing"};
	// Call API to get admin/staff/callcenter user logs listing listing.
	$scope.adminLoader =true;
	API.common_api($scope.user_login_log_listing,'client/log').success(function(data)
	{
		$scope.user_log_details = data.response_data;
		$scope.adminLoader =false;
		// Sorting variables
		$scope.sort_table = 'created_on';
		$scope.reverse = true;
	
	});
	
	// Pagination for the grid.
	$scope.selected_page_pagination = '25';
	$scope.page_per_pagination = [
									{name:'5', value: '5'}, 
									{name:'10', value: '10'}, 
									{name:'25', value: '25'}, 
									{name:'50', value: '50'}, 
									{name:'100', value: '100'}					
								 ];
	// Sorting table
	$scope.sortAdminLoginLogTableBy = function (keyname)
	{	
		$scope.sortKey = keyname; //set the sortKey to the param passed
		$scope.reverse = !$scope.reverse; //if true make it false and vice versa
		$scope.sort_table = keyname
	}
})

// driver_log controller for car listing of log of driver
.controller('driver_log',function($scope,$http,$rootScope,$location,API,$http,$window,$timeout,$upload,$cookieStore,$timeout,$sessionStorage)
{	
	// Check login status.
	if (localStorage.getItem('loginStatus') != 1 ||  $sessionStorage.loginStatus == 0 || $sessionStorage.userId == 0)
	{
		$location.path('/login');
	}
	// Get the URL of the page.
	var page_url = $window.location.href;
	// Get the database name of the client from the URL of the page.
	var url_path = page_url.split('/');
	$rootScope.data_base_name =	url_path[4];
	// Add the database name to the array.
	$scope.adminLoader=false;
	
	$scope.driver_login_log_listing = {"database_name" : $rootScope.data_base_name, "webservice_case" : "client_application_driver_log_listing"};
	
	// Call API to get admin user logs listing listing.
	$scope.adminLoader =true;
	API.common_api($scope.driver_login_log_listing,'client/log').success(function(data)
	{
		$scope.driver_log_details = data.response_data;
		$scope.adminLoader =false;
		$scope.sort_table='driver_id.driver_id';
		$scope.reverse = true;
	});
	// Pagination for the grid.
	$scope.selected_page_pagination = '25';
	$scope.page_per_pagination = [
									{name:'5', value: '5'}, 
									{name:'10', value: '10'}, 
									{name:'25', value: '25'}, 
									{name:'50', value: '50'}, 
									{name:'100', value: '100'}					
								 ];
	// Sorting table
	$scope.sortDriverLoginLogTableBy = function (keyname)
	{	
		$scope.sortKey = keyname; //set the sortKey to the param passed
		$scope.reverse = !$scope.reverse; //if true make it false and vice versa
		$scope.sort_table = keyname
	}
})
// customer_log controller for  listing of log of customer
.controller('customer_log',function($scope,$http,$rootScope,$location,API,$http,$window,$timeout,$upload,$cookieStore,$timeout,$sessionStorage)
{
	// Check login status.
	if (localStorage.getItem('loginStatus') != 1 ||  $sessionStorage.loginStatus == 0 || $sessionStorage.userId == 0)
	{
		$location.path('/login');
	}
	// Get the URL of the page.
	var page_url = $window.location.href;
	// Get the database name of the client from the URL of the page.
	var url_path = page_url.split('/');
	$rootScope.data_base_name =	url_path[4];
	// Add the database name to the array.
	$scope.adminLoader=false;
	$scope.customer_login_log_listing = {"database_name" : $rootScope.data_base_name, "webservice_case" : "client_application_customer_log_listing"};
	
	// Call API to get admin user logs listing listing.
	$scope.adminLoader =true;
	API.common_api($scope.customer_login_log_listing,'client/log').success(function(data)
	{
		$scope.customer_log_details = data.response_data;
		$scope.adminLoader =false;
		// Below variable use for soting purpose
		$scope.sort_table = 'created_on';
		$scope.reverse = true;
	});
	// Pagination for the grid.
	$scope.selected_page_pagination = '25';
	$scope.page_per_pagination = [
									{name:'5', value: '5'}, 
									{name:'10', value: '10'}, 
									{name:'25', value: '25'}, 
									{name:'50', value: '50'}, 
									{name:'100', value: '100'}					
								 ];
	// Sorting table							 
	$scope.sortCustomerLoginLogTableBy = function (keyname)
	{	
		$scope.sortKey = keyname; //set the sortKey to the param passed
		$scope.reverse = !$scope.reverse; //if true make it false and vice versa
		$scope.sort_table = keyname
	}
})

// user_edit_log controller for  listing of log of user edit
.controller('user_edit_log',function($scope,$http,$rootScope,$location,API,$http,$window,$timeout,$upload,$cookieStore,$timeout,$sessionStorage)
{
	// Check login status.
	if (localStorage.getItem('loginStatus') != 1 ||  $sessionStorage.loginStatus == 0 || $sessionStorage.userId == 0)
	{
		$location.path('/login');
	}
	// Get the URL of the page.
	var page_url = $window.location.href;
	// Get the database name of the client from the URL of the page.
	var url_path = page_url.split('/');
	$rootScope.data_base_name =	url_path[4];
	// Add the database name to the array.
	$scope.adminLoader=false;
	$scope.user_update_log_listing = {"database_name" : $rootScope.data_base_name, "webservice_case" : "client_application_user_update_log_listing"};
	
	// Call API to get admin user logs listing listing.
	$scope.adminLoader =true;
	API.common_api($scope.user_update_log_listing,'client/log').success(function(data)
	{
		$scope.user_update_details = data.response_data;
		$scope.adminLoader =false;
		$scope.sort_table = 'created_on';
		$scope.reverse = true;
	
	});

	// Pagination for the grid.
	$scope.selected_page_pagination = '25';
	$scope.page_per_pagination = [
									{name:'5', value: '5'}, 
									{name:'10', value: '10'}, 
									{name:'25', value: '25'}, 
									{name:'50', value: '50'}, 
									{name:'100', value: '100'}					
								 ];
	// Sorting table							 
	$scope.sortUserLogTableBy = function (keyname)
	{	
		$scope.sortKey = keyname; //set the sortKey to the param passed
		$scope.reverse = !$scope.reverse; //if true make it false and vice versa
		$scope.sort_table = keyname
	}
})
// booking_log controller for  listing of log of booking edit
.controller('booking_log',function($scope,$http,$rootScope,$location,API,$http,$window,$timeout,$upload,$cookieStore,$timeout,$sessionStorage)
{
	// Check login status.
	if (localStorage.getItem('loginStatus') != 1 ||  $sessionStorage.loginStatus == 0 || $sessionStorage.userId == 0)
	{
		$location.path('/login');
	}
	// Get the URL of the page.
	var page_url = $window.location.href;
	// Get the database name of the client from the URL of the page.
	var url_path = page_url.split('/');
	$rootScope.data_base_name =	url_path[4];
	// Add the database name to the array.
	$scope.adminLoader=false;
	$scope.booking_update_log_listing = {"database_name" : $rootScope.data_base_name, "webservice_case" : "client_application_booking_update_log_listing"};
	
	// Call API to get admin user logs listing listing.
	$scope.adminLoader =true;
	API.common_api($scope.booking_update_log_listing,'client/log').success(function(data)
	{
		$scope.booking_update_details = data.response_data;
		$scope.adminLoader =false;
		$scope.sort_table = 'booking_id.booking_id';
		$scope.reverse = true;
	});

	// Pagination for the grid.
	$scope.selected_page_pagination = '25';
	$scope.page_per_pagination = [
									{name:'5', value: '5'}, 
									{name:'10', value: '10'}, 
									{name:'25', value: '25'}, 
									{name:'50', value: '50'}, 
									{name:'100', value: '100'}					
								 ];
	// Sorting table							 
	$scope.sortBookingLogTableBy = function (keyname)
	{	
		$scope.sortKey = keyname; //set the sortKey to the param passed
		$scope.reverse = !$scope.reverse; //if true make it false and vice versa
		$scope.sort_table = keyname
	}
})

// driver_booking_log controller for  listing of log of driver status update during booking edit
.controller('driver_booking_log',function($scope,$http,$rootScope,$location,API,$http,$window,$timeout,$upload,$cookieStore,$timeout,$sessionStorage)
{	
	// Check login status.
	if (localStorage.getItem('loginStatus') != 1 ||  $sessionStorage.loginStatus == 0 || $sessionStorage.userId == 0)
	{
		$location.path('/login');
	}
	// Get the URL of the page.
	var page_url = $window.location.href;
	// Get the database name of the client from the URL of the page.
	var url_path = page_url.split('/');
	$rootScope.data_base_name =	url_path[4];
	// Add the database name to the array.
	$scope.adminLoader=false;
	$scope.driver_booking_update_log_listing = {"database_name" : $rootScope.data_base_name, "webservice_case" : "client_application_driver_booking_update_log_listing"};
	
	// Call API to get admin user logs listing listing.
	$scope.adminLoader =true;
	API.common_api($scope.driver_booking_update_log_listing,'client/log').success(function(data)
	{
		$scope.driver_booking_update_details = data.response_data;
		$scope.adminLoader =false;
		$scope.sort_table = 'booking_id.booking_id';
		$scope.reverse = true;
	});

	// Pagination for the grid.
	$scope.selected_page_pagination = '25';
	$scope.page_per_pagination = [
									{name:'5', value: '5'}, 
									{name:'10', value: '10'}, 
									{name:'25', value: '25'}, 
									{name:'50', value: '50'}, 
									{name:'100', value: '100'}					
								 ];
	// Sorting table							 
	$scope.sortDriverBookingLogtableBy = function (keyname)
	{	
		$scope.sortKey = keyname; //set the sortKey to the param passed
		$scope.reverse = !$scope.reverse; //if true make it false and vice versa
		$scope.sort_table = keyname
	}
})