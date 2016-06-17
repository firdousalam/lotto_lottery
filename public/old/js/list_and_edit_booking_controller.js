angular.module('listEditBooking.controllers', ['google.places','ui.bootstrap','720kb.tooltips','date-picker','ngMessages', 'limo_client.services'])

.controller('bookingListController', function($scope,$rootScope,$timeout,$http,API,$location,$localStorage, $window, $sessionStorage, $stateParams, $cookieStore, orderByFilter)
 {	
	$rootScope.business_name = localStorage.getItem('business_name');
	// Check login status.
	if(localStorage.getItem('loginStatus') != 1 ||  $sessionStorage.loginStatus == 0 || $sessionStorage.userId == 0 )
	{
		$location.path('/login');
	}
	// By default the check all for bulk allot job checkbox is true(Show)
	$scope.check_all_checkbox_for_bulk_job = false;
	// Get user details  from sessionStorage.
	$rootScope.contact_type = $sessionStorage.contact_type;   
	if (!$rootScope.contact_type)
	{	
		$rootScope.contact_type 	= localStorage.getItem("customer_contact_type");
	}
	$scope.admin_type_session_value = $sessionStorage.userType;
	 if(typeof $scope.admin_type_session_value=='undefined' || $scope.admin_type_session_value=='')
	 {
		$scope.admin_type_session_value = localStorage.getItem("userType");
	 }
	 // Check the login user type. If the contact type not admin then the bulk check all checkbox not show
	 if($scope.admin_type_session_value!='Admin')
	 {
		 $scope.check_all_checkbox_for_bulk_job = true;
	 }
	$rootScope.customer_id 					= $sessionStorage.customer_id;
	$scope.currency_symbol					= $rootScope.currency_symbol;
	var page_url 							= $window.location.href;
	var url_path 							= page_url.split('/');
	$rootScope.data_base_name 				= url_path[4];
	$scope.loder_image 						= false;
	$scope.edit_click 						= 0;
	$scope.previous_content_present 		= 0;
	// Create date objects.
	$scope.today 							= new Date();
	$scope.dt_from 							= new Date();
	$scope.dt_to 							= new Date();
	$scope.date_from 						= new Date();
	$scope.date_to 							= new Date();
	// Controll all the tabs
	$scope.counter 							= 1;
	$scope.booking_table_list 				= {};
	$scope.booking_table_list.view_type  	= 'daily';
	$scope.myhtml 							= [];
	$rootScope.templates 					= [];
	var serial_number 						= 0;
	var page_content 						= [];
	$scope.currency_symbol					= $rootScope.currency_symbol; // Get the currency symbol 
	$scope.test_tab1 						= true;
	
	// Add mutiple tab with new page content using this  addTab() function 
	$scope.addTab = function(page_title,page_name,booking_id)
	{ 
		$scope.counter 				= 1; 
		$sessionStorage.job_id 		= booking_id;
		$scope.counter++;
		$scope.tab_close_class 		= "glyphicon-remove";
		$rootScope.tabs.push({id:$scope.counter,title:page_title,content:page_name,tab_close_class:$scope.tab_close_class,"active": true});
		$rootScope.selected 		= $rootScope.tabs.length - 1; //Set the newly added tab active.
		$rootScope.select_tab 		= $rootScope.tabs.length - 1;
		
	}
	/* Delete a tab  using this deleteTab() function
		index : is the selected tax index 
	*/
	$scope.deleteTab = function(index)
	{
		$rootScope.tabs.splice(index,1);  //remove the object from the array based on index
		$rootScope.selectedTab = index-1;
	}
	$rootScope.selectedTab = 0; //set selected tab to the 1st by default.
	/* Select the tab  using this selectTab() function
		index : is the selected tax index 
	*/
	$scope.selectTab = function(index, content)
	{	
		$rootScope.selectedTab = index;
	}
	/*  Using getTableViewListing() function show the booking details data as a table view
		date_from 	: From  which date show the booking details
		to_date 	: To date 	
		
	*/
	$scope.getTableViewListing = function(date_from, date_to)
	{
		$scope.tab_res2 						= false;
		$scope.loading 							= true;
		$scope.booking_list 					= {};
		$scope.booking_list.database_name 		= $rootScope.data_base_name;
		$scope.booking_list.webservice_case 	= 'client_application_job_wise_booking_list'; //'client_application_booking_list_all';
		// If user type is admin then pass below parameters to getListing() function
		if( localStorage.getItem('userType') == "Admin" )
		{
			$scope.booking_list.user_type = 'admin';
		}
		// If user type is customer then pass below parameters to getListing() function
		else if( localStorage.getItem('userType') == "Customer" )
		{
			if( localStorage.getItem('customer_contact_type') == 'all' )
			{
				$scope.booking_list.user_type 			= 'all';
				$scope.booking_list.customer_id 		= localStorage.getItem('customer_id');
			}
			if( localStorage.getItem('customer_contact_type') == 'booking' )
			{
				$scope.booking_list.user_type 			= 'booking';
				$scope.booking_list.customer_id 		= localStorage.getItem('customer_id');
			}
			if( localStorage.getItem('customer_contact_type') == 'pax' )
			{
				$scope.booking_list.user_type 			= 'pax';
				$scope.booking_list.contact_id 			= localStorage.getItem('user_id');
			}
		}
		// If user type is driver then pass below parameters to getListing() function
		else if( localStorage.getItem('userType') == 'Driver' )
		{
			$scope.booking_list.user_type = 'driver';
			$scope.booking_list.driver_id = localStorage.getItem('user_id'); 
		}
		else
		{}
		$scope.booking_list.date_from 	= date_from;
		$scope.booking_list.date_to 	= date_to;
		// API.getListing() function use to get booking list.
		API.getListing($scope.booking_list).success(function (data)
		{
			$scope.loading = false;
			if( data.response_code == 200 )
			{
				$scope.booking_list_data = data.response_data;
				// Sort table by date and time
				$scope.sort_table 	= ['jobs.job_date_for_display','jobs.pickup_date_time.pickup_time'];
				$scope.reverse 		= false;
				$scope.tab_res2 	= true;
			}
		})
	}
	$scope.tab = 1;
	$scope.setTab = function(newTab)
	{
		$scope.tab = newTab;
		// If tab is grid.
		if( $scope.tab == 1 )
		{
			$scope.getGridViewListing($scope.grid_from, $scope.grid_to);
		}
		// If tab is table. 
		if( $scope.tab == 2 )
		{
			$scope.booking_table_list 				= {};
			$scope.booking_table_list.view_type  	= 'daily';
			$scope.listDataFilter('daily','');
		}
	};
	$scope.isSet = function(tabNum)
	{
		return $scope.tab === tabNum;
	};
	// Table view listing filters.
	$scope.listDataFilter = function(view_type, prev_next, dt, dt1)
	{
		if( !view_type )
		{
			$scope.view_type = 'daily';
		}
		else
		{
			$scope.view_type = view_type;
		}
		if( view_type == 'daily' )
		{
			if( prev_next == 'next' )
			{
				from = dt.split("-");
				from = from[1]+'/'+from[0]+'/'+from[2];
				$scope.daily_view_start_date = new Date(from);
				$scope.daily_view_start_date = new Date($scope.daily_view_start_date.setDate($scope.daily_view_start_date.getDate() + 1));
				
			}
			else if( prev_next == 'previous' )
			{
				from = dt.split("-");
				from = from[1]+'/'+from[0]+'/'+from[2];
				$scope.daily_view_start_date = new Date(from);
				$scope.daily_view_start_date = new Date($scope.daily_view_start_date.setDate($scope.daily_view_start_date.getDate() - 1));
			}
			else
			{
				$scope.daily_view_start_date = new Date();
			}
			$scope.daily_view_month 		= new Date($scope.daily_view_start_date).getMonth()+1;  
			$scope.daily_view_day 			= new Date($scope.daily_view_start_date).getDate();
			if( $scope.daily_view_month < 10 )
			{
				$scope.daily_view_month = '0'+($scope.daily_view_month);
			}
			if( $scope.daily_view_day < 10 )
			{
				$scope.daily_view_day = '0'+$scope.daily_view_day;
			}	
			$scope.daily_view_year 			= new Date($scope.daily_view_start_date).getFullYear();
			$scope.daily_view_start_date 	= $scope.daily_view_month+'-'+$scope.daily_view_day+'-'+$scope.daily_view_year;
			$scope.display_header_date1 	= $scope.daily_view_day+'-'+$scope.daily_view_month+'-'+$scope.daily_view_year;
			$scope.display_header_date2		 = '';
			$scope.getTableViewListing($scope.daily_view_start_date,$scope.daily_view_start_date);
		}
		if( view_type == 'weekly' || view_type == 'range' )
		{
			if( prev_next == 'next' )
			{
				dtt = dt.split("-");
				dtt = dtt[1]+'/'+dtt[0]+'/'+dtt[2];
				dtt = new Date(dtt);
				$scope.weekly_view_start_date = dtt;
				$scope.weekly_view_end_date = dtt;
				// Format dates -- date from
				$scope.weekly_view_start_date = $scope.weekly_view_start_date.setDate(dtt.getDate() + 1);
				// Format dates -- date to
				$scope.weekly_view_end_date = $scope.weekly_view_end_date.setDate($scope.weekly_view_end_date.getDate() + 6);
			}	
			else if( prev_next == 'previous' )
			{
				dtt = dt.split("-");
				dtt = dtt[1]+'/'+dtt[0]+'/'+dtt[2]; 
				dtt = new Date(dtt);
				$scope.weekly_view_start_date = dtt;
				$scope.weekly_view_end_date = dtt;
				// Format dates -- date from
				$scope.weekly_view_start_date = $scope.weekly_view_start_date.setDate(dtt.getDate() - 7);	
				// Format dates -- date to
				$scope.weekly_view_end_date = $scope.weekly_view_end_date.setDate(new Date($scope.weekly_view_start_date).getDate() + 6);
			}
			else if( prev_next == 'default' )
			{
				$scope.weekly_view_start_date = dt;
				$scope.weekly_view_end_date = dt1;
			}
			else
			{
				$scope.weekly_view_start_date 	= new Date();
				$scope.weekly_view_end_date 	= new Date();
				$scope.weekly_view_end_date 	= new Date($scope.weekly_view_end_date.setDate($scope.weekly_view_end_date.getDate() + 6));	
			}
			$scope.weekly_view_start_year 		= new Date($scope.weekly_view_start_date).getFullYear();
			$scope.weekly_view_end_year 		= new Date($scope.weekly_view_end_date).getFullYear();
			$scope.weekly_view_start_month 		= new Date($scope.weekly_view_start_date).getMonth()+1;
			$scope.weekly_view_start_day 		= new Date($scope.weekly_view_start_date).getDate();
			if( new Date($scope.weekly_view_start_date).getMonth()+1 < 10 )
			{
				$scope.weekly_view_start_month = '0'+(new Date($scope.weekly_view_start_date).getMonth()+1);
			}
			if( new Date($scope.weekly_view_start_date).getDate() < 10 )
			{
				$scope.weekly_view_start_day = '0'+new Date($scope.weekly_view_start_date).getDate();
			}
			$scope.weekly_view_end_month = new Date($scope.weekly_view_end_date).getMonth()+1;
			$scope.weekly_view_end_day = new Date($scope.weekly_view_end_date).getDate();
			if( new Date($scope.weekly_view_end_date).getMonth()+1 < 10 )
			{
				$scope.weekly_view_end_month = '0'+(new Date($scope.weekly_view_end_date).getMonth()+1);
			}
			if( new Date($scope.weekly_view_end_date).getDate() < 10 )
			{
				$scope.weekly_view_end_day = '0'+new Date($scope.weekly_view_end_date).getDate();
			}
			// Create dates.
			$scope.weekly_view_start_date 	= $scope.weekly_view_start_month+'-'+$scope.weekly_view_start_day+'-'+$scope.weekly_view_start_year;
			$scope.weekly_view_end_date 	= $scope.weekly_view_end_month+'-'+$scope.weekly_view_end_day+'-'+$scope.weekly_view_end_year;
			$scope.display_header_date1 	= $scope.weekly_view_start_day+'-'+$scope.weekly_view_start_month+'-'+$scope.weekly_view_start_year;
			$scope.display_header_date2 	= $scope.weekly_view_end_day+'-'+$scope.weekly_view_end_month+'-'+$scope.weekly_view_end_year;
			$scope.getTableViewListing($scope.weekly_view_start_date,$scope.weekly_view_end_date);
		}
	}
	// Generate PDFwith booking details
	$scope.booking_pdf_data_modal = false;
	$scope.openGenerateBookingPDFData = function()
	{
		$scope.booking_pdf_data_modal = true; 
	}
	// Export CSV data with booking details
	$scope.generateBookingCSVData = function()
	{
		$scope.booking_list_data_csv = orderByFilter($scope.booking_list_data, $scope.sort_table, $scope.reverse);
		var data = [];
		var driver_name,job_status,driver_status,pick_flight,drop_flight,extras,fare,from_label,from_line_1,from_line_2,from_suburb,from_city,to_label,to_line_1,to_line_2,to_suburb,to_city;
		data.push(["Job Id","Job Status","Driver Status","Driver","Job Time","Vehicle","Pax Name","Flight No.","Pickup","Destination","Pax#","Lug#","Extras","Ext Notes","Int Notes","Booking By","Booking Method","Account Name","Fare"]);
		for(i=0;i<$scope.booking_list_data_csv.length;i++)
		{
			extras = "";
			try
			{
				driver_name = $scope.booking_list_data_csv[i].jobs.driver[0].driver_id.title+" "+$