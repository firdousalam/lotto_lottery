angular.module('businessSettings.controller', ['ngSanitize','limo_client.services','angularUtils.directives.dirPagination','angularFileUpload'])
//'ngMessages'
// Business settings controller.
.controller('business_setting', function ($scope, $rootScope, API, $location,$sce,  $sceDelegate, $window,$sessionStorage, $cookieStore, $timeout, $upload,$http)
{
	// Check login status.
	if (localStorage.getItem('loginStatus') != 1 ||  $sessionStorage.loginStatus == 0 || $sessionStorage.userId == 0)
	{
		$location.path('/login');
	}
	angular.element(document).ready(function () 
	{
	//	$('.selectpicker').selectpicker({showSubtext:true});
	});	 
	// page loader
	$scope.business_setting_loader = true;
	// Get the URL of the page.
	var page_url = $window.location.href;
	// Get the database name of the client from the URL of the page.
	var url_path = page_url.split('/');
	$rootScope.data_base_name =	url_path[4];
	// Add the database name to the array.
	$scope.country_listing = {webservice_case : 'country_listing', database_name : 'a_limokit'};
	// Call API to get country listing.
	API.getCountry($scope.country_listing).success(function (data)
    {  
		$rootScope.country_data	= data.response_data;
		// Get business settings.
		$scope.getBusinessSettingListing('true');
	});
	// Create the surcharge percentage array.
	$scope.percent_array = [];
	var perc = 0.5;
	while (perc <= 20)
	{
		$scope.percent_array.push({'value':perc});
		perc = perc + 0.5;
	}
	// Get business settings.
	$scope.getBusinessSettingListing = function (loader)
	{	
		// Page loader
		if (loader == 'true')
		{
			$scope.business_setting_loader = true;
		}
		// Add the database name to the array.
		$scope.business_setting_listing = {
												webservice_case : 'client_application_business_setting_list',
												database_name : $rootScope.data_base_name
											};
		// Call API to get business settings listing.
		API.getListing($scope.business_setting_listing).success(function (data)
		{  	
			$rootScope.business_setting_listing_data = data.response_data;
			$scope.business_setting = $rootScope.business_setting_listing_data[0];
			// General data.
			$scope.general_setting = { 
										'business_logo'     	: $rootScope.business_setting_listing_data[0].bms_logo[0].image_name,
										'business_logo_path' 	: $rootScope.business_setting_listing_data[0].bms_logo[0].image_path,
										'business_name' 		: $rootScope.business_setting_listing_data[0].business_name,
										'trading_name' 			: $rootScope.business_setting_listing_data[0].trading_name,
										'business_number' 		: $rootScope.business_setting_listing_data[0].business_number,
										'bms_slogan' 			: $rootScope.business_setting_listing_data[0].bms_slogan,
										'website_domain' 		: $rootScope.business_setting_listing_data[0].website_domain,
										'paypal_email_id' 		: $rootScope.business_setting_listing_data[0].paypal_email_id,
										'currency_symbol' 		: $rootScope.business_setting_listing_data[0].currency.symbol,
										'currency_code' 		: $rootScope.business_setting_listing_data[0].currency.code
									 };
			// Dynamically set business name, bms slogan, image path if user change from business setting
			$sessionStorage.business_name = $rootScope.business_setting_listing_data[0].business_name;
			$rootScope.business_name = $sessionStorage.business_name;
			$sessionStorage.business_logo = $rootScope.business_setting_listing_data[0].bms_logo[0].image_path;
			$rootScope.business_logo = $sessionStorage.business_logo;
			$sessionStorage.bms_slogan = $rootScope.business_setting_listing_data[0].bms_slogan;
			$rootScope.bms_slogan = $sessionStorage.bms_slogan;
			$sessionStorage.bms_booking_phone_number = '+'+data.response_data[0].bms_phone.booking_phone[0].calling_code+'-'+data.response_data[0].bms_phone.booking_phone[0].number; 
			$rootScope.bms_booking_phone_number = $sessionStorage.bms_booking_phone_number; 
			// Currecy for business settings
			$scope.currency_of_general_setting = $scope.general_setting.currency_code + '( ' + $scope.general_setting.currency_symbol + ' )';					 
			// Business email data. 
			$scope.email_settings_booking = $rootScope.business_setting_listing_data[0].bms_email.booking_email[0];
			$scope.email_settings_billing = $rootScope.business_setting_listing_data[0].bms_email.billing_email[0];
			$scope.email_settings_support = $rootScope.business_setting_listing_data[0].bms_email.support_email[0];
			$scope.email_settings_contact_us = $rootScope.business_setting_listing_data[0].bms_email.contact_us_email[0];
			$scope.email_settings_driver_communication = $rootScope.business_setting_listing_data[0].bms_email.driver_communication_email[0];
			// Phone data.
			$scope.phone_settings_booking = $rootScope.business_setting_listing_data[0].bms_phone.booking_phone[0];
			if (typeof $rootScope.business_setting_listing_data[0].bms_phone.billing_phone[0] != 'undefined')
			{
				$scope.phone_settings_billing = $rootScope.business_setting_listing_data[0].bms_phone.billing_phone[0];
			}
			else
			{
				$scope.phone_settings_billing = '';
			}
			if (typeof $rootScope.business_setting_listing_data[0].bms_phone.support_phone[0] != 'undefined')
			{
				$scope.phone_settings_support = $rootScope.business_setting_listing_data[0].bms_phone.support_phone[0];
			}
			else
			{
				$scope.phone_settings_support = '';
			}
			if (typeof $rootScope.business_setting_listing_data[0].bms_phone.contact_us_phone[0] != 'undefined')
			{
				$scope.phone_settings_contact_us = $rootScope.business_setting_listing_data[0].bms_phone.contact_us_phone[0];
			}
			else
			{
				$scope.phone_settings_contact_us = '';
			}
			if (typeof $rootScope.business_setting_listing_data[0].bms_phone.driver_communication_phone[0] != 'undefined')
			{
				$scope.phone_settings_driver_communication = $rootScope.business_setting_listing_data[0].bms_phone.driver_communication_phone[0];
			}
			else
			{
				$scope.phone_settings_driver_communication = '';
			}
			// Business address data.
			$scope.address_setting = {};    
			$scope.address_setting = $scope.business_setting.address[0]; 
			if (typeof $rootScope.business_setting_listing_data[0].taxes[0] != 'undefined')
			{
				if (typeof $rootScope.business_setting_listing_data[0].taxes[0].name != 'undefined') 
				{
					$scope.address_setting.tax_percentage_field_name = $rootScope.business_setting_listing_data[0].taxes[0].name;
				}
				if (typeof $rootScope.business_setting_listing_data[0].taxes[0].percentage != 'undefined')
				{
					$scope.address_setting.tax_percentage_value = $rootScope.business_setting_listing_data[0].taxes[0].percentage;
				}
			}
			// For bank details data of business settings.
			$scope.bank_setting = {};
			// Get country wise bank parameters value.
			$scope.bank_setting.country_id = $rootScope.business_setting_listing_data[0].country.country_id; 
			$scope.bank_setting.calling_code = $rootScope.business_setting_listing_data[0].country.calling_code;
			$scope.getBankDetails($scope.bank_setting.calling_code);
			// Get check payament details
			$scope.bank_setting.cheque_payment_details = $rootScope.business_setting_listing_data[0].cheque_payment_details;
			// For invoice messages data of invoice inle.
			if (!$rootScope.business_setting_listing_data[0].invoice_line.length)
			{
				$scope.invoice_messages_is_empty = 'Message box is empty.';
			}
			else if ($rootScope.business_setting_listing_data[0].invoice_line.length == 1)
			{
				$scope.invoice_messages_is = '1';
				$scope.invoice_messages_is_empty = '';
				$scope.invoice_messages = $rootScope.business_setting_listing_data[0].invoice_line;
		//		$scope.deleteInvoiceMessage($scope.invoice_messages[0]._id,'YES');
			}
			else
			{
				$scope.invoice_messages_is_empty = '';
				$scope.invoice_messages_is = '2';
				$scope.invoice_messages = $rootScope.business_setting_listing_data[0].invoice_line;
			}
			// For driver expenses
			$scope.driver_expense_type_data = {};
			$scope.driver_expense_type_data = $rootScope.business_setting_listing_data[0].expense;
			// For driver income
			$scope.driver_income_type_data = {};
			$scope.driver_income_type_data = $rootScope.business_setting_listing_data[0].income[0];
			// For bidding job
			$scope.bidding_time_for_job = {};
			$scope.bidding_time_for_job.job_offered_valid_for = $rootScope.business_setting_listing_data[0].job_offered_valid_for;
			// Legal data.
			$scope.update_legal = {};
			$scope.update_legal.email_disclaimer = $rootScope.business_setting_listing_data[0].email_disclaimer;
			$scope.update_legal.booking_terms_and_conditions = $rootScope.business_setting_listing_data[0].booking_terms_and_conditions;
			// Invoice payable due date
			$scope.invoice_payable_due_date = $rootScope.business_setting_listing_data[0].invoice_amount_payable_in_day;
			$scope.invoice_due_date_date_list = [];
			for (i = 1; i <= 90; i++)
			{
				$scope.invoice_due_date_date_list.push({name:i+" Days", value:i});
			}
			// Credit card surcharge percentage
			$scope.cc_surcharge_percentage = $rootScope.business_setting_listing_data[0].credit_card_surcharge_percentage;
			// Create the surcharge percentage array.
			$scope.percent_array = [];
			var perc = 0.5;
			while (perc <= 20)
			{
				$scope.percent_array.push({'value':perc});
				perc = perc + 0.5;
			}
			$scope.business_setting_loader = false;
		});
	}
	$scope.choices = [];
	$scope.addNewParam = function() 
	{
		var newItemNo = $scope.choices.length+1;
		$scope.choices.push({'id':'choice'+newItemNo});
	};
	$scope.removeParam = function(index) 
	{
		$scope.choices.splice(index, 1);
	};
	// Get country wise bank parameters.
	$scope.getBankDetails = function(code)
	{	
		if (code != '')
		{
			// Below array define to hold bank details field value 
			$scope.bank_setting.bank_parameters_value = [];  
			$scope.bank_parameters = {};
			$rootScope.country_data.forEach(function (value, index, _ary)
			{	
				if (value.calling_code == code.split('+')[0])
				{
					// If country field of business address is empty  
					if ($scope.address_setting.country == '')   
					{
						$scope.address_setting.country = value.name;     
					}
					//Get and hold business parameter fields value
					$scope.bank_parameters = value.bank_parameters;
					// Check all required condition then populale bank details value
					if (typeof $rootScope.business_setting_listing_data[0].bank_details != 'undefined' && $rootScope.business_setting_listing_data[0].bank_details.length && typeof $rootScope.business_setting_listing_data[0].country.calling_code != 'undefined' && $rootScope.business_setting_listing_data[0].country.calling_code == code.split('+')[0])
					{
						for (var i = 0; i < $scope.bank_parameters.length; i++)
						{
							$scope.bank_setting.bank_parameters_value[i] = $rootScope.business_setting_listing_data[0].bank_details[i].value;
						}
					}
				}
			});
		}
		else
		{
			return;
		}
	}
	// Email settings update.
	$scope.updateEmailSettings = function (email_setting_form)
	{	
		$scope.email_settings = {};
		$scope.email_settings.bms_email = {};
		// Check form fields validation
		if (angular.isUndefined(email_setting_form.booking_email.$modelValue) || email_setting_form.booking_email.$modelValue == '')
		{
			email_setting_form.booking_email.$dirty = true;
			document.forms['email_setting_form'].elements['booking_email'].focus();
			return false;
		}
		if (angular.isUndefined(email_setting_form.booking_host.$modelValue) || email_setting_form.booking_host.$modelValue == '')
		{
			email_setting_form.booking_host.$dirty = true;
			document.forms['email_setting_form'].elements['booking_host'].focus();
			return false;
		}
		if (angular.isUndefined(email_setting_form.booking_password.$modelValue) || email_setting_form.booking_password.$modelValue == '')
		{
			email_setting_form.booking_password.$dirty = true;
			document.forms['email_setting_form'].elements['booking_password'].focus();
			return false;
		}
		if(angular.isDefined(email_setting_form.billing_password.$viewValue) && email_setting_form.billing_password.$viewValue != '')
		{	
			if (angular.isUndefined(email_setting_form.billing_password.$modelValue) || email_setting_form.billing_password.$modelValue == '')
			{
				email_setting_form.billing_password.$error.minlength = true;
				document.forms['email_setting_form'].elements['billing_password'].focus();
				return false;
			}
		}
		if(angular.isDefined(email_setting_form.support_password.$viewValue) && email_setting_form.support_password.$viewValue != '')
		{	
			if (angular.isUndefined(email_setting_form.support_password.$modelValue) || email_setting_form.support_password.$modelValue == '')
			{
				email_setting_form.support_password.$error.minlength = true;
				document.forms['email_setting_form'].elements['support_password'].focus();
				return false;
			}
		}
		if(angular.isDefined(email_setting_form.contact_us_password.$viewValue) && email_setting_form.contact_us_password.$viewValue != '')
		{	
			if (angular.isUndefined(email_setting_form.contact_us_password.$modelValue) || email_setting_form.contact_us_password.$modelValue == '')
			{
				email_setting_form.contact_us_password.$error.minlength = true;
				document.forms['email_setting_form'].elements['contact_us_password'].focus();
				return false;
			}
		}
		if(angular.isDefined(email_setting_form.driver_communication_password.$viewValue) && email_setting_form.driver_communication_password.$viewValue != '')
		{	
			if (angular.isUndefined(email_setting_form.driver_communication_password.$modelValue) || email_setting_form.driver_communication_password.$modelValue == '')
			{
				email_setting_form.driver_communication_password.$error.minlength = true;
				document.forms['email_setting_form'].elements['driver_communication_password'].focus();
				return false;
			}
		}
		$scope.confirm = confirm("Are you sure you want to update email?");
		if ($scope.confirm == false)
		{
			return;
		}
		$scope.email_setting_loader = true;
		$scope.email_settings.created_by = $sessionStorage.userId;
		$scope.email_settings.created_by_type = 'Admin';
		$scope.email_settings.bms_email.booking_email = $scope.email_settings_booking;
		$scope.email_settings.bms_email.billing_email = $scope.email_settings_billing;
		$scope.email_settings.bms_email.support_email = $scope.email_settings_support;
		$scope.email_settings.bms_email.contact_us_email = $scope.email_settings_contact_us;
		$scope.email_settings.bms_email.driver_communication_email = $scope.email_settings_driver_communication;
		// Add the database name to the array.
		$scope.email_settings.webservice_case = 'client_application_business_settings_update_email_details';
		$scope.email_settings.database_name = $location.absUrl().split('/')[4] || "Unknown";
		$scope.email_settings.setting_type = 'bms';
		$scope.email_settings.required_fields = [{name:'email'},{name:'host'},{name:'password'}];
		// Call API to updatte business settings.
		API.common_api($scope.email_settings, 'business_settings/update').success(function (data)
		{
			$scope.email_setting_loader = false;
			// Check if successful.
			if (data.response_code == 200)
			{
				$scope.loading = false;
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'Email settings successfully updated.';
				$scope.success_error_message = true;
				$timeout(function ()
				{
					$scope.success_error_message = false;
				}, 2000);
			}
			else
			{
				$scope.loading = false;
				$scope.alert_message_success = '';
				$scope.alert_message_error = data.response_message;
				$scope.success_error_message = true;
				$timeout(function ()
				{
					$scope.success_error_message = false;
				}, 2000);
			}
		});
	}
	// Phone settings update.
	$scope.updatePhoneSettings = function(phone_setting_form)
	{	
		if (angular.isUndefined(phone_setting_form.booking_calling_code.$modelValue) || phone_setting_form.booking_calling_code.$modelValue == '')
		{	
			phone_setting_form.booking_calling_code.$dirty = true;
			$('select.ng-invalid').first().focus();
			return false;
		}
		if (angular.isUndefined(phone_setting_form.booking_phone.$modelValue) || phone_setting_form.booking_phone.$modelValue == '')
		{	
			phone_setting_form.booking_phone.$dirty = true;
			document.forms['phone_setting_form'].elements['booking_phone'].focus();
			return false;
		}
		if (angular.isDefined(phone_setting_form.billing_phone.$viewValue) && phone_setting_form.billing_phone.$viewValue != '')
		{
			if (angular.isUndefined(phone_setting_form.billing_phone.$modelValue) || phone_setting_form.billing_phone.$modelValue == '')
			{
				phone_setting_form.billing_phone.$error.pattern = true;
				document.forms['phone_setting_form'].elements['billing_phone'].focus();
				return false;
			}
		}
		if (angular.isUndefined(phone_setting_form.billing_phone.$viewValue) || phone_setting_form.billing_phone.$viewValue == '')
		{
			$scope.phone_settings_billing.number = ''; 
		}
		if (angular.isDefined(phone_setting_form.support_phone.$viewValue) && phone_setting_form.support_phone.$viewValue != '')
		{
			if (angular.isUndefined(phone_setting_form.support_phone.$modelValue) || phone_setting_form.support_phone.$modelValue == '')
			{
				phone_setting_form.support_phone.$error.pattern = true;
				document.forms['phone_setting_form'].elements['support_phone'].focus();
				return false;
			}
		}
		if (angular.isUndefined(phone_setting_form.support_phone.$viewValue) || phone_setting_form.support_phone.$viewValue == '')
		{
			$scope.phone_settings_support.number = '';
		}
		if (angular.isDefined(phone_setting_form.contact_us_phone.$viewValue) && phone_setting_form.contact_us_phone.$viewValue != '')
		{
			if (angular.isUndefined(phone_setting_form.contact_us_phone.$modelValue) || phone_setting_form.contact_us_phone.$modelValue == '')
			{
				phone_setting_form.contact_us_phone.$error.pattern = true;
				document.forms['phone_setting_form'].elements['contact_us_phone'].focus();
				return false;
			}
		}
		if (angular.isUndefined(phone_setting_form.contact_us_phone.$viewValue) || phone_setting_form.contact_us_phone.$viewValue == '')
		{
			$scope.phone_settings_contact_us.number = '';
		}
		if (angular.isDefined(phone_setting_form.communication_phone.$viewValue) && phone_setting_form.communication_phone.$viewValue != '')
		{
			if (angular.isUndefined(phone_setting_form.communication_phone.$modelValue) || phone_setting_form.communication_phone.$modelValue == '')
			{
				phone_setting_form.communication_phone.$error.pattern = true;
				document.forms['phone_setting_form'].elements['communication_phone'].focus();
				return false;
			}
		}
		if (angular.isUndefined(phone_setting_form.communication_phone.$viewValue) || phone_setting_form.communication_phone.$viewValue == '')
		{
			$scope.phone_settings_driver_communication.number = '';
		}
		$scope.confirm = confirm("Are you sure you want to update phone?");    
		if ($scope.confirm == false)
		{
			return;
		}
		$scope.phone_setting_loader = true;
		$scope.phone_settings = {};
		$scope.phone_settings.bms_phone = {};
		$scope.phone_settings.created_by = $sessionStorage.userId;
		$scope.phone_settings.created_by_type = 'Admin';
		$scope.phone_settings.bms_phone.booking_phone = $scope.phone_settings_booking;
		$scope.phone_settings.bms_phone.billing_phone = $scope.phone_settings_billing;
		$scope.phone_settings.bms_phone.support_phone = $scope.phone_settings_support;
		$scope.phone_settings.bms_phone.contact_us_phone = $scope.phone_settings_contact_us;
		$scope.phone_settings.bms_phone.driver_communication_phone = $scope.phone_settings_driver_communication;
		// Add the database name to the array.
		$scope.phone_settings.webservice_case = 'client_application_business_settings_update_phone_details';
		$scope.phone_settings.database_name = $location.absUrl().split('/')[4]||"Unknown";
		$scope.phone_settings.setting_type = 'bms';
		$scope.phone_settings.required_fields = [{name : 'number'}];
		// Call API to update business settings.
		API.common_api($scope.phone_settings, 'business_settings/update').success(function(data)
		{
			$scope.phone_setting_loader = false;
			// Check if successful.
			if (data.response_code == 200)
			{
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'Phone settings successfully updated.';
				$scope.success_error_message = true;
				// Get business setting data.
				$scope.getBusinessSettingListing('false');
				$timeout(function ()
				{
					$scope.success_error_message = false;
				}, 2000);
			}
			else
			{
				$scope.alert_message_success = '';
				$scope.alert_message_error = data.response_message;
				$scope.success_error_message = true;
				$timeout(function ()
				{
					$scope.success_error_message = false;
				}, 2000);
			}
		});
	}
	// To show logo upload modal 
	$scope.showImageUploadPanel = function()
	{
		$scope.upload_business_logo = !$scope.upload_business_logo;
	}
	// Below function check size and type of logo
	$scope.checkFileExtentionPattern = (function ()
	{	
		return{ 
			test : function (value)
			{	
				if (value.type) 
				{
					if (value.type != 'image/jpeg' && value.type != 'image/gif' && value.type != 'image/png')
					{
						$scope.file_size_error = false;
						$scope.file_extention_error = true;
						return false;
					}
					else if (value.size > 2000000)
					{
						// Check logo size
						$scope.file_size_error = true;
						$scope.file_extention_error = false;
						return false;
					}
					else
					{
						return true;
					}
				}
			}
		};
	})();
	// Define json and array for address and tax
	$scope.address_and_tax = {};
	// General settings update.
	$scope.updateGeneralSettings = function(general_setting_form)
	{	
		// Check model value of logo is empty or not
		if (angular.isUndefined(general_setting_form.image.$modelValue) || general_setting_form.image.$modelValue == '')
		{
			general_setting_form.image.$dirty = true;
			$('input.ng-invalid').first().focus();
			return false;
		}
		// Check new uploaded logo is not empty 
		if (angular.isDefined($scope.general_setting.business_logo.name) || angular.isDefined(general_setting_form.image.$modelValue.name))
		{
			// Check new uploaded logo type 
			if (general_setting_form.image.$modelValue.type != 'image/jpeg' && general_setting_form.image.$modelValue.type != 'image/gif' && general_setting_form.image.$modelValue.type != 'image/png')
			{
				$scope.file_extention_error = true;
				$('input.ng-invalid').first().focus();
				return false;
			}
			else
			{
				$scope.file_extention_error = false;
			}
			// Check new uploaded logo size
			if (general_setting_form.image.$modelValue.size > 2000000)
			{
				$scope.file_size_error = true;
				$('input.ng-invalid').first().focus();
				return false;
			}
			else
			{
				$scope.file_size_error = false;
			}
		}
		if (angular.isUndefined(general_setting_form.business_name.$modelValue) || general_setting_form.business_name.$modelValue == '')
		{
			general_setting_form.business_name.$dirty = true;
			$('input.ng-invalid').first().focus();
			return false;
		}
		if (angular.isUndefined(general_setting_form.trading_name.$modelValue) || general_setting_form.trading_name.$modelValue == '')
		{
			//general_setting_form.trading_name.$dirty = true;
			//$('input.ng-invalid').first().focus();
			//return false;
		}
		if (angular.isUndefined(general_setting_form.business_number.$modelValue) || general_setting_form.business_number.$modelValue == '')
		{
			//general_setting_form.business_number.$dirty = true;
			//$('input.ng-invalid').first().focus();
			//return false;
		}
		if (angular.isDefined(general_setting_form.website_domain.$viewValue) && general_setting_form.website_domain.$viewValue != '')
		{
			if (angular.isUndefined(general_setting_form.website_domain.$modelValue) || general_setting_form.website_domain.$modelValue == '')
			{
				//general_setting_form.website_domain.$error.url = true;
				//$('input.ng-invalid').first().focus();
				//return false;
			}
		}
		if (angular.isUndefined(general_setting_form.business_slogan.$modelValue) || general_setting_form.business_slogan.$modelValue == '')
		{
			//general_setting_form.business_slogan.$dirty = true;
			//$('textarea.ng-invalid').first().focus();
			//return false;
		}
		if (angular.isUndefined(general_setting_form.website_domain.$viewValue) || general_setting_form.website_domain.$viewValue == '')
		{
			$scope.general_setting.website_domain = ''; 
		}
		if (angular.isUndefined(general_setting_form.line_1.$modelValue) || general_setting_form.line_1.$modelValue == '')
		{
			//general_setting_form.line_1.$dirty = true;
			//document.forms['general_setting_form'].elements['line_1'].focus();
			//return false;
		}
		if (angular.isUndefined(general_setting_form.line_2.$modelValue) || general_setting_form.line_2.$modelValue == '')
		{
			//general_setting_form.line_2.$dirty = true;
			//document.forms['general_setting_form'].elements['line_2'].focus();
			//return false;
		}
		if (angular.isUndefined(general_setting_form.suburb_district.$modelValue) || general_setting_form.suburb_district.$modelValue == '')
		{
			//general_setting_form.suburb_district.$dirty = true;
			//document.forms['general_setting_form'].elements['suburb_district'].focus();
			//return false;
		}
		if (angular.isUndefined(general_setting_form.city.$modelValue) || general_setting_form.city.$modelValue == '')
		{
			//general_setting_form.city.$dirty = true;
			//document.forms['general_setting_form'].elements['city'].focus();
			//return false;
		}
		if (angular.isUndefined(general_setting_form.state.$modelValue) || general_setting_form.state.$modelValue == '')
		{
			//general_setting_form.state.$dirty = true;
			//document.forms['general_setting_form'].elements['state'].focus();
			//return false;
		}
		if (angular.isUndefined(general_setting_form.post_code.$modelValue) || general_setting_form.post_code.$modelValue == '')
		{
			//general_setting_form.post_code.$dirty = true;
			//document.forms['general_setting_form'].elements['post_code'].focus();
			//return false;
		}
		if (angular.isUndefined(general_setting_form.tax_percentage.$modelValue) || general_setting_form.tax_percentage.$modelValue == '')
		{
			//general_setting_form.tax_percentage.$dirty = true;
			//document.forms['general_setting_form'].elements['tax_percentage'].focus();
			//return false;
		}
		$scope.confirm = confirm("Are you sure you want to update general details?");
		if ($scope.confirm == false)
		{
			return;
		} 
		// Html loader
		$scope.general_details_loader = true;
		// Add the database name to the array.
		$scope.general_setting.webservice_case = 'client_application_business_settings_update_general_details';
		$scope.general_setting.database_name = $location.absUrl().split('/')[4]||"Unknown";
		$scope.general_setting.setting_type = 'bms';
		$scope.general_setting.update_type = 'general';
		$scope.general_setting.created_by = $sessionStorage.userId;
		$scope.general_setting.created_by_type = 'Admin';
		$scope.general_setting.required_fields = [
													{name	:	'business_name'}
													//{name	:	'trading_name'},
													//{name	:	'business_number'},
													//{name	:	'bms_slogan'}
												];
		// Add the database name to the array.
		$scope.address_and_tax.taxes_name = $scope.address_setting.tax_percentage_field_name; 
		$scope.address_and_tax.taxes_percentage = $scope.address_setting.tax_percentage_value;
		$scope.address_and_tax.webservice_case = 'client_application_business_settings_update_general_details';
		$scope.address_and_tax.database_name = $location.absUrl().split('/')[4]||"Unknown"; 
		$scope.address_and_tax.setting_type = 'bms';
		$scope.address_and_tax.update_type = 'address';
		$scope.address_and_tax.line_1 = $scope.address_setting.line_1; 
		$scope.address_and_tax.line_2 = $scope.address_setting.line_2; 
		$scope.address_and_tax.suburb_district = $scope.address_setting.suburb_district; 
		$scope.address_and_tax.city = $scope.address_setting.city; 
		$scope.address_and_tax.state = $scope.address_setting.state;
		$scope.address_and_tax.post_code = $scope.address_setting.post_code; 
		$scope.address_and_tax.country = $scope.address_setting.country;
		$scope.address_and_tax.created_by = $sessionStorage.userId;
		$scope.address_and_tax.created_by_type = 'Admin';
		$scope.address_and_tax.required_fields = [
													//{name	:	'line_1'},
													//{name	:	'line_2'},
													//{name	:	'suburb_district'},
													//{name	:	'city'},
													//{name	:	'state'},
													//{name	:	'post_code'},
													//{name	:	'taxes_percentage'}
												];
		// Call below url to update business settings with image and without business address.
		if (angular.isDefined($scope.general_setting.business_logo.name) || angular.isDefined(general_setting_form.image.$modelValue.name))
		{
			$upload.upload
			({
				url: 'http://www.limokit.com:3400/business_settings/update',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			   // headers: {'myHeaderKey': 'myHeaderVal'},
				data : $scope.general_setting,
				file : $scope.general_setting.business_logo,
				fileFormDataName: 'myFile'
			})
			.then(function (response) 
			{ 
				$scope.general_details_loader = false;
				if (response.data.response_code == 200)
				{	
					// Below API call for update only business address 
					API.common_api($scope.address_and_tax, 'business_settings/update').success
					(
						function (adata)
						{
							if (adata.response_code == 200)
							{
								$scope.alert_message_error = '';
								$scope.alert_message_success = 'General details is successfully updated.';
								$scope.success_error_message = true;
								// Get business setting data.
								$scope.getBusinessSettingListing('false');
								$scope.upload_business_logo = false;
								$timeout(function ()
								{
									$scope.success_error_message = false;
								}, 2000);
							}
							else
							{
								$scope.alert_message_success = '';
								$scope.alert_message_error = adata.response_message;
								$scope.success_error_message = true;
								// Get business setting data.
								$scope.getBusinessSettingListing('false');
								$scope.upload_business_logo = false;
							}
						}
					);
				}
				else
				{
					// If API.common_api() function return response_code rather then 200 means error msg then execute below condition
					$scope.alert_message_success = '';
					$scope.alert_message_error = response.data.response_message;
					$scope.success_error_message = true;
					// Get business setting data.
					$scope.getBusinessSettingListing('false');
				}
			}, null, function (evt) {});
		}
		// Else if site admin dont want to upload logo
		else
		{	
			API.common_api($scope.general_setting, 'business_settings/update').success(function (data)
			{	
				$scope.general_details_loader = false;
				// If API.common_api() function return success then update address setting 
				if (data.response_code == 200)
				{
					// Below API call for update only business address
					API.common_api($scope.address_and_tax, 'business_settings/update').success(function (adata)
					{
						// If success
						if (adata.response_code == 200)
						{
							$scope.alert_message_error = '';
							$scope.alert_message_success = 'General details is successfully updated.';
							$scope.success_error_message = true;
							// Get logo upload panel hide  
							$scope.upload_business_logo = false;
							// Get business setting data.
							$scope.getBusinessSettingListing('false');
							$timeout(function ()
							{
								$scope.success_error_message = false;
							}, 2000);
						}
						else
						{
							$scope.alert_message_success = '';
							$scope.alert_message_error = adata.response_message;
							$scope.success_error_message = true;
							// Get business setting data.
							$scope.getBusinessSettingListing('false');
							$scope.upload_business_logo = false;
						}
					});
				}
				else
				{
					// If API.common_api() function return response_code rather then 200 means error msg then execute below condition
					$scope.alert_message_success = '';
					$scope.alert_message_error = data.response_message;
					$scope.success_error_message = true;
					// Get admin user listing.
					$scope.getBusinessSettingListing('false');
				}
			});
		}
	}
	// Bank settings update.
	$scope.updateBankSettings = function (bank_setting_form)
	{	
		// bank_details array define to hold bank details data
		$scope.bank_details = [];
		// required_fields-use for server side validation
		$scope.bank_setting.required_fields = [];
		for (var i = 0; i < $scope.bank_parameters.length; i++)
		{	
			// Form fields validation
			if (angular.isUndefined(bank_setting_form['bank_parameters_value_'+i].$modelValue) || bank_setting_form['bank_parameters_value_'+i].$modelValue == '')
			{
				bank_setting_form['bank_parameters_value_' + i].$dirty = true;
			//	$('input.ng-invalid').first().focus();
				document.forms['bank_setting_form'].elements['bank_parameters_value_'+i].focus();
				return false;
			}
			// Below $scope.bank_parameters.name-this variable use to get bank field name that define on top of controller
			for (var prop in $scope.bank_parameters.name)
			{
				$scope.bank_parameters = prop;
			}
			// Bank details data hold below array
			$scope.bank_details.push({bank_field_name : $scope.bank_parameters[i].name,	bank_field_value : $scope.bank_setting.bank_parameters_value[i]});
			// mandatory form fields goes to required_fields for server side validation
			$scope.bank_setting.required_fields.push({name : $scope.bank_parameters[i].name});
		}
		$scope.confirm = confirm("Are you sure you want to update bank details?");
		if ($scope.confirm == false)
		{
			return;
		}
		$scope.bank_details_loader = true; 
		$scope.bank_setting.created_by = $sessionStorage.userId;
		$scope.bank_setting.created_by_type = 'Admin';
		$scope.bank_setting.country_id = $scope.bank_setting.calling_code.split('+')[1];
		$scope.bank_setting.calling_code = $scope.bank_setting.calling_code.split('+')[0];
		$scope.bank_setting.bank_parameters_value = $scope.bank_details;
		$scope.bank_setting.cheque_payment_details = $scope.bank_setting.cheque_payment_details;
		$scope.bank_setting.required_fields.push({name : 'cheque_payment_details'});
		$scope.bank_setting.webservice_case = 'client_application_business_settings_update_general_details';
		$scope.bank_setting.database_name = $location.absUrl().split('/')[4] || "Unknown";
		$scope.bank_setting.setting_type = 'bms';
		$scope.bank_setting.update_type = 'bank_details';
		// Call API to update bank details.
		API.common_api($scope.bank_setting, 'business_settings/update').success(function (data)
		{
			$scope.bank_details_loader = false;
			// Check if successful.
			if (data.response_code == 200)
			{
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'Bank details successfully updated.';
				$scope.success_error_message = true;
				$timeout(function ()
				{
					$scope.success_error_message = false;
				}, 2000);
				// Get country wise bank parameters updata value.
				$scope.getBusinessSettingListing('false');
			}
			else
			{
				$scope.alert_message_success = '';
				$scope.alert_message_error = data.response_message;
				$scope.success_error_message = true;
				// Get country wise bank parameters update value.
				$scope.getBusinessSettingListing('false');
			}
		});
	}
	// Show add message modal after click this function by user
	$scope.modalForAddMessage = function()    
	{	
		$scope.invoice_message_model = !$scope.invoice_message_model;
		$scope.invoice_message_error = '';
	}
	// Submit a new invoice message
	$scope.add_invoice_message = {};
	$scope.addInvoiceMessage = function(add_invoice_message_form)    
	{	
		if (angular.isUndefined(add_invoice_message_form.add_message.$modelValue) || add_invoice_message_form.add_message.$modelValue == '')
		{
			add_invoice_message_form.add_message.$dirty = true;
			$('textarea.ng-invalid').focus();
			return false;
		}
		$scope.confirm = confirm("Are you sure you want to add invoice message?");
		if ($scope.confirm == false)
		{
			return;
		}
		$scope.add_new_invoice_loader = true;
		$scope.add_invoice_message.webservice_case = 'client_application_business_settings_add_general_details';
		$scope.add_invoice_message.database_name = $location.absUrl().split('/')[4]||"Unknown"; 
		$scope.add_invoice_message.setting_type = 'bms';
		$scope.add_invoice_message.update_type = 'invoice_line'; 
		$scope.add_invoice_message.required_fields = [{name : 'line'}];
		// Call API to update line message details.
		API.common_api($scope.add_invoice_message, 'business_settings/update').success(function (data)
		{
			$scope.add_new_invoice_loader = false;
			// Check if successful.
			if (data.response_code == 200)
			{
				$scope.invoice_message_error = '';
				$scope.alert_message_success = 'Invoice message successfully added.';
				$scope.success_error_message = true;
				add_invoice_message_form.add_message.$dirty = false; 
				$scope.add_invoice_message.line = "";
				$timeout(function ()
				{
					$scope.success_error_message = false;
				}, 2000);
				// Get country wise business setting update value.
				$scope.getBusinessSettingListing('false');
				$scope.modalForAddMessage();
			}
			else
			{
				$scope.alert_message_success = '';
				$scope.invoice_message_error = data.response_message;
				$scope.success_error_message = false;
			}
		});
		
	}
	// Define invoice_message array to delete invoice msg
	$scope.invoice_id = [];
	// Define invoice_message json
	$scope.invoice_message = {};
	// Below function define to delete invoice message ids
	$scope.deleteInvoiceMessage = function(id,checked_value)
	{	
		if (!Array.prototype.remove)
		{
			Array.prototype.remove = function (id)
			{
				var i = this.indexOf(id);
				return i > -1 ? this.splice(i, 1) : [];
			};
		}
		if (checked_value == 'YES')
		{	
			$scope.invoice_id.push(id);
		}
		if (checked_value == 'NO')
		{
			$scope.invoice_id.remove(id); 
		}
	}
	// Below function define to delete invoice message
	$scope.select_message = [];
	$scope.deleteInvoiceMessages = function (invoice_messege_setting_form)
	{	
		for (var i = 0; i < $scope.invoice_messages.length; i++)
		{
			if (invoice_messege_setting_form['delete_msg_' + i].$modelValue == 'YES')
			{
				$scope.select_message.push(invoice_messege_setting_form['delete_msg_' + i].$modelValue);
			}
		}
		// Check any message selected or not
		if ($scope.select_message == '')
		{
			alert('Please select a message to delete');
			return;
		}
		// Loader
		$scope.delete_invoice_messages_loader = true;
		// invoice_message json hold all required value to delete invoice message
		$scope.invoice_message.invoice_ids = $scope.invoice_id;
		$scope.invoice_message.database_name = $location.absUrl().split('/')[4] || "Unknown";
		$scope.invoice_message.webservice_case = 'client_application_business_settings_remove_invoice_line'; 
		API.common_api($scope.invoice_message, 'delete').success(function (data)
		{
			$scope.delete_invoice_messages_loader = false;
			// Check if successful.
			if (data.response_code == 200)
			{
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'Invoice message successfully deleted.';
				$scope.success_error_message = true;
				$timeout(function ()
				{
					$scope.success_error_message = false;
				}, 2000);
				$scope.getBusinessSettingListing('false');
				$scope.select_message = [];
			}
			else
			{
				$scope.alert_message_success = '';
				$scope.alert_message_error = data.response_message;
				$scope.success_error_message = true;
				$scope.select_message = [];
			}
		});
	}
	// Below function define to update invoice messages
	$scope.updateInvoiceMessagesSeting = function(invoice_messege_setting_form)  
	{	
		// invoice_line array define to hold message input data
		$scope.invoice_message.invoice_line = [];
		for (var i = 0; i < $scope.invoice_messages.length; i++)
		{	
			// invoice_line array hold message input data using push function
			$scope.invoice_message.invoice_line.push({line : invoice_messege_setting_form['invoice_line_'+i].$modelValue, _id : invoice_messege_setting_form['invoice_line_id_'+i].$modelValue});   
		}
		$scope.confirm = confirm("Are you sure you want to update invoice messages?");
		if ($scope.confirm == false)
		{
			return;
		}
		$scope.invoice_messages_loader = true;
		$scope.invoice_message.created_by = $sessionStorage.userId;
		$scope.invoice_message.created_by_type = 'Admin';
		$scope.invoice_message.webservice_case = 'client_application_business_settings_update_general_details';
		// Get DB name form URL
		$scope.invoice_message.database_name = $location.absUrl().split('/')[4] || "Unknown";
		$scope.invoice_message.setting_type = 'bms';
		$scope.invoice_message.update_type = 'invoice_line';
		// mandatory form fields goes to required_fields for server side validation
		//$scope.bank_setting.required_fields = [{name : 'job_offered_valid_for'}];
		API.common_api($scope.invoice_message, 'business_settings/update').success(function (data)
		{
			$scope.invoice_messages_loader = false;
			// Check if successful.
			if (data.response_code == 200)
			{
				// Get success message
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'Invoice messages successfully updated.';
				$scope.success_error_message = true;
				$timeout(function ()
				{
					$scope.success_error_message = false;
				}, 2000);
			}
			else
			{	
				// Get error message
				$scope.alert_message_success = '';
				$scope.alert_message_error = data.response_message;
				$scope.success_error_message = true;
			}
		});
	}
	// Submit bidding time
	$scope.bidding_time_for_job = {};
	$scope.updateBiddingForJobOffer = function(Job_offer_valid_for_form)  
	{
		if (angular.isUndefined(Job_offer_valid_for_form.bidding_job.$modelValue) || Job_offer_valid_for_form.bidding_job.$modelValue == '')
		{
			Job_offer_valid_for_form.bidding_job.$dirty = true;
			return false;
		}
		$scope.confirm = confirm("Are you sure you want to submit bidding time?");
		if ($scope.confirm == false)
		{
			return;
		}
		$scope.job_offer_loader = true;
		$scope.bidding_time_for_job.created_by = $sessionStorage.userId;
		$scope.bidding_time_for_job.created_by_type = 'Admin';
		$scope.bidding_time_for_job.webservice_case = 'client_application_business_settings_update_general_details';
		// Get DB name from URL
		$scope.bidding_time_for_job.database_name = $location.absUrl().split('/')[4] || "Unknown";
		$scope.bidding_time_for_job.setting_type = 'bms';
		$scope.bidding_time_for_job.update_type = 'bidding_time';
		// mandatory form fields goes to required_fields for server side validation
		$scope.bidding_time_for_job.required_fields = [{name : 'job_offered_valid_for'}];
		API.common_api($scope.bidding_time_for_job, 'business_settings/update').success(function (data)
		{
			$scope.job_offer_loader = false;
			// Check if successful.
			if (data.response_code == 200)
			{
				// Get success message
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'Bidding time for job successfully updated.';
				$scope.success_error_message = true;
				$timeout(function ()
				{
					$scope.success_error_message = false;
				}, 2000);
			}
			else if (data.response_code == 218)
			{
				// Get error message
				$scope.alert_message_success = '';
				$scope.alert_message_error = data.response_message;
				$scope.success_error_message = true;
			}
			else
			{	
				// Get error message
				$scope.alert_message_success = '';
				$scope.alert_message_error = data.response_message;
				$scope.success_error_message = true;
			}
		});
	}
	// Legal doc update function
	$scope.update_legal = {};
	$scope.updateLegalForm = function(business_legal_form)
	{
		$scope.confirm = confirm("Are you sure you want to update this legal documents?");
		if ($scope.confirm == false)
		{
			return;
		}
		$scope.alert_message_success = '';     
		$scope.alert_message_error = '';
		$scope.update_legal_loader = true;
		$scope.update_legal.database_name = $location.absUrl().split('/')[4] || "Unknown";
		$scope.update_legal.webservice_case = 'client_application_business_settings_update_general_details';
		$scope.update_legal.update_type = 'legals';
		$scope.update_legal.required_fields = []; 
		if (!$scope.update_legal.email_disclaimer || $scope.update_legal.email_disclaimer == 'undefined' || $scope.update_legal.email_disclaimer == '')
		{	
			$scope.update_legal.email_disclaimer = ''; 
		}
		if (!$scope.update_legal.booking_terms_and_conditions || $scope.update_legal.booking_terms_and_conditions == 'undefined' || $scope.update_legal.booking_terms_and_conditions == '')
		{	
			$scope.update_legal.booking_terms_and_conditions = ''; 
		} 		
		API.common_api($scope.update_legal, 'business_settings/update').success(function (data)
		{
			$scope.update_legal_loader = false;
			// Check if successful.
			if (data.response_code == 200)
			{
				// Get success message
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'Legal documents successfully updated.';
				$scope.success_error_message = true;
				// below function call for get updated data from DB
				$scope.getBusinessSettingListing('false');
				$timeout(function ()
				{
					$scope.success_error_message = false;
				}, 2000);
			}
			else 
			{
				if (data.response_code > 199 && data.response_code < 499)
				{
					// Get error message
					$scope.alert_message_success = '';
					$scope.alert_message_error = data.response_message;
					$scope.success_error_message = true;
				}
			}
		})
	}
	// google calender apis
	$scope.add_google_account = false;
	$scope.get_calender_code = true;
	$scope.update_google_calender_code = {};
	var correct_word_iframe ='';
	var google_calender_word 	= $rootScope.business_setting_details.google_calendar.calendar_iframe;

	var correct_word_with_colon = google_calender_word.replace(/colon/g, ":");
	var correct_word_with_equal = correct_word_with_colon.replace(/equal/g, "=");
	$scope.correct_word_iframe	= correct_word_with_equal.replace(/ampersant/g, "&");

	$scope.updateGoogleCalender = function (google_calendar_setting_form)
	{	
		if (angular.isUndefined(google_calendar_setting_form.calender_client_id.$modelValue) || google_calendar_setting_form.calender_client_id.$modelValue == '')
		{
			google_calendar_setting_form.calender_client_id.$dirty = true;
			document.forms['google_calendar_setting_form'].elements['calender_client_id'].focus();
			return false;
		}
		if (angular.isUndefined(google_calendar_setting_form.calender_client_secret.$modelValue) || google_calendar_setting_form.calender_client_secret.$modelValue == '')
		{
			google_calendar_setting_form.calender_client_secret.$dirty = true;
			document.forms['google_calendar_setting_form'].elements['calender_client_secret'].focus();
			return false;
		}
		if (angular.isUndefined(google_calendar_setting_form.redirect_url.$modelValue) || google_calendar_setting_form.redirect_url.$modelValue == '')
		{
			google_calendar_setting_form.redirect_url.$dirty = true;
			document.forms['google_calendar_setting_form'].elements['redirect_url'].focus();
			return false;
		}
		if (angular.isUndefined(google_calendar_setting_form.calendar_iframe.$modelValue) || google_calendar_setting_form.calendar_iframe.$modelValue == '')
		{
			google_calendar_setting_form.calendar_iframe.$dirty = true;
			document.forms['google_calendar_setting_form'].elements['calendar_iframe'].focus();
			return false;
		}
		$scope.confirm = confirm("Are you sure you want to update your google calendar setting?");
		if ($scope.confirm == false)
		{
			return;
		}
		// Loader on 
		$scope.google_calendar_setting_loader = true; 
		var iframe 										= $scope.business_setting.google_calendar.calendar_iframe;
		$scope.update_google_calendar 					= {};
		$scope.update_google_calendar.database_name		= $rootScope.data_base_name;
		$scope.update_google_calendar.webservice_case	= 'client_application_business_setting_update_google_calendar';
		$scope.update_google_calendar.client_id 		= $scope.business_setting.google_calendar.client_id;
		$scope.update_google_calendar.client_secret 	= $scope.business_setting.google_calendar.client_secret;
		$scope.update_google_calendar.redirect_url 		= $scope.business_setting.google_calendar.redirect_url;
	//	$scope.update_google_calendar.calendar_iframe 	= $scope.business_setting.google_calendar.calendar_iframe;         
		$scope.update_google_calendar.calendar_iframe 	= correct_word_iframe;
		
		var iframe_string = document.getElementById("calendar_iframe").value;
		
		var length = iframe_string.length;
		var new_string = '';
		for (i = 0; i < length; i++)
		{
			var iframe_char = iframe_string.charAt(i);
			switch (iframe_char)
			{
			case ':':
				new_string = new_string + 'colon';
				break;
			case '=':
				new_string = new_string + 'equal';
				break;
			case '&':
				new_string = new_string + 'ampersant';
				break;
			case '"':
				new_string = new_string + "'";
				break;
			default:
				new_string = new_string + iframe_char;
			}

		}
		$scope.update_google_calendar.calendar_iframe = new_string;
		$scope.update_google_calendar.required_fields = [];
		API.common_api($scope.update_google_calendar, 'business_settings/update').success(function (data)
		{
			// Loader off
			$scope.google_calendar_setting_loader = false;
			if (data.auth_url)
			{
				$scope.api_auth = data.auth_url;
				$scope.add_google_account = true;
				$scope.get_calender_code = true;
				$rootScope.business_setting_details.google_calendar.calendar_iframe=new_string;
			}
			else
			{
				// Get success message
				$scope.alert_message_success = '';
				$scope.alert_message_error = 'please enter correct google calendar credentials.';
				$scope.success_error_message = true;
				$scope.add_google_account=false;
				$scope.get_calender_code =false;
			}
		});
	}
	$scope.update_code_model = function ()
	{
		$scope.get_calender_code = false;
	}
	$scope.updateGoogleCalenderCode = function ()
	{
		$scope.add_google_account=false;
		$scope.update_google_calendar_code = {};
		$scope.update_google_calendar_code.database_name	= $rootScope.data_base_name;
		$scope.update_google_calendar_code.webservice_case	= 'client_application_business_setting_update_google_calendar_code';
		$scope.update_google_calendar_code.code 			= document.getElementById("update_google_calender_code").value;
		API.common_api($scope.update_google_calendar_code, 'business_settings/update').success(function (data)
		{
			$scope.add_google_account_loader = false;
			// Check if successful.
			if (data.response_code == 200)
			{
				// Get success message
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'google calendar account successfully updated.';
				$scope.success_error_message = true;
				// below function call for get updated data from DB
				$scope.getBusinessSettingListing('false');
				$timeout(function ()
				{
					$scope.success_error_message = false;
				}, 2000);
			}
			else 
			{
				if (data.response_code > 199 && data.response_code < 499)
				{
					// Get error message
					$scope.alert_message_success = '';
					$scope.alert_message_error = data.response_message;
					$scope.success_error_message = true;
				}
			}
		});
	}
	// below function will update invoice payable in day
	$scope.updateInvoiceDueDateAndCcSurchargeSetting = function ()
	{
		$scope.updated_value = document.getElementById("invoice_payable_due_date").value;
		$scope.updated_value_cc_charge = document.getElementById("cc_surcharge_percentage").value;
		if ($scope.updated_value == '' || $scope.updated_value == 'undefined')
		{
			$scope.invoice_due_date_setting_is_empty = 'Please select invoice payable due date';
			return false;
		}
		else
		{
			$scope.invoice_due_date_and_cc_surcharge_loader = true;
			$scope.update_invoice_due_date_setting = {};
			$scope.update_invoice_due_date_setting.database_name	= $rootScope.data_base_name;
			$scope.update_invoice_due_date_setting.webservice_case	= 'client_application_business_setting_update_invoice_due_date';
			$scope.update_invoice_due_date_setting.due_date			= $scope.updated_value;
			$scope.update_invoice_due_date_setting.cc_surcharge_percentage = $scope.updated_value_cc_charge; 
			API.common_api($scope.update_invoice_due_date_setting, 'business_settings/update').success(function (data)
			{
				$scope.invoice_payable_due_date = $scope.updated_value;
				$scope.cc_surcharge_percentage = $scope.updated_value_cc_charge;
				$rootScope.business_setting_details.invoice_amount_payable_in_day = $scope.updated_value;
				$scope.invoice_due_date_and_cc_surcharge_loader	 = false;
				if (data.response_code == 200)
				{
					// Get success message
					$scope.alert_message_error = '';
					$scope.alert_message_success = data.response_message;
					$scope.success_error_message = true;
					$timeout(function ()
					{
						$scope.success_error_message = false;
					}, 2000);
				}
				else 
				{
					if (data.response_code > 199 && data.response_code < 499)
					{
						// Get error message
						$scope.alert_message_success = '';
						$scope.alert_message_error = data.response_message;
						$scope.success_error_message = true;
					}
				}
			});
		}
	}
	//
	//$scope.driver_expenses = [];
	//$scope.driver_expenses.push({'expense_type':'Toll','order_id':2,'add_notes_field':false,'_id':'57306c4c9cf7eec9547b7e9c'});
	//$scope.driver_expenses.push({'expense_type':'Fuel','order_id':1,'add_notes_field':true,'_id':'57306c4c9cf7eec9547b7e7b'});
	//console.log(1311,$scope.driver_expenses);
	// Percentage select box.
	var perc_arr = [];
	for( f=0;f<=100;f=f+5 )
	{
		perc_arr.push(f);
	}
	$scope.percent_arr = perc_arr;
	// Show add driver expenses modal.
	$scope.modalForAddDriverExpense = function()    
	{	
		$scope.add_driver_expense_model = !$scope.add_driver_expense_model;
		$scope.add_driver_expense_error = '';
	}
	// Function to add driver expenses.
	$scope.add_driver_expense = {};
	$scope.add_driver_expense.add_notes_field = false;
	$scope.add_driver_expense.driver_percentage = 50;
	$scope.addDriverExpense = function(isValid)
	{
		if( isValid == false )
		{
			if( !$scope.add_driver_expense.expense )
			{
				$scope.expense = true;
			}
			if( !$scope.add_driver_expense.order_id )
			{
				$scope.order_id = true;
			}
			return false;
		}
		$scope.add_new_driver_expense_loader = true;
		$scope.add_driver_expense.database_name = $rootScope.data_base_name;
		$scope.add_driver_expense.webservice_case = 'client_application_business_settings_add_expense_type';
		// Call the api to add expense.
		API.common_api($scope.add_driver_expense,'business_settings/update').success(function(data)
		{
			$scope.add_new_driver_expense_loader = false;
			if( data.response_code == 200 )
			{
				$scope.getBusinessSettingListing('false');
				// Get success message
				$scope.alert_message_error = '';
				$scope.alert_message_success = data.response_message;
				$scope.success_error_message = true;
				$timeout(function ()
				{
					$scope.success_error_message = false;
				}, 2000);
				$scope.add_driver_expense_model = false;
			}
			else
			{
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
	// Show edit driver expenses modal.
	$scope.edit_driver_expense = {};
	$scope.modalForEditDriverExpense = function(driver_expense)    
	{	
		$scope.edit_driver_expense = driver_expense;
		$scope.edit_driver_expense.expense_id = driver_expense._id;
		$scope.edit_driver_expense_model = !$scope.edit_driver_expense_model;
		$scope.edit_driver_expense_error = '';
	}
	// Function to edit driver expense.
	$scope.editDriverExpense = function(isValid)
	{
		if( isValid == false )
		{
			if( !$scope.edit_driver_expense.expense )
			{
				$scope.expense = true;
			}
			if( !$scope.edit_driver_expense.order_id )
			{
				$scope.order_id = true;
			}
			return false;
		}
		$scope.edit_new_driver_expense_loader = true;
		$scope.edit_driver_expense.database_name = $rootScope.data_base_name;
		$scope.edit_driver_expense.webservice_case = 'client_application_business_settings_update_expense_type';
		// Call the api to edit expense.
		API.common_api($scope.edit_driver_expense,'business_settings/update').success(function(data)
		{
			$scope.edit_new_driver_expense_loader = false;
			if( data.response_code == 200 )
			{
				$scope.getBusinessSettingListing('false');
				// Get success message
				$scope.alert_message_error = '';
				$scope.alert_message_success = data.response_message;
				$scope.success_error_message = true;
				$scope.getBusinessSettingListing('false');
				$timeout(function ()
				{
					$scope.success_error_message = false;
				}, 2000);
				$scope.edit_driver_expense_model = false;
			}
			else
			{
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
	// Function to delete driver expense.
	$scope.delete_driver_expense = {};
	$scope.deleteDriverExpense = function(id)
	{
		$scope.delete_driver_expense.expense_id = id;
		$scope.delete_driver_expense_loader = true;
		$scope.delete_driver_expense.database_name = $rootScope.data_base_name;
		$scope.delete_driver_expense.webservice_case = 'client_application_business_settings_delete_expense_type';
		// Call the api to delete expense.
		API.common_api($scope.delete_driver_expense,'business_settings/update').success(function(data)
		{
			$scope.delete_new_driver_expense_loader = false;
			if( data.response_code == 200 )
			{
				// Get success message
				$scope.alert_message_error = '';
				$scope.alert_message_success = data.response_message;
				$scope.success_error_message = true;
				$scope.getBusinessSettingListing('false');
				$timeout(function ()
				{
					$scope.success_error_message = false;
				}, 2000);
				$scope.delete_driver_expense_model = false;
			}
			else
			{
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
	// Show edit driver income modal.
	$scope.edit_driver_income = {};
	$scope.modalForEditDriverIncome = function(driver_income)    
	{	
		$scope.edit_driver_income = driver_income;
		$scope.edit_driver_income.income_id = driver_income._id;
		$scope.edit_driver_income_model = !$scope.edit_driver_income_model;
		$scope.edit_driver_income_error = '';
	}
	// Function to edit driver income.
	$scope.editDriverIncome = function(isValid)
	{
		$scope.edit_new_driver_income_loader = true;
		$scope.edit_driver_income.database_name = $rootScope.data_base_name;
		$scope.edit_driver_income.webservice_case = 'client_application_business_settings_update_income';
		// Call the api to edit expense.
		API.common_api($scope.edit_driver_income,'business_settings/update').success(function(data)
		{
			$scope.edit_new_driver_income_loader = false;
			if( data.response_code == 200 )
			{
				$scope.getBusinessSettingListing('false');
				// Get success message
				$scope.alert_message_error = '';
				$scope.alert_message_success = data.response_message;
				$scope.success_error_message = true;
				$scope.getBusinessSettingListing('false');
				$timeout(function ()
				{
					$scope.success_error_message = false;
				}, 2000);
				$scope.edit_driver_income_model = false;
			}
			else
			{
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
})

// Point of interest controller.
.controller('point_of_interest',function($scope,$rootScope,API,$location,$window,$sessionStorage,$cookieStore,$timeout)
{
	// Show page loader
	$scope.point_of_interest_loader = true;
	// Check login status.
	if (localStorage.getItem('loginStatus') != 1 ||  $sessionStorage.loginStatus == 0 || $sessionStorage.userId == 0)
	{
		$location.path('/login');
		// Stop page loader
		$scope.point_of_interest_loader = false;
	}
	// Get the URL of the page.
	var page_url = $window.location.href;
	// Get the database name of the client from the URL of the page.
	var url_path = page_url.split('/');
	$rootScope.data_base_name =	url_path[4];
	// Add the database name to the array.
	$scope.country_listing = {webservice_case : 'country_listing', database_name : 'a_limokit'};
	// Call API to get country listing.
	API.getCountry($scope.country_listing).success(function(data)
    {  
        $rootScope.country_data	= data.response_data;
	});
	// Add the database name to the array.
	$scope.business_setting_listing = {webservice_case : 'client_application_business_setting_list', database_name : $rootScope.data_base_name};
	$scope.getPoiListing = function()
	{
		// Call API to get business settings listing.
		API.getListing($scope.business_setting_listing).success(function(data)
		{ 
			$rootScope.business_setting_listing_data = data.response_data[0];
			$rootScope.poi_listing_data = $rootScope.business_setting_listing_data.point_of_interest;
			$scope.callng_code = data.response_data[0].country.calling_code;
			$scope.country_name = $scope.getCountryName($scope.callng_code);
			// Show page loader
			$scope.point_of_interest_loader = false;
			// Sorting keyword
			$scope.sort_table = 'label';
			$scope.reverse = false;
		});
	}
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
	// POI listing.
	$scope.getPoiListing();
	$scope.add_poi = {};
	// Hide add poi modal.
	$scope.add_poi_modal = false;
	// Toggle modal.
	$scope.openAddPoi = function()
	{
		// Reset error and success messages.
		$scope.alert_message_success = '';
		$scope.alert_message_error = '';
		$scope.add_poi_modal = !$scope.add_poi_modal;
		$scope.add_poi.country = $scope.country_name;
	}
	// Function to add poi.
	$scope.addPoi = function(isValid)
	{
		$scope.loading = true;
		// Validations.
		if(isValid == false)
		{
			if( !$scope.add_poi.label )
			{
				$scope.label = true;
			}
			if( !$scope.add_poi.line_1 )
			{
				$scope.line_1 = true;
			}
			if( !$scope.add_poi.city )
			{
				$scope.city = true;
			}
			if( !$scope.add_poi.suburb_district )
			{
				$scope.suburb_district = true;
			}
			if( !$scope.add_poi.state )
			{
				$scope.state = true;
			}
			if( !$scope.add_poi.post_code )
			{
				$scope.post_code = true;
			}
			if( !$scope.add_poi.country )
			{
				$scope.country = true;
			}
			$scope.loading = false;
			return false;
		}
		// Add database name and webservice case to add_poi array.
		$scope.add_poi.database_name = $rootScope.data_base_name;
		$scope.add_poi.webservice_case = 'client_application_business_settings_add_point_of_interest';
		$scope.add_poi.update_type = 'address';
		// Add required fields to add_poi array.
		$scope.add_poi.required_fields = [{'name':'label'},{'name':'line_1'},{'name':'line_2'},{'name':'city'},{'name':'state'},{'name':'suburb_district'},{'name':'post_code'},{'name':'country'}];
		// Call API to add address.
		API.common_api($scope.add_poi, 'business_settings/update').success(function(data)
		{
			// Check if successful.
			if( data.response_code == 200 )
			{
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'Point of interest successfully added.';
				$scope.success_error_message = true;
				// Get admin user listing.
				$scope.getPoiListing();
				$timeout(function() 
				{
					$scope.success_error_message = false;
				}, 2000);
				$scope.loading = false;
				// Toggle modal.
				$scope.add_poi_modal = false;
			}
			else
			{
				$scope.alert_message_success = '';
				$scope.alert_message_error = data.response_message;
				// Get admin user listing.
				$scope.getPoiListing();
				$scope.loading = false;
			}
		});
	}
	$scope.edit_poi = {};
	// Hide add poi modal.
	$scope.edit_poi_modal = false;
	// Toggle modal.
	$scope.openEditPoi = function(poi)
	{
		// Reset error and success messages.
		$scope.alert_message_success = '';
		$scope.alert_message_error = '';
		$scope.edit_poi_modal = !$scope.edit_poi_modal;
		$scope.edit_poi = poi;
		$scope.edit_poi.point_of_interest_id = poi._id;
		$scope.edit_poi.id = poi._id;
	}
	// Function to edit poi.
	$scope.editPoi = function(isValid)
	{
		$scope.loading = true;
		if(isValid == false)
		{
			if( !$scope.edit_poi.label )
			{
				$scope.label = true;
			}
			if( !$scope.edit_poi.line_1 )
			{
				$scope.line_1 = true;
			}
			if( !$scope.edit_poi.city )
			{
				$scope.city = true;
			}
			if( !$scope.edit_poi.suburb_district )
			{
				$scope.suburb_district = true;
			}
			if( !$scope.edit_poi.state )
			{
				$scope.state = true;
			}
			if( !$scope.edit_poi.post_code )
			{
				$scope.post_code = true;
			}
			if( !$scope.edit_poi.country )
			{
				$scope.country = true;
			}
			$scope.loading = false;
			return false;
		}
		// Add database name and webservice case to edit_poi array.
		$scope.edit_poi.database_name = $rootScope.data_base_name;
		$scope.edit_poi.webservice_case = 'client_application_business_settings_edit_point_of_interest';
		$scope.edit_poi.update_type = 'address';
		// Add required fields to edit_poi array.
		$scope.edit_poi.required_fields = [{'name':'label'},{'name':'line_1'},{'name':'line_2'},{'name':'city'},{'name':'state'},{'name':'suburb_district'},{'name':'post_code'},{'name':'country'}];
		// Call API to add address.
		API.common_api($scope.edit_poi, 'business_settings/update').success(function(data)
		{
			// Check if successful.
			if( data.response_code == 200 )
			{
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'Point of interest successfully updated.';
				$scope.success_error_message = true;
				// Get admin user listing.
				$scope.getPoiListing();
				$timeout(function() 
				{
					$scope.success_error_message = false;
				}, 2000);
				$scope.loading = false;
				// Toggle modal.
				$scope.edit_poi_modal = false;
			}
			else
			{
				$scope.alert_message_success = '';
				$scope.alert_message_error = data.response_message;
				// Get admin user listing.
				$scope.getPoiListing();
				$scope.loading = false;
			}
		});
	}
	// Delete point of interest.
	$scope.delete_poi = {};
	$scope.deletePointOfInterest = function(poi_id)
	{
		$scope.delete_poi = {'database_name' : $rootScope.data_base_name, 'webservice_case' : 'client_application_business_settings_remove_point_of_interest', 'point_of_interest_id' : poi_id};
		API.common_api($scope.delete_poi, 'delete').success(function(data)
		{
			if( data.response_code == 200 )
			{
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'Point of interest successfully deleted.';
				$scope.success_error_message = true;
				// Get admin user listing.
				$scope.getPoiListing();
				$timeout(function() 
				{
					$scope.success_error_message = false;
				}, 2000);
			}
		});
	}
	// Sorting functionality for POI.
	$scope.sortPOITableBy = function (keyname)
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
// Templates controller
.controller('css_templates',function($scope, $rootScope, API, $location, $cookieStore, $window, $sessionStorage, $timeout)
{	
	// page loader
	$scope.template_loader = true;
	// Check login status.
	if (localStorage.getItem('loginStatus') != 1 ||  $sessionStorage.loginStatus == 0 || $sessionStorage.userId == 0)
	{
		$location.path('/login');
		// Stop page loader
		$scope.template_loader = false;
	} 
	// Json for get all templates fron main site
	$scope.get_template_from_main_site =
	{
		user_type : "admin",
		webservice_case : "client_application_template_listing",
		database_name : "a_limokit",
		type : "bms"
	};
	// API for get all templates fron main site
	API.common_api($scope.get_template_from_main_site, 'listing').success(function (data)
	{	
		if (data.response_data.length)
		{
			$scope.no_data_found = false;
			$scope.css_templates = data.response_data;
		}
		else
		{
			$scope.no_data_found = true;
		}
	})
	$rootScope.bms_template_number = $sessionStorage.bms_template_number;
	// Page loader off
	$scope.template_loader = false;
	$scope.getBmsTemplateNumber = function ()
	{	
		// Add the database name to the array.
		$scope.get_selected_bms_template = {
												webservice_case : 'client_application_business_setting_list',
												database_name : $location.absUrl().split('/')[4] || "Unknown"
											};
		// Call API to get bms template number.
		API.getListing($scope.get_selected_bms_template).success(function (data)
		{
			// Dynamically set css if user change from business setting
			$sessionStorage.bms_template_number = data.response_data[0].bms_template_number;
			$rootScope.bms_template_number = $sessionStorage.bms_template_number;
		});
	}
	// Below function define to select css template
	$scope.selectCssTemplate = function(id)
	{	
		// If user check same css that already checked
		if (id == $sessionStorage.bms_template_number)
		{
			return;
		}
		$scope.template_loader = true;
		$scope.selected_template = {};
		$scope.selected_template.bms_template_number = id;
		$scope.selected_template.webservice_case = "client_application_business_settings_update_general_details";
		$scope.selected_template.update_type = "bms_template";
		$scope.selected_template.database_name = $location.absUrl().split('/')[4] || "Unknown";
		$scope.selected_template.required_fields = [];
		API.common_api($scope.selected_template, 'business_settings/update').success(function (data)
		{
			// Check if successful.
			if (data.response_code == 200)
			{
				// Get success message
				$scope.alert_message_error = '';
				$scope.alert_message_success = 'Template successfully selected.';
				//Modal open
				$scope.success_error_message = true;
				$timeout(function ()
				{
					$scope.success_error_message = false;
				}, 2000);
				$scope.getBmsTemplateNumber();
				$scope.template_loader = false;
			}
			else
			{	
				$scope.template_loader = false;
				// Get error message
				$scope.alert_message_success = '';
				$scope.alert_message_error = data.response_message;
				$scope.success_error_message = true;
			}
		});
	}
	//For pagination function 
	$scope.selected_page_pagination = '5'; 
	$scope.page_per_pagination = 	[
										{name:'5', value: '5'}, 
										{name:'10', value: '10'}, 
										{name:'25', value: '25'}, 
										{name:'50', value: '50'}, 
										{name:'100', value: '100'}					
									];
	$scope.sort = function (keyname)
	{	
		$scope.sortKey = keyname; //set the sortKey to the param passed
		$scope.reverse = !$scope.reverse; //if true make it false and vice versa
		$scope.sort_table = keyname
	}
})     

// google calender controller
app.controller('calendar',function ($scope,$rootScope,API,$location,$window,$localStorage,$sessionStorage,$cookieStore,$timeout)
{
	var correct_word_iframe		= '';
	var google_calender_word 	= $rootScope.business_setting_details.google_calendar.calendar_iframe;
	var correct_word_with_colon = google_calender_word.replace(/colon/g, ":");
	var correct_word_with_equal = correct_word_with_colon.replace(/equal/g, "=");
	$scope.correct_iframe_url	= correct_word_with_equal.replace(/ampersant/g, "&");
})

// Below directive is very inportent so don't remove it
.directive('input', function() 
{
    return {
        restrict: 'E',
        require: '?ngModel',
        link: function(scope, elm, attr, ctrl, attributes) 
		{
            if (!ctrl) 
			{
                return;
            }
           if (attr.type == 'text' && attr.ngPattern === '/[0-9]/') 
		   {
                elm.bind('keyup',function ()
				{
                    var text = this.value;
                 //   console.log(text);
                    this.value = text.replace(/[a-zA-Z]/g,'');
                });
            }
			if (attr.type == 'text' && attr.ngPattern === '/^[0-9]{1,6}$/')
			{
				elm.bind('keyup', function ()
				{
					var text = this.value;
					//   console.log(text);
					this.value = text.replace(/[a-zA-Z]/g, '');
				}
				);
			}
			if (attr.type == 'text' && attr.ngPattern === '/^[0-9]{8,10}$/')
			{
				elm.bind('keyup', function ()
				{
					var text = this.value;
					//   console.log(text);
					this.value = text.replace(/[a-zA-Z]/g, '');
				}
				);
			}
		}
    };
});
