var routerApp = angular.module('routerApp', ['ngSanitize','ui.router','angular.chosen','ngFileUpload','registration_controller','login_controller','profile.controller','support_controller','car_controller','ngMdIcons','date-picker','booking.controllers','ngStorage','ngCookies','angularUtils.directives.dirPagination','ContactUs.controllers','udpCaptcha','invoice_controller','businessSettings.controller','listEditBooking.controllers','accountinModule','log_controller','statistics_module']); 
routerApp.run(function ($rootScope, $cookieStore, $location, $sessionStorage, API, $localStorage)
{   
	$rootScope.bms_loader = true;
	// Get the database name of the client from the URL of the page.
	
		 // console.log(localStorage)

	$rootScope.data_base_name = $location.absUrl().split('/')[4] || "Unknown";
	if (localStorage.getItem("bms_folder_name") != $rootScope.data_base_name)
	{	
		$sessionStorage.loginStatus  = 0;
		$location.path('/login'); 
	}	
	// Add the database name to the array.
	$rootScope.business_setting_listing =
	{
		webservice_case : 'client_application_business_setting_list',
		database_name : $rootScope.data_base_name
	};
	// Call API to get business settings name and put it in cookie and session.  
	API.getListing($rootScope.business_setting_listing).success(function (data)   
	{	
		if (data.response_code == 200)
		{
			// Put business name into session and cookie
			$sessionStorage.business_name = data.response_data[0].business_name;
			$sessionStorage.business_logo = data.response_data[0].bms_logo[0].image_path;
			$sessionStorage.bms_slogan = data.response_data[0].bms_slogan;
			$sessionStorage.bms_booking_phone_number = '+'+data.response_data[0].bms_phone.booking_phone[0].calling_code+'-'+data.response_data[0].bms_phone.booking_phone[0].number; 
			$sessionStorage.business_calling_code = data.response_data[0].bms_phone.contact_us_phone[0].calling_code;
			$sessionStorage.bms_template_number = data.response_data[0].bms_template_number;
			localStorage.setItem("business_name", data.response_data[0].business_name);
			localStorage.setItem("bms_slogan", data.response_data[0].bms_slogan);
			localStorage.setItem("business_logo", data.response_data[0].bms_logo[0].image_path);
			localStorage.setItem("bms_booking_phone_number", $sessionStorage.bms_booking_phone_number);
			//localStorage.setItem("bms_folder_name", $rootScope.business_setting_listing.database_name);
			$cookieStore.put("bms_template_number", data.response_data[0].bms_template_number);
			$cookieStore.put("business_name", data.response_data[0].business_name);
			$cookieStore.put("business_logo", data.response_data[0].bms_logo[0].image_path);
			$cookieStore.put("bms_slogan", data.response_data[0].bms_slogan);
			$cookieStore.put("bms_booking_phone_number", $sessionStorage.bms_booking_phone_number); 
			$rootScope.business_setting_details = data.response_data[0];
			var invoice_line_array = []; 
			for (i = 0; i < $rootScope.business_setting_details.invoice_line.length; i++)
			{
				invoice_line_array.push($rootScope.business_setting_details.invoice_line[i].line);
			}
			$rootScope.currency_symbol = data.response_data[0].currency.symbol;
			$rootScope.credit_card_surcharge_percentage = data.response_data[0].credit_card_surcharge_percentage;
			$rootScope.auto_complete_data = invoice_line_array; 
		}
	});
	$rootScope.country_listing = {webservice_case : 'country_listing', database_name : 'a_limokit'};
	// Call API to get country listing.
	API.getCountry($rootScope.country_listing).success(function (data)
    {  
		$rootScope.country_data	= data.response_data;
	});
	$rootScope.user_type = localStorage.getItem('userType');
	/*$rootScope.business_name = $sessionStorage.business_name;
	$rootScope.business_logo = $sessionStorage.business_logo;
	$rootScope.bms_slogan = $sessionStorage.bms_slogan;*/
	$rootScope.business_calling_code = $sessionStorage.business_calling_code;
	$rootScope.contact_type = localStorage.getItem("customer_contact_type");
	if($rootScope.contact_type == "billing")
	{	 
		// Set the tab initial array
		$rootScope.tabs = [{
							id:1,
							title:'Unpaid Invoice',
							content:'../repo/templates/unpaid_invoice.html'
						}];
	}
	else
	{
		if ($rootScope.contact_type == '' || $rootScope.contact_type != "billing")   
		{
			// Set the tab initial array
			$rootScope.tabs = [{
								id:1,
								title:'Booking Table View',
								content:'../repo/templates/booking_list_table_view.html'
							}];
		}
	}
	var page_url = $location.url(); 
	if (page_url == '' || page_url == '/bms-home' || page_url == '/add_booking' || page_url == '/booking_list' || page_url == '/customer_list' || page_url == '/driver_list' || page_url == '/admin_user' || page_url == '/staff_list' || page_url == '/agent_list' || page_url == '/partner_list' || page_url == '/car_list' || page_url == '/extra_list' || page_url == '/point_of_interest' || page_url == '/business_setting' || page_url == '/create_invoice' || page_url == '/unpaid_invoice' || page_url == '/paid_invoice' || page_url == '/manage-contact-profile' || page_url == '/manage-driver-profile' || page_url == '/templates')
	{	
		// Check login status
		if( localStorage.getItem('loginStatus') != 1 || !$sessionStorage.loginStatus || $sessionStorage.loginStatus == 0)
    	{	
			$location.path('/login');
    	}
	}
	$rootScope.bms_loader = false;
})
routerApp.config(function ($stateProvider, $urlRouterProvider, $compileProvider, $httpProvider)
{
    $compileProvider.debugInfoEnabled(false);
	$httpProvider.useApplyAsync(true);
	$urlRouterProvider.otherwise('/booking_list');
    $stateProvider
       /* Login page load when dafault page load */   
		.state('login', {
            url						: '/login',
            templateUrl				: '../repo/templates/login.html',
			controller				: 'login'
        })
		 /* Customer listing,add,edit all are load here */ 
        .state('customer', {
            url						: '/customer',
            templateUrl				: '../repo/templates/customer.html',
			controller				: 'registration'
        })
		 /* Login page load when dafault page load */
        .state('admins', {
            url						: '/admin_user',
            templateUrl				: '../repo/templates/admin_user.html',
			controller				: 'admin'
        })
		 /* Forgetpassword page load here */  
		.state('forget_password', {
            url						: '/forget_password',
            templateUrl				: '../repo/templates/forget_password.html',
			controller				: 'login'
        })
		 /* Login page load when dafault page load */   
		.state('reset_password_with_verification_code', {
            url						: '/reset_password_with_verification_code',
            templateUrl				: '../repo/templates/reset_password_with_verification_code.html',
			controller				: 'login'
        })
		 /* Bms home page load after successfully login */   
		.state('bms-home', {
            url						: '/bms-home',
            templateUrl				: '../repo/templates/bms_home.html'
        })
		/* Add booking page */   
		.state('add-booking', {
            url						: '/add_booking',
            templateUrl				: '../repo/templates/booking.html',
			controller				: 'BookingController'
        })
       /* Booking list */   
		.state('booking-list', {
            url						: '/booking_list',
            templateUrl				: '../repo/templates/booking_list.html',
			controller				: 'bookingListController'
        })
		/* Edit booking page */   
		.state('edit-job/:booking_id', {
            url						: '/edit-job/:booking_id',
            templateUrl				: '../repo/templates/edit_job.html',
			controller				: 'editJobController'
        })
		.state('car-list', {
            url						: '/car_list',
            templateUrl				: '../repo/templates/car_list.html',
			controller				: 'car'
        })
		/* Car extra list list,add,edit view load */   
		.state('car-extra-list', {
            url						: '/extra_list',
            templateUrl				: '../repo/templates/extra_list.html',
			controller				: 'extra'
        })
		/* Staff list,add,edit view load */   
		.state('staff-list', {
            url						: '/staff_list',
            templateUrl				: '../repo/templates/staff_list.html',
			controller				: 'admin'
        })
		/* Partner list,add,edit view load */   
		.state('partner-list', {
            url						: '/partner_list',
            templateUrl				: '../repo/templates/partner_list.html',
			controller				: 'admin'
        })
		/* Agent list,add,edit view load */   
		.state('agent-list', {
            url						: '/agent_list',
            templateUrl				: '../repo/templates/agent_list.html',
			controller				: 'admin'
        })
		/* Driver list,add,edit view load */   
		.state('driver-list', {
            url						: '/driver_list',
            templateUrl				: '../repo/templates/driver_list.html',
			controller				: 'driver'
        })
		/* Customer list,add,edit view load */   
		.state('customer-list', {
            url						: '/customer_list',
            templateUrl				: '../repo/templates/customer_list.html',
			controller				: 'customer'
        })
		/* Business Settings view load  */   
		.state('business-setting', {
            url						: '/business_setting',
            templateUrl				: '../repo/templates/business_setting.html',
			controller				: 'business_setting'
        })
		.state('point-of-interest', {
            url						: '/point_of_interest',
            templateUrl				: '../repo/templates/point_of_interest.html',
			controller				: 'point_of_interest'
        })
		.state('create_invoice', {
            url						: '/create_invoice',
            templateUrl				: '../repo/templates/create_invoice.html',
			controller				: 'invoice'
        }).state('unpaid_invoice', {
            url						: '/unpaid_invoice',
            templateUrl				: '../repo/templates/unpaid_invoice.html',
			controller				: 'unpaid_invoice'
        }).state('paid_invoice', {
            url						: '/paid_invoice',
            templateUrl				: '../repo/templates/paid_invoice.html',
			controller				: 'paid_invoice'
        }).state('manage-contact-profile', {
            url						: '/manage-contact-profile',
            templateUrl				: '../repo/templates/edit_contact_profile.html',
			controller				: 'manageProfile'
        }).state('manage-driver-profile', {
            url						: '/manage-driver-profile',
            templateUrl				: '../repo/templates/edit_driver_profile.html',
			controller				: 'manageProfile'
        })
		.state('manage-accounting', {
            url						: '/manage-accounting',
           templateUrl				: '../repo/templates/manage_accounting.html',
			controller				: 'accountingController'
        })
		.state('manage-operator-accounting', {
            url						: '/manage-operator-accounting',
           templateUrl				: '../repo/templates/manage_operator_accounting.html',
			controller				: 'accountingController'
        })
		.state('cashin-accounting', {
            url						: '/cash-in',
           templateUrl				: '../repo/templates/accounting_cashin.html',
			controller				: 'accountingController'
        })
		.state('cashout-accounting', {
            url						: '/cash-out',
           templateUrl				: '../repo/templates/accounting_cashout.html',
			controller				: 'accountingController'
        })
		.state('driver-login-log', {
            url						: '/driver_login_log',
           templateUrl				: '../repo/templates/driver_login_log.html',
			controller				: 'driver_log',
			reloadOnSearch			: false
        })
		.state('customer-login-log', {
            url						: '/customer_login_log',
           templateUrl				: '../repo/templates/customer_login_log.html',
			controller				: 'customer_log',
			reloadOnSearch			: false
        })
		.state('admin-login-log', {
            url						: '/admin_login_log',
           templateUrl				: '../repo/templates/admin_login_log.html',
			controller				: 'user_log',
			reloadOnSearch			: false
        })
		.state('user-log', {
            url						: '/user_log',
           templateUrl				: '../repo/templates/user_log.html',
			controller				: 'user_edit_log',
			reloadOnSearch			: false
        })
		.state('booking-log', {
            url						: '/booking_log',
           templateUrl				: '../repo/templates/booking_log.html',
			controller				: 'booking_log',
			reloadOnSearch			: false
        })
		.state('driver-booking-log', {
            url						: '/driver_booking_log',
           templateUrl				: '../repo/templates/driver_booking_log.html',
			controller				: 'driver_booking_log',
			reloadOnSearch			: false
        })
		.state('templates', {
            url						: '/templates',
           templateUrl				: '../repo/templates/css_templates.html',
			controller				: 'css_templates'
        })
		.state('calendar', {
            url						: '/calendar',
            templateUrl				: '../repo/templates/calendar.html',
			controller				: 'calendar'
        })
		.state('uninvoice_job', {
            url						: '/uninvoice_job',
            templateUrl				: '../repo/templates/uninvoice_job.html',
			controller				: 'uninvoice_job'
        })
		.state('invoiced_job', {
            url						: '/invoiced_job',
            templateUrl				: '../repo/templates/invoiced_job.html',
			controller				: 'invoiced_job'
        })
		.state('collect_cc_invoice', {
            url						: '/collect_cc_invoice',
            templateUrl				: '../repo/templates/collect_cc_invoice.html',
			controller				: 'collect_cc_invoice'
        })
		//Customer wise statistic
		.state('customer_wise_statistics', {
            url: '/customer_wise_statistics',
			title: 'Customer - Jobs',
            templateUrl: '../repo/templates/customer_wise_statistics.html',
			controller: 'statisticsController'
        })
		//Month wise statistic
		.state('month_wise_statistics', {
            url: '/month_wise_statistics',
			title: 'Month wise - Jobs',
            templateUrl: '../repo/templates/month_wise_statistics.html',
			controller: 'statisticsController'
        })
		//Job type wise statistic
		.state('job_type_wise_statistics', {
            url: '/job_type_wise_statistics',
			title: 'Job Type',
            templateUrl: '../repo/templates/job_type_wise_statistics.html',
			controller: 'statisticsController'
        })
		
	'$parseProvider', function ($parseProvider)
	{
		return $parseProvider.unwrapPromises(true);
	}
})
// this directive will help to load html contain from server
routerApp.filter("sanitize", ['$sce', function($sce) {
  return function(htmlCode){
    return $sce.trustAsHtml(htmlCode);
  }
}])
// this directive will help to create dynamik drop down number
routerApp.filter('range', function() {
  return function(input, start, end) {    
    start = parseInt(start);
    end = parseInt(end);
    var direction = (start <= end) ? 1 : -1;
    while (start != end) {
        input.push(start+1+" Days");
        start += direction;
    }
    return input;
  };
});