var app = angular.module('login_controller', ['ngStorage','ngAnimate', 'ngCookies']);
// Login controller for user, includes login and logout functions.
app.controller('login', function ($scope, $http, $rootScope, $location, API, $window, $localStorage, $sessionStorage, $cookieStore)
{	
	$rootScope.user_type = $cookieStore.get('userType'); 
	if (!$rootScope.user_type)
	{
		$rootScope.user_type = localStorage.getItem("userType");
	} 
	$rootScope.contact_type = $sessionStorage.contact_type;   
	if (!$rootScope.contact_type)
	{	
		$rootScope.contact_type = localStorage.getItem("customer_contact_type");
	}
	// Set business setting data to header.html
	$rootScope.business_name = $sessionStorage.business_name; 
	$rootScope.business_logo = $sessionStorage.business_logo;
	$rootScope.bms_slogan = $sessionStorage.bms_slogan;
	$rootScope.bms_booking_phone_number = $sessionStorage.bms_booking_phone_number;
	$rootScope.bms_template_number = $sessionStorage.bms_template_number;
	// Set user profile data to header
	$rootScope.user_name = $sessionStorage.user_name;
//	$rootScope.user_phone_number = $sessionStorage.user_phone_number;
	$rootScope.user_profile_image = $sessionStorage.user_profile_image;
	// Set contact type to header
	//$rootScope.contact_type = $sessionStorage.contact_type;  
	$scope.password_reset_form = true;
	// Server error msg for forget password form
	$scope.email_error_get_from_server = true;
	$scope.password_reset_code_get_from_server = true;
    // Define two json for reset password form
    // Get the  current page url
    var page_url = $location.url();
	// Get the URL of the page.
    var page_url = $window.location.href;
    // Get the database name of the client from the URL of the page.
    var url_path = page_url.split('/');
    $rootScope.database_name = url_path[4];
    // Define json for forget password and reset password.
    $scope.forget_password = {   
								'webservice_case': "client_application_customer_forget_password",
								'database_name': $rootScope.database_name,
								'required_fields': [{'name': "email"}]
							 }
    $scope.user = {};
    $scope.reset_passwd = {
							'webservice_case': "client_application_customer_reset_password_using_reset_code",
							'database_name'	: $rootScope.database_name,
							'required_fields': [{'name': "reset_code"}, {'name': "password"}, {'name': 'password_verify'}]
						  }
    // Initialize array for inserting login credentials.
    $scope.login_form_for_user = {};
    // Show the user type, email, password in the login form, if user click stay signin
    if (localStorage.getItem("check_stay_signin_status"))
    {
		// Set user credentials to login form if user click stay signin
    	$scope.login_form_for_user.email = localStorage.getItem('email_id');
    	$scope.login_form_for_user.password = localStorage.getItem('user_password');
    	$scope.login_form_for_user.user_type = localStorage.getItem('user_type');
    }
    // Check if the user had checked on stay signed in option.
    if (localStorage.getItem('admin_login_status_stay_signin') == 1 && localStorage.getItem("business_folder_name") == $rootScope.database_name)
    {	
    	// If yes, get the user id from cookie and store it in session storage.
    	$sessionStorage.userId = localStorage.getItem("user_id");
		// Get business data form cookie
		$rootScope.business_name = localStorage.getItem('business_name');  
		$rootScope.business_logo = localStorage.getItem('business_logo');
		$rootScope.bms_slogan = localStorage.getItem('bms_slogan');
		$rootScope.bms_booking_phone_number = localStorage.getItem('bms_booking_phone_number');
		$rootScope.bms_template_number =  $cookieStore.get("bms_template_number");		
		// Get user data form cookie 
		$rootScope.user_name =  $cookieStore.get("user_name");
		if (!$rootScope.user_name)
		{
			$rootScope.user_name = localStorage.getItem("user_name");
		}
		$rootScope.user_profile_image = $cookieStore.get("user_profile_image");
		if (!$rootScope.user_profile_image)
		{
			$rootScope.user_profile_image = localStorage.getItem("user_profile_image");
		}
		// Contact type set from here if user check stay login
		if (!$rootScope.contact_type)
		{	
			$rootScope.contact_type = localStorage.getItem("customer_contact_type"); 
		}
    	$sessionStorage.loginStatus = 1;
    	$rootScope.loginstatus = true; 
    	// Redirect user if check already logged in.
    	if ($sessionStorage.loginStatus == 1 && localStorage.getItem("loginStatus") == 1 && $location.url() == '/login')
    	{	
		//	if (localStorage.getItem("business_folder_name") == $rootScope.database_name)
		//	{	
				// Redirect page
				$location.path('/booking_list');   
				return;
		//	}
			
    	}
    }
	// console.log($window.localStorage.getItem('loginStatus'));
	// User login function
	$scope.generalLogin = function ()
    {	
        // Login form validations and set error messages accordingly.
        if (!$scope.login_form_for_user.user_type)
        {
            $scope.loginForm.user_type.$dirty = true;
            return false;
        }
        else
        {
            $scope.loginForm.user_type.$dirty = false;
        }
        if (!$scope.login_form_for_user.email)
        {
            $scope.loginForm.email.$dirty = true;
            return false;
        }
        else
        {
            $scope.loginForm.email.$dirty = false;
        }
        if (!$scope.login_form_for_user.password)
        {
            $scope.loginForm.password.$dirty = true;
            return false;
        }
        else
        {
            $scope.loginForm.password.$dirty = false;
        }
		// Stear html loader
		$scope.login_loader = true; 
        // Checks user types and insert webservice case into the login credential array - $scope.login_form_for_user.
        if ($scope.login_form_for_user.user_type == 'Driver')
        {
            $scope.login_form_for_user.webservice_case = 'client_application_driver_login';
        }
        if ($scope.login_form_for_user.user_type == 'Customer')
        {
            $scope.login_form_for_user.webservice_case = 'client_application_customer_login';
        }
        if ($scope.login_form_for_user.user_type == 'Partner')
        {
            $scope.login_form_for_user.webservice_case = 'bms_application_common_login';
        }
        if ($scope.login_form_for_user.user_type == 'Admin')
        {
            $scope.login_form_for_user.webservice_case = 'client_application_admin_login';
        }
		// Insert database name into the login credential array - $scope.login_form_for_user.
        $scope.login_form_for_user.database_name = $rootScope.database_name;
		// Check login status
		/*$scope.login_status=localStorage.getItem("loginStatus");
		 console.log($window.localStorage.getItem('loginStatus'));
		// return false;
		if($scope.login_status=='1' && $scope.login_form_for_user.database_name!=localStorage.getItem("bms_folder_name"))
		{
			$scope.errors = [];
            $scope.error_message = "You are already our system as another customer please logout and re login.";
			return false;
		}*/
		//return false;
        
		// Add the required fields to the login_form_for_user array.
        $scope.login_form_for_user.required_fields = [{'name': 'user_type'}, {'name': 'email'}, {'name': 'password'}];
        // Call the API for user login.
        API.common_api($scope.login_form_for_user, 'login').success(function (data)
        {	
			// Stop html loader
			$scope.login_loader = false; 
            // Check if the user is able to login successfuly. 
            if ( data.response_code == '200' )
            {	 
				if (data.response_data[0].contact_type)
				{
					// Put contact type into session and cookie
					$sessionStorage.contact_type = data.response_data[0].contact_type;
					$sessionStorage.customer_id = data.response_data[0].customer_id;
					$cookieStore.put("customer_contact_type", data.response_data[0].contact_type);
					localStorage.setItem("customer_contact_type",data.response_data[0].contact_type);
					$cookieStore.put("contact_id", data.response_data[0]._id);
					localStorage.setItem("contact_id",data.response_data[0]._id);
					$sessionStorage.contact_id = data.response_data[0]._id;
					$cookieStore.put("customer_id", data.response_data[0].customer_id);
					localStorage.setItem("customer_id",data.response_data[0].customer_id);
				}
				else
				{
					$sessionStorage.contact_type = '';
					$cookieStore.put("customer_contact_type", "");
					$cookieStore.put("contact_id", '');
					$cookieStore.put("customer_id", '');
				}
                // If yes, store user data in session and cookie storage.
				$sessionStorage.userId = data.response_data[0]._id;
				$sessionStorage.loginStatus= 1;
				$sessionStorage.userType   = $scope.login_form_for_user.user_type;
				$rootScope.loginstatus     = true;
				$cookieStore.put("userType", $scope.login_form_for_user.user_type);
				$cookieStore.put("user_id", data.response_data[0]._id);
				$cookieStore.put("loginStatus", 1);
				localStorage.setItem("userType",$scope.login_form_for_user.user_type);
				localStorage.setItem("user_id",data.response_data[0]._id);
				localStorage.setItem("loginStatus",1);
				if(!data.response_data[0].last_name || data.response_data[0].last_name =='')
				{
					data.response_data[0].last_name = '';
				}
				$sessionStorage.user_name = data.response_data[0].title + ' ' + data.response_data[0].first_name + ' ' + data.response_data[0].last_name;
				$cookieStore.put("user_name", $sessionStorage.user_name);
				localStorage.setItem("user_name",$sessionStorage.user_name);
				if (typeof data.response_data[0].phone != 'undefined' && data.response_data[0].phone.length)
				{
					$sessionStorage.user_phone_number = '+' + data.response_data[0].phone[0].calling_code + '-' + data.response_data[0].phone[0].number;
					$cookieStore.put("user_phone_number", $sessionStorage.user_phone_number);
					localStorage.setItem("user_phone_number",$sessionStorage.user_phone_number);
				}
				else
				{
					$sessionStorage.user_phone_number = '';
					$cookieStore.put("user_phone_number", "");
				}
				if (typeof data.response_data[0].image != 'undefined' && data.response_data[0].image.length)
				{
					$sessionStorage.user_profile_image = data.response_data[0].image[0].image_path;
					$cookieStore.put("user_profile_image", $sessionStorage.user_profile_image);
					localStorage.setItem("user_profile_image",$sessionStorage.user_profile_image);
				}
				else
				{
					$sessionStorage.user_profile_image = '';
					$cookieStore.put("user_profile_image", "");
				}
				if ( $scope.login_form_for_user.stay_signin == true )
                {
					$cookieStore.put("check_stay_signin_status", 1);
					localStorage.setItem("check_stay_signin_status",1);
					$cookieStore.put("user_type", $scope.login_form_for_user.user_type);
					localStorage.setItem("user_type",$scope.login_form_for_user.user_type);
                    // Set cookies with user data.
                    $cookieStore.put("email_id", $scope.login_form_for_user.email);
					localStorage.setItem("email_id",$scope.login_form_for_user.email);
                    $cookieStore.put("user_password", $scope.login_form_for_user.password);
					localStorage.setItem("user_password",$scope.login_form_for_user.password);
                    $cookieStore.put("user_id", data.response_data[0]._id);
					localStorage.setItem("user_id",data.response_data[0]._id);
					$cookieStore.put("userType", $scope.login_form_for_user.user_type);
					localStorage.setItem("userType",$scope.login_form_for_user.user_type);
					$cookieStore.put("admin_login_status_stay_signin", 1); 
					localStorage.setItem("admin_login_status_stay_signin",1);
					localStorage.setItem("business_folder_name",$location.absUrl().split('/')[4]);
				}
                if ( $scope.login_form_for_user.user_type == 'Admin' )
                {
					$rootScope.tabs = [{
											id:1,
											title:'Booking Table View',
											content:'../repo/templates/booking_list_table_view.html'
										}];
                    $location.path('/booking_list');
                    $rootScope.loginstatus = false;
                }
				else if ( $scope.login_form_for_user.user_type == 'Driver' )
                {
					$cookieStore.put("driver_id", data.response_data[0].driver_id);
					localStorage.setItem("driver_id", data.response_data[0].driver_id);
					$rootScope.tabs = [{
											id:1,
											title:'Booking Table View',
											content:'../repo/templates/booking_list_table_view.html'
										}];
                    $location.path('/booking_list');
                    $rootScope.loginstatus = false;
                }
                else if ( $scope.login_form_for_user.user_type == 'Customer' )
                {
					
                    //$rootScope.user_menu = $sessionStorage.userType;
					// If contact type is booking
					if (data.response_data[0].contact_type == 'billing')
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
						$rootScope.tabs = [{
											id:1,
											title:'Booking Table View',
											content:'../repo/templates/booking_list_table_view.html'
										}];
					}
					$location.path('/booking_list');
				}
				else
				{}
            }
            else
            {
                // If login fails set error message.   
                $scope.errors = [];
                $scope.error_message = data.response_message;
                return false;
            }
		})
    }
    if ($sessionStorage.loginStatus == 1)
    {
        $rootScope.loginstatus = true;
    }
    // Logout function for admin, driver, customer
    $scope.logout = function ()
    {
		// Tabs set to initialize value that define in app.js
		if ($rootScope.tabs.length > 1)
		{
			$rootScope.tabs.length = 1;
		}
        // Unset cookies and local storage on logout.
        $cookieStore.remove('loginStatus');
		localStorage.removeItem("loginStatus");
		localStorage.removeItem("business_folder_name");
		if($cookieStore.userType=='Driver')
		{
			$cookieStore.remove("driver_id");
			localStorage.removeItem("driver_id");
		}
		if( $cookieStore.get('admin_login_status_stay_signin') == 1 || localStorage.getItem('admin_login_status_stay_signin') == 1)
		{
			$cookieStore.remove('admin_login_status_stay_signin');
			localStorage.removeItem("admin_login_status_stay_signin");
		}
		else
		{
			$cookieStore.remove('userType');
			localStorage.removeItem("userType");
			$cookieStore.remove("customer_contact_type");
			$cookieStore.remove('user_id');
		}
		
		$cookieStore.remove("customer_id");
		$cookieStore.remove("contact_id");
		$cookieStore.remove("user_name");
		if ($cookieStore.get("user_phone_number")) 
		{
			$cookieStore.remove("user_phone_number");
		}
		if ($cookieStore.get("user_profile_image"))
		{
			$cookieStore.remove("user_profile_image");
		}
		// Unset session on logout.
		$sessionStorage.loginStatus  = 0;
		$sessionStorage.userId       = 0;
		$sessionStorage.customer_id  = 0;
		$sessionStorage.userType     = 0;
		$rootScope.loginstatus       = false;
		$sessionStorage.user_name = '';
		$sessionStorage.user_phone_number = '';
		$sessionStorage.user_profile_image = '';
		$sessionStorage.contact_type = '';
		//localStorage.clear();
		localStorage.removeItem("user_phone_number");
		localStorage.removeItem("user_profile_image");
		localStorage.removeItem("user_name");
		localStorage.removeItem("customer_contact_type");
		localStorage.removeItem("user_id");
		localStorage.removeItem("contact_id");
		localStorage.removeItem("customer_id");
		localStorage.removeItem("userType");
		$location.path('/login');
    }
    // Below function define for forget password
    $scope.forgetPassword = function ()
    {   
        $scope.error_message = "";
		if (!$scope.email.email)
        {
            $scope.forget_passwd_form.email.$dirty = true;
            $('input.ng-invalid').first().focus();
            return false;
        }
		$scope.forget_password_loader = true;
        // webservice_case define user role wise
        if ($scope.email.user_type == "Admin")
        {
            $scope.forget_password.webservice_case = "clients_application_admin_forget_password";
        }
        if ($scope.email.user_type == "Custimer")
        {
            $scope.forget_password.webservice_case = "client_application_customer_forget_password";
        }
		if ($scope.email.user_type == "Driver")
        {
            $scope.forget_password.webservice_case = "client_application_driver_forget_password";
        }
        // Add user email field to forget_password json
        $scope.forget_password.email = $scope.email.email;
        $scope.password_reset_code_get_from_server = false;
        // API.common_api() function call for get response from server 
        API.common_api($scope.forget_password, 'forget_password').success(function (data)
        {
            // If API.common_api() function return then execute below condition
            if (data)
            {
				$scope.forget_password_loader = false;
                // If API.common_api() function return response_code 200 then execute below condition
                if (data.response_code == 200)
                {
                    // Below code will be hide after successfully getting reset code by email
                    $scope.email_error_get_from_server = true;
                    $scope.forget_passwd_form = false;
                    $scope.password_reset_form = false;
                    // Below msg will be show after successfully getting reset code by email
                    $scope.password_reset_code_get_from_server = false;
                    $scope.error_on_password_reset_code_get_from_server = true;
                    $scope.email_address = $scope.email.email;
                }
                else
                {
                    // If API.common_api() function return response_code rather then 200 means error msg then execute below condition
                    $scope.email_error_get_from_server = false;
                    $scope.error_message = data.response_message;
                    $location.path('/forget_password');
                }
            }
        });
    };
    // Below function define for password reset after getting reset code by mail
    $scope.passwReset = function ()
    {
        $scope.error_message = "";
        if (isNaN($scope.user.reset_code) || $scope.user.reset_code < 6)
        {
            $scope.email_varification_code = true;
            $('input.ng-invalid').first().focus();
            return false;
        }
        if (!$scope.user.reset_code)
        {
            $scope.email_varification_code = true;
            $('input.ng-invalid').first().focus();
            return false;
        }
        if (!$scope.user.password || $scope.user.password.length < 6)
        {
            $scope.passwMinlength = true;
            $scope.passwordVerify = false;
            $('input.ng-invalid').first().focus();
            return false;
        }
        if (!angular.equals($scope.user.password, $scope.user.password_verify))
        {
            $scope.passwMinlength = false;
            $scope.passwordVerify = true;
            $('input.ng-invalid').first().focus();
            return false;
        }
		$scope.forget_password_loader = true;
        // webservice case define user role wise
        if ($scope.email.user_type == "Admin")
        {
            $scope.reset_passwd.webservice_case = "client_application_admin_reset_password_using_reset_code";
        }
        if ($scope.email.user_type == "Customer")
        {
            $scope.reset_passwd.webservice_case = "client_application_customer_reset_password_using_reset_code";
        }
		if ($scope.email.user_type == "Driver")
        {
            $scope.reset_passwd.webservice_case = "client_application_driver_reset_password_using_reset_code";
        }
        // Add reset code and password field to reset_passwd json
        $scope.reset_passwd.reset_code = $scope.user.reset_code;
        $scope.reset_passwd.password = $scope.user.password;
        $scope.reset_passwd.password_verify = $scope.user.password_verify;
        API.common_api($scope.reset_passwd, 'reset_password_using_reset_code').success(function (data)
        {   
            if (data)
            {
				$scope.forget_password_loader = false;
                if (data.response_code == 200)
                {
                    if (data.response_data[0].contact_type)
                    {
                    	// Put contact type into session
                    	$sessionStorage.contact_type = data.response_data[0].contact_type;
                    	$sessionStorage.customer_id = data.response_data[0].customer_id;
						$sessionStorage.contact_id = data.response_data[0]._id;
                    	$cookieStore.put("customer_contact_type", data.response_data[0].contact_type);
                    	$cookieStore.put("contact_id", data.response_data[0]._id);
                    	$cookieStore.put("customer_id", data.response_data[0].customer_id);
						localStorage.setItem("customer_id", data.response_data[0].customer_id);
						localStorage.setItem("customer_contact_type", data.response_data[0].contact_type);
                    }
                    else
                    {
                    	$sessionStorage.contact_type = '';
                    	$cookieStore.put("customer_contact_type", '');  
                    	$cookieStore.put("contact_id", '');
                    	$cookieStore.put("customer_id", '');
                    }
                    // If yes, store user data in session and cookie storage.
                    $sessionStorage.userId = data.response_data[0]._id;
					localStorage.setItem("user_id", data.response_data[0]._id);
					if(!data.response_data[0].last_name || data.response_data[0].last_name =='')
					{
						data.response_data[0].last_name = '';
					}
                    $sessionStorage.user_name = data.response_data[0].title + ' ' + data.response_data[0].first_name + ' ' + data.response_data[0].last_name;
                    $cookieStore.put("user_name", $sessionStorage.user_name);
                    if (typeof data.response_data[0].phone != 'undefined' && data.response_data[0].phone.length)
                    {
                    	$sessionStorage.user_phone_number = '+' + data.response_data[0].phone[0].calling_code + '-' + data.response_data[0].phone[0].number;
                    	$cookieStore.put("user_phone_number", $sessionStorage.user_phone_number);
                    }
                    else
                    {
                    	$sessionStorage.user_phone_number = '';
                    	$cookieStore.put("user_phone_number", "");
                    }
                    if (typeof data.response_data[0].image != 'undefined' && data.response_data[0].image.length)
                    {
                    	$sessionStorage.user_profile_image = data.response_data[0].image[0].image_path;
                    	$cookieStore.put("user_profile_image", $sessionStorage.user_profile_image);
                    }
                    else
                    {
                    	$sessionStorage.user_profile_image = '';
                    	$cookieStore.put("user_profile_image", "");
                    }
                    $sessionStorage.loginStatus = 1;
                    $sessionStorage.userType = $scope.email.user_type;
                    $rootScope.loginstatus = true;
                    $cookieStore.put("userType", $scope.email.user_type);
                    $cookieStore.put("user_id", data.response_data[0]._id);
                    localStorage.setItem("loginStatus", 1);
					localStorage.setItem("business_folder_name",$location.absUrl().split('/')[4]);
					$cookieStore.put("loginStatus", 1);
					localStorage.setItem("userType", $scope.email.user_type);
                    // If user type customer send to customer section
                    if ($scope.email.user_type != 'Admin')
                    {   
                        $scope.show_for_user_id = false;
                        $scope.show_for_user_password = false;
                        $scope.show_for_user_type = false;
						if (data.response_data[0].contact_type == 'billing')
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
							$rootScope.tabs = [{
												id:1,
												title:'Booking Table View',
												content:'../repo/templates/booking_list_table_view.html'
											}];
						}
						$location.path('/booking_list');
                        return;
                    }
                    // If user type customer send to admin section
                    if ($scope.email.user_type == 'Admin')
                    {
                        $scope.show_for_user_id = false;
                        $scope.show_for_user_password = false;
                        $scope.show_for_user_type = false;
						$rootScope.tabs = [{
												id:1,
												title:'Booking Table View',
												content:'../repo/templates/booking_list_table_view.html'
											}];
                        $location.path('/booking_list');
                        return;
                    }
                }
                else
                {	// All error msg gose here
                    if (data.response_message == "Please enter reset_code.")
                    {
                        $scope.password_reset_code_get_from_server = true;
                        $scope.error_on_password_reset_code_get_from_server = false;
                        $scope.error_message = "Please enter reset code.";
                        $location.path('/forget_password');
                    }
                    else if (data.response_message == "Please enter password_verify.")
                    {
                        $scope.password_reset_code_get_from_server = true;
                        $scope.error_on_password_reset_code_get_from_server = false;
                        $scope.error_message = "Please enter confirm password.";
                        $location.path('/forget_password');
                    }
                    else
                    {
                        $scope.password_reset_code_get_from_server = true;
                        $scope.error_on_password_reset_code_get_from_server = false;
                        $scope.error_message = data.response_message;
                        $location.path('/forget_password');
                    }
                }
            }
        });
    };
    // Below function define for resent password reset code again --but it optional
    $scope.resendCode = function ()
    {
		$scope.resend_reset_code_loader = true;
        $scope.error_message = "";
        API.common_api($scope.forget_password, 'forget_password').success(function (data)
        {
            if (data)
            {
				$scope.resend_reset_code_loader = false;
                if (data.response_code == 200)
                {
                    $scope.forget_passwd_form = false;
                    $scope.password_reset_form = false;
                    // Below msg will be show after successfully getting reset code by email
                    $scope.password_reset_code_get_from_server = false;
                    $scope.error_on_password_reset_code_get_from_server = true;
                    $scope.email_address = $scope.email.email;
                    alert("Password reset code successfully send to " + $scope.email_address);
                }
                else
                {
                    $scope.password_reset_code_get_from_server = true;
                    $scope.error_on_password_reset_code_get_from_server = false;
                    $scope.error_message = data.response_message;
                    $location.path('/forget_password');
                }
            }
        });
    };
});

// Get all first character uppercase of a sentence
app.filter('capitalize', function() 
{
    return function(input, all) {
      var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
      return (!!input) ? input.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
    }
});