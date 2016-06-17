/*
This module have all accounting function like add , listing , edit 
*/
angular.module('accountinModule', ['udpCaptcha'])
.controller('accountingController',function($scope,$rootScope,API,$captcha,$window,$sessionStorage,$location,$timeout)
{
	$scope.drivers_account_loader = true;
	// Get the URL of the page.
	var page_url = $window.location.href;
	// Get the database name of the client from the URL of the page.
	var url_path = page_url.split('/');
	$rootScope.data_base_name =	url_path[4];
	$scope.table_view=true;
	$scope.no_data_found=true;
	$scope.adminLoader	= true;
	$scope.currency_symbol = $rootScope.currency_symbol;
	// Call for driver list api
	$scope.driver_listing_model={"database_name": $rootScope.data_base_name,"webservice_case":"client_application_driver_list"};
/*	API.common_api($scope.driver_listing_model,'listing')
												.success(function(data)
													{
														//console.log(data);
														if(data.response_code==200)
														{
															$scope.driver_list=data.response_data;
														}
														else
														{
														}
														
													})*/
	$rootScope.currecy_code	=	$rootScope.currency_symbol;
	// Operator account balance.
	$scope.operator_account_balance_model = {"database_name":$rootScope.data_base_name,"webservice_case":"client_application_accounting_operator_details"};
	API.common_api($scope.operator_account_balance_model,'accounting/listing').success(function(data)
	{
		if( data.response_code == 200 )
		{
			$scope.operator_account_balance = data.response_data.accounting_details;
			// Sorting key
			$scope.sort_table = 'account_name';
			$scope.reverce = false;
			$scope.drivers_account_loader = false;
		}
	});
	// Show all account balance of admin
	$scope.user_type = localStorage.getItem("userType");
	if ($scope.user_type == 'Admin')
	{
		$scope.driver_account_balance_listing_model =
		{
			"database_name" 	: $rootScope.data_base_name,
			"webservice_case" 	: "client_application_accounting_general_details"
		};
		API.common_api($scope.driver_account_balance_listing_model,'accounting/listing')
		.success(function (data)
		{
			$scope.account_details = [];
			if (data.response_code == 200)
			{
				//console.log(data);
				for (i = 0; i < data.response_data.length; i++)
				{
					if (data.response_data[i]._id != 'a_account_general')
					{
						var driverid = data.response_data[i]._id;
						$scope.driver_id = driverid.split('_');
						$scope.account_details.push(
						{
							'total_credit'	: data.response_data[i].total_credit,
							'total_debit'	: data.response_data[i].total_debit,
							'driver_id'		: $scope.driver_id[3]
						});
					}
				}
				if (data.response_data.length)
				{
					API.common_api($scope.driver_listing_model, 'listing')
					.success(function (data)
					{
						//console.log(data);
						if (data.response_code == 200)
						{
							$scope.driver_list = data.response_data;
							// Below two FOR LOOP use to match driver name with account details driver id wise
							for (i = 0; i < $scope.account_details.length; i++)
							{
								for (j = 0; j < $scope.driver_list.length; j++)
								{
									if ($scope.driver_list[j].driver_id == $scope.account_details[i].driver_id)
									{
										$scope.account_details[i].holder_title = $scope.driver_list[j].title;
										$scope.account_details[i].holder_first_name = $scope.driver_list[j].first_name;
										$scope.account_details[i].holder_last_name = $scope.driver_list[j].last_name;
									}
								}
							}
						}
						else
						{}
					})
				}
				$scope.driver_account_balance = $scope.account_details;
				$scope.no_data_found = false;
				$scope.sort_table = 'holder_first_name';
				$scope.reverse = false;
				$scope.drivers_account_loader = false;
			}
			else
			{
				$scope.errors = [];
				$scope.errors.push("Some thing is going wrong!");
			}
		})
		// account type of admin like cash account, general account
		$scope.showOperatorAccountListByAccountType = function (account_name, total_credit, total_debit, total_account_balance)
		{	
			$scope.account_list_by_account_type =
			{
				"database_name" 	: $rootScope.data_base_name,
				"webservice_case" 	: "client_application_accounting_operator_account_details",
				"account_type" 		: account_name
			};
			API.common_api($scope.account_list_by_account_type, 'accounting/listing')
			.success(function (data)
			{
				$scope.driver_perticular_account_balance = data.response_data;
				$scope.driver_name = localStorage.getItem('user_name');
				$scope.total_debit = total_debit;
				$scope.total_credit = total_credit;
				$scope.accout_balance = total_account_balance;
				$scope.table_view = false;
			})
		}
		$scope.showTransactionDetailsOperatorAccountWise = function (id)
		{
			$scope.transaction_details_by_transaction_id =
			{
				"database_name" 	: $rootScope.data_base_name,
				"webservice_case" 	: "client_application_accounting_operator_transaction_details",
				"transaction_id" 	: id
			};
			API.common_api($scope.transaction_details_by_transaction_id,'accounting/listing')
			.success(function(data)
			{
				//console.log(data);
				$scope.transaction_details = data.response_data.accounting_details;
			})
			//$scope.show_transaction_details_model=true;
			$scope.preview_for_transaction_details =! $scope.preview_for_transaction_details;
			$scope.show_transaction_id = id;
		}
		// For operator debit entry
		$scope.debit_entry_model =
		{
			"database_name" 	: $rootScope.data_base_name,
			"webservice_case" 	: "client_application_accounting_general_debit",
		};
		$scope.addDebitEntry = function (cash_entry_form)
		{	
			$scope.loading = true;
			if (cash_entry_form.$invalid == true)
			{
				if (!$scope.cash_in_out_model.driver_id || $scope.cash_in_out_model.driver_id =='')
				{
					$scope.driverAccount = true;
				}
				if (!$scope.debit_entry_model.amount || $scope.debit_entry_model.amount == '')
				{
					$scope.enter_amount = true;
				}
				if (!$scope.debit_entry_model.description || $scope.debit_entry_model.description == '')
				{
					$scope.entry_note = true;
				}
				$scope.loading = false;
				return false;
			}
			else
			{
				$scope.debit_entry_model.driver_id = $scope.cash_in_out_model.driver_id;
				API.common_api($scope.debit_entry_model,'accounting')
				.success(function(data)
				{
					if(data.response_code = 200)
					{
						$scope.loading = false;
						$scope.success_error_message = true;
						$scope.alert_message_success = 'Successfuly add debit entry.';
						$timeout(function ()
						{
							$scope.success_error_message = false;
						}, 2000);
						$scope.cash_in_out_model.driver_id 		= '';
						$scope.debit_entry_model.amount 		= '';
						$scope.debit_entry_model.description 	= '';
						cash_entry_form.driverAccount.$touched 	= false;
						cash_entry_form.enter_amount.$touched 	= false;
						cash_entry_form.entry_note.$touched 	= false;
						$scope.driverAccount = false;
						$scope.enter_amount = false;
						$scope.entry_note = false;
					}
					else
					{
						$scope.loading = false;
						$scope.success_error_message = true;
						$scope.alert_message_success = data.response_message;
					}
				})
			}
		}
		// For operator credit entry
		$scope.credit_entry_model =
		{
			"database_name" 	: $rootScope.data_base_name,
			"webservice_case" 	: "client_application_accounting_general_credit",
		};
		$scope.addCreditEntry = function (cash_entry_form)
		{	
			$scope.loading = true;
			if (cash_entry_form.$invalid == true)
			{
				if (!$scope.cash_in_out_model.driver_id || $scope.cash_in_out_model.driver_id == '')
				{
					$scope.driverAccount = true;
				}
				if (!$scope.credit_entry_model.amount || $scope.credit_entry_model.amount == '')
				{
					$scope.enter_amount = true;
				}
				if (!$scope.credit_entry_model.description || $scope.credit_entry_model.description == '')
				{
					$scope.entry_note = true;
				}
				$scope.loading = false;
				return false;
			}
			else
			{
				$scope.credit_entry_model.driver_id = $scope.cash_in_out_model.driver_id;
				API.common_api($scope.credit_entry_model,'accounting')
				.success(function(data)
				{
					if(data.response_code = 200)
					{
						$scope.loading = false;
						$scope.success_error_message = true;
						$scope.alert_message_success = 'Successfuly add credit entry.';
						$timeout(function ()
						{
							$scope.success_error_message = false;
						}, 2000);
						$scope.cash_in_out_model.driver_id 		= '';
						$scope.credit_entry_model.amount 		= '';
						$scope.credit_entry_model.description 	= '';
						cash_entry_form.driverAccount.$touched 	= false;
						cash_entry_form.enter_amount.$touched 	= false;
						cash_entry_form.entry_note.$touched 	= false;
						$scope.driverAccount = false;
						$scope.enter_amount = false;
						$scope.entry_note = false;
					}
					else
					{
						$scope.loading = false;
						$scope.success_error_message = true;
						$scope.alert_message_success = data.response_message;
					}
				})
			}
		}
	}
	//Show account type show model
	$scope.showAccountDetails = function ()
	{
		$scope.show_account_selection_panel = !$scope.show_account_selection_panel;
	}
	//Show account balance model
	$scope.showAccountBalance = function ()
	{
		$scope.show_account_balance_panel = !$scope.show_account_balance_panel;
	}
	// Show cash entry model
	$scope.cashInOuntEntry = function ()
	{
		$scope.show_account_cash_entry_panel = !$scope.show_account_cash_entry_panel;
	}
	// Show debit credit model
	$scope.debitOrCreditEntry = function ()
	{
		$scope.debit_or_credit_model = {};
		//$scope.form_val.$pristine=false;
		$scope.entryType = false;
		$scope.accountType = false;
		debit_credit_entry_form.$setUntouched = true;
		debit_credit_entry_form.$setPristine = false;
		$scope.show_account_debit_or_credit_entry_panel = !$scope.show_account_debit_or_credit_entry_panel;
	}
	// Cash in out entry
	$scope.cash_in_out_model={"database_name": $rootScope.data_base_name};
	$scope.addCashEntry = function (isValid, cash_entry_type)
	{
		$scope.loading = true;
		if (isValid == false)
		{
			if (!$scope.cash_in_out_model.driver_id || $scope.cash_in_out_model.driver_id == '')
			{
				$scope.driverAccount = true;
			}
			if (!$scope.cash_in_out_model.amount || $scope.cash_in_out_model.amount == '')
			{
				$scope.enter_amount = true;
			}
			if (!$scope.cash_in_out_model.description || $scope.cash_in_out_model.description == '')
			{
				$scope.entry_note = true;
			}
			$scope.loading = false;
			return false;
		}
		//alert(cash_entry_type);
		if(cash_entry_type=='2')
		{
			$scope.cash_in_out_model.entry_type=='in'
			$scope.cash_in_out_model.webservice_case='client_application_accounting_cash_in';
		}
		if(cash_entry_type=='3')
		{
			$scope.cash_in_out_model.entry_type=='out'
			$scope.cash_in_out_model.webservice_case='client_application_accounting_cash_out';
		}
		$scope.cash_in_out_model.created_by=$sessionStorage.userId;
		$scope.cash_in_out_model.created_by_type=$sessionStorage.userType;
		if(cash_entry_type=='1')
		{
			if($scope.cash_in_out_model.entry_type=='in')
			{
				$scope.cash_in_out_model.webservice_case='client_application_accounting_cash_in';
			}
			else
			{
				$scope.cash_in_out_model.webservice_case='client_application_accounting_cash_out';
			}
		}
		//console.log($scope.cash_in_out_model);
		// Api call for entry on db
		API.common_api($scope.cash_in_out_model,'accounting')
													.success(function(data)
													{
														$scope.show_account_cash_entry_panel=!$scope.show_account_cash_entry_panel;
														if(data.response_code==200)
														{
															$scope.success	= [];
															$scope.success.push("Transaction successful.Transaction No - "+data.response_data);
															API.common_api($scope.driver_account_balance_listing_model,'accounting/listing')
															.success(function(data)
															{
																$scope.account_details=[];
																if(data.response_code==200)
																{
																	//console.log(data);
																	for(i=0;i<data.response_data.length;i++)
																	{
																		if(data.response_data[i]._id!='a_account_general')
																		{
																			var driverid				=data.response_data[i]._id;
																			$scope.driver_id			=driverid.split('_');
																			$scope.account_details.push({
																										'total_credit'	:data.response_data[i].total_credit,
																										'total_debit'	:data.response_data[i].total_debit,
																										'driver_id'		:$scope.driver_id[3]
																										});
																		}
																	}
																	$scope.driver_account_balance=$scope.account_details;
																	$scope.table_view=true;
																	//console.log($scope.driver_account_balance);
																}
																else
																{
																	$scope.errors	= [];
																	$scope.errors.push("Some thing is going wrong!");
																	
																}
																
															})
															$scope.cash_in_out_model.driver_id 		= '';
															$scope.cash_in_out_model.amount 		= '';
															$scope.cash_in_out_model.description 	= '';
															cash_entry_form.driverAccount.$touched 	= false;
															cash_entry_form.enter_amount.$touched 	= false;
															cash_entry_form.entry_note.$touched 	= false;
															$scope.driverAccount = false;
															$scope.enter_amount = false;
															$scope.entry_note = false;
														}
														else
														{
															$scope.errors	= [];
															$scope.errors.push("Some thing is going wrong!");
														}
														$scope.show_update_message_model = !$scope.show_update_message_model;
														$scope.loading = false;
														/*$timeout(function() {
																				$scope.show_update_message_model=!$scope.show_update_message_model;
																			}, 5000);*/
													})
	}
	// Show all account balance
	$scope.showAccountBalance=function()
	{
		$scope.driver_account_balance_listing_model =
		{
			"database_name" 	: $rootScope.data_base_name,
			"webservice_case" 	: "client_application_accounting_general_details"
		};
		API.common_api($scope.driver_account_balance_listing_model,'accounting/listing')
		.success(function(data)
		{
			$scope.account_details = [];
			if (data.response_code == 200)
			{
				//console.log(data);
				for (i = 0; i < data.response_data.length; i++)
				{
					if(data.response_data[i]._id!='a_account_general')
					{
						var driverid 		= data.response_data[i]._id;
						$scope.driver_id 	= driverid.split('_');
						$scope.account_details.push({
													'total_credit'	:data.response_data[i].total_credit,
													'total_debit'	:data.response_data[i].total_debit,
													'driver_id'		:$scope.driver_id[3]
													});
					}
				}
				$scope.driver_account_balance=$scope.account_details;
				//console.log($scope.driver_account_balance);
			}
			else
			{
				$scope.errors	= [];
				$scope.errors.push("Some thing is going wrong!");
			}
			
		})
	}
	// For perticular account details
	$scope.select_account_type =
	{
		"database_name" 	: $rootScope.data_base_name,
		"webservice_case"	: "client_application_accounting_driver_account_details"
	};
	$scope.account_details_loader = [];
	$scope.showPerticularDriverAccountListing = function (isValidate, type, driver_id, driver_title, driver_first_name, driver_last_name, position)
	{	
		if (position != '')
		{
			$scope.account_details_loader[position] = true;  
		}
		$scope.no_data_found = true;
		$scope.driver_total_balance_show_model =
		{
			"database_name" 	: $rootScope.data_base_name,
			"webservice_case" 	: "client_application_accounting_driver_account_details",
			"driver_id" 		: driver_id,
			"listing_type" 		: "account_balance"
		};
		$scope.driver_id = driver_id;
		if (driver_title)
		{
			driver_title = driver_title;
		}
		else
		{
			driver_title = '';
		}
		if (driver_first_name)
		{
			driver_first_name = driver_first_name;
		}
		else
		{
			driver_first_name = '';
		}
		if (driver_last_name)
		{
			driver_last_name = driver_last_name;
		}
		else
		{
			driver_last_name = '';
		}
		$scope.driver_name = driver_title + ' ' + driver_first_name + ' ' + driver_last_name;
		API.common_api($scope.driver_total_balance_show_model,'accounting/listing')
		.success(function (data)
		{
			$scope.debit_amount 	= data.response_data.debit_balance;
			$scope.credit_amount 	= data.response_data.credit_balance;
			$scope.accout_balance	= $scope.credit_amount - $scope.debit_amount;
			$scope.no_data_found 	= false;
		})
		$scope.table_view = false;
		$scope.select_account_type.driver_id = driver_id;
		if (type == '1')
		{
			$scope.show_account_selection_panel = !$scope.show_account_selection_panel;
		}
		$scope.total_credit = 0;
		$scope.total_debit = 0;
		API.common_api($scope.select_account_type,'accounting/listing')
		.success(function(data)
		{
			if (position != '')
			{
				$scope.account_details_loader[position] = false;
			}
			$scope.account_details = [];
			if (data.response_code == 200)
			{
				//console.log(data);
				for (i = 0; i < data.response_data.length; i++)
				{
					$scope.total_credit	= $scope.total_credit + data.response_data[i].amount_credit;
					$scope.total_debit	= $scope.total_debit + data.response_data[i].amount_debit;
				}
				$scope.driver_perticular_account_balance = data.response_data;
				$scope.adminLoader	= false;
				$scope.sort_table	= 'created_on';
				$scope.reverce		= false;
			}
			else
			{
				$scope.errors	= [];
				$scope.errors.push("Some thing is going wrong!");
			}
		})
	}
	// For a driver account
	if ($scope.user_type == 'Driver')
	{	
		$scope.table_view = false;
		$scope.showPerticularDriverAccountListing('','2',localStorage.getItem("driver_id"),localStorage.getItem("user_name"),'','','')
		$scope.adminLoader	= false;
	}
	// Back button from account details page
	$scope.back_to_main_account_page = function ()
	{
		if ($scope.user_type != 'Admin')
		{
			return;
		}
		else
		{
			$scope.table_view = true;
			$scope.show_transaction_details_model = false;
		}
	//	$location.path('/manage-accounting');
	}
	// Show account balance
	$scope.show_driver_balance = function ()
	{
		$scope.driver_total_balance_show_model =
		{
			"database_name" 	: $rootScope.data_base_name,
			"webservice_case" 	: "client_application_accounting_driver_account_details",
			"driver_id" 		: $scope.cash_in_out_model.driver_id,
			"listing_type" 		: "account_balance"
		};
		API.common_api($scope.driver_total_balance_show_model,'accounting/listing')
		.success(function(data)
		{
			$scope.debit_amount				= data.response_data.debit_balance;
			$scope.credit_amount			= data.response_data.credit_balance;
			$scope.accout_balance			= $scope.credit_amount-$scope.debit_amount;
			$scope.currecy_code_for_account	= $rootScope.currecy_code;
		})
	}
	//Show transaction details for an operator and also for a driver
	$scope.showTransactionDetailsDriverIdWise = function (id, driverId)
	{	
		$scope.transaction_details_show_model =
		{
			"database_name" 	: $rootScope.data_base_name,
			"webservice_case" 	: "client_application_accounting_transaction_details",
			"driver_id" 		: driverId,
			"transaction_id" 	: id
		};
		API.common_api($scope.transaction_details_show_model,'accounting/listing')
		.success(function(data)
		{
			//console.log(data);
			$scope.transaction_details = data.response_data.accounting_details;
		})
		//$scope.show_transaction_details_model=true;
		$scope.preview_for_transaction_details =! $scope.preview_for_transaction_details;
		$scope.show_transaction_id = id;
	}
	//For pagination function
	$scope.page_per_pagination = 	[
										{name:'5', value: '5'}, 
										{name:'10', value: '10'}, 
										{name:'25', value: '25'}, 
										{name:'50', value: '50'}, 
										{name:'100', value: '100'}					
									];
	$scope.selected_page_pagination = '25';
	$scope.sortManageAccountTableBy = function (keyname)
	{
		$scope.sortKey = keyname; //set the sortKey to the param passed
		$scope.reverse = !$scope.reverse; //if true make it false and vice versa
		$scope.sort_table = keyname
	}
}) 

// All driver accounting controller 
.controller('allDriverAccountController',function($scope,$rootScope,API,$captcha,$window,$sessionStorage,$location,$timeout)
{
	// Check login status.
	if(localStorage.getItem('loginStatus') != 1 ||  $sessionStorage.loginStatus == 0 || $sessionStorage.userId == 0 )
	{
		$location.path('/login');
	}
	// Get user data from sessionStorage.
	$rootScope.contact_type = $sessionStorage.contact_type;   
	if (!$rootScope.contact_type)
	{	
		$rootScope.contact_type 	= localStorage.getItem("customer_contact_type");
	} 
	$rootScope.customer_id 			= $sessionStorage.customer_id;		 
	// Set all the hide div when page is load.
	var page_url 					= $window.location.href;
	var url_path 					= page_url.split('/');
	$rootScope.data_base_name 		= url_path[4];
	$scope.loder_image 				= false;
	$scope.edit_click 				= 0;
	$scope.previous_content_present = 0;
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
	$scope.currency_symbol					= $rootScope.currency_symbol;
	$scope.test_tab1 						= true;
	// Function for table view listing for all driver account .
	$scope.getTableViewListing = function(date_from, date_to)
	{
		console.log('comehherre');
		$scope.tab_res2 							= false;
		$scope.loading 								= true;
		$scope.all_driver_account_list 				= {};
		$scope.all_driver_account_list.database_name 	= $rootScope.data_base_name;
		$scope.all_driver_account_list.webservice_case = 'client_application_completed_job_listing';//'client_application_booking_list_all';
		//console.log($scope.all_driver_account_list);
		// If user type is admin then pass below parameters to getListing() function
		if( localStorage.getItem('userType') == "Admin" )
		{
			$scope.all_driver_account_list.user_type = 'admin';
		}
		// If user type is customer then pass below parameters to getListing() function
		else if( localStorage.getItem('userType') == "Customer" )
		{
			if( localStorage.getItem('customer_contact_type') == 'all' )
			{
				$scope.all_driver_account_list.user_type = 'all';
				$scope.all_driver_account_list.customer_id = localStorage.getItem('customer_id');
			}
			if( localStorage.getItem('customer_contact_type') == 'booking' )
			{
				$scope.all_driver_account_list.user_type = 'booking';
				$scope.all_driver_account_list.customer_id = localStorage.getItem('customer_id');
			}
			if( localStorage.getItem('customer_contact_type') == 'pax' )
			{
				$scope.all_driver_account_list.user_type = 'pax';
				$scope.all_driver_account_list.contact_id = localStorage.getItem('user_id');
			}
		}
		// If user type is driver then pass below parameters to getListing() function
		else if( localStorage.getItem('userType') == 'Driver' )
		{
			$scope.all_driver_account_list.user_type = 'driver';
			$scope.all_driver_account_list.driver_id = localStorage.getItem('user_id'); 
		}
		else
		{}
		$scope.all_driver_account_list.date_from = date_from;
		$scope.all_driver_account_list.date_to = date_to;
		// API.getListing() function use to get booking list.
		API.getListing($scope.all_driver_account_list).success(function (data)
		{
			$scope.loading 			= false;
			if( data.response_code == 200 )
			{
				$scope.all_driver_account_list_data_arrey  = [];
				$scope.all_driver_account_list_data = data.response_data;
				// Sort table by date and time
				$scope.sort_table 	= 'driver_id.first_name';
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
			$scope.daily_view_month = new Date($scope.daily_view_start_date).getMonth()+1;  
			$scope.daily_view_day = new Date($scope.daily_view_start_date).getDate();
			if( $scope.daily_view_month < 10 )
			{
				$scope.daily_view_month = '0'+($scope.daily_view_month);
			}
			if( $scope.daily_view_day < 10 )
			{
				$scope.daily_view_day = '0'+$scope.daily_view_day;
			}	
			$scope.daily_view_year = new Date($scope.daily_view_start_date).getFullYear();
			$scope.daily_view_start_date = $scope.daily_view_month+'-'+$scope.daily_view_day+'-'+$scope.daily_view_year;
			$scope.display_header_date1 = $scope.daily_view_day+'-'+$scope.daily_view_month+'-'+$scope.daily_view_year;
			$scope.display_header_date2 = '';
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
	
	// Pagination for the grid.
	$scope.selected_page_pagination = '100';
	$scope.page_per_pagination = [
									{name:'5', value: '5'}, 
									{name:'10', value: '10'}, 
									{name:'25', value: '25'}, 
									{name:'50', value: '50'}, 
									{name:'100', value: '100'},
									{name:'200', value: '200'}
								 ];
	// Sort table function
	$scope.sortJobListTableBy = function (keyname)
	{	
		$scope.sortKey = keyname; //set the sortKey to the param passed
		$scope.reverse = !$scope.reverse; //if true make it false and vice versa
		$scope.sort_table = keyname
	}
});