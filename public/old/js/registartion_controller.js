var app	=	angular.module('registration_controller',['limo_client.services']);

app.controller('registration',function ($scope,Upload,$window,$http,$rootScope,$location,API)
{
	
	/* Fetch list of countries. */
   $scope.country_listing = {webservice_case : 'country_listing', database_name : 'a_limokit'};
   $rootScope.div_val = 0;
   $scope.address = {line1:''};
        
    API.getCountry($scope.country_listing).success(function(data)
    {  
        $rootScope.country_data	=  data.response_data;
		
    });
	
	$rootScope.address_div	= true;
	$rootScope.userRegistration	= {'database_name':'a_limokit_developement','webservice_case':'client_application_admin_registration'};
	$rootScope.customerRegistration	= {'database_name':"a_limokit_developement",'webservice_case':'client_application_customer_registration'};
	
	$scope.showAddress	=	function(user)
	{
		
		if($scope.customerRegistration.customer_type == 'corporate')
		{
			$rootScope.div_val = 1;
			$rootScope.address_div	= false;
		}
		else
		{
			$rootScope.div_val = 0;
			$rootScope.address_div	= true;
		}
		
	};
	
	//------------ create a new client -----------------------------------------//
	
	$scope.user_register	= {}; 
	$scope.register =   function(){
	
            if($scope.user_register.phone_number < 10)
            {   
                $scope.check_number =   true;
                return false;
            }
		
		$rootScope.user_register	= {'database_name':'a_limokit_development','webservice_case':'main_application_client_registration'};	
		console.log($scope.user_register);		
	    API.signup($scope.user_register).success(function(data){
		if(data.response_code == 200)
		{
                    $scope.sucess_message   =   data.response_message;
                    $scope.user_register    =	'';	
                    $sessionStorage.user_id =   data.response_data.user_id;
                    $location.path('/account-activation');
		}
		else
		{
			$rootScope.error_message	=	data.response_message;
			$location.path('/registration');    
		}
		
	    });
	};
	
	
	$scope.addCustomer	=	function(){
	   //validation check all the field
	$scope.errors = [];
	$rootScope.customer_type				=	$scope.customerRegistration.customer_type;
	$rootScope.contact_title				=	$scope.customerRegistration.contact_title;
	$rootScope.contact_first_name				=	$scope.customerRegistration.contact_first_name;
	$rootScope.contact_last_name				=	$scope.customerRegistration.contact_last_name;
	$rootScope.contact_email					=	$scope.customerRegistration.contact_email;
	$rootScope.contact_password				=	$scope.customerRegistration.contact_password;
	$rootScope.contact_calling_code			=	$scope.customerRegistration.contact_calling_code;
	$rootScope.contact_phone_number			=	$scope.customerRegistration.contact_phone_number;
	$rootScope.customer_type			=	$scope.customerRegistration.customer_type;
	$rootScope.public_pref				=	$scope.customerRegistration.public_pref;
	$rootScope.private_pref				=	$scope.customerRegistration.private_pref;
	$rootScope.internal_notes				=	$scope.customerRegistration.internal_notes;
	$rootScope.external_notes				=	$scope.customerRegistration.external_notes;
	$rootScope.business_name				=	$scope.customerRegistration.business_name;
	$rootScope.address							=	$scope.customerRegistration.address;
	$rootScope.subrub_district				=	$scope.customerRegistration.address;
	  var vm = this;
	//console.log(vm.regForm.file);
	console.log($scope.customerRegistration.file);
	
	if (typeof $rootScope.customer_type == 'undefined' )
	{
		$scope.errors.push("Please select user type");
		return false;
	}
	
	if (typeof $rootScope.contact_title == 'undefined' )
	{
		$scope.errors.push("Please select title");
		return false;
	}
	
	if (typeof $rootScope.contact_first_name == 'undefined' )
	{
		$scope.errors.push("Please enter your first name.");
		return false;
	}
	if (typeof $rootScope.contact_last_name == 'undefined' )
	{
		$scope.errors.push("Please enter your last name.");
		return false;
	}
	if (typeof $rootScope.contact_email == 'undefined' )
	{
		$scope.errors.push("Please enter your email.");
		return false;
	}
	if (typeof $rootScope.contact_password == 'undefined' )
	{
		$scope.errors.push("Please enter your password.");
		return false;
	}
	if (typeof $rootScope.contact_calling_code == 'undefined' )
	{
		$scope.errors.push("Please select calling code.");
		return false;
	}
	
	if (typeof $rootScope.contact_phone_number == 'undefined' )
	{
		$scope.errors.push("Please enter your phone number.");
		return false;
	}
	
	if ($rootScope.contact_phone_number.length < 10 || $rootScope.contact_phone_number.length > 10)
	{
		$scope.errors.push("Please enter  10 digit phone number.");
		return false;
	}
	
	
	if($rootScope.div_val == 1)
	{
		var business_name = $('#business_name').val();
		var address1 = $('#address1').val();
		var district = $('#district').val();
		var country = $('#country').val();
		var city = $('#city').val();
		alert(city);
		var post_code = $('#post_code').val();
		var state = $('#state').val();
		
		if(business_name =='' || business_name== 'undefined')
		{
			$scope.errors.push("Please enter business name");
			return false;
		}
		if(address1 =='' || address1== 'undefined')
		{
			$scope.errors.push("Please enter an address");
			return false;
		}
		if(district =='' || district== 'undefined')
		{
			$scope.errors.push("Please select a district");
			return false;
		}
		
		if(country =='' || country== 'undefined')
		{
			$scope.errors.push("Please select a country");
			return false;
		}
		
		if(city =='' || city == 'undefined')
		{
			$scope.errors.push("Please select a city");
			return false;
		}
		if(post_code =='' || post_code== 'undefined')
		{
			$scope.errors.push("Please select a city");
			return false;
		}
		if(state =='' || state== 'undefined')
		{
			$scope.errors.push("Please select a state");
			return false;
		}
	}
		
	API.addCustomerByAdmin($scope.customerRegistration).success(function(data)
   {
		if(data.response_code == 200)
		{
		//	$location.path('/customer_profile_listing_for_admin');
		}
		else
		{
			$scope.error_message = data.response_message;
		}
		
    });
	    
	};
	
	//-------------- Add user admin/staff-------------------------------------//
	
	$scope.addUser	=	function()
	{
	   //validation check all the field
	$scope.errors = [];
	$rootScope.customer_type				=	$scope.userRegistration.customer_type;
	$rootScope.title						=	$scope.userRegistration.title;
	$rootScope.first_name				=	$scope.userRegistration.first_name;
	$rootScope.last_name				=	$scope.userRegistration.last_name;
	$rootScope.email					=	$scope.userRegistration.email;
	$rootScope.password				=	$scope.userRegistration.password;
	$rootScope.calling_code			=	$scope.userRegistration.calling_code;
	$rootScope.phone_number			=	$scope.userRegistration.phone_number;
	
	
	if (typeof $rootScope.customer_type == 'undefined' )
	{
		$scope.errors.push("Please select user type");
		return false;
	}
	if (typeof $rootScope.email == 'undefined' )
	{
		$scope.errors.push("Please enter your email.");
		return false;
	}
	if (typeof $rootScope.password == 'undefined' )
	{
		$scope.errors.push("Please enter your password.");
		return false;
	}
	
	if (typeof $rootScope.title == 'undefined' )
	{
		$scope.errors.push("Please select title");
		return false;
	}
	
	if (typeof $rootScope.first_name == 'undefined' )
	{
		$scope.errors.push("Please enter your first name.");
		return false;
	}
	if (typeof $rootScope.last_name == 'undefined' )
	{
		$scope.errors.push("Please enter your last name.");
		return false;
	}
	
	if (typeof $rootScope.calling_code == 'undefined' )
	{
		$scope.errors.push("Please select calling code.");
		return false;
	}
	
	if (typeof $rootScope.phone_number == 'undefined' )
	{
		$scope.errors.push("Please enter your phone number.");
		return false;
	}
	
	if ($rootScope.phone_number.length < 10 || $rootScope.phone_number.length > 10)
	{
		$scope.errors.push("Please enter  10 digit phone number.");
		return false;
	}
	console.log($scope.userRegistration);
		
	API.addUserByAdmin($scope.userRegistration).success(function(data)
   {
	  
	  
		if(data.response_code == 200)
		{
			$location.path('/admin_user_profile_listing_for_admin');
		}
		else
		{
			$scope.error_message = data.response_message;
		}
		
    });
	    
		
	};
	

});