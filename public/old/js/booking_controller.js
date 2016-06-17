 angular.module('booking.controllers', ['google.places','ngAnimate','720kb.tooltips', 'date-picker', 'ngMessages', 'limo_client.services'])
     .controller('BookingController', function($scope, $rootScope, API, $location, $window, $sessionStorage,$filter,$parse)
     {
		 $scope.total_another_extra_fare 				= parseFloat(0);
		 $scope.total_another_extra_fare_value 			= parseFloat(0);
		 $scope.total_extra_fare 						= parseFloat(0);
		 $scope.total_extra_fare_value 					= parseFloat(0);
		 $scope.total_another_expenses					= parseFloat(0);
		 $scope.total_another_expenses_value			= parseFloat(0);
		 $scope.return_total_another_extra_fare 		= parseFloat(0);
		 $scope.return_total_another_extra_fare_value 	= parseFloat(0);
		 $scope.return_total_extra_fare 				= parseFloat(0);
		 $scope.return_total_extra_fare_value 			= parseFloat(0);
		 $scope.return_total_another_expenses 			= parseFloat(0);
		 $scope.return_total_another_expenses_value 	= parseFloat(0);		 
		 $scope.templateLoader 							= false; 
		 $scope.bookingHistoryLoader 					= false;
		 $scope.bookingListContaintPageLoader 			= true;
		 $scope.pax_phone_error_msg						= true;
		 $scope.pax_unique_error_message_div			= true;
		 $scope.unique_error_msg_div					= true;
         // Check the login status 
         if ($sessionStorage.loginStatus == 0 || $sessionStorage.userId == 0)
         {
             $location.path('/login');
         }
		 // Set the business setting calling code into a session value
		 $rootScope.business_calling_code 					= $sessionStorage.business_calling_code; // Session storage calling code store in a rootscope variable 
		 $scope.driver_payment_option_account 				= true;
		 $scope.driver_payment_option_collect 				= true;
		 $scope.return_driver_payment_option_account 		= true;
		 $scope.return_driver_payment_option_collect 		= true;
		 $scope.driver_payment_option_collect_div 			= true;
		 $scope.return_driver_payment_option_collect_div 	= true;
		 // Set the contact type value from the  sessioin variable 
		 $scope.contact_type_session_value 					= $sessionStorage.contact_type;
		 if(typeof $scope.contact_type_session_value =='undefined' || $scope.contact_type_session_value =='')
		 {
			  $scope.contact_type_session_value = localStorage.getItem("customer_contact_type");
		 }
		 $scope.admin_type_session_value = $sessionStorage.userType;
		 if(typeof $scope.admin_type_session_value=='undefined' || $scope.admin_type_session_value=='')
		 {
			$scope.admin_type_session_value = localStorage.getItem("userType");
		 }
		 $scope.customer_loder_image 							= true;
		 $scope.customer_select_loder_image 					= true;
		 $scope.booking_made_loder_image 						= true;
		 $scope.pax_drop_down_information_loder_image 			= true;		 
		 $scope.bookingHistoryLoader					 		= false;
         $scope.booking_form 									= {};
		 $scope.customer_type_div 								= false;
		 $scope.customer_list_div		  						= false;
		 $scope.booking_made_by_for_contact 					= true;
		 $scope.booking_made_by_div_for_contact_type_user 		= true;
		 $scope.external_notes_div								= false;
		 // One way driver information panel div by default show for admin 
		 $scope.one_way_driver_information_div   				= false;
		 $scope.fare_guideline									= false;
		 $scope.one_way_pick_up_point_of_interest_loader 		= false;
		 $scope.customer_type_select_loder_image  				= true;
         $scope.invoice_information 							= true;
         $scope.add_account_div			 						= true;
         $scope.showBookingMadeInformation 						= true;
         $scope.showPaxInformation 								= true;
         $scope.booking_made_by_div 							= true;
         $scope.select_passenger_div 							= true;
         $scope.pax_details_by_dropdown_select_value 			= true;
         $scope.return_details_div 								= true;
         $scope.driver_details_div 								= true;
         $scope.pick_up_hour 									= true;
         $scope.return_fare_div 								= true;
         $scope.pax_details_open_button 						= true;
         $scope.closeAccountButtonAddAccount 					= true;
         $scope.openAccountButtonAddAccount 					= false;
         $scope.closeAccountButtonAddBookingMade 				= true;
         $scope.openAccountButtonAddBookingMade 				= false;
         $scope.closeAccountButtonAddPax 						= true;
         $scope.openAccountButtonAddPax 						= false;
         $scope.active_account_div		 						= 0;
		 $scope.booking_made_by_information_active 				= 0;
		 $scope.new_pax_information_active						= 0;
		 $rootScope.one_way_calculate_extra_by_calulator 		= 0;
		 $rootScope.return_way_calculate_extra_by_calulator 	= 0;
         $scope.one_way_driver_information 						= true;
         $scope.return_way_driver_information 					= true;
         $scope.booking_save 									= false;
         $scope.base_fare_history 								= false;
         $scope.customer_id 									= $sessionStorage.userId;
         var page_url 											= $window.location.href;
         var url_path 											= page_url.split('/');
         $rootScope.data_base_name 								= url_path[4];
		 $scope.currency_symbol									= $rootScope.currency_symbol;
		 $scope.commission_div 									= true;
		 $scope.return_commission_div 							= true;
		 $scope.driver_percentage_commission_div 				= true;
		 $scope.driver_fixed_commission_div						= true;
		 $scope.driver_percentage_commission_dynamic_div 		= true;
		 $scope.return_driver_percentage_commission_div 		= true;
		 $scope.return_driver_fixed_commission_div				= true;
		 $scope.driver_fixed_commission_dynamic_div 			= true;
		 $scope.return_driver_percentage_commission_dynamic_div = true;
		 $scope.return_driver_fixed_commission_dynamic_div		= true;
         $scope.car_list 										= {};
         $scope.customer_name 									= {};
         $scope.driver_name 									= {};
		 $scope.booking_form_new_account						= {};
		 $scope.booking_form_new_booking_made_contact			= {};
		 $scope.booking_form.extra_prices		 				= [];
		 $scope.booking_form.extra_prices_val					= [];
		 $scope.booking_form.return_extra_prices 				= [];
		 $scope.booking_form.other_expenses						= []; 
		 $scope.booking_form.return_other_expenses				= [];
		 $scope.customer_select_default_dropdown 				= true;
		 $scope.booking_made_select_default_dropdown			= true;	
		 $scope.pax_select_default_dropdown						= true;
		 if(typeof $rootScope.credit_card_surcharge_percentage=='undefined')
		 {
			 $rootScope.credit_card_surcharge_percentage_value = 0.00;
		 }
		 else
		 {
			$rootScope.credit_card_surcharge_percentage_value = ($rootScope.credit_card_surcharge_percentage).toFixed(2); 
		 }
		 $scope.goToBookingId = function (page_title,page_name,booking_id,index)
		 {
			$scope.booking_sucess_modal = false; 
			$sessionStorage.job_id 		= booking_id;  
			$scope.counter++;
			$scope.tab_close_class = "glyphicon-remove";
			$rootScope.tabs.splice($rootScope.selected,1); 
			$rootScope.tabs.push({id:$scope.counter,title:page_title,content:page_name,tab_close_class:$scope.tab_close_class,"active": true});
			$rootScope.selected = $rootScope.tabs.length-1; //Set the newly added tab active.
			$rootScope.select_tab = $rootScope.tabs.length - 1;
		 }
		 $scope.deleteTab1 = function(index)
		 {
			$scope.test_tab = false;
			$rootScope.tabs.splice(index,1);  //Remove the object from the array based on index
			$rootScope.selectedTab = index-1;
			$location.path('/booking_list');
		 }
		  /* Populate the address field for Pick up and drop off address from Google autosuggestion Api
			Address1,Addrss2 ,label ,state pin code etc for one way booking  using address() function
		 */
		$scope.address = function(class_name,booking_type)
		{
			var options = {
							//componentRestrictions: {country: "in"}
						 };
			var inputs = document.getElementsByClassName(class_name);
			for (i = 0; i <inputs.length; i++) 
			{
				var autocompleteFrom = new google.maps.places.Autocomplete(inputs[i], options);

				google.maps.event.addListener(autocompleteFrom, 'place_changed', function() 
				{
					var place = autocompleteFrom.getPlace();
					
					for(i=0;i<place.address_components.length;i++)
						{
							if(booking_type=='one_way_pick_up')
							{
								$scope.get_from_latitude = place.geometry.location.lat();
								$scope.get_from_longitude = place.geometry.location.lng();
								$scope.booking_form.from_label = place.name;
							}
							if(booking_type=='one_way_drop_off')
							{
								$scope.get_to_latitude = place.geometry.location.lat();
								$scope.get_to_longitude = place.geometry.location.lng();
								$scope.booking_form.to_label = place.name;
							}
							if(place.address_components[i].types[0]=='street_number')
							{
								if(booking_type=='one_way_pick_up')
								{
									$scope.booking_form.from_address_line_1 = place.address_components[i].long_name;
								}
								if(booking_type=='one_way_drop_off')
								{
									$scope.booking_form.to_address_line_1 = place.address_components[i].long_name;
								}
							}
							if(place.address_components[i].types[0]=='route')
							{
								if(booking_type=='one_way_pick_up')
								{
									$scope.booking_form.from_address_line_2 = place.address_components[i].long_name;
								}
								if(booking_type=='one_way_drop_off')
								{
									$scope.booking_form.to_address_line_2 = place.address_components[i].long_name;
								}
							}
							if(place.address_components[i].types[0]=='locality')
							{
								if(booking_type=='one_way_pick_up')
								{
									$scope.booking_form.from_suburb = place.address_components[i].long_name;
								}
								if(booking_type=='one_way_drop_off')
								{
									$scope.booking_form.to_suburb = place.address_components[i].long_name;
								}
							}
							if(place.address_components[i].types[0]=='administrative_area_level_1')
							{
								if(booking_type=='one_way_pick_up')
								{
									$scope.booking_form.from_state = place.address_components[i].long_name;
								}
								if(booking_type=='one_way_drop_off')
								{
									$scope.booking_form.to_state = place.address_components[i].long_name;
								}
							}
							if(place.address_components[i].types[0]=='country')
							{
								if(booking_type=='one_way_pick_up')
								{
									$scope.booking_form.from_country = place.address_components[i].long_name;
								}
								if(booking_type=='one_way_drop_off')
								{
									$scope.booking_form.to_country = place.address_components[i].long_name;	
								}
							}
							if(place.address_components[i].types[0]=='postal_code')
							{
								if(booking_type=='one_way_pick_up')
								{
									$scope.booking_form.from_post_code = place.address_components[i].long_name;
								}
								if(booking_type=='one_way_drop_off')
								{
									$scope.booking_form.to_post_code = place.address_components[i].long_name;
								}
							}
						}
				});
			}
		};
		 /* Populate the address field for Pick up and drop off address from Google autosuggestion Api
		 Address1,Addrss2 ,label ,state pin code etc for return way booking  using returnAddress() function
		 */
		$scope.returnAddress = function(class_name,booking_type)
		{
			var options = {
							//componentRestrictions: {country: "in"}
						 };
			var inputs = document.getElementsByClassName(class_name);
			for (i = 0; i <inputs.length; i++) 
			{
				var autocompleteFrom = new google.maps.places.Autocomplete(inputs[i], options);
				google.maps.event.addListener(autocompleteFrom, 'place_changed', function() 
				{
					var place = autocompleteFrom.getPlace();
					for(i=0;i<place.address_components.length;i++)
						{
							if(booking_type=='return_way_pick_up')
							{
								$scope.booking_form.return_from_label = place.name;
							}
							if(booking_type=='return_way_drop_off')
							{
								$scope.booking_form.return_to_label = place.name;
							}
							
							if(place.address_components[i].types[0]=='street_number')
							{
								if(booking_type=='return_way_pick_up')
								{
									$scope.booking_form.return_from_address_line_1 = place.address_components[i].long_name;
								}
								if(booking_type=='return_way_drop_off')
								{
									$scope.booking_form.return_to_address_line_1 = place.address_components[i].long_name;
								}
							}
							if(place.address_components[i].types[0]=='route')
							{
								if(booking_type=='return_way_pick_up')
								{
									$scope.booking_form.return_from_address_line_2 = place.address_components[i].long_name;
								}
								if(booking_type=='return_way_drop_off')
								{
									$scope.booking_form.return_to_address_line_2 = place.address_components[i].long_name;
								}
							}
							if(place.address_components[i].types[0]=='locality')
							{
								if(booking_type=='return_way_pick_up')
								{
									$scope.booking_form.return_from_suburb = place.address_components[i].long_name;
								}
								if(booking_type=='return_way_drop_off')
								{
									$scope.booking_form.return_to_suburb = place.address_components[i].long_name;
								}
							}
							if(place.address_components[i].types[0]=='administrative_area_level_1')
							{
								if(booking_type=='return_way_pick_up')
								{
									$scope.booking_form.return_from_state = place.address_components[i].long_name;
								}
								if(booking_type=='return_way_drop_off')
								{
									$scope.booking_form.return_to_state = place.address_components[i].long_name;
								}
							}
							if(place.address_components[i].types[0]=='country')
							{
								if(booking_type=='return_way_pick_up')
								{
									$scope.booking_form.return_from_country = place.address_components[i].long_name;
								}
								if(booking_type=='return_way_drop_off')
								{
									$scope.booking_form.return_to_country = place.address_components[i].long_name;	
								}
							}
							if(place.address_components[i].types[0]=='postal_code')
							{
								if(booking_type=='return_way_pick_up')
								{
									$scope.booking_form.return_from_post_code = place.address_components[i].long_name;
								}
								if(booking_type=='return_way_drop_off')
								{
									$scope.booking_form.return_to_post_code = place.address_components[i].long_name;
								}
							}
						}
				});
			}
		};
		// Get Driver payment option div  for one way 
		$scope.getDriverPaymentOption = function(driver_payment_select_option)
		{
			if(driver_payment_select_option=='collect')
			{
				$scope.driver_payment_option_collect_div 			= false;
				$scope.driver_payment_option_account 				= true;
				$scope.driver_payment_option_collect 				= false;
				$scope.commission_div = true;
				if($scope.booking_form.driver_price!='')
				{
					$scope.driver_percentage_commission_div 		 = true;
					$scope.driver_percentage_commission_dynamic_div = false;
					$scope.driver_fixed_commission_div				= true;
					$scope.driver_fixed_commission_dynamic_div		= false;
				}
				else
				{
					$scope.driver_percentage_commission_div 		= false;
					$scope.driver_fixed_commission_div 				= false;
				}
			}
			if(driver_payment_select_option=='account')
			{
				$scope.commission_div 								= true;
				$scope.driver_payment_option_collect_div 			= true;
				$scope.driver_payment_option_account 				= false;
				$scope.driver_payment_option_collect 				= true;
				$scope.driver_percentage_commission_div 			= true;
				$scope.driver_fixed_commission_div 					= true;
			}
			if(driver_payment_select_option=='')
			{
				$scope.commission_div 								= true;
				$scope.driver_payment_option_collect_div 			= true;
				$scope.driver_payment_option_account 				= true;
				$scope.driver_payment_option_collect 				= true;
				$scope.driver_percentage_commission_div 			= true;
				$scope.driver_fixed_commission_div 					= true;
			}
		}
		// Get Driver payment option div for one way booking  
		$scope.returnGetDriverPaymentOption = function(return_driver_payment_select_option)
		{
			if(return_driver_payment_select_option=='collect')
			{
				$scope.return_driver_payment_option_account 			= true;
				$scope.return_driver_payment_option_collect 			= false;
				$scope.return_commission_div 							= true;
				$scope.return_driver_payment_option_collect_div 		= false; 
				$scope.return_driver_payment_option_account 			= true;
				$scope.return_driver_payment_option_collect 			= false;
				$scope.return_driver_percentage_commission_dynamic_div 	= true;
			    $scope.return_driver_fixed_commission_dynamic_div		= true;
				$scope.return_driver_percentage_commission_div 		 	= true;
				$scope.return_driver_fixed_commission_div			 	= true;
				if($scope.booking_form.return_driver_price!='')
				{
					$scope.return_driver_percentage_commission_div 		 	= true;
					$scope.return_driver_percentage_commission_dynamic_div 	= false;
					$scope.return_driver_fixed_commission_div				= true;
					$scope.return_driver_fixed_commission_dynamic_div		= false;
				}
				else
				{
						$scope.return_driver_percentage_commission_div 		 = false;
						$scope.return_driver_fixed_commission_div			 = false;
				}
			}
			if(return_driver_payment_select_option=='account')
			{
				$scope.return_driver_payment_option_account 			= false;
				$scope.return_driver_payment_option_collect 			= true;
				$scope.return_driver_percentage_commission_div 			= true;
				$scope.return_driver_percentage_commission_dynamic_div 	= true;
				$scope.return_driver_fixed_commission_div 				= true;
				$scope.return_driver_fixed_commission_dynamic_div		= true;
				$scope.return_driver_payment_option_account 			= false;
				$scope.return_driver_payment_option_collect 			= true;
				$scope.return_commission_div 							= true;
			}
		}
		$scope.getDriverCommissionStatus = function()
		{
			if($scope.booking_form.driver_commission_status=='yes')
			{
				$scope.commission_div 							= false; 
				$scope.driver_percentage_commission_dynamic_div = false;
			    $scope.driver_fixed_commission_dynamic_div		= false;
			}
			if($scope.booking_form.driver_commission_status=='no')
			{
				$scope.commission_div 							= true;
				$scope.driver_percentage_commission_div 		= true;
				 $scope.driver_fixed_commission_dynamic_div		= true;
			}
		}
		$scope.returnGetDriverCommissionStatus = function()
		{
			if($scope.booking_form.return_driver_commission_status=='yes')
			{
				$scope.return_commission_div 							= false; 
				$scope.return_driver_percentage_commission_dynamic_div 	= false;
			    $scope.return_driver_fixed_commission_dynamic_div		= false;
			}
			if($scope.booking_form.return_driver_commission_status=='no')
			{
				$scope.return_commission_div 							= true;
				$scope.return_driver_percentage_commission_div 			= true;
				$scope.return_driver_fixed_commission_dynamic_div		= true;
			}
		}
		 // Get all the active driver name from database 
         $scope.driver_name.database_name = $rootScope.data_base_name;
         $scope.driver_name.webservice_case = 'client_application_driver_list';
         API.getListing($scope.driver_name).success(function(data)
         {
			 $scope.booking_form.driver_id 						= '';
			 $scope.booking_form.return_driver_id 				= '';
			 $scope.booking_form.offered_driver_ids				= {};
			 $scope.booking_form.return_offered_driver_ids		= {};
             $scope.driver_listing_data = data.response_data;
         });
		 
         // Show new account information div 
         $scope.showNewAccountDiv = function (mode)
         {
         	if (mode == 'open')
         	{
         		$scope.active_account_div 					= 1;
         		$scope.add_account_div 						= false;
         		$scope.closeAccountButtonAddAccount 		= false;
         		$scope.openAccountButtonAddAccount 			= true;
         		$scope.showNewBookingMadetDiv('close');
         		$scope.showNewPaxDiv('close');
         		$scope.booking_made_by_div 					= true;
         		$scope.select_passenger_div 				= true;
				$scope.customer_select_default_dropdown 	= false;
				$scope.customer_select_dropdown				= true;
				$scope.pax_details_by_dropdown_select_value = true;
         	}
         	if (mode == 'close')
         	{
         		// Get all the account name customer name 
         		$scope.active_account_div 					= 0;
				$scope.customer_select_default_dropdown 	= true;
				$scope.customer_select_dropdown				= false;
         		$scope.customer_name.database_name 			= $rootScope.data_base_name;
         		$scope.customer_name.webservice_case 		= 'client_application_customer_listing';
				$scope.customer_name.customer_type 			= $scope.booking_form.customer_type;
         		API.getListing($scope.customer_name).success(function (data)
         		{
         			$scope.customer_listing_data = data.response_data;
         		}
         		);
         		$scope.add_account_div 					= true;
         		$scope.closeAccountButtonAddAccount 	= true;
         		$scope.openAccountButtonAddAccount 		= false;
         	}
         }
         // Show new customer invoice information div 
         $scope.getInvoiceInformationDiv = function()
         {
             if ($scope.booking_form_new_account.payment_type == 'invoice' || $scope.booking_form_new_account.payment_type == '')
             {
                 $scope.invoice_information = false;
             }
             if ($scope.booking_form_new_account.payment_type == 'credit_card')
             {
                 $scope.invoice_information = true;
             }
             if ($scope.booking_form_new_account.payment_type == 'collect')
             {
                 $scope.invoice_information = true;
             }
         }
         // Open the new Booking made by information div 
         $scope.showNewBookingMadetDiv = function (mode)
         {
         	if (mode == 'open')
         	{
				$scope.booking_made_by_information_active		= 1;
				$scope.booking_made_select_default_dropdown		= false;
				$scope.booking_made_by_select_dropdown			= true;			
         		$scope.booking_made_listing_data 				= {};
         		$scope.showBookingMadeInformation 				= false;
         		$scope.closeAccountButtonAddBookingMade			= false;
         		$scope.openAccountButtonAddBookingMade 			= true;
         	}
         	if (mode == 'close')
         	{
				$scope.booking_made_by_information_active		= 0;
				$scope.booking_made_select_default_dropdown		= true;
				$scope.booking_made_by_select_dropdown			= false;
         		$scope.showBookingMadeInformation 				= true;
         		$scope.closeAccountButtonAddBookingMade 		= true;
         		$scope.openAccountButtonAddBookingMade 			= false;
         	}
         }
         // Show new add pax information div 
         $scope.showNewPaxDiv = function(mode)
         {
             if (mode == 'open')
             {
				 $scope.new_pax_information_active			= 1;
				 $scope.pax_select_default_dropdown			= false;
				 $scope.pax_select_dropdown					= true;
                 $scope.showPaxInformation 					= false;
                 $scope.closeAccountButtonAddPax 			= false;
                 $scope.openAccountButtonAddPax 			= true;
				 $scope.pax_details_by_dropdown_select_value = true;
             }
             if (mode == 'close')
             {
				 $scope.new_pax_information_active			= 0;
				 $scope.pax_select_default_dropdown			= true;
				 $scope.pax_select_dropdown					= false;
                 $scope.showPaxInformation 					= true;
                 $scope.closeAccountButtonAddPax 			= true;
                 $scope.openAccountButtonAddPax 			= false;
				 $scope.pax_details_by_dropdown_select_value = false;
             }
         }
		 $scope.booking_form.customer_type 		= 'corporate';
         // All Customer list with customer type 
         $scope.booking_form_new_account 		= {};
         $scope.customer_details 				= {};
         $scope.getCustomerNameByCustomerType = function()
         {
			 $scope.customer_loder_image 				= false;
			 $scope.customer_type_select_loder_image 	= false;
			 if($scope.booking_form.customer_id=='')
			 {
				$scope.booking_form.customer_id = 3; 
			 }
             $scope.customer_details.database_name 		= $rootScope.data_base_name;
             $scope.customer_details.webservice_case 	= 'client_application_customer_listing_by_type';
             $scope.customer_details.customer_type 		= $scope.booking_form.customer_type;
             API.getListing($scope.customer_details).success(function(data)
             {
				 $scope.customer_loder_image 				= true;
				 $scope.customer_type_select_loder_image 	= true;
				 $scope.booking_form.customer_id			= '';
                 $scope.customer_listing_data 				= data.response_data;
				 
             });
			 $scope.customer_select_default_dropdown 	= true;
			 $scope.customer_select_dropdown			= false;
         }
		 if($scope.booking_form.customer_type=='corporate')
		 {
			 $scope.getCustomerNameByCustomerType();
		 }
         // Booking made by and passenger and pax dropdown div open 
         $scope.getBookingMadeByPassanger = function()
         {
             $scope.select_passenger_div 			= false;
         }
         // Drop up details table open and closed when booking dropdown change 
         $scope.getDropUpDetails = function()
         {
             $scope.booking_type = $scope.booking_form.booking_type;
             if ($scope.booking_type == 'return')
             {
                 $scope.return_fare_div 		= false;
                 $scope.return_details_div 		= false;
                 $scope.pick_up_hour 			= true;
				 if($scope.contact_type_session_value=='booking'|| $scope.contact_type_session_value=='all')
				 {
					$scope.return_way_driver_information_div = true;
				 }
             }
             if ($scope.booking_type == 'hourly')
             {
                 $scope.return_fare_div 		= true;
                 $scope.return_details_div 		= true;
                 $scope.pick_up_hour 			= false;
             }
             if ($scope.booking_type == 'one_way')
             {
                 $scope.return_fare_div 		= true;
                 $scope.pick_up_hour 			= true;
                 $scope.return_details_div 		= true;
             }
         }
         //  Get Pax details div with basis of contact type 
         $scope.getPaxDetailsDiv = function()
         {
             if ($scope.booking_form_new_account.contact_type == 'booking')
             {
                 $scope.pax_details_open_button 			= false;
             }
             if ($scope.booking_form_new_account.contact_type == 'all')
             {
                 $scope.pax_details_open_button 			= true;
                 $scope.showNewPaxInformationWithNewAccount = false;
             }
         }
         // Get Pax details from database with dropdown select value 
         $scope.getPaxDetails = function()
         {
             if ($scope.booking_form_new_booking_made.contact_type == 'booking')
             {
                 $scope.select_passenger_div = false;
             }
             if ($scope.booking_form_new_booking_made.contact_type == 'all')
             {
                 $scope.select_passenger_div = true;
				 $scope.showPaxInformation	= true;
             }
         }
        
         // Populate the pax details from database 
         $scope.pax_details = {};
         $scope.getPaxInformationBySelectValue = function(pax_id)
         {
			 $scope.pax_drop_down_information_loder_image = false;	
             if (pax_id !== '')
             {
                 $scope.pax_details_by_dropdown_select_value 	= false;
                 // Get pax information from database selected value 
                 $scope.pax_details.database_name 				= $rootScope.data_base_name;
                 $scope.pax_details.webservice_case 			= 'client_application_customer_contact_listing';
                 $scope.pax_details.id 							= pax_id;
				 $scope.pax_details.customer_id = $scope.booking_form.customer_id;
				 // If login as a booking or all type contacts
				if($scope.contact_type_session_value=='booking'|| $scope.contact_type_session_value=='all')
				 {
					  $scope.pax_details.customer_id = $sessionStorage.customer_id;
				 }
                 API.getListing($scope.pax_details).success(function(data)
                 {
					 $scope.pax_drop_down_information_loder_image = true;
                     $scope.pax_details_data = data.response_data[0].contacts[0];
					 $scope.booking_form.private_preferences = data.response_data[0].contacts[0].private_preferences;
					 $scope.booking_form.public_preferences = data.response_data[0].contacts[0].public_preferences;
					 
                 });
             }
             if (typeof pax_id == 'undefined')
             {
                 $scope.pax_details_by_dropdown_select_value = true;
                 $scope.pax_details_data = {};
             }
         }
         $scope.poiAddress = function(val)
             {
				 if($scope.contact_type_session_value=='booking'|| $scope.contact_type_session_value=='all')
					{
						$scope.booking_form.customer_id 			=  $scope.customer_id;
					}
				 // Point of interest value for One way booking pick up 
                 if (val == "one_way_pick_up")
                 {	
					 $scope.bookingHistoryLoader = true;
                     $scope.point_of_interest = {};
                     $scope.point_of_interest.database_name 	= $rootScope.data_base_name;
                     $scope.point_of_interest.webservice_case 	= 'client_application_business_setting_list';
                     API.getListing($scope.point_of_interest).success(function(data)
                     {
						 $scope.bookingHistoryLoader 	= false;
						 if(data.response_data[0].point_of_interest.length)
						 {
							$scope.no_point_of_interest_data 	= false;
							$scope.point_of_interest_data 		= data.response_data[0].point_of_interest;
						 }
						 else
						 {
							 $scope.no_point_of_interest_data = true;
						 }
                     });
					  $scope.poi_modal_pick_up_from = true;
                 }
				 
				 // Fetch the point of interest value for One way booking drop off 
                 if (val == "one_way_drop_off")
                 {
					 $scope.bookingHistoryLoader 						= true;
					 $scope.drop_off_pick_up_point_of_interest_loader = false;
                     $scope.point_of_interest 							= {};
                     $scope.point_of_interest.database_name 			= $rootScope.data_base_name;
                     $scope.point_of_interest.webservice_case 			= 'client_application_business_setting_list';
                     API.getListing($scope.point_of_interest).success(function(data)
                     {
						 $scope.bookingHistoryLoader = false;
						 if(data.response_data[0].point_of_interest.length)
						 {
							$scope.no_point_of_interest_data_for_drop_off 	= false;
							$rootScope.point_of_interest_data_for_drop_off 	= data.response_data[0].point_of_interest;
						 }
						 else
						 {
							$scope.no_point_of_interest_data_for_drop_off = true; 
						 }
                     });
                     $scope.poi_modal_drop_off_from = true;
                 }
                 // Customer address history for one way booking pick up address 
                 if (val == "one_way_pick_up_cust")
                 {
					if (!$scope.booking_form.customer_id)
					{
						$scope.booking_form_validate.customer_name.$dirty = true;
						return;
					} 
					 $scope.bookingHistoryLoader = true;
                     $scope.one_way_and_return_cust = {
														 'customer_id'		: $scope.booking_form.customer_id,
														 'database_name'	: $rootScope.data_base_name,
														 'webservice_case'	: "client_application_customer_contact_address_listing",
														 'required_fields'	: []
														}
                     API.common_api($scope.one_way_and_return_cust, 'listing').success(function(one_way_and_return_cust_data)
                     {
						 $scope.bookingHistoryLoader = false;
						 if(one_way_and_return_cust_data.response_data.length)
						 {
							 $rootScope.no_cust_data 	= false;
							 $rootScope.cust_data 		= one_way_and_return_cust_data.response_data;
						 }
						 else
						 {
							$rootScope.no_cust_data = true;
						 }
                     });
                     $scope.poi_modal_cust_from = true;
                 }
				 //  Customer address history for one way booking drop off address 
                 if (val == "one_way_drop_off_cust")
                 {
					 if (!$scope.booking_form.customer_id)
					{
						$scope.booking_form_validate.customer_name.$dirty = true;
						return;
					} 
					 $scope.bookingHistoryLoader = true;
                     $scope.one_way_and_return_cust = {
														 'customer_id'		: $scope.booking_form.customer_id,
														 'database_name'	: $rootScope.data_base_name,
														 'webservice_case'	: "client_application_customer_contact_address_listing",
														 'required_fields'	: []
														}
                     API.common_api($scope.one_way_and_return_cust, 'listing').success(function(one_way_and_return_cust_data)
                     {
						 $scope.bookingHistoryLoader = false;
						 if (one_way_and_return_cust_data.response_data.length)
						 {
							 $rootScope.no_one_way_drop_off_cust 	= false;
							 $scope.one_way_drop_off_cust 			= one_way_and_return_cust_data.response_data;
						 }
						 else
						 {
							$rootScope.no_one_way_drop_off_cust = true;
						 }
                     });
                     $scope.poi_modal_cust_to = true;
                 }
                 // Pax address history for one way booking pick up address 
                 if (val == "one_way_pick_up_pax")
                 {
					if (!$scope.booking_form.customer_id)
					{
						$scope.booking_form_validate.customer_name.$dirty = true;
						return;
					}
					if (!$scope.booking_form.pax_id)
					{
						$scope.booking_form_validate.paxname.$dirty = true;
						return;
					}
					 $scope.bookingHistoryLoader = true;
                     $scope.one_way_pax = {
												 'customer_id' 		: $scope.booking_form.customer_id,
												 'pax_id' 			: $scope.booking_form.pax_id,
												 'database_name'	: $rootScope.data_base_name,
												 'webservice_case' 	: "client_application_customer_contact_address_listing",
												 'required_fields' 	: []
											}
                     API.common_api($scope.one_way_pax, 'listing').success(function(one_way_and_return_pax_data)
                     {	
						$scope.bookingHistoryLoader = false;
						if(one_way_and_return_pax_data.response_data.length)
						{
							$scope.no_pax_data = false;
							$scope.pax_data = one_way_and_return_pax_data.response_data;
						}
						else
						{
							$scope.no_pax_data = true;
						}
                     });
                     $scope.poi_modal_one_way_pick_up_pax_from = true;
                 }
				 // Pax address history one way booking drop off address 
                 if (val == "one_way_drop_off_pax")
                 {
					 if (!$scope.booking_form.customer_id)
					 {
					 	$scope.booking_form_validate.customer_name.$dirty = true;
					 	return;
					 }
					 if (!$scope.booking_form.pax_id)
					 {
					 	$scope.booking_form_validate.paxname.$dirty = true;
					 	return;
					 }
					 $scope.bookingHistoryLoader = true;
                     $scope.one_way_pax = {
											 'customer_id'		: $scope.booking_form.customer_id,
											 'pax_id'			: $scope.booking_form.pax_id,
											 'database_name'	: $rootScope.data_base_name,
											 'webservice_case'	: "client_application_customer_contact_address_listing",
											 'required_fields'	: []
										}
					  // Call the Api for fetch Pax address history one way booking drop off address 
                     API.common_api($scope.one_way_pax, 'listing').success(function(one_way_and_return_pax_data)
                     {
						 $scope.bookingHistoryLoader = false;
						 if(one_way_and_return_pax_data.response_data.length)
						 {
							 $scope.no_drop_off_pax_data = false;
							$scope.drop_off_pax_data = one_way_and_return_pax_data.response_data;
						 }
						 else
						 {
							$scope.no_drop_off_pax_data = true;
						 }
                     });
                     $scope.drop_off_modal_one_way_pick_up_pax_from = true;
                 }
                	
                 if (val == "return_pick_up_poi")
                 {
					 $scope.bookingHistoryLoader 				= true;
                     $scope.point_of_interest 					= {};
                     $scope.point_of_interest.database_name 	= $rootScope.data_base_name;
                     $scope.point_of_interest.webservice_case 	= 'client_application_business_setting_list';
                     API.getListing($scope.point_of_interest).success(function(data)
                     {
						 $scope.bookingHistoryLoader = false;
						 if(data.response_data[0].point_of_interest.length)
						 {
							 $rootScope.no_point_of_interest_data_for_return 	= false;
							$rootScope.point_of_interest_data_for_return 		= data.response_data[0].point_of_interest;
						 }
						 else
						 {
							 $rootScope.no_point_of_interest_data_for_return = true;
						 }
                     });
                     $scope.poi_modal_pick_up_from_for_return = true;
                 }
                 if (val == "return_drop_off_poi")
                 {
					 $scope.bookingHistoryLoader 				= true;
                     $scope.point_of_interest 					= {};
                     $scope.point_of_interest.database_name 	= $rootScope.data_base_name;
                     $scope.point_of_interest.webservice_case 	= 'client_application_business_setting_list';

                     API.getListing($scope.point_of_interest).success(function(data)
                     {
						 $scope.bookingHistoryLoader = false;
						 if(data.response_data[0].point_of_interest.length)
						 {
							 $rootScope.no_poi_data_for_drop_off_for_return 	= false;
							$rootScope.poi_data_for_drop_off_for_return 		= data.response_data[0].point_of_interest;
						 }
						 else
						 {
							$rootScope.no_poi_data_for_drop_off_for_return = true;
						 }
                     });
                     $scope.poi_modal_drop_off_from_for_return = true;
                 }
                 if (val == "return_pick_up_cust")
                 {
					  if (!$scope.booking_form.customer_id)
					  {
					  	$scope.booking_form_validate.customer_name.$dirty = true;
					  	return;
					  }
					 $scope.bookingHistoryLoader = true;
                     $scope.one_way_and_return_cust = {
														 'customer_id'		: $scope.booking_form.customer_id,
														 'database_name'	: $rootScope.data_base_name,
														 'webservice_case'	: "client_application_customer_contact_address_listing",
														 'required_fields'	: []
														}
                     API.common_api($scope.one_way_and_return_cust, 'listing').success(function(one_way_and_return_cust_data)
                     {
						 $scope.bookingHistoryLoader = false;
						 if (one_way_and_return_cust_data.response_data)
						 {
							$scope.no_return_cust_data 	= false;
							$scope.return_cust_data 	= one_way_and_return_cust_data.response_data;
						 }
						 else
						 {
							$scope.no_return_cust_data = true;
						 }
                     });
                     $scope.poi_modal_cust_from_return = true;
                 }
                 if (val == "return_drop_off_cust")
                 {
					   if (!$scope.booking_form.customer_id)
					  {
					  	$scope.booking_form_validate.customer_name.$dirty = true;
					  	return;
					  }
					 $scope.bookingHistoryLoader = true;
                     $scope.one_way_and_return_cust = {
														 'customer_id'		: $scope.booking_form.customer_id,
														 'database_name'	: $rootScope.data_base_name,
														 'webservice_case'	: "client_application_customer_contact_address_listing",
														 'required_fields'	: []
														}
                     API.common_api($scope.one_way_and_return_cust, 'listing').success(function(one_way_and_return_cust_data)
                     {
						 $scope.bookingHistoryLoader = false;
						 if(one_way_and_return_cust_data.response_data.length)
						 {
							$rootScope.no_return_drop_off_cust = false;
							$rootScope.return_drop_off_cust = one_way_and_return_cust_data.response_data;
						 }
						 else
						 {
							$rootScope.no_return_drop_off_cust = true;
						 }
                     });
                     $scope.return_modal_cust_to = true;
                 }
                  // Pax address history for return way journey 
                 if (val == "return_pick_up_pax")
                 {
					if (!$scope.booking_form.customer_id)
					{
						$scope.booking_form_validate.customer_name.$dirty = true;
						return;
					}
					if (!$scope.booking_form.pax_id)
					{
						$scope.booking_form_validate.paxname.$dirty = true;
						return;
					}
					 $scope.bookingHistoryLoader = true;
                     $scope.one_way_pax = {
											 'customer_id'		: $scope.booking_form.customer_id,
											 'pax_id'			: $scope.booking_form.pax_id,
											 'database_name'	: $rootScope.data_base_name,
											 'webservice_case'	: "client_application_customer_contact_address_listing",
											 'required_fields'	: []
											}
                     API.common_api($scope.one_way_pax, 'listing').success(function(one_way_and_return_pax_data)
                     {
						 $scope.bookingHistoryLoader = false;
						 if	(one_way_and_return_pax_data.response_data.length)
						 {
							$scope.no_return_pax_data = false;
							$scope.return_pax_data = one_way_and_return_pax_data.response_data;
						 }
						 else
						 {
							 $scope.no_return_pax_data = true;
						 }
                     });
                     $scope.poi_modal_return_pick_up_pax_from = true;
                 }
                 if (val == "return_drop_off_pax")
                 {
					 if (!$scope.booking_form.customer_id)
					 {
					 	$scope.booking_form_validate.customer_name.$dirty = true;
					 	return;
					 }
					 if (!$scope.booking_form.pax_id)
					 {
					 	$scope.booking_form_validate.paxname.$dirty = true;
					 	return;
					 }
					  $scope.bookingHistoryLoader = true;
                      $scope.one_way_pax = {
											 'customer_id'		: $scope.booking_form.customer_id,
											 'pax_id'			: $scope.booking_form.pax_id,
											 'database_name'	: $rootScope.data_base_name,
											 'webservice_case'	: "client_application_customer_contact_address_listing",
											 'required_fields'	: []
											}
                     API.common_api($scope.one_way_pax, 'listing').success(function(one_way_and_return_pax_data)
                     {
						 $scope.bookingHistoryLoader = false;
						 if(one_way_and_return_pax_data.response_data.length)
						 {
							$scope.no_return_drop_off_pax_data = false;
							$scope.return_drop_off_pax_data = one_way_and_return_pax_data.response_data;
						 }
						 else
						 {
							$scope.no_return_drop_off_pax_data = true;
						 }
                     });
                     $scope.drop_off_modal_return_pick_up_pax_from = true;
                 }
             }
          //  Below functions is use for get LAT LONG from Pickup Location 
         $scope.getLatitudeLongitudeOfPickup = function (address)
         {
         	address = address || 'Ferrol, Galicia, Spain';
         	// Initialize the Geocoder 
         	geocoder = new google.maps.Geocoder();
         	if (geocoder)
         	{
         		geocoder.geocode(
         		{
         			'address' : address
         		}, function (results, status)
         		{
         			if (status == google.maps.GeocoderStatus.OK)
         			{
         				$sessionStorage.lat = results[0].geometry.location.lat();
         				$sessionStorage.lng = results[0].geometry.location.lng();
         			}
         		}
         		);
         	}
         }

		 $scope.fareEstimationAndFareHistory = function(booking_type)
			{
				$scope.base_fare.database_name 		= $location.absUrl().split('/')[4] || "Unknown";
				$scope.base_fare.booking_type 		= booking_type;
				$scope.base_fare.webservice_case 	= "client_application_distance_fare_estimator_for_car";
				
				// Api for fare estimator
				API.common_api($scope.base_fare, 'fare_estimator').success(function (base_fare_data)
				{
					$scope.calculate_base_fare 			= base_fare_data.response_data[0].car_fare;
					$scope.distance						= base_fare_data.distance;
					$scope.currency_symbol				= $rootScope.currency_symbol;
					$scope.base_fare.webservice_case 	= "client_application_fare_list_point_to_point";
					$scope.base_fare.customer_id 		= $scope.booking_made.id;
					API.common_api($scope.base_fare, 'listing').success(function (base_fare_data_for_same_and_other_customer)
					{
						if(base_fare_data_for_same_and_other_customer.response_code == 200)
						{
						    // Fetch the fare history for this selected customer
							$scope.calculate_base_fare_for_same_customer 		= base_fare_data_for_same_and_other_customer.response_data.customer_journey_history;
							// Fetch the fare history for the others customer
							$scope.calculate_base_fare_for_other_customer 		= base_fare_data_for_same_and_other_customer.response_data.other_customer_journey;
						}
						else
						{
							//$scope.bookingHistoryLoader = true;
						}
					});
					$scope.base_fare_history = true;
				});
			}
         // Open modal for base fare history(Fare estimation, For This customer and another customer) 
         $scope.base_fare = {};
         $scope.BaseFareModal = function (val,booking_type)
         {
			// If the booking type is one way 
			if(booking_type=='one_way')
			{
				if ($scope.booking_form.car_type_id)
				{
					$scope.base_fare.car_id = $scope.booking_form.car_type_id;
				}
				else
				{
					alert('Please choose a car');
					return;
				}
				if ($scope.booking_form.from_address_line_1)
				{
					$scope.base_fare.from_address_line_1 = $scope.booking_form.from_address_line_1;
				}
				else
				{
					$scope.base_fare.from_address_line_1 = '';
				}
				if ($scope.booking_form.from_address_line_2)
				{
					$scope.base_fare.from_address_line_2 = $scope.booking_form.from_address_line_2;
				}
				else
				{
					$scope.base_fare.from_address_line_2 = '';
				}
				if ($scope.booking_form.to_address_line_1)
				{
					$scope.base_fare.to_address_line_1 = $scope.booking_form.to_address_line_1;      
				}
				
				if ($scope.booking_form.to_address_line_2)
				{
					$scope.base_fare.to_address_line_2 = $scope.booking_form.to_address_line_2;
				}
				else
				{
					$scope.base_fare.to_address_line_2 = '';
				}
			}
			
			if(booking_type=='return_way')
			{
				if ($scope.booking_form.return_car_type_id)
				{
					$scope.base_fare.car_id = $scope.booking_form.return_car_type_id;
				}
				else
				{
					alert('Please choose a car');
					return;
				}
				if ($scope.booking_form.return_from_address_line_1)
				{
					$scope.base_fare.from_address_line_1 = $scope.booking_form.return_from_address_line_1;
				}
				else
				{
					$scope.base_fare.from_address_line_1 = '';
				}
				if ($scope.booking_form.return_from_address_line_2)
				{
					$scope.base_fare.from_address_line_2 = $scope.booking_form.return_from_address_line_2;
				}
				else
				{
					$scope.base_fare.from_address_line_2 = '';
				}
				if ($scope.booking_form.return_to_address_line_1)
				{
					$scope.base_fare.to_address_line_1 = $scope.booking_form.return_to_address_line_1;      
				}
				
				if ($scope.booking_form.return_to_address_line_2)
				{
					$scope.base_fare.to_address_line_2 = $scope.booking_form.return_to_address_line_2;
				}
				else
				{
					$scope.base_fare.to_address_line_2 = '';
				}
			}
			
			if(typeof $scope.get_from_latitude!='undefined' ||  typeof $scope.get_from_longitude != 'undefined')
			{
				$scope.base_fare.from_latitude = $scope.get_from_latitude;
				$scope.base_fare.from_longitude = $scope.get_from_longitude;
				$scope.base_fare.to_latitude 	= $scope.get_to_latitude;
				$scope.base_fare.to_longitude 	= $scope.get_to_longitude;
				$scope.fareEstimationAndFareHistory(booking_type);
			}
			if( typeof $scope.get_from_latitude=='undefined' ||typeof $scope.get_from_longitude == 'undefined')
			{
				// If the booking type one way then 
				if(booking_type=='one_way')
				{
					$scope.edit_booking_mode_type = booking_type;
					$scope.from_address 			= $scope.base_fare.from_address_line_1 + ', ' + $scope.base_fare.from_address_line_2+ ','+ $scope.booking_form.from_suburb +','+$scope.booking_form.from_state;
					var from_address 				= $scope.from_address;
					$scope.to_address 				= $scope.base_fare.to_address_line_1 + ', ' + $scope.base_fare.to_address_line_2+','+ $scope.booking_form.to_suburb +','+$scope.booking_form.to_state;
				}
				// If the booking type one way then 
				if(booking_type=='return_way')
				{
					$scope.edit_booking_mode_type 	= booking_type;
					$scope.from_address 			= $scope.base_fare.from_address_line_1 + ', ' + $scope.base_fare.from_address_line_2+ ','+ $scope.booking_form.return_from_suburb +','+$scope.booking_form.return_from_state;
					var from_address 				= $scope.from_address;
					$scope.to_address 				= $scope.base_fare.to_address_line_1 + ', ' + $scope.base_fare.to_address_line_2+','+ $scope.booking_form.return_to_suburb +','+$scope.booking_form.return_to_state;
				}
				
				var to_address 	= $scope.to_address;
				from_geocoder 	= new google.maps.Geocoder();
				to_geocoder 	= new google.maps.Geocoder();
				if (from_geocoder)
				{
					from_geocoder.geocode(
					{
						'address' : from_address
					}, function (results, status)
					{
						if (status == google.maps.GeocoderStatus.OK)
						{
							$scope.base_fare.from_latitude = results[0].geometry.location.lat();
							$scope.base_fare.from_longitude = results[0].geometry.location.lng();
							// If success then 
							to_geocoder.geocode(
												{
													'address' : to_address
												}, function (results, status)
												{
													if (status == google.maps.GeocoderStatus.OK)
													{
														$scope.base_fare.to_latitude = results[0].geometry.location.lat();
														$scope.base_fare.to_longitude = results[0].geometry.location.lng();
														$scope.fareEstimationAndFareHistory(booking_type);
													}
												}
											);
									}
								}
						);
				}
			}
			
         }
         // Set all the modal value
         $rootScope.setPoivalue = function(val, point_of_interest)
         {
			 
             if (val == "poi_pick_up")
             {
                 $scope.poi_modal_pick_up_from = false;
				 $scope.booking_form.from_label 		 = point_of_interest.label;
                 $scope.booking_form.from_address_line_1 = point_of_interest.line_1;
                 $scope.booking_form.from_address_line_2 = point_of_interest.line_2;
                 $scope.booking_form.from_suburb 		= point_of_interest.suburb_district;
				 $scope.booking_form.from_state			= point_of_interest.state;
				 $scope.booking_form.from_post_code		= point_of_interest.post_code;
				 $scope.booking_form.from_country 		= point_of_interest.country;
             }
             if (val == "poi_drop_off")
             {
                 $scope.poi_modal_drop_off_from 		= false;
				 $scope.booking_form.to_label 		 	= point_of_interest.label;
                 $scope.booking_form.to_address_line_1 = point_of_interest.line_1;
                 $scope.booking_form.to_address_line_2 = point_of_interest.line_2;
				 $scope.booking_form.to_suburb 			= point_of_interest.suburb_district;
				 $scope.booking_form.to_state			= point_of_interest.state;
				 $scope.booking_form.to_post_code		= point_of_interest.post_code;
				 $scope.booking_form.to_country 		= point_of_interest.country;
             }
             if (val == "poi_pick_up_cust")
             {
                 $scope.poi_modal_cust_from = false;
				 $scope.booking_form.from_label 		 = point_of_interest._id.label;
                 $scope.booking_form.from_address_line_1 = point_of_interest._id.line_1;
                 $scope.booking_form.from_address_line_2 = point_of_interest._id.line_2;
				 $scope.booking_form.from_suburb 		= point_of_interest._id.suburb_district;
				 $scope.booking_form.from_state			= point_of_interest._id.state;
				 $scope.booking_form.from_post_code		= point_of_interest._id.post_code;
				 $scope.booking_form.from_country 		= point_of_interest._id.country;
				
             }
             if (val == "poi_drop_off_cust")
             {
                 $scope.poi_modal_cust_to = false;
				 $scope.booking_form.to_label 		 		= point_of_interest._id.label;
                 $scope.booking_form.to_address_line_1 		= point_of_interest._id.line_1;;
                 $scope.booking_form.to_address_line_2 		= point_of_interest._id.line_2;
				 $scope.booking_form.to_suburb 				= point_of_interest._id.suburb_district;
				 $scope.booking_form.to_state				= point_of_interest._id.state;
				 $scope.booking_form.to_post_code			= point_of_interest._id.post_code;
				 $scope.booking_form.to_country 			= point_of_interest._id.country;

             }
             if (val == "pax_data")
             {
                 $scope.poi_modal_one_way_pick_up_pax_from = false;
                 $scope.booking_form.from_label 		 = point_of_interest._id.label;
                 $scope.booking_form.from_address_line_1 = point_of_interest._id.line_1;
                 $scope.booking_form.from_address_line_2 = point_of_interest._id.line_2;
				 $scope.booking_form.from_suburb 		= point_of_interest._id.suburb_district;
				 $scope.booking_form.from_state			= point_of_interest._id.state;
				 $scope.booking_form.from_post_code		= point_of_interest._id.post_code;
				 $scope.booking_form.from_country 		= point_of_interest._id.country;
             }
			 // Set pax history data in one way booking as a drop off address 
             if (val == "drop_off_pax_data")
             {
				
                 $scope.drop_off_modal_one_way_pick_up_pax_from = false;
                 $scope.booking_form.to_label 		 		= point_of_interest._id.label;
                 $scope.booking_form.to_address_line_1 		= point_of_interest._id.line_1;;
                 $scope.booking_form.to_address_line_2 		= point_of_interest._id.line_2;
				 $scope.booking_form.to_suburb 				= point_of_interest._id.suburb_district;
				 $scope.booking_form.to_state				= point_of_interest._id.state;
				 $scope.booking_form.to_post_code			= point_of_interest._id.post_code;
				$scope.booking_form.to_country 			= point_of_interest._id.country;
             }
           
             if (val == "return_poi_pick_up")
             {
                 $scope.poi_modal_pick_up_from_for_return = false;
				 $scope.booking_form.return_from_label 		 	= point_of_interest.label;
                 $scope.booking_form.return_from_address_line_1 = point_of_interest.line_1;
                 $scope.booking_form.return_from_address_line_2 = point_of_interest.line_2;
				 $scope.booking_form.return_from_suburb 		= point_of_interest.suburb_district;
				 $scope.booking_form.return_from_state			= point_of_interest.state;
				 $scope.booking_form.return_from_post_code		= point_of_interest.post_code;
				 $scope.booking_form.return_from_country 		= point_of_interest.country;
             }
             if (val == "return_poi_drop_off")
             {
                 $scope.poi_modal_drop_off_from_for_return = false;
				 $scope.booking_form.return_to_label 		 	= point_of_interest.label;
                 $scope.booking_form.return_to_address_line_1 = point_of_interest.line_1;
                 $scope.booking_form.return_to_address_line_2 = point_of_interest.line_2;
				 $scope.booking_form.return_to_city 		  = point_of_interest.city;
				 $scope.booking_form.return_to_suburb 			= point_of_interest.suburb_district;
				 $scope.booking_form.return_to_state			= point_of_interest.state;
				 $scope.booking_form.return_to_post_code		= point_of_interest.post_code;
				 $scope.booking_form.return_to_country 			= point_of_interest.country;
             }
             if (val == "return_pick_up_cust")
             {
                 $scope.poi_modal_cust_from_return = false;
				 $scope.booking_form.return_from_label 		 	= point_of_interest._id.label;
                 $scope.booking_form.return_from_address_line_1 = point_of_interest._id.line_1;
                 $scope.booking_form.return_from_address_line_2 = point_of_interest._id.line_2;
				 $scope.booking_form.return_from_suburb 		= point_of_interest._id.suburb_district;
				 $scope.booking_form.return_from_state			= point_of_interest._id.state;
				 $scope.booking_form.return_from_post_code		= point_of_interest._id.post_code;
				 $scope.booking_form.return_from_country 		= point_of_interest._id.country;
             }
             if (val == "return_poi_drop_off_cust")
             {
                 $scope.return_modal_cust_to = false;
				 $scope.booking_form.return_to_label 		 		= point_of_interest._id.label;
                 $scope.booking_form.return_to_address_line_1 		= point_of_interest._id.line_1;;
                 $scope.booking_form.return_to_address_line_2 		= point_of_interest._id.line_2;
				 $scope.booking_form.return_to_suburb 				= point_of_interest._id.suburb_district;
				 $scope.booking_form.return_to_state				= point_of_interest._id.state;
				 $scope.booking_form.return_to_post_code			= point_of_interest._id.post_code;
				 $scope.booking_form.return_to_country 				= point_of_interest._id.country;
             }
             if (val == "return_pick_up_pax_data")
             {
                 $scope.poi_modal_return_pick_up_pax_from = false;
                 $scope.booking_form.return_from_label 		 	= point_of_interest._id.label;
                 $scope.booking_form.return_from_address_line_1 = point_of_interest._id.line_1;
                 $scope.booking_form.return_from_address_line_2 = point_of_interest._id.line_2;
				 $scope.booking_form.return_from_suburb 		= point_of_interest._id.suburb_district;
				 $scope.booking_form.return_from_state			= point_of_interest._id.state;
				 $scope.booking_form.return_from_post_code		= point_of_interest._id.post_code;
				 $scope.booking_form.return_from_country 		= point_of_interest._id.country;
             }
             if (val == "return_drop_off_pax_data")
             {
                 $scope.drop_off_modal_return_pick_up_pax_from = false;
                 $scope.booking_form.return_to_label 		 		= point_of_interest._id.label;
                 $scope.booking_form.return_to_address_line_1 		= point_of_interest._id.line_1;;
                 $scope.booking_form.return_to_address_line_2 		= point_of_interest._id.line_2;
				 $scope.booking_form.return_to_suburb 				= point_of_interest._id.suburb_district;
				 $scope.booking_form.return_to_state				= point_of_interest._id.state;
				 $scope.booking_form.return_to_post_code			= point_of_interest._id.post_code;
				 $scope.booking_form.return_to_country 				= point_of_interest._id.country;
             }
         }
         //  Add an extra field for fare extra charge 
		 $scope.booking_form.add_another_extra 			= [];
		 $scope.booking_form.return_add_another_extra 	= [];
         $scope.choices 								= [];
         $scope.addNewChoice = function()
         {
             var newItemNo = $scope.choices.length + 1;
             $scope.choices.push(
								 {
									 'id': 'choice' + newItemNo
								 }
								);
			// Push the value in add an another extra array for one way booking 					
			 $scope.booking_form.add_another_extra.push(
														{
														  "extras_type_id": '',
														  "name": "",
														  "extra_price": 0.00
														}
														);
			$scope.booking_form.return_add_another_extra.push(
														{
														  "extras_type_id": '',
														  "name": "",
														  "extra_price": 0.00
														}
														);											
			
         };
		 // Remove  an extra added filed using this function  for one way booking 
         $scope.removeChoice = function(index,extra_price_value)
         {
			 $scope.booking_form.extra_prices_val[index+1] = '';
             var lastItem = $scope.choices.length - 1;
             $scope.choices.splice(lastItem);
			 if(typeof $scope.booking_form.return_extra_prices_val!='undefined')
			 {
				$scope.return_extra_price_value =  $scope.booking_form.return_extra_prices_val[index+1];
			 }
			 
			 // Check the fare value undefined or not  
			 // Remove the extra fare for return way booking
			 if(typeof extra_price_value!='undefined'&& extra_price_value!='')
			 {
				$scope.booking_form.add_another_extra.splice(index);
				$scope.oneWayFareCalculation(index,'extra',extra_price_value,'remove_another_extra');
			 }
			 // Remove the extra fare for return way booking
			  if(typeof $scope.return_extra_price_value!='undefined'&& $scope.return_extra_price_value!='')
			 {
				$scope.booking_form.return_add_another_extra.splice(index);
				$scope.returnWayFareCalculation(index,'extra',$scope.return_extra_price_value,'remove_another_extra');
				$scope.booking_form.return_extra_prices_val[index+1] = '';
			 }
         };
		 // Remove an extra field for return way booking 
			$scope.returnRemoveChoice = function(index,extra_price_value)
			{
				$scope.return_extra_price_value =  $scope.booking_form.return_extra_prices_val[index+1];
				if(typeof $scope.return_extra_price_value!='undefined'&& $scope.return_extra_price_value!='')
				{
					$scope.booking_form.return_add_another_extra.splice(index);
					$scope.returnWayFareCalculation(index,'extra',$scope.return_extra_price_value,'remove_another_extra');
					$scope.booking_form.return_extra_prices_val[index+1] = '';
				}
			};
		 // Set the Another extra field name dynamically 
		 $scope.oneWayExtraFiledName= function(index,field_name)
		 {
			$scope.booking_form.add_another_extra[index].name = field_name;
		 }
         // Add an extra fare field dynamic create for one way booking 
         $scope.via = [];
		 // Function for add extra fields
         $scope.addVia = function()
         {
             var viaNo = $scope.via.length + 1;
             $scope.via.push(
							 {
								 'id': 'choice' + viaNo
							 }
						);
         }
		 // Function for remove an extra fields for one way booking 
         $scope.removeVia = function()
         {
             var lastViaItem = $scope.via.length - 1;
             $scope.via.splice(lastViaItem);
         };
         // Add an extra fare field dynamic create for return way booking 
         $scope.returnvia = [];
         $scope.returnVia = function()
         {
             var returnviaNo = $scope.returnvia.length + 1;
             $scope.returnvia.push(
									 {
										 'id': 'choice' + returnviaNo
									 }
									);
         }
		  // Function for remove an extra fields for return way booking 
         $scope.removeReturnVia = function()
         {
             var lastRetunViaItem = $scope.returnvia.length - 1;
             $scope.returnvia.splice(lastRetunViaItem);
         };

         //  Add Retun way drop up 
         $scope.returnwaydropvia = [];
         $scope.returnWayDropvia = function()
         {
             var returnwaydropviaNo = $scope.returnwaydropvia.length + 1;
             $scope.returnwaydropvia.push(
											 {
												 'id': 'choice' + returnwaydropviaNo
											 }
										);
         }
         $scope.removeReturnWayDropupVia = function()
         {
             var lastRetunWayDropViaItem = $scope.returnwaydropvia.length - 1;
             $scope.returnwaydropvia.splice(lastRetunWayDropViaItem);
         };

         // Add Retun way booking additional pick up addresss 
         $scope.returnwaypickvia = [];
         $scope.returnWayPickvia = function()
         {
             var returnwaypickviaNo = $scope.returnwaypickvia.length + 1;
             $scope.returnwaypickvia.push(
             {
                 'id': 'choice' + returnwaypickviaNo
             });
         }
         $scope.removeReturnWayPickupVia = function()
         {
             var lastRetunWayPickViaItem = $scope.returnwaypickvia.length - 1;
             $scope.returnwaypickvia.splice(lastRetunWayPickViaItem);
         };

         // Add  an extra field for fare  add expenses  in  guideline panel 
		 $scope.booking_form.add_another_expenses 			= [];
		 $scope.booking_form.return_add_another_expenses 	= [];
         $scope.expenses 									= [];
         $scope.addExpensesField = function()
         {
             var newexpensesno = $scope.expenses.length + 1;
             $scope.expenses.push(
									{
										'id': 'expense' + newexpensesno
									}
								);
			 // Push the value in add an another expenses array  for one way booking 					
			 $scope.booking_form.add_another_expenses.push(
															{
															  "extras_type_id": '',
															  "name": "",
															  "extra_price": 0.00
															}
														 );
			 $scope.booking_form.return_add_another_expenses.push(
															{
															  "extras_type_id": '',
															  "name": "",
															  "extra_price": 0.00
															}
														 );											 
         }
		 // Remove the extra expense field and calculate the fare
		 $scope.booking_form.extra_expenses_val=[];
         $scope.removeNewExpenses = function(index,expense_remove_value)
         {
			 $scope.booking_form.extra_expenses_val[index+1] = '';
			 if(typeof $scope.booking_form.return_extra_expenses_val!='undefined')
			 {
				$scope.return_expense_remove_value =  $scope.booking_form.return_extra_expenses_val[index+1];
			 }
             var expenselastitem = $scope.expenses.length - 1;
             $scope.expenses.splice(expenselastitem);
			 if(typeof expense_remove_value!='undefined' && expense_remove_value!='')
			 {
				$scope.booking_form.add_another_expenses.splice(index);
				$scope.oneWayFareCalculation(index,'expenses',expense_remove_value,'remove_another_expense');	
			 }
			 // Remove for another expense field for return way booking 
			 if(typeof $scope.return_expense_remove_value!='undefined' && $scope.return_expense_remove_value!='')
			 {
				$scope.booking_form.return_add_another_expenses.splice(index);
				$scope.returnWayFareCalculation(index,'expenses',expense_remove_value,'remove_another_expense');	
			 } 
         };
		 // Add  an additional expenses field name dynamically and add into a array
		 $scope.oneWayExpensesFiledName = function(index,field_name)
		 {
			 $scope.booking_form.add_another_expenses[index].name = field_name;
		 }
		 	
	 /* Call the Api for get car extra name and price 
		*/
		$scope.car_extra 					= {};
		$scope.car_extra.database_name		= $rootScope.data_base_name;
		$scope.car_extra.webservice_case 	= 'client_application_car_type_extra_list';
		API.getListing($scope.car_extra).success(function(car_extra_data)
		{
			 if(car_extra_data.response_code==200)
			 {
				 $scope.extras_data 					= car_extra_data.response_data;
				 
			  $scope.booking_form_extras_for_concat = [
												 {
													"extras_type_id"	: $scope.extras_data[0]._id,
													"name"				: $scope.extras_data[0].name,
													"extra_price"		:0.00
												 },
												 {
													 "extras_type_id"	: $scope.extras_data[1]._id,
													"name"				: $scope.extras_data[1].name,
													"extra_price"		:0.00
												 },
												 {
													 "extras_type_id"	:$scope.extras_data[2]._id,
													 "name"				: $scope.extras_data[2].name,
													 "extra_price"		:0.00
												 }
											];	
				$scope.booking_form.extras = [
												 {
													 "extra_type_id"	: $scope.extras_data[0]._id,
													 "extra_nos"		: 0,
													 "name"				: $scope.extras_data[0].name
												 },
												 {
													 "extra_type_id"	: $scope.extras_data[1]._id,
													"extra_nos"			: 0,
													 "name"				: $scope.extras_data[1].name
												 },
												 {
													 "extra_type_id"	: $scope.extras_data[2]._id,
													 "extra_nos"		: 0,
													 "name"				: $scope.extras_data[2].name
												 }
												];
		$scope.booking_form.return_extras = [
												  {
													 "extra_type_id"	: $scope.extras_data[0]._id,
													 "extra_nos"		: 0,
													 "name"				: $scope.extras_data[0].name
												 },
												 {
													 "extra_type_id"	: $scope.extras_data[1]._id,
													"extra_nos"			: 0,
													 "name"				: $scope.extras_data[1].name
												 },
												 {
													 "extra_type_id"	: $scope.extras_data[2]._id,
													 "extra_nos"		: 0,
													 "name"				: $scope.extras_data[2].name
												 }
											];
																	
				  
	    // Create the json for fare guide line one way booking
         $scope.booking_form.extra_prices_data = [
		  {
             "extras_type_id": '5690e2a4d09476a42e89261u',
             "name": "Airport Charges",
             "extra_price": 0.00
         },
         {
             "extras_type_id": '5690e2a4d09476a42e89261m',
             "name": "Waiting Charges",
             "extra_price": 0.00
         },
         {
             "extras_type_id": '5690e2a4d09476a42e89266p',
             "name": "Toll Charges",
             "extra_price": 0.00
         },
         {
             "extras_type_id": '5690e2a4d09476a42e89266t',
             "name": "After Hour Charges",
             "extra_price": 0.00
         },

         {
             "extras_type_id": '5690e2a4d09476a42e89266s',
             "name": "Card Surcharge",
             "extra_price": 0.00
         }];
		 // Return way booking extra array  
         $scope.booking_form.return_extra_prices_data = [
		 {
             "extras_type_id": '5690e2a4d09476a42e89261u',
             "name": "Airport Charges",
             "extra_price": 0.00
         },
         {
             "extras_type_id": '5690e2a4d09476a42e89261m',
             "name": "Waiting Charges",
             "extra_price": 0.00
         },
         {
             "extras_type_id": '5690e2a4d09476a42e89266p',
             "name": "Toll Charges",
             "extra_price": 0.00
         },
         {
             "extras_type_id": '5690e2a4d09476a42e89266t',
             "name": "After Hour Charges",
             "extra_price": 0.00
         },

         {
             "extras_type_id": '5690e2a4d09476a42e89266s',
             "name": "Card Surcharge",
             "extra_price": 0.00
         }
		 ];
			$scope.booking_form.extra_prices 			= $scope.booking_form_extras_for_concat.concat($scope.booking_form.extra_prices_data);
			$scope.booking_form.return_extra_prices 	= $scope.booking_form_extras_for_concat.concat($scope.booking_form.return_extra_prices_data);
			 }
		});
         $scope.booking_form.other_expenses = [
												{
												 "_id"				: '5690e2a4d09476a42e89261u',
												 "name"				: "Driver Fee",
												 "expense_amount"	: 0.00
												},
												{
												 "_id"				: '5690e2a4d09476a42e89261u',
												 "name"				: "Other Expenses",
												 "expense_amount"	: 0.00
												}
											];
		 
		 $scope.default_drop_down_range = [];
		 for(var i=1;i<=100;i++) 
				{
					i=i.toFixed(2);
				  $scope.default_drop_down_range.push(i);
				}
		 
			// Generate the one way booking drodown option 
			$scope.generateCommissionDropDownValue = function(driver_price)
			{
				$scope.drop_down_range = [];
				for(var i=1;i<=driver_price;i++) 
				{
					i=i.toFixed(2);
				  $scope.drop_down_range.push(i);
				}
				if($scope.booking_form.driver_payment_option=='collect')
				{
					$scope.driver_percentage_commission_div 		 	= true;
					$scope.driver_percentage_commission_dynamic_div 	= false;
					$scope.driver_fixed_commission_div					= true;
					$scope.driver_fixed_commission_dynamic_div			= false;
				}
			}

			// Generate the one way booking drodown option 
			$scope.returnGenerateCommissionDropValue = function(driver_price)
			{
				$scope.return_drop_down_range = [];
				for(var i=1;i<=driver_price;i++) 
				{
					i=i.toFixed(2);
				  $scope.return_drop_down_range.push(i);
				}
				if($scope.booking_form.return_driver_payment_option=='collect')
				{
					$scope.return_driver_percentage_commission_div 			= true;
					$scope.return_driver_percentage_commission_dynamic_div = false;
					$scope.return_driver_fixed_commission_div				= true;
					$scope.return_driver_fixed_commission_dynamic_div		= false;
				}
			}
		 
		 // Function for one way booking fare calculation include commssion 
		 $scope.setFareWithCommission = function(commission_value,commission_type)
		 {
			 $scope.booking_form.driver_price;
			 if(commission_type=='percentage')
			 {
				 if(typeof $scope.booking_form.driver_price!='undefined'&& typeof $scope.booking_form.driver_percentage_commission)
				 {
					 $scope.driver_commission_value = $scope.booking_form.driver_percentage_commission;
					 $scope.driver_commission_value = $scope.driver_commission_value.split(".");
					 $scope.driver_commssion_price = (($scope.driver_commission_value[0])*($scope.booking_form.driver_price)/100).toFixed(2);
					 $scope.booking_form.percentage_commission = $scope.driver_commssion_price;
					 $scope.driver_price = parseFloat($scope.booking_form.driver_price - $scope.driver_commssion_price);
					 $scope.booking_form.one_way_driver_fee = $scope.driver_price;
					 $scope.oneWayFareCalculation('0','expenses',$scope.driver_price,'driver_price_from_driver_information');
				 }
			 }
			 if(commission_type=='fixed')
			 {
				 if(typeof $scope.booking_form.driver_price!='undefined'&& typeof $scope.booking_form.driver_fixed_commission)
				 {
					
					$scope.driver_commission_value = $scope.booking_form.driver_fixed_commission;
					$scope.driver_commission_value = $scope.driver_commission_value.split(".");
					$scope.driver_commission_value = ($scope.driver_commission_value[0]);
					$scope.driver_commission_value = ($scope.driver_commission_value);
					$scope.booking_form.fixed_commission = $scope.driver_commission_value;
					$scope.driver_price = parseFloat($scope.booking_form.driver_price - $scope.driver_commission_value);
					$scope.booking_form.one_way_driver_fee = $scope.driver_price;
					$scope.oneWayFareCalculation('0','expenses',$scope.driver_price,'driver_price_from_driver_information');
				 }
			 }
		 };
		 
		 // Function for return way booking fare calculation include commssion 
		 $scope.returnSetFareWithCommission = function(commission_value,commission_type)
		 {
			 $scope.booking_form.return_driver_price;
			 if(commission_type=='percentage')
			 {
				 if(typeof $scope.booking_form.return_driver_price!='undefined'&& typeof $scope.booking_form.return_driver_percentage_commission)
				 {
					 $scope.return_driver_commission_value 				= $scope.booking_form.return_driver_percentage_commission;
					 $scope.return_driver_commission_value 				= $scope.return_driver_commission_value.split(".");
					 $scope.return_driver_commssion_price 				= (($scope.return_driver_commission_value[0])*($scope.booking_form.return_driver_price)/100).toFixed(2);
					 $scope.booking_form.return_percentage_commission 	= $scope.return_driver_commssion_price;
					 $scope.return_driver_price 						= parseFloat($scope.booking_form.return_driver_price - $scope.return_driver_commssion_price);
					 $scope.booking_form.return_driver_fee 				= $scope.return_driver_price;
					 $scope.returnWayFareCalculation('0','expenses',$scope.return_driver_price,'driver_price_from_driver_information');
				 }
			 }
			 if(commission_type=='fixed')
			 {
				 if(typeof $scope.booking_form.return_driver_price!='undefined'&& typeof $scope.booking_form.return_driver_fixed_commission)
				 {
					$scope.return_driver_commission_value 		= $scope.booking_form.return_driver_fixed_commission;
					$scope.return_driver_commission_value 		= $scope.return_driver_commission_value.split(".");
					$scope.return_driver_commission_value 		= ($scope.return_driver_commission_value[0]);
					$scope.return_driver_commission_value 		= ($scope.return_driver_commission_value);
					$scope.booking_form.return_fixed_commission = $scope.return_driver_commission_value;
					$scope.return_driver_price 					= parseFloat($scope.booking_form.return_driver_price - $scope.return_driver_commission_value);
					$scope.booking_form.return_driver_fee 		= $scope.return_driver_price;
					$scope.returnWayFareCalculation('0','expenses',$scope.return_driver_price,'driver_price_from_driver_information');
				 }
			 }
		 };
		 // Convert to the decimal number for one way fare all fields value  
		 $scope.toFixedTwo = function (field_name,field_value, position,type)
			{
				if(field_value=='' || typeof field_value=='undefined')
				{
					field_value = parseFloat(0);
				}
				if(typeof field_value!='undefined')
				{
					if(type=='common')
					{	
						common_field_name = $parse(field_name);			
						if(field_value)
						{
							common_field_name.assign($scope, parseFloat(field_value).toFixed(2));
						}
					}
					if(type=='extra')
					{
						if(typeof $scope.booking_form.extra_prices.extra_price=='undefined')
						{
							$scope.booking_form.extra_prices.extra_price = {};
						}
						$scope.booking_form.extra_prices.extra_price[position + 1]  = parseFloat(field_value).toFixed(2);
					}
					if(type=='another_extra')
					{
						$scope.booking_form.extra_prices_val[position + 1]  = parseFloat(field_value).toFixed(2);
					}
					
					if(type=='driver_fee')
					{
						$scope.booking_form.one_way_driver_fee  = parseFloat(field_value).toFixed(2);
					}
					if(type=='other_expenses')
					{
						if(typeof $scope.booking_form.one_way_driver_fee=='undefined' || $scope.booking_form.one_way_driver_fee=='')
						{
							$scope.booking_form.one_way_driver_fee = parseFloat(0);
							
						}
						$scope.booking_form.one_way_driver_fee =  (parseFloat($scope.booking_form.one_way_driver_fee)).toFixed(2);
						$scope.booking_form.one_way_other_expenses  = parseFloat(field_value).toFixed(2);
					}
					if(type=='another_expenses')
					{
						$scope.booking_form.extra_expenses_val[position + 1]  = parseFloat(field_value).toFixed(2);
					}
				}
			}
		// Convert to the decimal number for return way fare all fields value 
		 $scope.returnToFixedTwo = function (field_name,field_value,position,type)
			{
				if(field_value=='')
				{
					field_value = parseFloat(0);
				}
				if(typeof field_value!='undefined' || field_value!='')
				{
					if(typeof field_value=='undefined')
					{
						field_value = parseFloat(0);
					}
					if(type=='common')
					{	
						common_field_name = $parse(field_name);			
						if(field_value)
						{
							common_field_name.assign($scope, parseFloat(field_value).toFixed(2));
						}
					}
					if(type=='extra')
					{
						
						$scope.booking_form.return_extra_prices.extra_price[position + 1]  = parseFloat(field_value).toFixed(2);
					}
					if(type=='another_extra')
					{
						$scope.booking_form.return_extra_prices_val[position + 1]  = parseFloat(field_value).toFixed(2);
					}
					
					if(type=='driver_fee')
					{
						$scope.booking_form.return_driver_fee  = parseFloat(field_value).toFixed(2);
					}
					if(type=='other_expenses')
					{
						if(typeof $scope.booking_form.return_driver_fee=='undefined' || $scope.booking_form.return_driver_fee=='')
						{
							$scope.booking_form.return_driver_fee = parseFloat(0);
						}
						$scope.booking_form.return_driver_fee =  (parseFloat($scope.booking_form.return_driver_fee).toFixed(2));
						$scope.booking_form.return_way_other_expenses  = parseFloat(field_value).toFixed(2);
					}
					if(type=='another_expenses') 
					{
						$scope.booking_form.return_extra_expenses_val[position + 1]  = parseFloat(field_value).toFixed(2);
					}
				}
			}

		/* 	Calculate the Total fare, Total expense profit and loss for one way booking using oneWayFareCalculation() function
			index 			: index of the array or position of the array
			fare_type 		: is extra,expenses,common
								"extra" 	: is used for baby seat,booster seat,airport charge etc..
								"expenses" 	: is used for driver price and othe expense.
			val 			: 	the field value
			another_extra 	: this is used for check it add another extra or anothe expense 
		*/		
         $scope.oneWayFareCalculation = function(index,fare_type,val,another_extra)
		 {	
				if(typeof $scope.booking_form.base_fare=='undefined')
				{
					$scope.booking_form.base_fare = 0.00;
				}
				if(typeof $scope.booking_form.base_price=='undefined')
				{
					$scope.booking_form.base_price = parseFloat(0);
				}
                 $scope.value = isNaN(val);
                 if (typeof val != 'undefined')
                 {
                     if ($scope.value == false)
                     {
						 if(fare_type!='expenses')
						 {
							 if (index == '0' || index > 0)
							 {
								// This dynamic array create only for extra without add another extra field
								if(another_extra!='another_extra')
								{
									$scope.booking_form.extra_prices[index].extra_price = val;
									$scope.check_number_or_not = isNaN($scope.booking_form.extra_prices[index].extra_price); 
									if($scope.check_number_or_not==false)
									{
										$scope.booking_form.extra_prices[index].extra_price = val;
									}
									else
									{
										$scope.booking_form.extra_prices[index].extra_price = parseFloat(0);
									}
									
								}
							 }
						 }
                         if (typeof $scope.total_fare_extra == 'undefined')
                         {
                             $scope.total_fare_extra = 0.00;
                         }
                         $scope.one_way_base_price 				= $scope.booking_form.base_price;
						 if(fare_type == 'common')
                         {
							$scope.booking_form.base_price 		= $scope.booking_form.base_price;
						 }
						 if(fare_type!='common' || another_extra=='modal_base_fare_value')
						 {
							$scope.booking_form.base_price 		= (parseFloat($scope.booking_form.base_price)).toFixed(2); 
						 }
                         
                         $scope.one_way_driver_fee 				= $scope.booking_form.one_way_driver_fee;
                         $scope.one_way_other_expenses 			= $scope.booking_form.one_way_other_expenses;
						 // Set the default value when any price get undefined value

                         if (typeof $scope.booking_form.one_way_driver_fee == 'undefined')
                         {
                             $scope.one_way_driver_fee = 0.00;
                         }
                         if (typeof $scope.booking_form.one_way_other_expenses == 'undefined')
                         {
                             $scope.one_way_other_expenses = 0.00;
                         }
                         if (typeof $scope.booking_form.one_way_total_expenses == 'undefined')
                         {
                             $scope.booking_form.one_way_total_expenses = 0.00;
                         }
                         if (typeof $scope.booking_form.total_fare == 'undefined')
                         {
                             $scope.booking_form.total_fare = 0.00;
                         }
                         if (typeof $scope.booking_form.total_extra_fare == 'undefined')
                         {
                             $scope.total_extra_fare = 0.00;
                         }
						// If the fare type extra then call that condition
                         if(fare_type == 'extra')
                         {
							 if(val=='')
							 {
								$scope.val = 0;
								$scope.booking_form.extra_prices.extra_price[index + 1] = ($scope.val).toFixed(2);
								for($i=0;$i<$scope.booking_form.extra_prices.length;$i++)
								{
									if((typeof $scope.booking_form.extra_prices.extra_price[$i + 1] )!='undefined')
									{
										$scope.total_extra_fare += parseFloat($scope.booking_form.extra_prices.extra_price[$i + 1]);
									}
								}
								$scope.one_way_total_extra_fee	=	$scope.total_extra_fare;
								$scope.booking_form.total_fare = (parseFloat($scope.booking_form.base_price) + parseFloat($scope.total_extra_fare)).toFixed(2);
							 }
							 if(val!='')
							 {
								 // Calculate the the add another extra price value
								 if(another_extra=='another_extra')
								 {
									$scope.booking_form.extra_prices_val[index+1] = val;
									// Set the price value in add an extra price array  
									$scope.booking_form.add_another_extra[index].extra_price = val;
									// Using this for loop calculate the total additional extra price value
									$scope.total_another_extra_fare = 0;
									for($i=0;$i<$scope.booking_form.add_another_extra.length;$i++)
									{
										if((typeof $scope.booking_form.add_another_extra[$i].extra_price )!='undefined')
										{
											$scope.total_another_extra_fare += parseFloat($scope.booking_form.add_another_extra[$i].extra_price);
										}
									}
										 $scope.total_another_extra_fare_value = $scope.total_another_extra_fare;
								 }
								 // If remove extra field after put any valid price 
								 if(another_extra=='remove_another_extra')
								 {
									 if($scope.booking_form.add_another_extra.length>0)
									 {
										for($i=0;$i<$scope.booking_form.add_another_extra.length;$i++)
										{
											if((typeof $scope.booking_form.add_another_extra[$i].extra_price )!='undefined')
											{
												// Check the populate extra arry value is number or not
												$scope.check_another_extra_valid_number_or_not = isNaN(($scope.booking_form.add_another_extra[$i].extra_price));
												$scope.total_another_extra_fare += parseFloat($scope.booking_form.add_another_extra[$i].extra_price);
											}
										}
										 $scope.total_another_extra_fare_value = $scope.total_another_extra_fare;
									 }
									 // If the add extra arry return blank or length 0 
									 else
									 {
										$scope.total_another_extra_fare_value = 0;
									 }
								 }
								  if(another_extra=='' || another_extra=='another_extra_from_calculator')
								  {
									if(another_extra=='another_extra_from_calculator')
									{
										$scope.booking_form.extra_prices.extra_price[index + 1]  = parseFloat(val).toFixed(2);
									}
									if(another_extra=='')
									{
										$scope.booking_form.extra_prices.extra_price[index + 1]  = val;
										$scope.check_number_or_not_booking_extra_price = isNaN($scope.booking_form.extra_prices.extra_price[index + 1]);
										if($scope.check_number_or_not_booking_extra_price == false)
										{
											$scope.booking_form.extra_prices.extra_price[index + 1]  = val;
										}
										else
										{
											$scope.booking_form.extra_prices.extra_price[index + 1]	= parseFloat(0);
										}
									}
									for($i=0;$i<$scope.booking_form.extra_prices.length;$i++)
									{
										if((typeof $scope.booking_form.extra_prices.extra_price[$i + 1] )!='undefined')
										{
											// Check the populate extra arry value is number or not 
											$scope.check_extra_fare_valid_number_or_not = isNaN(($scope.booking_form.extra_prices.extra_price[$i + 1]));
											if($scope.check_extra_fare_valid_number_or_not==false)
											{
												$scope.total_extra_fare += parseFloat($scope.booking_form.extra_prices.extra_price[$i + 1]);
											}
										}
									}
									$scope.total_extra_fare_value = $scope.total_extra_fare;
								 }
								 if(another_extra=='another_extra_fare_panel_extra')
								  {
									//$scope.total_extra_fare = 0;
									$scope.booking_form.extra_prices[index+1].extra_price  = parseFloat(val).toFixed(2);
									for($i=0;$i<$scope.booking_form.extra_prices.length;$i++)
									{
										if((typeof $scope.booking_form.extra_prices[$i].extra_price )!='undefined')
										{
											// Check the populate extra arry value is number or not 
											$scope.check_extra_fare_valid_number_or_not = isNaN(($scope.booking_form.extra_prices[$i].extra_price));
											if($scope.check_extra_fare_valid_number_or_not==false)
											{
												$scope.total_extra_fare += parseFloat($scope.booking_form.extra_prices[$i].extra_price);
											}
										}
									}
									$scope.total_extra_fare_value = $scope.total_extra_fare;
								 }
							 }
                         }
						 // Calculate all the expense like driver fee ,extra prices
                         if (fare_type == 'expenses')
                         {
							 if(another_extra=='' || another_extra=='driver_price_from_driver_information')
							 {
								 $scope.booking_form.other_expenses[index].expense_amount	=	val;
								 // If the driver fee value reset  and get value is blank 
								 if($scope.booking_form.one_way_driver_fee == '')
								 {
									$scope.driver_fee = 0;
									$scope.total_expenses = ($scope.booking_form.one_way_driver_fee) + parseFloat($scope.booking_form.one_way_other_expenses);
									$scope.booking_form.one_way_total_expenses = ($scope.total_expenses).toFixed(2);
								 }
								  // Driver fee for one way booking when driver fee value not blank
								  if($scope.booking_form.one_way_driver_fee!='')
								  { 
									$scope.base_price_without_put_base_price = (isNaN($scope.booking_form.base_price));
									if($scope.base_price_without_put_base_price == true)
									{
										$scope.booking_form.base_price = 0;
										$scope.booking_form.base_price = $scope.booking_form.base_price.toFixed(2)
									}
									
									if(another_extra=='driver_price_from_driver_information')
									{
										$scope.booking_form.one_way_driver_fee = parseFloat($scope.booking_form.one_way_driver_fee).toFixed(2);
									}
									if(another_extra=='')
									{
										$scope.booking_form.one_way_driver_fee = $scope.booking_form.one_way_driver_fee;
									}
									$scope.total_expenses = parseFloat($scope.one_way_driver_fee) + parseFloat($scope.one_way_other_expenses);
									$scope.booking_form.one_way_total_expenses = ($scope.total_expenses).toFixed(2);
									
								 }
								 // When other expense value not blank
								 if (typeof $scope.booking_form.one_way_other_expenses != 'undefined')
								 {
									 $scope.booking_form.one_way_other_expenses = parseFloat($scope.booking_form.one_way_other_expenses);
								 }
								 // When other expense value is blank
								$scope.other_expenses_valid = (isNaN ($scope.booking_form.one_way_other_expenses));
								if($scope.other_expenses_valid == false)
								{
								}
							}
							// Calculate the Add another expenses total price 
							if(another_extra=='another_expenses')
							{
								$scope.total_another_expenses 								= 0;
								$scope.booking_form.extra_expenses_val[index+1] 			= val;
								$scope.booking_form.add_another_expenses[index].extra_price = val;
								// Calculate all the add an expenses price 
								for($i=0;$i<$scope.booking_form.add_another_expenses.length;$i++)
									{
										if((typeof $scope.booking_form.add_another_expenses[$i].extra_price )!='undefined')
										{
											$scope.total_another_expenses += parseFloat($scope.booking_form.add_another_expenses[$i].extra_price);
										}
									}
								// Total additional expense amount 
								 $scope.total_another_expenses_value = parseFloat($scope.total_another_expenses);
							}
							// Calculate when remove the extra expense value form booking page after adding  new expense field
							if(another_extra=='remove_another_expense')
							{
								$scope.total_another_expenses = 0;
								if($scope.booking_form.add_another_expenses.length>0)
									 {
										for($i=0;$i<$scope.booking_form.add_another_expenses.length;$i++)
										{
											if((typeof $scope.booking_form.add_another_expenses[$i].extra_price)!='undefined')
											{
												$scope.total_another_expenses += parseFloat($scope.booking_form.add_another_expenses[$i].extra_price);
											}
										}
										 $scope.total_another_expenses_value = parseFloat($scope.total_another_expenses);
									 }
									 // If the add extra expense arry return blank or length 0 
									 else
									 {
										$scope.total_another_expenses_value = 0;
									 }
								}
						}
						// Total fare and expenses calculation for one way booking 
						 if(typeof $scope.booking_form.base_price=='undefined')
						 {
							$scope.booking_form.base_price 	= parseFloat(0);
						 }
						 if(typeof $scope.total_extra_fare_value=='undefined')
						 {
							$scope.total_extra_fare_value 		= parseFloat(0);
						 }
						 if(typeof $scope.total_another_extra_fare_value=='undefined')
						 {
							$scope.total_another_extra_fare_value = parseFloat(0);
						 }
						// Total fare for one way booking 
						$scope.booking_form.total_fare = (parseFloat($scope.booking_form.base_price) + parseFloat($scope.total_extra_fare_value)+ parseFloat($scope.total_another_extra_fare_value)).toFixed(2);
						$scope.check_number_or_not_one_way_booking_total_fare = isNaN($scope.booking_form.total_fare);
						if($scope.check_number_or_not_one_way_booking_total_fare==false)
						{
							$scope.booking_form.total_fare = (parseFloat($scope.booking_form.base_price) + parseFloat($scope.total_extra_fare_value)+ parseFloat($scope.total_another_extra_fare_value)).toFixed(2);
						}
						else
						{
							$scope.booking_form.total_fare = parseFloat(0);
						}
						 // Total expense calculation for one way edit booking
						 if(typeof $scope.booking_form.total_fare=='undefined')
						 {
							 $scope.booking_form.total_fare = parseFloat(0);
						 }
						 if(typeof $scope.booking_form.one_way_driver_fee=='undefined')
						 {
							$scope.one_way_driver_fee = parseFloat(0).toFixed(2); 
						 }
						 else
						 {
							$scope.one_way_driver_fee =  $scope.booking_form.one_way_driver_fee;
						 }
						 if(typeof $scope.booking_form.one_way_other_expenses=='undefined')
						 {
							$scope.one_way_other_expenses = parseFloat(0); 
						 }
						 else
						 {
							 $scope.one_way_other_expenses = $scope.booking_form.one_way_other_expenses;
						 }
						 if(typeof $scope.total_another_expenses_value=='undefined')
						 {
							$scope.total_another_expenses_value = parseFloat(0); 
						 }
						 $scope.booking_form.one_way_total_expenses 		= (parseFloat($scope.one_way_driver_fee) + parseFloat($scope.one_way_other_expenses) + parseFloat($scope.total_another_expenses_value)).toFixed(2);
						 $scope.booking_form.profit_and_loss 				= (parseFloat($scope.booking_form.total_fare) - parseFloat($scope.booking_form.one_way_total_expenses)).toFixed(2); 

						 // Add the css style for Generate profit and loss 
                         if ($scope.booking_form.profit_and_loss > 0)
                         {
                             $scope.myStyle = {
													background: '#449D44',
													color:'white'
													
												};
                         }
                         if ($scope.booking_form.profit_and_loss == 0)
                         {
                             $scope.myStyle = {
													background: '#449D44'
												};
                         }
						 // If calculate value result negative means loss then add this style
                         if ($scope.booking_form.profit_and_loss < 0)
                         {
                             $scope.myStyle = {
												background: 'red',
												color:'white'
											 };
                         }
                     }
                 }
             }
         // Set Base fare from Modal (database fetch value) 
         $scope.setBaseFare = function (base_fare_val,edit_booking_mode_type)
         {
			$scope.base_fare_history = false;
			if(edit_booking_mode_type=='one_way')
			{
				$scope.booking_form.base_price = base_fare_val;
				// Set all the estimate or previous fare value in to fare panel for one way booking panel
				$scope.oneWayFareCalculation('','common',base_fare_val,'modal_base_fare_value');
			}
			//If the booking type return way then enter that function
			if(edit_booking_mode_type=='return_way')
			{
				$scope.booking_form.return_base_price = base_fare_val;
				$scope.returnWayFareCalculation('','common',base_fare_val,'modal_base_fare_value');
			}
         }

         // Set the driver offer price  
         $scope.setDriverPrice = function(job_type, price_val)
         {
             if (job_type == 'one_way' && typeof price_val!='undefined')
             {
                 $scope.booking_form.driver_price = parseFloat($scope.booking_form.driver_price).toFixed(2);
				 $scope.booking_form.one_way_driver_fee = $scope.booking_form.driver_price;
				 $scope.oneWayFareCalculation('0','expenses',price_val,'driver_price_from_driver_information');
				 $scope.generateCommissionDropDownValue(price_val);
             }
             if (job_type == 'return_way' && typeof price_val!='undefined')
             {
                 $scope.booking_form.return_driver_price = parseFloat($scope.booking_form.return_driver_price).toFixed(2);
				 $scope.booking_form.return_driver_fee = $scope.booking_form.return_driver_price;
				 $scope.returnWayFareCalculation('0','expenses',price_val,'driver_price_from_driver_information');
				 $scope.returnGenerateCommissionDropValue(price_val);
             }
         }
		
         $scope.booking_form.return_other_expenses = [
													 {
														 "_id": '5690e2a4d09476a42e89261u',
														 "name": "Driver Fee",
														 "expense_amount": 0.00
													 },
													 {
														 "_id": '5690e2a4d09476a42e89261u',
														 "name": "Other Expenses",
														 "expense_amount": 0.00
													 }, 
													];
		 /* Calculate the Total fare, Total expense profit and loss for return way booking using returnWayFareCalculation() function
			index 			: index of the array or position of the array
			fare_type 		: is extra,expenses,common
								"extra" 	: is used for baby seat,booster seat,airport charge etc..
								"expenses" 	: is used for driver price and othe expense.
			val 			: the field value
			another_extra 	: this is used for check it add another extra or anothe expense 
		*/		
         $scope.returnWayFareCalculation = function(index, fare_type, val,another_extra)
         {
			 if(typeof $scope.booking_form.return_base_price=='undefined')
			 {
				 $scope.booking_form.return_base_price = 0;
				 $scope.booking_form.return_base_price = parseFloat($scope.booking_form.return_base_price).toFixed(2);
			 }
			 // Check the fare value blank or undefined  
             if (typeof val != 'undefined' && val!='')
             {
				 $scope.return_value = isNaN(val);
				 if ($scope.return_value == false)
                     {
						 // If the fare type is expense like driver fee and other expense 
						 if(fare_type!='expenses')
						 {
							 if (index == '0' || index > 0)
							 {
								 if(another_extra!='another_extra')
									{
										$scope.booking_form.return_extra_prices[index].extra_price	=	val;
									}
							 }
						 }
						 if (typeof $scope.return_total_fare_extra == 'undefined')
						 {
							 $scope.return_total_fare_extra = 0.00;
						 }
						 $scope.return_base_price 				= $scope.booking_form.return_base_price;
						 if(fare_type=='common')
						 {
							$scope.booking_form.return_base_price  = $scope.booking_form.return_base_price;
						 }
						 if(fare_type!='common' || another_extra=='modal_base_fare_value')
						 {
							 $scope.booking_form.return_base_price  = parseFloat($scope.booking_form.return_base_price).toFixed(2);
						 }
						 $scope.return_driver_fee 				= $scope.booking_form.return_driver_fee;
						 $scope.return_other_expenses			 = $scope.booking_form.return_other_expenses;
						
						 // Total all expenses with drive fee 
						 if (typeof $scope.booking_form.return_driver_fee 	== 'undefined')
						 {
							 $scope.return_driver_fee = 0.00;
						 }
						 if (typeof $scope.booking_form.return_way_other_expenses 	== 'undefined')
						 {
							 $scope.return_way_other_expenses = 0.00;
						 }
						 if (typeof $scope.booking_form.return_total_expenses 		== 'undefined')
						 {
							 $scope.booking_form.return_total_expenses = 0.00;
						 }
						 if (typeof $scope.booking_form.return_total_fare 			== 'undefined')
						 {
							 $scope.booking_form.return_total_fare = 0.00;
						 }
						 if (typeof $scope.booking_form.return_total_extra_fare 	== 'undefined')
						 {
							 $scope.return_total_extra_fare = 0.00;
						 }
						 if (fare_type == 'extra')
						 {
							 if(val=='')
							 {
								$scope.val = 0;
								$scope.booking_form.return_extra_prices.extra_price[index + 1] = ($scope.val).toFixed(2);
								for($i=0;$i<$scope.booking_form.return_extra_prices.length;$i++)
								{
									if((typeof $scope.booking_form.return_extra_prices.extra_price[$i + 1] )!='undefined')
									{
										$scope.return_total_extra_fare += parseFloat($scope.booking_form.return_extra_prices.extra_price[$i + 1]);
									}
								}
								// Calculate the total value of all extra price
								$scope.booking_form.total_fare = (parseFloat($scope.booking_form.base_price) + parseFloat($scope.return_total_extra_fare)).toFixed(2);
							 }
							 if(val!='')
							 {
								 // Calculate the the add another extra price value
								 if(another_extra=='another_extra')
								 {
									$scope.return_total_another_extra_fare 							= 0;
									$scope.booking_form.return_extra_prices_val[index+1] 			= val;
									// Set the price value in add an extra price array  
									$scope.booking_form.return_add_another_extra[index].extra_price = val;
									// Using this for loop calculate the total additional extra price value
									for($i=0;$i<$scope.booking_form.return_add_another_extra.length;$i++)
									{
										if((typeof $scope.booking_form.return_add_another_extra[$i].extra_price )!='undefined')
										{
											$scope.booking_form.return_add_another_extra[$i].extra_price= parseFloat($scope.booking_form.return_add_another_extra[$i].extra_price);
											$scope.return_total_another_extra_fare +=($scope.booking_form.return_add_another_extra[$i].extra_price);
										}
									}
										 $scope.return_total_another_extra_fare_value = $scope.return_total_another_extra_fare;
								 }
								 // If remove extra field after put any valid price 
								 if(another_extra=='remove_another_extra')
								 {
									 if($scope.booking_form.return_add_another_extra.length>0)
									 {
										for($i=0;$i<$scope.booking_form.return_add_another_extra.length;$i++)
										{
											if((typeof $scope.booking_form.return_add_another_extra[$i].extra_price )!='undefined')
											{
												$scope.return_total_another_extra_fare += parseFloat($scope.booking_form.return_add_another_extra[$i].extra_price);
											}
										}
										 $scope.return_total_another_extra_fare_value = $scope.return_total_another_extra_fare;
									 }
									 // If the add extra array return blank or length 0 
									 else
									 {
										$scope.return_total_another_extra_fare_value = 0;
									 }
								 }
								  if(another_extra=='' || another_extra=='another_extra_from_calculator')
								  {
									$scope.total_extra_fare = 0;
									if(another_extra=='another_extra_from_calculator')
									{
										$scope.booking_form.return_extra_prices.extra_price[index + 1] = parseFloat(val).toFixed(2);
									}
									if(another_extra=='')
									{
										$scope.booking_form.return_extra_prices.extra_price[index + 1] = val;
									}
									for($i=0;$i<$scope.booking_form.return_extra_prices.length;$i++)
									{
										if((typeof $scope.booking_form.return_extra_prices.extra_price[$i + 1] )!='undefined')
										{
											$scope.return_total_extra_fare += parseFloat($scope.booking_form.return_extra_prices.extra_price[$i + 1]);
										}
									}
									 $scope.return_total_extra_fare_value = $scope.return_total_extra_fare;
								 }
							 }
					 }
					// Calculate all the expense like driver fee ,extra prices
					 if(fare_type == 'expenses')
					 {
						 if(another_extra=='' || another_extra=='driver_price_from_driver_information')
						 {
							 $scope.booking_form.return_other_expenses[index].expense_amount	=	val;
							 // If the driver fee value reset and get value is blank 
							 if($scope.booking_form.return_driver_fee == '')
							 {
								$scope.return_driver_fee = 0;
								$scope.return_total_expenses = ($scope.booking_form.return_driver_fee) + parseFloat($scope.booking_form.return_way_other_expenses);
								$scope.booking_form.return_total_expenses = ($scope.return_total_expenses).toFixed(2);
								
							 }
							  // Driver fee for one way booking when driver fee value not blank
							  if($scope.booking_form.return_driver_fee!='')
							  { 
								$scope.return_base_price_without_put_base_price = (isNaN($scope.booking_form.return_base_price));
								if($scope.return_base_price_without_put_base_price == true)
								{
									$scope.booking_form.return_base_price = 0;
									$scope.booking_form.return_base_price = $scope.booking_form.return_base_price.toFixed(2)
								}
								
								if(another_extra=='driver_price_from_driver_information')
								{
									$scope.booking_form.return_driver_fee = parseFloat($scope.booking_form.return_driver_fee).toFixed(2);	
								}
								if(another_extra=='')
								{
									$scope.booking_form.return_driver_fee = $scope.booking_form.return_driver_fee;
								}
								
								$scope.return_total_expenses 				= parseFloat($scope.return_driver_fee) + parseFloat($scope.return_way_other_expenses);
								$scope.booking_form.return_total_expenses 	= ($scope.return_total_expenses).toFixed(2);
							 }
							 // When other expense value not blank
							 if (typeof $scope.booking_form.return_way_other_expenses != 'undefined')
							 {
								 $scope.booking_form.return_way_other_expenses 	= $scope.booking_form.return_way_other_expenses;
								 $scope.return_total_expenses 					= parseFloat($scope.booking_form.return_driver_fee) + parseFloat($scope.booking_form.return_way_other_expenses);
								 $scope.booking_form.return_total_expenses 		= ($scope.return_total_expenses).toFixed(2);
							 }
							 // When other expense value is blank
							$scope.other_expenses_valid = (isNaN ($scope.booking_form.one_way_other_expenses));
							if($scope.other_expenses_valid == false)
							{
							}
						}
						// Calculate the Add another expenses total price for return way booking
						if(another_extra=='another_expenses')
						{
							$scope.return_total_another_expenses 								= 0;
							$scope.booking_form.return_extra_expenses_val[index+1] 				= val;
							$scope.booking_form.return_add_another_expenses[index].extra_price = val;
							// Calculate all the add an expenses price 
							for($i=0;$i<$scope.booking_form.return_add_another_expenses.length;$i++)
								{
									if((typeof $scope.booking_form.return_add_another_expenses[$i].extra_price )!='undefined')
									{
										$scope.return_total_another_expenses += parseFloat($scope.booking_form.return_add_another_expenses[$i].extra_price);
									}
								}
							// Total additional expense amount  for return way booking 
							 $scope.return_total_another_expenses_value = parseFloat($scope.return_total_another_expenses);
							 
						}
						// Calculate when remove the extra expense value form booking page after adding  new expense field
						if(another_extra == 'remove_another_expense')
						{
							$scope.total_another_expenses = 0;
							if($scope.booking_form.return_add_another_expenses.length>0)
							 {
									for($i=0;$i<$scope.booking_form.return_add_another_expenses.length;$i++)
									{
										if((typeof $scope.booking_form.return_add_another_expenses[$i].extra_price)!='undefined')
										{
											$scope.return_total_another_expenses += parseFloat($scope.booking_form.return_add_another_expenses[$i].extra_price);
										}
									}
									 $scope.return_total_another_expenses_value = parseFloat($scope.return_total_another_expenses);
							 }
							 // If the add extra expense arry return blank or length 0 
							 else
							 {
								$scope.return_total_another_expenses_value = 0;
							 }
					 }
				 }
				 // Total fare and expenses calculation for Retun way booking 
				 if(typeof $scope.booking_form.return_base_price=='undefined')
				 {
					$scope.booking_form.return_base_price = parseFloat(0);
				 }
				 if(typeof $scope.return_total_extra_fare_value=='undefined')
				 {
					$scope.return_total_extra_fare_value = parseFloat(0);
				 }
				 if(typeof $scope.return_total_another_extra_fare_value=='undefined')
				 {
					$scope.return_total_another_extra_fare_value = parseFloat(0);
				 }
				// Total fare for return way booking 
				$scope.booking_form.return_total_fare = (parseFloat($scope.booking_form.return_base_price) + parseFloat($scope.return_total_extra_fare_value)+ parseFloat($scope.return_total_another_extra_fare_value)).toFixed(2);
				 // Total expense calculation for one way edit booking
				 if(typeof $scope.booking_form.return_total_fare=='undefined')
				 {
					 $scope.booking_form.return_total_fare = parseFloat(0);
				 }
				 if(typeof $scope.booking_form.return_driver_fee=='undefined')
				 {
					$scope.return_way_driver_fee = parseFloat(0).toFixed(2); 
				 }
				 else
				 {
					$scope.return_way_driver_fee =  $scope.booking_form.return_driver_fee;
				 }
				 if(typeof $scope.booking_form.return_way_other_expenses=='undefined')
				 {
					$scope.return_way_other_expenses = parseFloat(0); 
				 }
				 else
				 {
					 $scope.return_way_other_expenses = $scope.booking_form.return_way_other_expenses;
				 }
				 if(typeof $scope.return_total_another_expenses_value=='undefined')
				 {
					$scope.return_total_another_expenses = parseFloat(0); 
				 }
				 $scope.booking_form.return_way_total_expenses = parseFloat($scope.return_way_driver_fee) + parseFloat($scope.return_way_other_expenses);
				 $scope.booking_form.return_total_expenses = (parseFloat($scope.booking_form.return_way_total_expenses)+ parseFloat($scope.return_total_another_expenses_value)).toFixed(2);
				 $scope.booking_form.return_profit_and_loss = (parseFloat($scope.booking_form.return_total_fare) - parseFloat($scope.booking_form.return_total_expenses)).toFixed(2); 
				// Add profit or loss css style
				 if ($scope.booking_form.return_profit_and_loss > 0)
				 {
					 $scope.return_myStyle = {
												background: '#449D44',
												color:'white'
											};
				 }
				 if ($scope.booking_form.return_profit_and_loss == 0)
				 {
					 $scope.return_myStyle = {
												background: '#449D44',
												color:'white'
											};
				 }
				  // If calculate value is loss 
				 if ($scope.booking_form.return_profit_and_loss < 0)
				 {
					 $scope.return_myStyle = {
												background: 'red',
												color:'white'
											};
				 }
			}
	 }
 }
		/* Call the Api for get car extra name and price 
		*/

		$scope.car_extra 				= {};
		$scope.car_extra.database_name 	= $rootScope.data_base_name;
		$scope.car_extra.webservice_case = 'client_application_car_type_extra_list';
		 
		API.getListing($scope.car_extra).success(function(car_extra_data)
		{
		 if(car_extra_data.response_code==200)
		 {
			$scope.extras_data = car_extra_data.response_data;
			if($scope.extras_data.length>0)
				{
					  for(var i=0; i<$scope.extras_data.length; i++) 
					  {
						  if(i==0)
						  {
							$rootScope.baby_seat_price = $scope.extras_data[i].price;  
						  }
						  if(i==0)
						  {
							 $rootScope.booster_seat_price = $scope.extras_data[i].price;  
						  }
						  if(i==2)
						  {
							 $rootScope.baby_capsule_price = $scope.extras_data[i].price;  
						  }
					 }
				}
			}
		});
 
		/* Calculate the Extra price after click the Fare calculator
		for baby seat,Booster seat, credit card surcharge etc
		 */
		$scope.calculateExtraPrice = function(index,fare_type,val,return_value,extra_type)
		{
			if(typeof $scope.booking_form.base_price=='undefined')
			{
				$scope.booking_form.base_price = parseFloat(0).toFixed(2);
			}
				if(index==0)
				{
					if(typeof val=='undefined')
					{
						if(typeof $scope.booking_form.extra_prices.extra_price=='undefined')
						{
							$scope.booking_form.extra_prices.extra_price = [];
						}
					}
					$scope.extra_number1 = $scope.booking_form_extra.extra_extra_nos1;
					if($scope.extra_number1=='')
					{
						$scope.val = val;
					}
					else
					{
						$scope.val = ($rootScope.baby_seat_price)*($scope.extra_number1);
						$scope.val = (parseFloat($scope.val));
					}
				}
				if(index==1)
				{
					if(typeof val=='undefined')
					{
						if(typeof $scope.booking_form.extra_prices.extra_price=='undefined')
						{
							$scope.booking_form.extra_prices.extra_price = [];
						}
					}
					$scope.extra_number2 = $scope.booking_form_extra.extra_extra_nos2;
					if($scope.extra_number2=='')
					{
						$scope.val = val;
					}
					else
					{
						$scope.val = ($rootScope.booster_seat_price)*($scope.extra_number2);
						$scope.val = (parseFloat($scope.val));
					}
				}
				if(index==2)
				{
					if(typeof val=='undefined')
					{
						if(typeof $scope.booking_form.extra_prices.extra_price=='undefined')
						{
							$scope.booking_form.extra_prices.extra_price = [];
						}
					}
					$scope.extra_number3 = $scope.booking_form_extra.extra_extra_nos3;
					if($scope.extra_number3=='')
					{
						$scope.val = val;
					}
					else
					{
						$scope.val = ($rootScope.baby_capsule_price)*($scope.extra_number3);
						$scope.val = (parseFloat($scope.val));
					}
				}
				if(extra_type=='Card Surcharge')
				{
					$scope.total_extra_fare_value = 0;
					if(typeof $scope.booking_form.extra_prices.extra_price=='undefined')
					{
						$scope.booking_form.extra_prices.extra_price = [];
					}
					for($i=0;$i<$scope.booking_form.extra_prices.length-1;$i++)
					{
						if((typeof $scope.booking_form.extra_prices.extra_price[$i + 1] )!='undefined')
						{
							// Check the populate extra arry value is number or not 
							$scope.check_extra_fare_valid_number_or_not 		= isNaN(($scope.booking_form.extra_prices.extra_price[$i + 1]));
							if($scope.check_extra_fare_valid_number_or_not 		== false)
							{
								$scope.total_extra_fare_value = (parseFloat($scope.total_extra_fare_value)+parseFloat($scope.booking_form.extra_prices.extra_price[$i + 1]));
							}
						}
					}
					$scope.total_extra_fare_for_credit_card_surcharge = (parseFloat($scope.total_extra_fare_value)+parseFloat($scope.booking_form.base_price));
					$credit_card_surcharge_percentage_database_value = $rootScope.credit_card_surcharge_percentage_value;
					$scope.total_extra_fare_for_credit_card_surcharge = (($credit_card_surcharge_percentage_database_value)*($scope.total_extra_fare_for_credit_card_surcharge)/100).toFixed(2);
					$scope.val = (parseFloat($scope.total_extra_fare_for_credit_card_surcharge));
				}
				$scope.oneWayFareCalculation(index,'extra',$scope.val,'another_extra_from_calculator');
				// Calculate the credit card surcharge for return way
				if($scope.booking_form.booking_type=='return')
				{
					if(typeof $scope.booking_form.return_base_price=='undefined')
					{
						$scope.booking_form.return_base_price = parseFloat(0).toFixed(2);
					}
					if(index==0) 
					{
						if(typeof return_value=='undefined')
						{
							if(typeof $scope.booking_form.return_extra_prices.extra_price=='undefined')
							{
								$scope.booking_form.return_extra_prices.extra_price = [];
							}
						}
						$scope.return_extra_number1 = $scope.retun_booking_form_extra.extra_extra_nos1;
						
						if($scope.return_extra_number1=='' || typeof $scope.return_extra_number1=='undefined')
						{
							$scope.return_val = return_value;
						}
						else
						{
							$scope.return_val = ($rootScope.baby_seat_price)*($scope.return_extra_number1);
							$scope.return_val = (parseFloat($scope.return_val));
						}
					}
					if(index==1)
					{
						if(typeof return_value=='undefined')
						{
							if(typeof $scope.booking_form.return_extra_prices.extra_price=='undefined')
							{
								$scope.booking_form.return_extra_prices.extra_price 	= [];
							}
						}
						$scope.return_extra_number2 = $scope.retun_booking_form_extra.extra_extra_nos2;
						if($scope.return_extra_number2=='' || typeof $scope.return_extra_number2=='undefined')
						{
							$scope.return_val = return_value;
						}
						else
						{
							$scope.return_val = ($rootScope.booster_seat_price)*($scope.return_extra_number2);
							$scope.return_val = (parseFloat($scope.return_val));
						}
					}
					if(index==2) 
					{
						if(typeof return_value=='undefined')
						{
							if(typeof $scope.booking_form.return_extra_prices.extra_price=='undefined')
							{
								$scope.booking_form.return_extra_prices.extra_price = [];
							}
						}
						$scope.retrurn_extra_number3 = $scope.retun_booking_form_extra.extra_extra_nos3;
						if($scope.retrurn_extra_number3=='' || typeof $scope.retrurn_extra_number3=='undefined')
						{
							$scope.return_val = return_value;
						}
						else
						{
							$scope.return_val = ($rootScope.baby_capsule_price)*($scope.retrurn_extra_number3);
							$scope.return_val = (parseFloat($scope.return_val));
						}
					}
					if(extra_type=='Card Surcharge')
					{
						$scope.return_total_extra_fare_value = 0;
						if(typeof $scope.booking_form.return_extra_prices.extra_price=='undefined')
						{
							$scope.booking_form.return_extra_prices.extra_price = [];
						}
						for($i=0;$i<$scope.booking_form.return_extra_prices.length-1;$i++)
						{
							if((typeof $scope.booking_form.return_extra_prices.extra_price[$i + 1] )!='undefined')
							{
								// Check the populate extra arry value is number or not 
								$scope.return_check_extra_fare_valid_number_or_not 		= isNaN(($scope.booking_form.return_extra_prices.extra_price[$i + 1]));
								if($scope.return_check_extra_fare_valid_number_or_not 		== false)
								{
									$scope.return_total_extra_fare_value = (parseFloat($scope.return_total_extra_fare_value)+parseFloat($scope.booking_form.return_extra_prices.extra_price[$i + 1]));
								}
							}
						}
						$scope.return_total_extra_fare_for_credit_card_surcharge = (parseFloat($scope.return_total_extra_fare_value)+parseFloat($scope.booking_form.return_base_price));
						$return_credit_card_surcharge_percentage_database_value = $rootScope.credit_card_surcharge_percentage_value;
						$scope.return_total_extra_fare_for_credit_card_surcharge = (($return_credit_card_surcharge_percentage_database_value)*($scope.return_total_extra_fare_for_credit_card_surcharge)/100).toFixed(2);
						$scope.return_val = (parseFloat($scope.return_total_extra_fare_for_credit_card_surcharge));
					}
					$scope.returnWayFareCalculation(index,'extra',$scope.return_val,'another_extra_from_calculator');  
				}
		}

         /*  Fill up all the one way booking all address,city 
			 put as a return way address ,city and subub */
         $scope.populalateReturnData = function()
         {
			 $scope.booking_form.return_from_label		 	= $scope.booking_form.to_label;
			 $scope.booking_form.return_to_label 			= $scope.booking_form.from_label;
             $scope.booking_form.return_from_address_line_1 = $scope.booking_form.to_address_line_1;
             $scope.booking_form.return_from_address_line_2 = $scope.booking_form.to_address_line_2;
             $scope.booking_form.return_to_address_line_1 	= $scope.booking_form.from_address_line_1;
             $scope.booking_form.return_to_address_line_2 	= $scope.booking_form.from_address_line_2;
			 $scope.booking_form.return_from_suburb			= $scope.booking_form.to_suburb;
			 $scope.booking_form.return_to_suburb			= $scope.booking_form.from_suburb;
			 $scope.booking_form.return_from_city			= $scope.booking_form.to_city;
			 $scope.booking_form.return_to_city				= $scope.booking_form.from_city;
			 $scope.booking_form.return_from_state			= $scope.booking_form.to_state;
			 $scope.booking_form.return_to_state			= $scope.booking_form.from_state;
			 $scope.booking_form.return_from_post_code		= $scope.booking_form.to_post_code;
			 $scope.booking_form.return_to_post_code		= $scope.booking_form.from_post_code;
			 $scope.booking_form.return_from_country		= $scope.booking_form.to_country;
			 $scope.booking_form.return_to_country			= $scope.booking_form.from_country;
         }
		 // Close the booking success model after success booking 
		$scope.bookingModalCloseAfterSuccess= function(index)
		{
			$scope.booking_sucess_modal = false;
			$rootScope.tabs.splice(index,1); //remove the object from the array based on index
			$rootScope.selectedTab = index-1;
		}
		// Reset the booking form 
		$scope.bookingModalResetAfterSuccess = function(page_title,page_content,booking_id,index)
		{
			$scope.booking_sucess_modal = false;   
			$rootScope.tabs.splice(index,1); //remove the object from the array based on index
			$rootScope.selectedTab = index-1;
			$scope.addTab(page_title,page_content,'');
		}
         // Drop down  show when select job allocate type : Alloted,Allocate,offer 
         $scope.getDriverdetails = function()
         {
             if($scope.booking_form.driver_status != '')
             {
				 if($scope.booking_form.driver_status == 'offered')
				 {
					$scope.job_offer			= false;
					$scope.job_allocate			= true;
				 }
				 if($scope.booking_form.driver_status == 'allocate' || $scope.booking_form.driver_status == 'allotted')
				 {
					$scope.job_offer			= true;
					$scope.job_allocate			= false;
				 }
			 $scope.one_way_driver_information = false;
             }
             if ($scope.booking_form.driver_status == '')
             {
                 $scope.one_way_driver_information = true;
             }
             $scope.job_allocation_type = $scope.booking_form.job_allocation_type;
             if ($scope.job_allocation_type == 'allocate')
             {
                 $scope.driver_details_div = false;
             }
         }
         $scope.return_getDriverdetails = function()
         {
             if ($scope.booking_form.return_driver_status != '')
             {
				 if($scope.booking_form.return_driver_status == 'offered')
				 {
					$scope.return_job_offer				= false;
					$scope.return_job_allocate			= true;
				 }
				 if($scope.booking_form.return_driver_status == 'allocate' || $scope.booking_form.return_driver_status == 'allotted')
				 {
					$scope.return_job_offer				= true;
					$scope.return_job_allocate			= false;
				 }
			 $scope.return_way_driver_information = false;
             }
             if ($scope.booking_form.return_driver_status == '')
             {
                 $scope.return_way_driver_information = true;
             }
         }
			// Get selected car maximum pasenger and maximum suitcase capacity for one way and return way edit booking
			$scope.populateTheCarMaximumCapacity	= function(car_id)
			{
				// Fetch all the car name from database using below Api  
				 $scope.car_list.database_name 		= $rootScope.data_base_name;				// Data base name 
				 $scope.car_list.webservice_case 	= 'client_application_admin_car_type_list'; // Webservice case for fetch all car name from database
				 API.getListing($scope.car_list).success(function(data)
				 {
					$scope.car_data_for_get_capacity 						= data.response_data;
					for(var i = 0; i < $scope.car_data_for_get_capacity.length; i++)
					{
					  if($scope.car_data_for_get_capacity[i]._id == car_id)
					  {
						$scope.maximum_passengers 						= $scope.car_data_for_get_capacity[i].maximum_passengers;
						$scope.maximum_suitcases 						= $scope.car_data_for_get_capacity[i].maximum_suitcases;
						$scope.pasenger_drop_down_range 				= [];
						$scope.suitcases_drop_down_range 				= [];
						$scope.pasenger_drop_down_range_value 			= $scope.maximum_passengers
						$scope.suitcases_drop_down_range_value 			= $scope.maximum_suitcases
						// Create the number of passenger dynamic array with the database maximum capacity value 
						if(!$scope.pasenger_drop_down_range)
						{
							$scope.pasenger_drop_down_range_value = 20;
						}
						for(var i=1;i<=$scope.pasenger_drop_down_range_value;i++) 
						{
						  i = i;
						  $scope.pasenger_drop_down_range.push(i);
						}
						$scope.select_pasenger_value = 1;
						// Create the number of suitcases dynamic array with the car  maximum capacity value 
						if(!$scope.suitcases_drop_down_range)
						{
							$scope.suitcases_drop_down_range_value = 20;
						}
						for(var i=1;i<=$scope.suitcases_drop_down_range_value;i++) 
						{
						  i = i;
						  $scope.suitcases_drop_down_range.push(i);
						}
						$scope.select_suitcases_value = 0;
					}
				}
			}); 
		}
		// Get selected car maximum pasenger and maximum suitcase capacity for one way and return way edit booking
		$scope.returnPopulateTheCarMaximumCapacity	= function(car_id)
		{
			// Fetch all the car name from database using below Api  
			 $scope.car_list.database_name 		= $rootScope.data_base_name;				// Data base name 
			 $scope.car_list.webservice_case 	= 'client_application_admin_car_type_list'; // Webservice case for fetch all car name from database
			 API.getListing($scope.car_list).success(function(data)
			 {
				$scope.return_car_data_for_get_capacity 						= data.response_data;
				for(var i = 0; i < $scope.return_car_data_for_get_capacity.length; i++)
				{
				  if($scope.return_car_data_for_get_capacity[i]._id == car_id)
				  {
					$scope.return_maximum_passengers 							= $scope.return_car_data_for_get_capacity[i].maximum_passengers;
					$scope.return_maximum_suitcases 							= $scope.return_car_data_for_get_capacity[i].maximum_suitcases;
					$scope.return_pasenger_drop_down_range 						= [];
					$scope.return_suitcases_drop_down_range 					= [];
					$scope.return_pasenger_drop_down_range_value 				= $scope.return_maximum_passengers
					$scope.return_suitcases_drop_down_range_value 				= $scope.return_maximum_suitcases
					// Create the number of passenger dynamic array with the database maximum capacity value 
					if(!$scope.return_pasenger_drop_down_range)
					{
						$scope.return_pasenger_drop_down_range_value = 20;
					}
					for(var i=1;i<=$scope.return_pasenger_drop_down_range_value;i++) 
					{
					  i = i;
					  $scope.return_pasenger_drop_down_range.push(i);
					}
					$scope.select_pasenger_value = 1;
					// Create the number of suitcases dynamic array with the car  maximum capacity value 
					if(!$scope.return_suitcases_drop_down_range)
					{
						$scope.return_suitcases_drop_down_range_value = 20;
					}
					for(var i=1;i<=$scope.return_suitcases_drop_down_range_value;i++) 
					{
					  i = i;
					  $scope.return_suitcases_drop_down_range.push(i);
					}
					$scope.select_suitcases_value = 0;
				}
			}
		}); 
	}
         // Get all Car class list from database 
         $scope.car_list.database_name 		= $rootScope.data_base_name;
         $scope.car_list.webservice_case 	= 'client_application_admin_car_type_list';
         API.getListing($scope.car_list).success(function(data)
         {
             $scope.car_list_data 							= data.response_data;
			 $scope.car_list_data 							= $filter('orderBy')($scope.car_list_data, 'order_id');
			 $scope.booking_form.car_type_id 				= $scope.car_list_data[0]._id;
			 /* using populateTheCarMaximumCapacity() function create dynamic dropdown for
				maximum passenger and maximum Luggages for one way booking 
			 */
			 $scope.populateTheCarMaximumCapacity($scope.booking_form.car_type_id);
			 /* using populateTheCarMaximumCapacity() function create dynamic dropdown for
				maximum passenger and maximum Luggages for return way booking 
			 */
			 $scope.returnPopulateTheCarMaximumCapacity($scope.booking_form.car_type_id);		 
			 $scope.booking_form.return_car_type_id 		= $scope.car_list_data[0]._id;
			 $rootScope.booking_form_car_type_id 			=  $scope.car_list_data[0]._id;
			 $rootScope.return_booking_form_car_type_id 	=  $scope.car_list_data[0]._id;
         });
	
		 // Using updatePriceAccordingToExtra() function update the extra number in  extra array for one way booking 
         $scope.updatePriceAccordingToExtra = function(index, val)
         {
             $scope.booking_form.extras[index].extra_nos = parseInt(val);
         }
		 /*
			using return_updatePriceAccordingToExtra() function update the extra number in 
			extra array for return way booking 	
		*/
         $scope.return_updatePriceAccordingToExtra = function(index, val)
         {
             $scope.booking_form.return_extras[index].extra_nos = parseInt(val);
         }
		 // Get Booking made by details with account name(using customer id)
         $scope.booking_made = {};
		 // initilize the arry for listing all the booking made by contacts
		 $scope.booking_made_listing_data_new = [];
		 // initilize the arry for listing all the pax only contacts
		 $scope.pax_listing_data			  = [];
		 // Fetch all the booking made by contacts using customer id 
         $scope.getBookingMadeBydetails = function(customer_id)
         {
			 if(typeof customer_id!='undefined' && customer_id!='')
			 {
				 $scope.add_account_div				= true;
			 }
			 $scope.booking_made_loder_image 		= false;
			 if($scope.booking_form.booking_made_by_id=='')
			 {
				$scope.booking_form.booking_made_by_id = 3; 
			 }
			 if($scope.booking_form.pax_id	=='')
			 {
				$scope.booking_form.pax_id	= 3; 
			 }
			 $scope.booking_made_listing_data	 	 = [];
			 // Set the database name and the webservice case 
             $scope.booking_made.database_name 		= $rootScope.data_base_name;
             $scope.booking_made.webservice_case 	= 'client_application_customer_listing';
             $scope.booking_made.id = customer_id;
             API.getListing($scope.booking_made).success(function(data)
             {
				 $scope.booking_made_loder_image 				= true;
				 $scope.booking_made_listing_data	  			= [];
				 $scope.booking_form.booking_made_by_id 		= '';
				 $scope.booking_form.pax_id						= '';
                 $scope.booking_made_listing_data = data.response_data[0].contacts;
				 $scope.booking_made_listing_data_new 			= [];
				 $scope.pax_listing_data						= [];
				 for($i=0;$i< data.response_data[0].contacts.length;$i++)
				 {
					if($scope.booking_made_listing_data[$i].contact_type=='booking' || $scope.booking_made_listing_data[$i].contact_type=='all')
					{
						$scope.booking_made_listing_data_new.push($scope.booking_made_listing_data[$i]);
					}
					if($scope.booking_made_listing_data[$i].contact_type=='pax' || $scope.booking_made_listing_data[$i].contact_type=='all')
					{
						$scope.pax_listing_data.push($scope.booking_made_listing_data[$i]);
					}
				 }
					$scope.booking_made_by_div 	= false;
					$scope.select_passenger_div = false;
             });
         }
		 
		 // If login as a customer
		 // If the contact type is "booking" or "all" 
		 if($scope.contact_type_session_value=='booking'|| $scope.contact_type_session_value=='all')
		 {
			 $scope.customer_type_div								= 	true;
			 $scope.customer_list_div								= 	true;
			 $scope.booking_made_by_div_for_contact_type_user		=	false;
			 $scope.booking_made_by_select_dropdown					= 	true;
			 $scope.booking_made_by_for_contact						= 	false;
			 $scope.booking_made_select_default_dropdown 			= 	true;
			 $scope.select_passenger_div							= 	false;
			 $scope.pax_select_dropdown								= 	false;
			 $scope.pax_select_default_dropdown						= 	true;
			 //$scope.external_notes_div								= 	true;
			 $scope.one_way_driver_information_div   				= 	true;
			 $scope.return_way_driver_information 					= 	true;
			 $scope.fare_guideline 									= 	true;
			 $scope.customer_id 									= $sessionStorage.customer_id;
			 $scope.session_contact_id = $sessionStorage.contact_id;
			 $scope.contact_type_user_full_name						= $sessionStorage.user_name;
			 $scope.getBookingMadeBydetails($scope.customer_id);
			 $scope.booking_made_by_div								= 	true;
			 $scope.openAccountButtonAddBookingMade					= 	true;
			 $scope.contact_booking_form_booking_made_by_name 		= $scope.contact_type_user_full_name;
			 $scope.booking_form.customer_id 						=  $scope.customer_id;
			 $scope.booking_form.booking_made_by_id 				= $scope.session_contact_id;			 
		 }		
         // Get pax listing data for a particular customer 
         $scope.booking_made 							= {};
         // Add new booking 
         $scope.booking_form.booking_form_pick_time 	= {};
         $scope.booking_form.booking_source 			= 'bms';
		 
		 // Call the add booking function for insert into database  with all the booking value
         $scope.addBooking = function(booking_form_validate)
         {
			 if(typeof $scope.booking_form.booking_made_by_id_confirmation=='undefined')
			 {
				$scope.booking_form.booking_made_by_id_confirmation = true; 
			 }
			 if(typeof $scope.booking_form.pax_confirmation=='undefined')
			 {
				$scope.booking_form.pax_confirmation = true; 
			 }
			 if(typeof $scope.booking_form_new_pax_regitration_contact.calling_code=='undefined')
				{
					$scope.booking_form_new_pax_regitration_contact.calling_code = $rootScope.business_calling_code;
				}
			 if(typeof $scope.booking_form_new_pax_regitration_contact.calling_code=='undefined')
				{
					$scope.booking_form_new_pax_regitration_contact.calling_code = $rootScope.business_calling_code;
				}
			 if(typeof $scope.booking_form.alternative_calling_code=='undefined')
				{
					$scope.booking_form.alternative_calling_code = $rootScope.business_calling_code;
				}
			if(typeof $scope.booking_form.pax_altternative_phone=='undefined')
				{
					$scope.booking_form.pax_altternative_phone = ''; 
				}
			 $scope.booking_form.job_status = 'confirmed';
             if ($scope.booking_form.payment_type == 0)
             {
                 $scope.booking_form.payment_type 				= '';
                 $scope.booking_form.contact_type 				= '';
                 $scope.booking_form.title 						= '';
                 $scope.booking_form.booking_made 				= '';
                 $scope.booking_form.booking_made_calling_code 	= '';
             }
			 // All the form validation here check the field is blank or undefined
             if (!$scope.booking_form.customer_type && $scope.admin_type_session_value=='Admin')
             {
                 booking_form_validate.cust_type.$dirty = true;
                 return false;
             }
			 // Check the customer id blank or not
			 if($scope.booking_form.customer_id=='' && $scope.active_account_div == 0)
			 {
				//booking_form_validate.customer_name.$dirty = true;
                //return false; 
			 }
			 // Check the new customer add div open or not
			 if($scope.active_account_div == 1)
			 {
				booking_form_validate.customer_name.$dirty = false; 
			 }
			 if($scope.admin_type_session_value=='Admin')
			 {
				 if (!$scope.booking_form.customer_id && $scope.active_account_div == 0)
				 {
					 booking_form_validate.customer_name.$dirty = true;
					 return false;
				 }
				// validation for Exsisting Booking made by id dropdown value 
				if ($scope.booking_form.customer_id != '')
				{
					if ($scope.booking_made_by_information_active == 0)
					{
						if(typeof $scope.booking_form.booking_made_by_id =='undefined' ||  $scope.booking_form.booking_made_by_id == '')
						{
							booking_form_validate.book_made.$dirty = true;
							return false;
						}
					}
				}
				// validation for dropdown value for pax. If the pax already registerd with us 
				if ($scope.booking_form.customer_id != '' && $scope.booking_form.booking_made_by_id!='')
				{
					if ($scope.new_pax_information_active==0)
					{
						if(typeof $scope.booking_form.pax_id =='undefined' ||  $scope.booking_form.pax_id == '')
						{
							booking_form_validate.paxname.$dirty = true;
							return false;
						}
					}
				}
			 }
			 //  validation if add new booking made by under a existing customer 
			 if ($scope.booking_form.customer_id != '')
             {
				 if($scope.booking_form.booking_made_by_id=='' || typeof $scope.booking_form.booking_made_by_id=='undefined')
				 {
					 //  Check the new booking made by div open or not 
					 if($scope.booking_made_by_information_active == 1)
					 {
						 // Validation for new booking made 
						 if(!$scope.booking_form_new_booking_made.contact_type || $scope.booking_form_new_booking_made.contact_type =='')
						 {
							 booking_form_validate.new_booking_made_by_contact_type.$dirty = true;
							return false;
						 }
						 // First name validation for new booking made 
						 if(!$scope.booking_form_new_booking_made.first_name || $scope.booking_form_new_booking_made.first_name=='')
						 {
							 booking_form_validate.new_booking_made_by_first_name.$dirty = true;
							return false;
						 }
						  // Last name validation for new booking made 
						 if(!$scope.booking_form_new_booking_made.last_name || $scope.booking_form_new_booking_made.last_name=='')
						 {
							 $scope.booking_form_new_booking_made.last_name = '';
							 //booking_form_validate.new_booking_made_by_last_name.$dirty = true;
							//return false;
						 }
						 
						if (typeof $scope.booking_form_new_booking_made_contact.type == 'undefined' || $scope.booking_form_new_booking_made_contact.type == '')
						{
							$scope.booking_form_new_booking_made_contact.type = '';
							//booking_form_validate.new_booking_made_by_ph_type.$dirty = true;
							//return false;
						}
						// validation for phone number 
						if (typeof $scope.booking_form_new_booking_made_contact.number == 'undefined' || $scope.booking_form_new_booking_made_contact.number == '')
						{
							$scope.booking_form_new_booking_made_contact.number = '';
							//booking_form_validate.new_booking_made_by_number.$dirty = true;
							//return false;
						}
						if($scope.booking_form_new_booking_made_contact.number!= '')
						{
							var phone_regexp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
							if (phone_regexp.test($scope.booking_form_new_booking_made_contact.number))
							{}
							else
							{
								$scope.booking_made_valid_phone_number_error_msg = "Please enter a valid phone Number.";
								return false;
							}
						}
						//  End of phone number validation 
					 }
				 }
			 }
			 // validation for new pax registration under a existing customer
			 if ($scope.booking_form.customer_id != '')
             {
				if($scope.booking_form.pax_id=='' || typeof $scope.booking_form.pax_id=='undefined')
				  {
					  if($scope.new_pax_information_active==1)
					  {
						 //  First name validation for new booking made 
						 if(!$scope.booking_form_new_pax_regitration.first_name || $scope.booking_form_new_pax_regitration.first_name=='')
						 {
							
							 booking_form_validate.booking_form_new_pax_first_name.$dirty = true;
							 return false;
						 }
						  // Last name validation for new pax registration 
						 if(!$scope.booking_form_new_pax_regitration.last_name || $scope.booking_form_new_pax_regitration.last_name =='')
						 {
							 $scope.booking_form_new_pax_regitration.last_name = '';
							 //booking_form_validate.new_booking_made_by_last_name.$dirty = true;
							 //return false;
						 }
						if (typeof $scope.booking_form_new_pax_regitration_contact.type == 'undefined' || $scope.booking_form_new_pax_regitration_contact.type == '')
						{
							$scope.booking_form_new_pax_regitration_contact.type = '';
							//booking_form_validate.booking_form_new_pax_ph_type.$dirty = true;
							//return false;
						}
						// validation for pax phone number 
						if (typeof $scope.booking_form_new_pax_regitration_contact.number == 'undefined' || $scope.booking_form_new_pax_regitration_contact.number == '')
						{
							$scope.booking_form_new_pax_regitration_contact.number = '';
							//booking_form_validate.booking_form_new_pax_number.$dirty = true;
							//return false;
						}
						if($scope.booking_form_new_pax_regitration_contact.number!= '')
						{
							var phone_regexp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
							if (phone_regexp.test($scope.booking_form_new_pax_regitration_contact.number))
							{}
							else
							{
								//$scope.new_pax_valid_phone_number_error_msg = "Please enter a valid phone Number.";
								//return false;   
							}
						}
						  
					  }
				  }
			 }
             if (typeof $scope.booking_form.pickup_date == 'undefined')
             {
                 booking_form_validate.one_way_pickupdate.$dirty = true;
                 return false;
             }
             if (!$scope.booking_form.pickup_date)
             {
                 booking_form_validate.pickupdate.$dirty = true;
                 return false;
             }
             if ($scope.booking_form_pick_time_hh == '')
             {
                 booking_form_validate.one_way_pickuptime_hh.$dirty = true;
                 return false;
             }
			  if ($scope.booking_form_pick_time_mm == '')
             {
                 booking_form_validate.one_way_pickuptime_mm.$dirty = true;
                 return false;
             }
             if (!$scope.booking_form.from_address_line_1)
             {
                 $scope.booking_form.from_address_line_1 = '';
             }

             if (!$scope.booking_form.to_address_line_1)
             {
                $scope.booking_form.to_address_line_1 = '';
             }
			 if (!$scope.booking_form.from_suburb)
             {
                 $scope.booking_form_validate.one_way_from_suburb.$dirty = true;
				 return false;
             }
			 /* Check the the booking type is one way or Hourly 
				if the booking type hourly then this validation not required_fields
			 */
			if($scope.booking_form.booking_type!='hourly')
			{
				 if (!$scope.booking_form.to_suburb)
				 {
					 $scope.booking_form_validate.one_way_to_suburb.$dirty = true;
					 return false;
				 }
			}
             if (!$scope.booking_form.car_type_id || $scope.booking_form.car_type_id == '')
             {
                 booking_form_validate.one_way_vehicle_type.$dirty = true;
                 return false;
             }
             if ($scope.booking_form.pax_nos == '')
             {
                 booking_form_validate.one_way_pax_no.$dirty = true;
                 return false;
             }
             //  validation driver id price when driver status is selected 
             if ($scope.booking_form.driver_status != '')
             {
				 //  If the driver status type allocate or alloted for one way booking 
				 if($scope.booking_form.driver_status=='allocate' || $scope.booking_form.driver_status=='allotted')
				 {
					 if ($scope.booking_form.driver_id == '')
					 {
						 booking_form_validate.one_way_driverid.$dirty = true;
						 return false;
					 }
				 }
				  if($scope.booking_form.driver_status=='offered')
				  {
					// If the driver status type is offerd for one way booking 
					 if (typeof $scope.booking_form.offered_driver_ids.length == 'undefined')
					 {
						  booking_form_validate.one_way_driverid.$dirty = true;
						 return false;
					 }
				  }
				  if($scope.booking_form.driver_status=='offered'|| $scope.booking_form.driver_status=='allotted')
				  {
					  if ($scope.booking_form.driver_payment_option == '' || typeof $scope.booking_form.driver_payment_option=='undefined')
						{
							 booking_form_validate.one_way_patment_type.$dirty = true;
							 return false;
						}
					 if (typeof $scope.booking_form.driver_price == 'undefined')
					 {
						 booking_form_validate.one_way_driver_price.$dirty = true;
						 return false;
					 }
					 else
					 {
						booking_form_validate.one_way_driver_price.$dirty = false; 
					 }
				  }
             }
             parseInt($scope.booking_form_pick_time_hh);
             if ($scope.booking_form_pick_time_hh > 12)
             {
                 $time_mode = 'PM';
             }
			 if ($scope.booking_form_pick_time_hh == 12)
             {
                 $time_mode = 'PM';
             }
             if ($scope.booking_form_pick_time_hh < 12)
             {
                 $time_mode = 'AM';
             }
             parseInt($scope.booking_form_pick_time_mm);
             $scope.pickup_time 					= $scope.booking_form_pick_time_hh + ':' + $scope.booking_form_pick_time_mm + ' ' + $time_mode;
             $scope.booking_form.pickup_time 		= $scope.pickup_time;
             $scope.booking_form.booking_status 	= 'confirmed';
            
			// If the booking is return type then validation 
             if ($scope.booking_form.booking_type == 'return')
             {
                 if (typeof $scope.booking_form.return_date == 'undefined')
                 {
                     booking_form_validate.return_pickupdate.$dirty = true;
                     return false;
                 }
                 if (!$scope.booking_form.return_date)
                 {
                     booking_form_validate.return_pickupdate.$dirty = true;
                     return false;
                 }
                 if ($scope.booking_form_return_pick_time_hh == '')
                 {
                     booking_form_validate.retrun_pickuptime_hh.$dirty = true;
                     return false;
                 }
				 if ($scope.booking_form_return_pick_time_mm == '')
				 {
					 booking_form_validate.return_pickuptime_mm.$dirty = true;
					 return false;
				 }
				 /* validation for retrurn way booking minutes and hour is less then one way booking
					hour and minutes or not
				 */
                 if (!$scope.booking_form.return_car_type_id || $scope.booking_form.return_car_type_id == '')
                 {
                     booking_form_validate.return_way_vehicle_type.$dirty = true;
                     return false;
                 }
                 if ($scope.booking_form.return_pax_nos == '')
                 {
                     booking_form_validate.return_pax_nos.$dirty = true;
                     return false;
                 }
                 parseInt($scope.booking_form_return_pick_time_hh);
                 $retun_time_mode = '';
                 if ($scope.booking_form_return_pick_time_hh > 12)
                 {
                     $retun_time_mode = 'PM';
                 }
				if ($scope.booking_form_pick_time_hh == 12)
				{
					$retun_time_mode = 'PM';
				}
                 if ($scope.booking_form_return_pick_time_hh < 12)
                 {
                     $retun_time_mode = 'AM';
                 }
				if (!$scope.booking_form.return_from_address_line_1)
				{
					$scope.booking_form.return_from_address_line_1 ='';
				}
				if (!$scope.booking_form.return_to_address_line_1)
				{
					$scope.booking_form.return_to_address_line_1='';
				}
				if (!$scope.booking_form.return_from_suburb)
				{
					$scope.booking_form_validate.return_way_from_suburb.$dirty = true;
					return false;
				}
				if (!$scope.booking_form.return_to_suburb)
				{
					$scope.booking_form_validate.return_way_to_suburb.$dirty = true;
					return false;
				}
                 // validation driver id price when driver status is selected for return way booking
                 if ($scope.booking_form.return_driver_status != '')
                 {
					 //$scope.booking_form.return_driver_status ='not_actioned';
					  if($scope.booking_form.return_driver_status=='allocate' || $scope.booking_form.return_driver_status=='allotted')
						{
							 if ($scope.booking_form.return_driver_id == '')
							 {
								 booking_form_validate.return_driver_name.$dirty = true;
								 return false;
							 }
						}
					 // If the driver status type is offerd for return way booking 
					 if($scope.booking_form.return_driver_status=='offered')
					 {
						 if (typeof $scope.booking_form.return_offered_driver_ids.length == 'undefined')
						 {
							 booking_form_validate.return_driver_name.$dirty = true;
							return false;
						 }
					 }
					if($scope.booking_form.return_driver_status=='allotted'|| $scope.booking_form.return_driver_status=='offered')
					{	
						if ($scope.booking_form.return_driver_payment_option == '')
						 {
							 booking_form_validate.return_patment_type.$dirty = true;
							 return false;
						 }
						 if (typeof $scope.booking_form.return_driver_price == 'undefined')
						 {
							 booking_form_validate.returndriverprice.$dirty = true;
							 return false;
						 }
					}
                 }
				
				 $scope.booking_form.job_status 				= 'confirmed';
                 parseInt($scope.booking_form_return_pick_time_mm);
                 $scope.return_pickup_time 						= $scope.booking_form_return_pick_time_hh + ':' + $scope.booking_form_return_pick_time_mm + ' ' + $retun_time_mode;
                 $scope.booking_form.return_time 				= $scope.return_pickup_time;
                 $scope.booking_form.booking_status 			= 'confirmed';
             }
			 // This is the common function for make booking 
			 $scope.makeBooking = function()
			 {
				$scope.bookingHistoryLoader 			= true;
				$scope.booking_form.database_name 		= $rootScope.data_base_name;
				$scope.booking_form.webservice_case 	= 'client_application_booking_add';
				$scope.booking_form.access_platform		='bms';
				$scope.booking_form.required_fields 	= [{'name': 'customer_id'},{'name': 'booking_type'}];
				 API.addBooking($scope.booking_form).success(function(data)
				 {
					 if (data.response_code == '200')
					 {
						 $scope.bookingHistoryLoader 		= false;
						 $scope.sucess_message 				= data.response_message;
						 $scope.booking_success_information = data.response_data.full_data;
						 $scope.booking_sucess_modal 		= true;
					 }
				 });
			 }
			
			/* Dynamic array creation for one way booking additional pick up address 
				Convert Object to arry format */
			var one_way_additional_pick_up = [];
			angular.forEach($scope.booking_form.additional_pickup_address_from, function(element) {
																									one_way_additional_pick_up.push(element);
																									});
			$scope.booking_form.additional_pickup_address_from = one_way_additional_pick_up;
			/* Dynamic array creation for one way booking additional drop off address 
				Convert Object to arry format */
			var one_way_additional_drop_off = [];
			angular.forEach($scope.booking_form.additional_pickup_address_to, function(element) {
																									one_way_additional_drop_off.push(element);
																									});
			$scope.booking_form.additional_pickup_address_to = one_way_additional_drop_off;
			if ($scope.booking_form.booking_type == 'return')
			{
				/* Dynamic array creation for return  way booking additional pick up address 
				Convert Object to arry format */
				var return_way_additional_pick_up = [];
				angular.forEach($scope.booking_form.return_additional_pickup_address_from, function(element) {
																									return_way_additional_pick_up.push(element);
																									});
				$scope.booking_form.return_additional_pickup_address_from = return_way_additional_pick_up;

				/* Dynamic array creation for return  way booking additional drop off address 
				Convert Object to arry format */
				var return_way_additional_drop_off = [];
				angular.forEach($scope.booking_form.return_additional_pickup_address_to, function(element) {
																									return_way_additional_drop_off.push(element);
																									});
				$scope.booking_form.return_additional_pickup_address_to = return_way_additional_drop_off;
			}
             //  All the validation for If the customer not registerd with us 
             if ($scope.booking_form.customer_id == '')
             {
                 if ($scope.active_account_div == 1)
                 {
                     // From validation here 
                     if (!$scope.booking_form_new_account.name || $scope.booking_form_new_account.name == '')
                     {
                         booking_form_validate.new_customer_name.$dirty = true;
                         return false;
                     }
                     if (!$scope.booking_form_new_account.payment_type || $scope.booking_form_new_account.payment_type == '')
                     {
                         booking_form_validate.new_account_payment_type.$dirty = true;
                         return false;
                     }
                     if (!$scope.booking_form_new_account.contact_type || $scope.booking_form_new_account.contact_type == '')
                     {
                         booking_form_validate.booking_made_contact_type.$dirty = true;
                         return false;
                     }
                     if (typeof $scope.booking_form_new_account.first_name == 'undefined' || $scope.booking_form_new_account.first_name == '')
                     {
                         booking_form_validate.new_account_booking_made_first_name.$dirty = true;
                         return false;
                     }
                     if (typeof $scope.booking_form_new_account.last_name == 'undefined' || $scope.booking_form_new_account.last_name == '')
                     {
						 $scope.booking_form_new_account.last_name ='';
                         //booking_form_validate.new_account_booking_made_last_name.$dirty = true;
                         //return false;
                     }
                     if (typeof $scope.booking_form_new_account.type == 'undefined' || $scope.booking_form_new_account.type == '')
                     {
						 $scope.booking_form_new_account.type = '';
                         //booking_form_validate.new_account_booking_made_ph_type.$dirty = true;
                         //return false;
                     }
                     if (typeof $scope.booking_form_new_account.number == 'undefined' || $scope.booking_form_new_account.number == '')
                     {
						 $scope.booking_form_new_account.number = '';
                         //booking_form_validate.new_account_booking_made_number.$dirty = true;
                         //return false;
                     }
                     if ($scope.booking_form_new_account.number != '')
                     {
                         var phone_regexp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
                         if (phone_regexp.test($scope.booking_form_new_account.number))
                         {}
                         else
                         {
                             //$scope.valid_phone_number = "Please enter a valid phone Number.";
                             //  return false;     
                         }
                     }
					 // Email validation for new customer registration 
					 if($scope.booking_form_new_account.email=='' || typeof $scope.booking_form_new_account.email=='undefined')
					 {
						 $scope.booking_form_new_account.email = '';
						 //booking_form_validate.new_account_booking_made_email.$dirty = true;
                        // return false; 
					 }
                     // Password validation for booking made by id(in new account create)
					
                     if (typeof $scope.booking_form_new_account.password != 'undefined' || $scope.booking_form_new_account.password != '')
                     {
						 //$scope.booking_form_new_account.password = '';
                         //booking_form_validate.new_account_booking_made_password.$error.minlength = true;
                         //return false;
                     }
					 else
					 {
						$scope.booking_form_new_account.password = ''; 
					 }
                     if ($scope.booking_form_new_account.contact_type == 'booking')
                     {
                         $scope.booking_form_new_account.add_new_pax = 'yes';
                         $scope.booking_form_new_account.pax_contact_type = 'pax';

                         // validation for pax information 
                         if (typeof $scope.booking_form_new_account.pax_first_name == 'undefined' || $scope.booking_form_new_account.pax_first_name == '')
                         {
                             booking_form_validate.new_account_pax_first_name.$dirty = true;
                             return false;
                         }
                         if (typeof $scope.booking_form_new_account.pax_last_name == 'undefined' || $scope.booking_form_new_account.pax_last_name == '')
                         {
							 $scope.booking_form_new_account.pax_last_name = '';
                            // booking_form_validate.new_account_pax_last_name.$dirty = true;
                             //return false;
                         }
                         if (typeof $scope.booking_form_new_account.pax_number == 'undefined' || $scope.booking_form_new_account.pax_number == '')
                         {
							 $scope.booking_form_new_account.pax_number = '';
                             //booking_form_validate.new_account_pax_number.$dirty = true;
                             //return false;
                         }
                     }
						if(typeof $scope.booking_form_new_account.calling_code=='undefined')
						{
							$scope.booking_form_new_account.calling_code = $rootScope.business_calling_code;
						}
						if(typeof $scope.booking_form_new_account.pax_calling_code=='undefined')
						{
							$scope.booking_form_new_account.pax_calling_code = $rootScope.business_calling_code;
						}
					 
					 $scope.bookingHistoryLoader = true;
                     $scope.booking_form_new_account.database_name = $rootScope.data_base_name;
                     $scope.booking_form_new_account.customer_type = $scope.booking_form.customer_type;
                     $scope.booking_form_new_account.webservice_case = 'client_application_customer_registration_during_booking';
                     API.addNewCustomerBooking($scope.booking_form_new_account).success(function(data)
                     {
						 $scope.unique_error_message = '';
                         if (data.response_code == '200')
                         {
                             $scope.booking_form.customer_id = data.response_data[0]._id;
                             $scope.booking_form.booking_made_by_id = data.response_data[0].contacts[0]._id;
                             if ($scope.booking_form_new_account.contact_type == 'booking')
                             {
                                 $scope.booking_form.pax_id = data.response_data[0].contacts[1]._id;
                             }
                             if ($scope.booking_form_new_account.contact_type == 'all')
                             {
                                 $scope.booking_form.pax_id = data.response_data[0].contacts[0]._id;
                             }
							 $scope.booking_form.access_platform		='bms'; // when make a booking then set the platform "bms" it used for identify the booking is made from where bms or website 
                             $scope.booking_form.database_name		 	= $rootScope.data_base_name;
                             $scope.booking_form.webservice_case 		= 'client_application_booking_add';
                             $scope.booking_form.required_fields 		= [{ 'name': 'customer_id'},{'name': 'booking_type'}];
                             API.addBooking($scope.booking_form).success(function(data)
                             {
                                 if (data.response_code == '200')
                                 {
									 $scope.bookingHistoryLoader 			= false;
                                     $scope.sucess_message 					= data.response_message;
									 $scope.booking_success_information 	= data.response_data.full_data;
                                     $scope.save_loder_image 				= true;
                                     $scope.booking_sucess_modal 			= true;
                                 }
                                 else
                                 {
                                     alert(data.response_message);
                                 }
                             });
                         }
						 // Response code for check the user exist or not
                         if (data.response_code == '203')
                         {
							  $scope.bookingHistoryLoader 		= false;
							  $scope.unique_error_msg_div	 	= false;
                             $scope.unique_error_message 		= data.response_message;
                         }
                     });
                 }
             }
			
             // Make booking for Register customer and login as a Admin
             if ($scope.booking_form.customer_id != '' && $scope.admin_type_session_value=='Admin')
             {
				 // Check the Booking made by select or not 
				 if($scope.booking_form.booking_made_by_id)
				 {
					 // Check the pax by select or not 
					 if($scope.booking_form.pax_id)
					 {
						 if ($scope.active_account_div == 0)
						 {
							 // validation for booking made by id and pax 
							 if (!$scope.booking_form.booking_made_by_id)
							 {
								 booking_form_validate.book_made.$dirty = true;
								 return false;
							 }
							 if (!$scope.booking_form.pax_id)
							 {
								 booking_form_validate.paxname.$dirty = true;
								 return false;
							 }
							 $scope.bookingHistoryLoader = true;
							 $scope.booking_form.database_name = $rootScope.data_base_name;
							 $scope.booking_form.webservice_case = 'client_application_booking_add';
							 $scope.booking_form.access_platform	='bms';
							 $scope.booking_form.required_fields = [{'name': 'customer_id'},{'name': 'booking_type'}];
							 API.addBooking($scope.booking_form).success(function(data)
							 {
								 if (data.response_code == '200')
								 {
									 $scope.bookingHistoryLoader 		= false;
									 $scope.sucess_message 				= data.response_message;
									 $scope.booking_success_information = data.response_data.full_data;
									 $scope.booking_sucess_modal 		= true;
								 }
							 });
						 }
					}
				}
			}
			
			  //  Make booking for Register customer and login as a "Booking" or "All" type contacts
			  if($scope.contact_type_session_value=='booking'|| $scope.contact_type_session_value=='all')
			  {
				$scope.booking_form.customer_id 			=  $scope.customer_id;
				$scope.booking_form.booking_made_by_id 		= $scope.session_contact_id;
				$scope.booking_form.job_status 				= 'received';
					// validation for pax select value 
					if($scope.new_pax_information_active==0)
					{
						 if (typeof $scope.booking_form.pax_id=='undefined' || $scope.booking_form.pax_id=='')
						 {
							 booking_form_validate.paxname.$dirty = true;
							 return false;
						 }
					}
					 // If add new pax under a exsinting customer  when contact login as a "booking or all type contacts
					 
					 if($scope.booking_form.pax_id=='' &&  $scope.new_pax_information_active==1)
					 {
						$scope.booking_form_new_pax_regitration.database_name 							= $rootScope.data_base_name;
						$scope.booking_form_new_pax_regitration.webservice_case 						= 'client_application_add_customer_contact';
						$scope.booking_form_new_pax_regitration.id 										= $scope.booking_form.customer_id;
						$scope.booking_form_new_pax_regitration.contact_type							= 'pax';
						$scope.booking_form_new_pax_regitration.required_fields 						= [];
						// Call the Api for add new pax registration under a exsinting customer and booking made contact 
						API.updateUserByAdmin($scope.booking_form_new_pax_regitration).success(function(pax_data)
						{
							if(pax_data.response_code==200)
							{
								$scope.booking_form_new_pax_regitration_contact.database_name 							= $rootScope.data_base_name;
								$scope.booking_form_new_pax_regitration_contact.webservice_case 						= 'client_application_add_customer_contact_detail';
								$scope.booking_form_new_pax_regitration_contact.update_type								= 'phone';
								$scope.booking_form_new_pax_regitration_contact.id										= pax_data.response_data[0]._id;
								$scope.booking_form_new_pax_regitration_contact.required_fields 						= [];
								// Call the Api for add contact information for a add a new pax 
								API.updateUserByAdmin($scope.booking_form_new_pax_regitration_contact).success(function(pax_contact_data)
								{
									if(pax_contact_data.response_code==200)
									{
										$scope.booking_form.pax_id				=	pax_contact_data.response_data[0]._id;
										$scope.bookingHistoryLoader 			= true;
										$scope.makeBooking();
									}
									if(pax_contact_data.response_code==203)
									{
										$scope.bookingHistoryLoader 			= false;
										$scope.pax_unique_error_message_div		= false;
										$scope.pax_unique_error_message 		= pax_contact_data.response_message;
									}
								});
							}
							 // Response code for check the pax already registered or not using the response code 
							 if (pax_data.response_code == 203) 
							 {
								  $scope.bookingHistoryLoader 				= false;
								  $scope.pax_unique_error_message_div		= false;
								  $scope.pax_unique_error_message 			= pax_data.response_message;
							 }
						}); 
					 }
					  // If add pax already exist and when contact login as a "booking or all type contacts
					  
					 if($scope.booking_form.pax_id!='' &&  $scope.new_pax_information_active==0)
					 {
						 $scope.makeBooking();
					}
			  }
			// Add a new Booking made by contact type under a customer 
			if ($scope.booking_form.customer_id != '' && $scope.admin_type_session_value=='Admin')
             {
				 if($scope.booking_form.booking_made_by_id =='' || typeof $scope.booking_form.booking_made_by_id=='undefined')
				 {
					 /* Check the new booking made by div open or not by the booking_made_by_information_active varible
						booking_made_by_information_active = 1, means the abb booking made by div is open
						booking_made_by_information_active = 0, means the abb booking made by div is not open
					 */					 
					 if($scope.booking_made_by_information_active == 1)
					 {
						$scope.bookingHistoryLoader = true;
						$scope.booking_form_new_booking_made.database_name 							= $rootScope.data_base_name;
						$scope.booking_form_new_booking_made.webservice_case 						= 'client_application_add_customer_contact';
						$scope.booking_form_new_booking_made.id										= $scope.booking_form.customer_id;
						$scope.booking_form_new_booking_made.required_fields 						= [];
						// Call the Api for add contact information for a new booking made 
						API.updateUserByAdmin($scope.booking_form_new_booking_made).success(function(booking_made_information)
						{
							if(booking_made_information.response_code==200)
							{
								 if(typeof $scope.booking_form_new_booking_made_contact.calling_code=='undefined')
								 {
									$scope.booking_form_new_booking_made_contact.calling_code = $rootScope.business_calling_code;
								 }
								// After registration then add the booking made information 
								$scope.booking_form_new_booking_made_contact.database_name 							= $rootScope.data_base_name;
								$scope.booking_form_new_booking_made_contact.webservice_case 						= 'client_application_add_customer_contact_detail';
								$scope.booking_form_new_booking_made_contact.update_type							= 'phone';
								$scope.booking_form_new_booking_made_contact.id										= booking_made_information.response_data[0]._id;
								$scope.booking_form_new_booking_made_contact.required_fields 						= [];
								API.updateUserByAdmin($scope.booking_form_new_booking_made_contact).success(function(booking_made_by_pax_contact_data)
								{
									// If the contact information sucessfully insert into  the database 
									if(booking_made_by_pax_contact_data.response_code==200)
									{
										//If the contact type is "all" then set the booking made by id and pax id  
										if($scope.booking_form_new_booking_made.contact_type=='all')
										{
											$scope.booking_form.booking_made_by_id	=	booking_made_by_pax_contact_data.response_data[0]._id;
											$scope.booking_form.pax_id				=	booking_made_by_pax_contact_data.response_data[0]._id;
											// Call the common function for make a booking 
											$scope.makeBooking();
										}
										//If the contact type is "booking" then set the booking made by id and pax id  
										if($scope.booking_form_new_booking_made.contact_type=='booking')
										{
											$scope.booking_form.booking_made_by_id	=	booking_made_by_pax_contact_data.response_data[0]._id;
											if($scope.booking_form.pax_id!='')
											{
												$scope.booking_form.pax_id			=	$scope.booking_form.pax_id;
												// Call the common function for make a booking 
												$scope.makeBooking();
											}
											// If the pax dropdown value not selected and add new pax with all information
											if($scope.booking_form.pax_id =='' &&  $scope.new_pax_information_active==1)
											{
												$scope.booking_form_new_pax_regitration.database_name 							= $rootScope.data_base_name;
												$scope.booking_form_new_pax_regitration.webservice_case 						= 'client_application_add_customer_contact';
												$scope.booking_form_new_pax_regitration.id 										= $scope.booking_form.customer_id;
												$scope.booking_form_new_pax_regitration.contact_type							= 'pax';
												$scope.booking_form_new_pax_regitration.required_fields 						= [];
												// Call the Api for add new pax registration under a exsinting customer and booking made contact 
												API.updateUserByAdmin($scope.booking_form_new_pax_regitration).success(function(pax_data)
												{
													if(pax_data.response_code==200)
													{
														$scope.booking_form_new_pax_regitration_contact.database_name 							= $rootScope.data_base_name;
														$scope.booking_form_new_pax_regitration_contact.webservice_case 						= 'client_application_add_customer_contact_detail';
														$scope.booking_form_new_pax_regitration_contact.update_type								= 'phone';
														$scope.booking_form_new_pax_regitration_contact.id										= pax_data.response_data[0]._id;
														$scope.booking_form_new_pax_regitration_contact.required_fields 						= [];
														// Call the Api for add contact information for a new pax 
														API.updateUserByAdmin($scope.booking_form_new_pax_regitration_contact).success(function(pax_contact_data)
														{
															if(pax_contact_data.response_code==200)
															{
																$scope.booking_form.pax_id				=	pax_contact_data.response_data[0]._id;
																/* Call the common makebooking() function for make a booking
																	the makebooking() function body already define 
																*/					
																$scope.makeBooking();
															}
														});
													}
													// Response code for check the user exist or not 
													 if (pax_data.response_code == 203)
													 {
														  $scope.bookingHistoryLoader 		= false;
														  $scope.pax_unique_error_message 	= pax_data.response_message;
													 }
													
												});
											}
										}
									}
								});
							}
							/* If the "Booking Made By" email id already exist with us check with response code
								if the response code is 203 then show the error message
							*/								
							if (booking_made_information.response_code == 203)
							 {
								 $scope.bookingHistoryLoader 		= false;
								  $scope.pax_unique_error_message 	= 'Booking made by already exists under other user, please provide another pax email id.';
							 }
							}
						);
					 }
				 }
			 }
			 
			// Add a new Pax only contact under a existing Customer
			if ($scope.booking_form.customer_id != '' && $scope.booking_form.booking_made_by_id!=='' && $scope.admin_type_session_value=='Admin')
             {
				if($scope.booking_form.pax_id=='' || typeof $scope.booking_form.pax_id=='undefined')
				  {
					  if($scope.new_pax_information_active==1)
					  {
							$scope.bookingHistoryLoader = true;
							$scope.booking_form_new_pax_regitration.database_name 							= $rootScope.data_base_name;
							$scope.booking_form_new_pax_regitration.webservice_case 						= 'client_application_add_customer_contact';
							$scope.booking_form_new_pax_regitration.id 										= $scope.booking_form.customer_id;
							$scope.booking_form_new_pax_regitration.contact_type							= 'pax';
							$scope.booking_form_new_pax_regitration.required_fields 						= [];
								// Call the Api for add new pax registration under a exsinting customer and booking made contact
								API.updateUserByAdmin($scope.booking_form_new_pax_regitration).success(function(pax_data)
								{
									if(pax_data.response_code==200)
									{
										$scope.booking_form_new_pax_regitration_contact.database_name 							= $rootScope.data_base_name;
										$scope.booking_form_new_pax_regitration_contact.webservice_case 						= 'client_application_add_customer_contact_detail';
										$scope.booking_form_new_pax_regitration_contact.update_type								= 'phone';
										$scope.booking_form_new_pax_regitration_contact.id										= pax_data.response_data[0]._id;
										$scope.booking_form_new_pax_regitration_contact.required_fields 						= [];
										// Call the Api for add contact information for a new pax 
										API.updateUserByAdmin($scope.booking_form_new_pax_regitration_contact).success(function(pax_contact_data)
										{
											if(pax_contact_data.response_code==200)
											{
													$scope.booking_form.pax_id				=	pax_contact_data.response_data[0]._id;
													// Make Booking After add new pax 
													$scope.booking_form.database_name = $rootScope.data_base_name;
													$scope.booking_form.webservice_case = 'client_application_booking_add';
													$scope.booking_form.access_platform	='bms';
													$scope.booking_form.required_fields = [{'name': 'customer_id'},{'name': 'booking_type'}];
													 API.addBooking($scope.booking_form).success(function(data)
													 {
														 if (data.response_code == '200')
														 {
															 $scope.bookingHistoryLoader 		= false;
															 $scope.sucess_message 				= data.response_message;
															 $scope.booking_success_information = data.response_data.full_data;
															 $scope.booking_sucess_modal 		= true;
														 }
														 else
														 {
															 $scope.bookingHistoryLoader 		= false;
														 }
													 });
												//  End of Make Booking After add new pax 
											}
										});
									}
									// Response code for check the user exist or not 
									 if (pax_data.response_code == 203)
									 {
										$scope.bookingHistoryLoader = false;
										$scope.pax_unique_error_message 							=  pax_data.response_message;
										$scope.pax_unique_error_message 							=  'Pax already exists under other user, please provide another pax email id.';
										 
									 }
							});	
					  }
				 }
			 }
			 
         }
     })
.directive('selectPicker', ['$timeout', function($timeout){
    return {
      restrict: 'A',
      link:function(scope, elem){
        $timeout(function() {
          console.log('foo');
          elem.selectpicker({showSubtext:true});
        }, 0);
      }
    };
  }])
  
  app.directive('autoFillSync', function($timeout) {
   return {
      require: 'ngModel',
      link: function(scope, elem, attrs, ngModel) {
          var origVal = elem.val();
          $timeout(function () {
              var newVal = elem.val();
              if(ngModel.$pristine && origVal !== newVal) {
                  ngModel.$setViewValue(newVal);
              }
          }, 500);
      }
   }
});