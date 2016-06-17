var app	=	angular.module('invoice_controller',['limo_client.services']);

app.controller('invoice',function ($scope,$rootScope,API,$location,$window,$sessionStorage,invoice_line,$cookieStore,$timeout)
{
	
	// Check login status.
	if (localStorage.getItem('loginStatus') != 1 ||  $sessionStorage.loginStatus == 0 || $sessionStorage.userId == 0)
	{
		$location.path('/login');
	}
	$scope.customer_id				=   $sessionStorage.userId;
	var page_url					=   $window.location.href;
	var url_path					=	page_url.split('/');
	$rootScope.data_base_name		=	url_path[4];
	var current_page_url			= $location.path();
	/* creating blank json to store customer and booking details details */
	$scope.customer_name										=	{};
	$scope.booking_made											=	{};
	$scope.invoice_send_to_customer								=   {};
	$scope.business_setting										=   {};
	$scope.customer_detail_for_invoice							=	{};
	$scope.get_customer_details_by_customer_type				=	{};
	$scope.send_new_invoice_to_customer							=	{};
	$scope.booking_not_invoice									=	{};
	$rootScope.make_payment_for_unpaid_invoice					=	{};
	$scope.delete_unpaid_invoice								= 	{};
	$scope.resend_invoice_to_customer							=	{};
	$scope.booking_form											= 	{};
	$scope.alert_message_success								=	'';
	$scope.alert_message_error									=	'';
	/* making all div as hidden by default it will be shown on selection of respected process */
	$scope.booking_made_by_div									= true;
	$scope.booking_list_div										= true;
	$scope.booking_invoice_reciever_list						= true;
	$scope.success_message_model								= false;
	$scope.error_message_model									= false;
	$scope.warning_message_model								= false;
	$scope.loader												= false;
	$scope.booking_made_listing_no_data_available				= false;
	$scope.booking_made_listing_loader							= false;
	$scope.send_invoice_loader									= false;
	$scope.customer_type_listing_loader							= false;
	$scope.hide_booking_invoice_watermark						= true;
	$scope.billing_customer_details								= [];
	$scope.booking_form.customer_id								='';
	$scope.customer_name.database_name							=	$rootScope.data_base_name;
	$scope.customer_name.webservice_case 						= 	'client_application_customer_listing';
	$scope.customer_detail_for_invoice.database_name			=	$rootScope.data_base_name;
	$scope.customer_detail_for_invoice.webservice_case 			= 	'client_application_customer_listing';
	$scope.invoice_send_to_customer.database_name				=	$rootScope.data_base_name;
	$scope.invoice_send_to_customer.webservice_case 			= 	'client_application_customer_listing';
	$scope.business_setting.database_name						=	$rootScope.data_base_name;
	$scope.business_setting.webservice_case 					=   'client_application_business_setting_list';
	$scope.resend_invoice_to_customer.database_name				=	$rootScope.data_base_name;
	$scope.resend_invoice_to_customer.webservice_case 			=	'client_application_customer_invoice_send_unpaid_invoice';
	
	// Pagination for the grid.
	$scope.selected_page_pagination = '25';
	$scope.page_per_pagination = [
									{name:'5', value: '5'}, 
									{name:'10', value: '10'}, 
									{name:'25', value: '25'}, 
									{name:'50', value: '50'}, 
									{name:'100', value: '100'}					
								 ];

	/* create invoice start here */

	/* get customer list according to type */
		var sort_by = function(field, reverse, primer){
		   var key = primer ? 
			   function(x) {return primer(x[field])} : 
			   function(x) {return x[field]};
		   reverse = !reverse ? 1 : -1;
		   return function (a, b) {
			   return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
			 } 
		}
		$scope.getCustomerByType=function(customer_type)
		{
			$scope.hide_booking_invoice_watermark = true;
			$scope.customer_type_listing_loader								= true;
			$scope.get_customer_details_by_customer_type					= {};
			$scope.get_customer_details_by_customer_type.database_name		= $rootScope.data_base_name;
			$scope.get_customer_details_by_customer_type.webservice_case 	= 'client_application_customer_listing_by_type';
			$scope.get_customer_details_by_customer_type.customer_type 		= customer_type;
			
			API.getListing($scope.get_customer_details_by_customer_type).success(function(data)
			{
				$scope.booking_form_customer_id			= '';
				$scope.customer_listing_data			= data.response_data;
				$scope.booking_list_div					= true;
				$scope.booking_invoice_reciever_list	= true;
				$scope.customer_type_listing_loader		= false;
			});
		}
		/* getting details of booking made by the customer which we selected */
		$scope.getBookingMadeBydetails	=	function(customer_id)
		{
			$scope.billing_customer_details		= [];
			$scope.booking_made_listing_data    = [];
			if(customer_id=='' || customer_id=='undefined' || typeof customer_id=='undefined')
			{
				$scope.billing_customer_details=[];
				$scope.booking_made_listing_data=[];
				$scope.booking_list_div				 	= true;
				$scope.booking_invoice_reciever_list 	= true;
				return false;
			}
			//$scope.loading = true;
			$scope.booking_made_listing_loader			= true;
			$scope.booking_not_invoice.database_name	=  $rootScope.data_base_name;
			$scope.booking_not_invoice.webservice_case 	= 'client_application_not_invoiced_booking_list';
			$scope.booking_not_invoice.id 				=  customer_id;
			$rootScope.booking_made_by_customer_id		=  customer_id;
			$scope.booking_made.id						=  customer_id;
			/* getting the list of booking which not being invoice */
			API.getInvoiceListing($scope.booking_not_invoice).success(function(data)
			{
				$scope.booking_list_div					= false;
				$scope.booking_made_listing_data		= data.response_data;
				if(data.response_data.length>0)
				{
					$scope.booking_made_listing_no_data_available=false;
				}
				else
				{
					$scope.booking_made_listing_no_data_available=true;;
				}
				$scope.booking_made_listing_loader		= false;
			});
			/* getting all the person list whom the invoice will go */
			$scope.invoice_send_to_customer.id 		= customer_id;
			API.getListing($scope.invoice_send_to_customer).success(function(data)
			{
				$scope.customer_details_to_make_payment	= data.response_data[0]; // this will use to calculate discount /tax surchage during invoice sending
				if($scope.customer_details_to_make_payment.payment_type=='invoice')
				{
					$scope.hide_booking_invoice_watermark   = true;
				}
				else
				{
					$scope.hide_booking_invoice_watermark   = false;
				}
				$scope.booking_list_div					= false;
				$scope.send_invoice_mail_to				= data.response_data[0].contacts;
				$scope.booking_invoice_reciever_list	= false;
				for(i=0;i<$scope.send_invoice_mail_to.length;i++)
				{
					if($scope.send_invoice_mail_to[i].contact_type=='all' || $scope.send_invoice_mail_to[i].contact_type=='billing')
					{
						if($scope.send_invoice_mail_to[i].contact_type=='billing')
						{
							$scope.send_invoice_mail_to[i].contact_type='BILLING ONLY';
						}
						if($scope.send_invoice_mail_to[i].contact_type=='all')
						{
							$scope.send_invoice_mail_to[i].contact_type='ALL';
						}
						$scope.billing_customer_details.push($scope.send_invoice_mail_to[i]);
					}
				}
				$scope.loading = false;
			});
		}
		
		$scope.preview_invoice_and_send_mail=false;
		$scope.add_driver_phone_modal = false;
		// this function will open the model to send invoice to the customer
		$scope.showPreviewAndSendInvoice=function()
		{
			var checkboxes = document.getElementsByName('jobs_details');
			var selected = [];
			$scope.selected_invoice_billing_person=[];
			$scope.total_invoice_amount=0;
			$scope.selected_invoice_job=[];
			var present_date = new Date();
			console.log(checkboxes.length);
			$scope.invoice_due_date=present_date.setDate(present_date.getDate() + $rootScope.business_setting_details.invoice_amount_payable_in_day);
			for (var i=0; i<checkboxes.length; i++) 
			{
				if (checkboxes[i].checked) 
				{
					//selected.push(checkboxes[i].value);
					for(j=0;j<$scope.booking_made_listing_data.length;j++)
					{
						if($scope.booking_made_listing_data[j].jobs.job_id==checkboxes[i].value)
						{
							if(typeof $scope.booking_made_listing_data[j].jobs.fare[0]=='undefined')
							{
								$scope.error_message_model = true;
								$scope.alert_message_error = "Please Select Job with fares details.";
								return false;
							}
							$scope.booking_made_listing_data[j].jobs.booking_id = $scope.booking_made_listing_data[j]._id;
							$scope.selected_invoice_job.push($scope.booking_made_listing_data[j].jobs);
							$scope.total_invoice_amount+=$scope.booking_made_listing_data[j].jobs.fare[0].total_fare;
						}
					}
				}
			}
			var billing=document.getElementsByName("billing_customer_details");
			for (var i=0; i<billing.length; i++) 
			{
				if (billing[i].checked) {
					$scope.selected_invoice_billing_person.push($scope.billing_customer_details[i]);
				}
			}
			if($scope.selected_invoice_job.length==0)
			{
				$scope.error_message_model=true;
				$scope.alert_message_error="Please Select Job.";
				return false;
			}
			if($scope.selected_invoice_billing_person.length==0)
			{
				$scope.error_message_model=true;
				$scope.alert_message_error="Please Select  receiver.";
				return false;
			}
			
			var invoice_bottom_check=document.getElementsByName("include_message_in_invoice");
			if(invoice_bottom_check[0].checked)
			{
				$scope.include_notes_in_business_setting='yes';
			}
			else
			{
				$scope.include_notes_in_business_setting='no';
			}
			
			var include_watermark_in_invoice=document.getElementsByName("include_watermark_in_invoice");
			if(include_watermark_in_invoice[0].checked)
			{
				$scope.include_watermark_in_invoice_to_send='yes';
			}
			else
			{
				$scope.include_watermark_in_invoice_to_send='no';
			}
		
		
			$scope.loader= true;
			$scope.customer_detail_for_invoice.id=$scope.booking_made.id;
			
			API.getListing($scope.customer_detail_for_invoice).success(function(data)
			{
				$scope.loader									= false;
				$scope.customer_detail_for_sending_invoice		=	data.response_data[0];
				$scope.invoice_date=new Date();
				/* calculating total/discount/surcharge and taxes i.e gst etc */
				
				if($scope.customer_details_to_make_payment.payment_type=='invoice')
				{
					$scope.hide_booking_invoice_watermark   = true;
					$scope.show_total_part					= true;
					$scope.show_discount_part				= true;
					$scope.show_invoice_surcharge_part		= true;
					$scope.show_tax_on_fare_part			= true;
					$scope.show_for_invoice_customer		= true;
					$scope.discount_made_on_invoice			= ($scope.customer_details_to_make_payment.invoice_discount_percentage*$scope.total_invoice_amount)/100;
					$scope.surcharge_amount					= ($scope.customer_details_to_make_payment.invoice_surcharge_percentage*($scope.total_invoice_amount-$scope.discount_made_on_invoice))/100;
					if($scope.customer_details_to_make_payment.include_taxes=='top_of_fare')
					{
						$scope.show_tax_within_the_fare_part= false;
						$scope.tax_amount_on_fare			= ($rootScope.business_setting_details.taxes[0].percentage*($scope.total_invoice_amount-$scope.discount_made_on_invoice+$scope.surcharge_amount))/100;
					}
					else
					{
						$scope.show_tax_within_the_fare_part 	= true;
						$scope.tax_amount_on_fare			 	= 0;
						$scope.show_tax_on_fare_part			= false;
						var tax									= ($scope.total_invoice_amount*100)/(100+$rootScope.business_setting_details.taxes[0].percentage);
						$scope.total_within_the_fare			= $scope.total_invoice_amount-tax;
						$scope.tax_is_included_within_the_fare 	= "This invoice includes a total "+$rootScope.business_setting_details.taxes[0].name+" of "+$rootScope.business_setting_details.currency.symbol+' '+$scope.total_within_the_fare.toFixed(2);
					}
					$scope.total_invoice_amount_to_be_paid	= $scope.total_invoice_amount-$scope.discount_made_on_invoice+$scope.surcharge_amount+$scope.tax_amount_on_fare;
				}
				else
				{
					$scope.hide_booking_invoice_watermark 	= false;
					$scope.show_tax_within_the_fare_part	= true;
					$scope.show_total_part					= false;
					$scope.show_discount_part				= false;
					$scope.show_invoice_surcharge_part		= false;
					$scope.show_tax_on_fare_part			= false;
					$scope.show_for_invoice_customer		= false;
					$scope.total_invoice_amount_to_be_paid  = $scope.total_invoice_amount;
					$scope.total_gst_to_be_paid				= $scope.total_invoice_amount - $scope.total_invoice_amount / ( 1 + $scope.business_setting_details.taxes[0].percentage/100);
					$scope.tax_is_included_within_the_fare 	= "This invoice includes a total "+$scope.business_setting_details.taxes[0].name+" of "+$scope.business_setting_details.currency.symbol+' '+$scope.total_gst_to_be_paid.toFixed(2);
				}
					$scope.loader = false;
					$scope.preview_invoice_and_send_mail = true;
			});
		}
		
		$scope.sendInvoiceToCustomer=function()
		{
			$scope.send_invoice_loader								= true;
			$scope.send_new_invoice_to_customer.database_name		= $rootScope.data_base_name;
			$scope.send_new_invoice_to_customer.webservice_case		= 'client_application_customer_invoice_add';
			$scope.send_new_invoice_to_customer.billing_person		= $scope.selected_invoice_billing_person;
			$scope.send_new_invoice_to_customer.business_setting	= $scope.business_setting_details;
			$scope.send_new_invoice_to_customer.customer_id			= $scope.invoice_send_to_customer.id;
			$scope.send_new_invoice_to_customer.include_invoice_line= $scope.include_notes_in_business_setting;
			$scope.send_new_invoice_to_customer.invoice_line		= $scope.invoice_line;
			$scope.send_new_invoice_to_customer.invoice_notes		= document.getElementById("invoice_notes").value;
			$scope.send_new_invoice_to_customer.jobs_details		= $scope.selected_invoice_job;
			$scope.send_new_invoice_to_customer.send_status			= "saved_and_sent";
			var customer_id											= $scope.invoice_send_to_customer.id;
			$scope.send_new_invoice_to_customer.include_watermark   = $scope.include_watermark_in_invoice_to_send;
			API.addNewInvoice($scope.send_new_invoice_to_customer).success(function(data)
			{
				$scope.booking_not_invoice.database_name	=  $rootScope.data_base_name;
				$scope.booking_not_invoice.webservice_case 	= 'client_application_not_invoiced_booking_list';
				$scope.booking_not_invoice.id 				=  customer_id;
				$rootScope.booking_made_by_customer_id		=  customer_id;
				/* getting the list of booking which not being invoice */
				API.getInvoiceListing($scope.booking_not_invoice).success(function(data)
				{
					$scope.booking_list_div					= false;
					$scope.booking_made_listing_data		= data.response_data;
					if(data.response_data.length>0)
					{
						$scope.booking_made_listing_no_data_available=false;
					}
					else
					{
						$scope.booking_made_listing_no_data_available=true;;
					}
					$scope.send_invoice_loader	=false;
				});
				/* getting all the person list whom the invoice will go */
				$scope.invoice_send_to_customer.id 		= customer_id;
				API.getListing($scope.invoice_send_to_customer).success(function(data)
				{
					$scope.billing_customer_details		= [];
					$scope.booking_list_div				= false;
					$scope.send_invoice_mail_to			= data.response_data[0].contacts;
					$scope.booking_invoice_reciever_list= false;
					for(i=0;i<$scope.send_invoice_mail_to.length;i++)
					{
						if($scope.send_invoice_mail_to[i].contact_type=='all' || $scope.send_invoice_mail_to[i].contact_type=='billing')
						{
							if($scope.send_invoice_mail_to[i].contact_type=='billing')
							{
								$scope.send_invoice_mail_to[i].contact_type='BILLING ONLY';
							}
							if($scope.send_invoice_mail_to[i].contact_type=='all')
							{
								$scope.send_invoice_mail_to[i].contact_type='ALL';
							}
							$scope.billing_customer_details.push($scope.send_invoice_mail_to[i]);
						}
					}
				});
				$scope.preview_invoice_and_send_mail = ! $scope.preview_invoice_and_send_mail;
				$scope.alert_message_success		 = "invoice successfully send to customer";
				$scope.success_message_model		 = ! $scope.success_message_model;
				$timeout(function() 
				{
					$scope.success_message_model = false;
				}, 5000);
			});
		}
		
		$scope.checkAll = function () {
			for(i=0;i<document.create_invoice.jobs_details.length;i++)
			{
				document.create_invoice.jobs_details[i].checked = true ;
			}
		};
		$scope.unCheckAll = function () {
			for(i=0;i<document.create_invoice.jobs_details.length;i++)
			{
				document.create_invoice.jobs_details[i].checked = false;
			}
		};
		
		$scope.checkAllBillingPerson = function () {
			for(i=0;i<document.create_invoice.billing_customer_details.length;i++)
			{
				document.create_invoice.billing_customer_details[i].checked = true ;
			}
		};
		$scope.unCheckAllBillingPerson = function () {
			for(i=0;i<document.create_invoice.billing_customer_details.length;i++)
			{
				document.create_invoice.billing_customer_details[i].checked = false;
			}
		};
		
		$scope.checkAllBilling = function () {
			if ($scope.selected_all_billing) {
				$scope.selected_all_billing = true;
			} else {
				$scope.selected_all_billing = false;
			}
			angular.forEach($scope.billing_customer_details, function (billing) {
				billing.Selected = $scope.selected_all_billing;
			});
		};
	/* create invoice end here */
	/* resend invoice to the customer */
	$scope.reSendInvoiceToCustomer=function()
	{	
		$scope.loader							= true;
		$scope.resend_invoice_to_customer.id 	= $rootScope.invoice_detail_to_view._id
		API.resendInvoiceDetails($scope.resend_invoice_to_customer).success(function(data)
		{
			if(data.response_code==200)
			{
				$scope.loader								= false;
				$scope.preview_paid_invoice_and_send_mail	= false;
				$scope.preview_unpaid_invoice_and_send_mail	= false;
				$scope.success_message_model				= true;
				$scope.alert_message_success				= "invoice send successfully";
				$timeout(function() 
				{
					$scope.alert_message_success = false;
				}, 3000);
			}
			else
			{
				$scope.loader				= false;
				$scope.error_message_model	= true;
				$scope.alert_message_error	= $scope.response_message;
			}
		});
	}
	$scope.invoice_message = invoice_line.get_invoice_line("...");
	$scope.invoice_message.then(function(data){
		$scope.invoice_message = data;
	});
	$scope.get_invoice_line = function(){
		return $scope.invoice_message;
	}
	$scope.doSomething = function(typedthings){
		$scope.return_invoice_line = invoice_line.get_invoice_line(typedthings);
		$scope.return_invoice_line.then(function(data){
			$scope.invoice_message = data;
		});
	}
	$scope.doSomethingElse = function(suggestion){
	}
	
})

app.controller('paid_invoice',function ($scope,$rootScope,API,$location,$window,$sessionStorage,$cookieStore,$timeout,$filter,orderByFilter)
{
	// Check login status.
	if (localStorage.getItem('loginStatus') != 1 ||  $sessionStorage.loginStatus == 0 || $sessionStorage.userId == 0)
	{
		$location.path('/login');
	}
	var page_url					=   $window.location.href;
	var url_path					=	page_url.split('/');
	$rootScope.data_base_name		=	url_path[4];
	$scope.customer_name							=	{};
	$scope.booking_made								=	{};
	$scope.invoice_send_to_customer					=   {};
	$scope.business_setting							=   {};
	$scope.customer_detail_for_invoice				=	{};
	$scope.get_customer_details_by_customer_type	=	{};
	$scope.send_new_invoice_to_customer				=	{};
	$scope.booking_not_invoice						=	{};
	$rootScope.make_payment_for_unpaid_invoice		=	{};
	$scope.delete_unpaid_invoice					= 	{};
	$scope.resend_invoice_to_customer				=	{};
	$scope.alert_message_success					=	'';
	$scope.alert_message_error						=	'';
	/* making all div as hidden by default it will be shown on selection of respected process */
	$scope.booking_made_by_div						= true;
	$scope.booking_list_div							= true;
	$scope.booking_invoice_reciever_list			= true;
	$scope.success_message_model					= false;
	$scope.error_message_model						= false;
	$scope.warning_message_model					= false;
	$scope.show_unpaid_invoice_details				= false;
	$scope.show_paid_invoice_details				= false;
	$scope.loader									= false;
	$scope.booking_made_listing_no_data_available	= false;
	$scope.booking_made_listing_loader				= false;
	$scope.send_invoice_loader						= false;
	$scope.billing_customer_details					= [];
	$scope.show_paid_invoice_details				= false;
	$scope.loader									= true;
	$scope.paid_invoice_list						={};
	$scope.total_paid_invoice_amount				= 0.00;
	$scope.paid_invoice_list.database_name			=	$rootScope.data_base_name;
	$scope.paid_invoice_list.webservice_case		=   "client_application_invoice_list";
	$scope.paid_invoice_list.find_type				=   "paid";
	$scope.resend_invoice_to_customer.database_name	=	$rootScope.data_base_name;
	$scope.resend_invoice_to_customer.webservice_case =	'client_application_customer_invoice_send_unpaid_invoice';
	
	// Pagination for the grid.
	$scope.selected_page_pagination = '25';
	$scope.page_per_pagination = [
									{name:'5', value: '5'}, 
									{name:'10', value: '10'}, 
									{name:'25', value: '25'}, 
									{name:'50', value: '50'}, 
									{name:'100', value: '100'}					
								 ];
	
	$rootScope.user_type = localStorage.getItem('userType');
	if($rootScope.user_type=='Customer')
	{
		$scope.paid_invoice_list.customer_id	= localStorage.getItem('customer_id');
	}
	
	API.getInvoiceListing($scope.paid_invoice_list).success(function(data)
	{
		$scope.paid_user_details=data.response_data; 
		$scope.show_paid_invoice_details			= true;
		$scope.loader								= false;
		$scope.sort_table = 'invoice_id';
		$scope.reverse = true;
		
		for(i=0;i<data.response_data.length;i++)
		{
			$scope.total_paid_invoice_amount+=data.response_data[i].invoice_amount;
		}
	});
	$scope.preview_paid_invoice_and_send_mail=false;
	$scope.showPreviewForPaidInvoice=function(invoice)
	{  
		$rootScope.paid_invoice_details				= invoice;
		$rootScope.invoice_detail_to_view			= invoice;
		var total_amount_of_job						= 0;
		for(i=0;i<invoice.jobs.length;i++)
		{
			if(invoice.jobs[i].booking_id.jobs!='undefined')
			{
				if(invoice.jobs[i].booking_id.jobs.length>0)
				{
					if( invoice.jobs[i].booking_id.jobs[0].fare !='undefined')
					{
						total_amount_of_job = invoice.jobs[i].booking_id.jobs[0].fare[0].total_fare+total_amount_of_job;
					}
				}
			}				
		}
		
		
		/* calculating total/discount/surcharge and taxes i.e gst etc */
		if(invoice.customer_id.payment_type=='invoice')
		{
			$scope.show_total_part					= true;
			$scope.show_discount_part				= true;
			$scope.show_invoice_surcharge_part		= true;
			$scope.show_tax_on_fare_part			= true;
			$scope.discount_made_on_invoice			= (invoice.customer_id.invoice_discount_percentage*total_amount_of_job)/100;
			$scope.surcharge_amount					= (invoice.customer_id.invoice_surcharge_percentage*(total_amount_of_job-$scope.discount_made_on_invoice))/100;
			if(invoice.customer_id.include_taxes=='top_of_fare')
			{
				$scope.show_tax_within_the_fare_part= false;
				$scope.tax_amount_on_fare			= ($scope.business_setting_details.taxes[0].percentage*(total_amount_of_job-$scope.discount_made_on_invoice+$scope.surcharge_amount))/100;
			}
			else
			{
				$scope.show_tax_within_the_fare_part 	= true;
				$scope.tax_amount_on_fare			 	= 0;
				$scope.show_tax_on_fare_part			= false;
				var tax									= ((total_amount_of_job-$scope.discount_made_on_invoice+$scope.surcharge_amount)*100)/(100+$scope.business_setting_details.taxes[0].percentage);
				$scope.total_within_the_fare			= (total_amount_of_job-$scope.discount_made_on_invoice+$scope.surcharge_amount)-tax;
				$scope.tax_is_included_within_the_fare 	= "This invoice includes a total "+$scope.business_setting_details.taxes[0].name+" of "+$scope.business_setting_details.currency.symbol+' '+$scope.total_within_the_fare.toFixed(2);
			}
			$scope.total_invoice_amount_to_be_paid	= total_amount_of_job-$scope.discount_made_on_invoice+$scope.surcharge_amount+$scope.tax_amount_on_fare;
		}
		else
		{
			$scope.show_tax_within_the_fare_part	= false;
			$scope.show_total_part					= false;
			$scope.show_discount_part				= false;
			$scope.show_invoice_surcharge_part		= false;
			$scope.show_tax_on_fare_part			= false;
			$scope.total_invoice_amount_to_be_paid  = total_amount_of_job;
			$scope.total_gst_to_be_paid				= total_amount_of_job - total_amount_of_job / ( 1 + $scope.business_setting_details.taxes[0].percentage/100);
			$scope.tax_is_included_within_the_fare 	= "This invoice includes a total "+$scope.business_setting_details.taxes[0].name+" of "+$scope.business_setting_details.currency.symbol+' '+$scope.total_gst_to_be_paid.toFixed(2);
		}
		$scope.job_total_amount =total_amount_of_job;
		$scope.preview_paid_invoice_and_send_mail 	= ! $scope.preview_paid_invoice_and_send_mail;
	}
	
	/* resend invoice to the customer */
	$scope.reSendInvoiceToCustomer=function()
	{	
		$scope.loader							= true;
		$scope.resend_invoice_to_customer.id 	= $rootScope.invoice_detail_to_view._id
		API.resendInvoiceDetails($scope.resend_invoice_to_customer).success(function(data)
		{
			if(data.response_code==200)
			{
				$scope.loader								= false;
				$scope.preview_paid_invoice_and_send_mail	= false;
				$scope.preview_unpaid_invoice_and_send_mail	= false;
				$scope.success_message_model				= true;
				$scope.alert_message_success				= "invoice send successfully";
				$timeout(function() 
				{
					$scope.alert_message_success = false;
				}, 3000);
			}
			else
			{
				$scope.loader				= false;
				$scope.error_message_model	= true;
				$scope.alert_message_error	= $scope.response_message;
			}
		});
	}
	
	/* Open modal for PDF. */
	$scope.generate_paid_invoice_pdf_modal = false;
	$scope.openGeneratePaidInvoicePDFData = function()
	{
		$scope.generate_paid_invoice_pdf_modal = true;
	}
	
	/* Export data to CSV. */
	$scope.generatePaidInvoiceCSVData = function()
	{
		$scope.paid_user_details_csv = orderByFilter($scope.paid_user_details, $scope.sort_table, $scope.reverse);
		var data = [];
		data.push(["INVOICE NUMBER","SENT ON","PAID ON","CUSTOMER NAME","CUSTOMER TYPE","INVOICE AMOUNT","NOTES","STATUS"]);
		data.push(["","","","","","","",""]);
		for(i=0;i<$scope.paid_user_details_csv.length;i++)
		{
			var inv_amt = $scope.paid_user_details_csv[i].invoice_amount;
			data.push([
							$scope.paid_user_details_csv[i].invoice_id,
							$filter('date')($scope.paid_user_details_csv[i].created_on,'dd-MM-yyyy'),
							$filter('date')($scope.paid_user_details_csv[i].paid_on,'dd-MM-yyyy'),
							$scope.paid_user_details_csv[i].customer_id.name,
							$filter('uppercase')($scope.paid_user_details_csv[i].customer_id.type),
							$rootScope.currency_symbol+""+inv_amt,
							$scope.paid_user_details_csv[i].invoice_notes,
							$filter('uppercase')($scope.paid_user_details_csv[i].status)
					  ]);
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
		link.setAttribute("download", "paid-invoice-data.csv");

		link.click();
	}
	
	$scope.sortInvoiceTableBy = function (keyname)
	{	
		$scope.sortKey = keyname; //set the sortKey to the param passed
		$scope.reverse = !$scope.reverse; //if true make it false and vice versa
		$scope.sort_table = keyname
	}
})





app.controller('collect_cc_invoice',function ($scope,$rootScope,API,$location,$window,$sessionStorage,$cookieStore,$timeout,$filter,orderByFilter)
{
	// Check login status.
	if (localStorage.getItem('loginStatus') != 1 ||  $sessionStorage.loginStatus == 0 || $sessionStorage.userId == 0)
	{
		$location.path('/login');
	}
	var page_url											=   $window.location.href;
	var url_path											=	page_url.split('/');
	$rootScope.data_base_name								=	url_path[4];
	$scope.customer_name									= {};
	$scope.booking_made										= {};
	$scope.invoice_send_to_customer							= {};
	$scope.business_setting									= {};
	$scope.customer_detail_for_invoice						= {};
	$scope.get_customer_details_by_customer_type			= {};
	$scope.send_new_invoice_to_customer						= {};
	$scope.booking_not_invoice								= {};
	$rootScope.make_payment_for_unpaid_invoice				= {};
	$scope.delete_unpaid_invoice							= {};
	$scope.resend_invoice_to_customer						= {};
	$scope.alert_message_success							= '';
	$scope.alert_message_error								= '';
	/* making all div as hidden by default it will be shown on selection of respected process */
	$scope.booking_made_by_div								= true;
	$scope.booking_list_div									= true;
	$scope.booking_invoice_reciever_list					= true;
	$scope.success_message_model							= false;
	$scope.error_message_model								= false;
	$scope.warning_message_model							= false;
	$scope.show_unpaid_invoice_details						= false;
	$scope.show_paid_invoice_details						= false;
	$scope.loader											= false;
	$scope.booking_made_listing_no_data_available			= false;
	$scope.booking_made_listing_loader						= false;
	$scope.send_invoice_loader								= false;
	$scope.billing_customer_details							= [];
	$scope.show_paid_invoice_details						= false;
	$scope.loader											= true;
	$scope.collect_creditcard_invoice_list					= {};
	$scope.total_collect_creditcard_invoice_amount			= 0.00;
	$scope.collect_creditcard_invoice_list.database_name	= $rootScope.data_base_name;
	$scope.collect_creditcard_invoice_list.webservice_case	= "client_application_invoice_list";
	$scope.collect_creditcard_invoice_list.find_type		= "collect_or_cc";
	$scope.resend_invoice_to_customer.database_name			= $rootScope.data_base_name;
	$scope.resend_invoice_to_customer.webservice_case 		=	'client_application_customer_invoice_send_unpaid_invoice';
	
	// Pagination for the grid.
	$scope.selected_page_pagination = '25';
	$scope.page_per_pagination = [
									{name:'5', value: '5'}, 
									{name:'10', value: '10'}, 
									{name:'25', value: '25'}, 
									{name:'50', value: '50'}, 
									{name:'100', value: '100'}					
								 ];
	
	$rootScope.user_type = localStorage.getItem('userType');
	if($rootScope.user_type=='Customer')
	{
		$scope.collect_creditcard_invoice_list.customer_id	= localStorage.getItem('customer_id');
	}
	
	API.getInvoiceListing($scope.collect_creditcard_invoice_list).success(function(data)
	{
		$scope.paid_user_details=data.response_data; 
		$scope.show_paid_invoice_details			= true;
		$scope.loader								= false;
		$scope.sort_table = 'invoice_id';
		$scope.reverse = true;
		
		for(i=0;i<data.response_data.length;i++)
		{
			$scope.total_collect_creditcard_invoice_amount+=data.response_data[i].invoice_amount;
		}
	});
	$scope.preview_collect_or_cc_invoice_and_send_mail=false;
	$scope.showPreviewForPaidInvoice=function(invoice)
	{  
		$rootScope.paid_invoice_details				= invoice;
		$rootScope.invoice_detail_to_view			= invoice;
		var total_amount_of_job						= 0;
		for(i=0;i<invoice.jobs.length;i++)
		{
			if(invoice.jobs[i].booking_id.jobs!='undefined')
			{
				if(invoice.jobs[i].booking_id.jobs.length>0)
				{
					if( invoice.jobs[i].booking_id.jobs[0].fare !='undefined')
					{
						total_amount_of_job = invoice.jobs[i].booking_id.jobs[0].fare[0].total_fare+total_amount_of_job;
					}
				}
			}				
		}
		
		
		/* calculating total/discount/surcharge and taxes i.e gst etc */
		if(invoice.customer_id.payment_type=='invoice')
		{
			$scope.show_total_part					= true;
			$scope.show_discount_part				= true;
			$scope.show_invoice_surcharge_part		= true;
			$scope.show_tax_on_fare_part			= true;
			$scope.discount_made_on_invoice			= (invoice.customer_id.invoice_discount_percentage*total_amount_of_job)/100;
			$scope.surcharge_amount					= (invoice.customer_id.invoice_surcharge_percentage*(total_amount_of_job-$scope.discount_made_on_invoice))/100;
			if(invoice.customer_id.include_taxes=='top_of_fare')
			{
				$scope.show_tax_within_the_fare_part= false;
				$scope.tax_amount_on_fare			= ($scope.business_setting_details.taxes[0].percentage*(total_amount_of_job-$scope.discount_made_on_invoice+$scope.surcharge_amount))/100;
			}
			else
			{
				$scope.show_tax_within_the_fare_part 	= true;
				$scope.tax_amount_on_fare			 	= 0;
				$scope.show_tax_on_fare_part			= false;
				var tax									= ((total_amount_of_job-$scope.discount_made_on_invoice+$scope.surcharge_amount)*100)/(100+$scope.business_setting_details.taxes[0].percentage);
				$scope.total_within_the_fare			= (total_amount_of_job-$scope.discount_made_on_invoice+$scope.surcharge_amount)-tax;
				$scope.tax_is_included_within_the_fare 	= "This invoice includes a total "+$scope.business_setting_details.taxes[0].name+" of "+$scope.business_setting_details.currency.symbol+' '+$scope.total_within_the_fare.toFixed(2);
			}
			$scope.total_invoice_amount_to_be_paid	= total_amount_of_job-$scope.discount_made_on_invoice+$scope.surcharge_amount+$scope.tax_amount_on_fare;
		}
		else
		{
			$scope.show_tax_within_the_fare_part	= true;  
			$scope.show_total_part					= false;
			$scope.show_discount_part				= false;
			$scope.show_invoice_surcharge_part		= false;
			$scope.show_tax_on_fare_part			= false;
			$scope.total_invoice_amount_to_be_paid  = total_amount_of_job;
			$scope.total_gst_to_be_paid				= total_amount_of_job - total_amount_of_job / ( 1 + $scope.business_setting_details.taxes[0].percentage/100);
			$scope.tax_is_included_within_the_fare 	= "This invoice includes a total "+$scope.business_setting_details.taxes[0].name+" of "+$scope.business_setting_details.currency.symbol+' '+$scope.total_gst_to_be_paid.toFixed(2);
		}
		$scope.job_total_amount =total_amount_of_job;
		$scope.preview_collect_or_cc_invoice_and_send_mail 	= ! $scope.preview_collect_or_cc_invoice_and_send_mail;
	}
	
	/* resend invoice to the customer */
	$scope.reSendInvoiceToCustomer=function()
	{	
		$scope.loader							= true;
		$scope.resend_invoice_to_customer.id 	= $rootScope.invoice_detail_to_view._id
		API.resendInvoiceDetails($scope.resend_invoice_to_customer).success(function(data)
		{
			if(data.response_code==200)
			{
				$scope.loader										= false;
				$scope.preview_collect_or_cc_invoice_and_send_mail	= false;
				$scope.preview_unpaid_invoice_and_send_mail			= false;
				$scope.success_message_model						= true;
				$scope.alert_message_success						= "invoice send successfully";
				$timeout(function() 
				{
					$scope.alert_message_success = false;
				}, 3000);
			}
			else
			{
				$scope.loader				= false;
				$scope.error_message_model	= true;
				$scope.alert_message_error	= $scope.response_message;
			}
		});
	}
	
	/* Open modal for PDF. */
	$scope.generate_collect_cc_invoice_pdf_modal = false;
	$scope.openGenerateCollectCcInvoicePDFData = function()
	{
		$scope.generate_collect_cc_invoice_pdf_modal = true;
	}
	
	/* Export data to CSV. */
	$scope.generateCollectCcInvoiceCSVData = function()
	{
		$scope.paid_user_details_csv = orderByFilter($scope.paid_user_details, $scope.sort_table, $scope.reverse);
		var data = [];
		data.push(["INVOICE NUMBER","SENT ON","PAID ON","CUSTOMER NAME","CUSTOMER TYPE","INVOICE AMOUNT","NOTES","STATUS"]);
		data.push(["","","","","","","",""]);
		for(i=0;i<$scope.paid_user_details_csv.length;i++)
		{
			var inv_amt = $scope.paid_user_details_csv[i].invoice_amount;
			data.push([
							$scope.paid_user_details_csv[i].invoice_id,
							$filter('date')($scope.paid_user_details_csv[i].created_on,'dd-MM-yyyy'),
							$filter('date')($scope.paid_user_details_csv[i].paid_on,'dd-MM-yyyy'),
							$scope.paid_user_details_csv[i].customer_id.name,
							$filter('uppercase')($scope.paid_user_details_csv[i].customer_id.type),
							$rootScope.currency_symbol+""+inv_amt,
							$scope.paid_user_details_csv[i].invoice_notes,
							$filter('uppercase')($scope.paid_user_details_csv[i].status)
					  ]);
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
		link.setAttribute("download", "collect-or-creditcard-invoice-data.csv");

		link.click();
	}
	
	$scope.sortInvoiceTableBy = function (keyname)
	{	
		$scope.sortKey = keyname; //set the sortKey to the param passed
		$scope.reverse = !$scope.reverse; //if true make it false and vice versa
		$scope.sort_table = keyname
	}
})







app.controller('unpaid_invoice',function ($scope,$rootScope,API,$location,$window,$localStorage,$sessionStorage,$cookieStore,$timeout,$filter,orderByFilter)
{
	// Check login status.
	if (localStorage.getItem('loginStatus') != 1 ||  $sessionStorage.loginStatus == 0 || $sessionStorage.userId == 0)
	{
		$location.path('/login');
	}
	var page_url											=   $window.location.href;
	var url_path											=	page_url.split('/');
	$rootScope.data_base_name								=	url_path[4];
	$scope.customer_name										=	{};
	$scope.booking_made											=	{};
	$scope.invoice_send_to_customer								=   {};
	$scope.business_setting										=   {};
	$scope.customer_detail_for_invoice							=	{};
	$scope.get_customer_details_by_customer_type				=	{};
	$scope.send_new_invoice_to_customer							=	{};
	$scope.booking_not_invoice									=	{};
	$rootScope.make_payment_for_unpaid_invoice					=	{};
	$scope.delete_unpaid_invoice								= 	{};
	$scope.edit_unpaid_invoice									=	{};
	$scope.resend_invoice_to_customer							=	{};
	$scope.alert_message_success								=	'';
	$scope.alert_message_error								=	'';
	/* making all div as hidden by default it will be shown on selection of respected process */
	$scope.booking_made_by_div									= true;
	$scope.booking_list_div										= true;
	$scope.booking_invoice_reciever_list						= true;
	$scope.success_message_model								= false;
	$scope.error_message_model									= false;
	$scope.warning_message_model								= false;
	$scope.show_unpaid_invoice_details							= false;
	$scope.show_paid_invoice_details							= false;
	$scope.loader												= false;
	$scope.booking_made_listing_no_data_available				= false;
	$scope.booking_made_listing_loader							= false;
	$scope.send_invoice_loader									= false;
	$scope.show_previous_payment_in_model						= false;
	$scope.billing_customer_details								= [];
	$scope.total_unpaid_invoice_amount							= 0.00;
	$scope.edit_unpaid_invoice.database_name					=	$rootScope.data_base_name;
	$scope.edit_unpaid_invoice.webservice_case 					=	"client_application_invoice_status_update";
	$rootScope.make_payment_for_unpaid_invoice.database_name	=	$rootScope.data_base_name;
	$rootScope.make_payment_for_unpaid_invoice.webservice_case	=	"client_application_invoice_payment_update";
	$scope.delete_unpaid_invoice.database_name					=	$rootScope.data_base_name;
	$scope.delete_unpaid_invoice.webservice_case 				=	'client_application_customer_invoice_delete';
	$scope.resend_invoice_to_customer.database_name				=	$rootScope.data_base_name;
	$scope.resend_invoice_to_customer.webservice_case 			=	'client_application_customer_invoice_send_unpaid_invoice';
	$scope.resend_invoice_to_customer.database_name				=	$rootScope.data_base_name;
	$scope.resend_invoice_to_customer.webservice_case 			=	'client_application_customer_invoice_send_unpaid_invoice';
	
	// Pagination for the grid.
	$scope.selected_page_pagination = '25';
	$scope.page_per_pagination = [
									{name:'5', value: '5'}, 
									{name:'10', value: '10'}, 
									{name:'25', value: '25'}, 
									{name:'50', value: '50'}, 
									{name:'100', value: '100'}					
								 ];
	/* all unpaid invoice list   */
	$scope.show_unpaid_invoice_details			= false;
	$scope.loader								= true;
	$scope.unpaid_invoice_list={};
	$scope.unpaid_invoice_list.database_name	=	$rootScope.data_base_name;
	$scope.unpaid_invoice_list.webservice_case	=  "client_application_invoice_list";
	$scope.unpaid_invoice_list.find_type		=  "unpaid";
	$rootScope.user_type = localStorage.getItem('userType');
	if($rootScope.user_type=='Customer')
	{
		$scope.unpaid_invoice_list.customer_id	= localStorage.getItem('customer_id');
	}
	API.getInvoiceListing($scope.unpaid_invoice_list).success(function(data)
	{
		$scope.unpaid_user_details=data.response_data; 
		$scope.show_unpaid_invoice_details			= true;
		$scope.loader								= false;
		$scope.sort_table = 'invoice_id';
		$scope.reverse = true;
		for(i=0;i<data.response_data.length;i++)
		{
			$scope.total_unpaid_invoice_amount+=data.response_data[i].invoice_amount;
		}
	});

	
	$scope.preview_unpaid_invoice_edit=false;
	$scope.showPreviewToEditUnpaidInvoice=function(invoice_details)
	{  
		$scope.unpaid_invoice=invoice_details;
		$rootScope.make_payment_for_unpaid_invoice.id				= invoice_details._id;
		$rootScope.make_payment_for_unpaid_invoice.invoice_amount	= invoice_details.amount;
		$scope.edit_unpaid_invoice.status							= invoice_details.status;
//		$scope.edit_unpaid_invoice									= invoice_details;
		$scope.edit_unpaid_invoice.invoice_id						= invoice_details.invoice_id;
		$scope.edit_unpaid_invoice.id								= invoice_details._id;
		$scope.edit_unpaid_invoice.invoice_notes					= invoice_details.invoice_notes;
		$scope.preview_unpaid_invoice_edit							= true;
		$scope.loader = false;
	}
	
	// function to update unpaid invoice details
	$scope.editUnpaidInvoiceList=function()
	{
		
		API.updateInvoiceDetails($scope.edit_unpaid_invoice).success(function(data)
		{
			$scope.loader = true;
			API.getInvoiceListing($scope.unpaid_invoice_list).success(function(data)
			{
				$scope.unpaid_user_details			= data.response_data;
				$scope.show_unpaid_invoice_details	= true;
				$scope.loader						= false;
				$scope.preview_unpaid_invoice_edit	= !$scope.preview_unpaid_invoice_edit;
				$scope.success_message_model		= true;
				$scope.alert_message_success		= "You have successfully edit invoice with invoice id "+$scope.edit_unpaid_invoice.invoice_id;
				$timeout(function() 
				{
					$scope.alert_message_success = false;
				}, 3000);
			});
			//$scope.loader 						= false;
		});
	}
	
	// function to update delete invoice details
	$scope.deleteUnpaidInvoiceShowWarning=function(invoice_details)
	{
		$scope.delete_unpaid_invoice.id=invoice_details._id;
		$scope.delete_unpaid_invoice.invoice_id=invoice_details.invoice_id;
		$scope.warning_message_model=true;
	}
	
	$scope.deleteUnpaidInvoice=function()
	{
		$scope.loader = true;
		$scope.unpaid_invoice_list={};
		$scope.unpaid_invoice_list.database_name	=	$rootScope.data_base_name;
		$scope.unpaid_invoice_list.webservice_case	=  "client_application_invoice_list";
		$scope.unpaid_invoice_list.find_type		=  "unpaid";
		API.deleteInvoiceDetails($scope.delete_unpaid_invoice).success(function(data)
		{
			API.getInvoiceListing($scope.unpaid_invoice_list).success(function(data)
			{
				$scope.unpaid_user_details		= data.response_data;
				$scope.warning_message_model 	= !$scope.warning_message_model;
				$scope.loader 					= false;;
				$scope.success_message_model	= true;
				$scope.alert_message_success	= "You have successfully delete invoice with invoice id ."+$scope.delete_unpaid_invoice.invoice_id;
				$timeout(function() 
				{
					$scope.alert_message_success = false;
				}, 3000);
			});
		});
	}
	
	$scope.preview_unpaid_invoice_and_send_mail=false;
	$scope.showPreviewForUnPaidInvoice=function(invoice)
	{  
		$rootScope.unpaid_invoice_details	= invoice;
		$rootScope.invoice_detail_to_view	= invoice;
		var total_amount_of_job				= 0;
		for(i=0;i<invoice.jobs.length;i++)
		{
			if(typeof invoice.jobs[i]!='undefined')
			{
				if(typeof invoice.jobs[i].booking_id !='undefined')
				{
					if(typeof invoice.jobs[i].booking_id.jobs !='undefined' && invoice.jobs[i].booking_id.jobs.length>0)
					{
						if(typeof invoice.jobs[i].booking_id.jobs[0].fare !='undefined' && invoice.jobs[i].booking_id.jobs[0].fare.length>0)
						{
						
							if(typeof invoice.jobs[i].booking_id.jobs[0].fare[0].total_fare)
							{
								total_amount_of_job = invoice.jobs[i].booking_id.jobs[0].fare[0].total_fare+total_amount_of_job;
							}	
						}
					}
				}
				
			}
			
		}
		
		/* calculating total/discount/surcharge and taxes i.e gst etc */
		if(invoice.customer_id.payment_type=='invoice')
		{
			$scope.show_total_part					= true;
			$scope.show_discount_part				= true;
			$scope.show_invoice_surcharge_part		= true;
			$scope.show_tax_on_fare_part			= true;
			$scope.discount_made_on_invoice			= (invoice.customer_id.invoice_discount_percentage*total_amount_of_job)/100;
			$scope.surcharge_amount					= (invoice.customer_id.invoice_surcharge_percentage*(total_amount_of_job-$scope.discount_made_on_invoice))/100;
			if(invoice.customer_id.include_taxes=='top_of_fare')
			{
				$scope.show_tax_within_the_fare_part= false;
				$scope.tax_amount_on_fare			= ($scope.business_setting_details.taxes[0].percentage*(total_amount_of_job-$scope.discount_made_on_invoice+$scope.surcharge_amount))/100;
			}
			else
			{
				$scope.show_tax_within_the_fare_part 	= true;
				$scope.tax_amount_on_fare			 	= 0;
				$scope.show_tax_on_fare_part			= false;
				var tax									= ((total_amount_of_job-$scope.discount_made_on_invoice+$scope.surcharge_amount)*100)/(100+$scope.business_setting_details.taxes[0].percentage);
				$scope.total_within_the_fare			= (total_amount_of_job-$scope.discount_made_on_invoice+$scope.surcharge_amount)-tax;
			$scope.tax_is_included_within_the_fare 	= "This invoice includes a total "+$scope.business_setting_details.taxes[0].name+" of "+$scope.business_setting_details.currency.symbol+' '+$scope.total_within_the_fare.toFixed(2);
			}
			$scope.total_invoice_amount_to_be_paid	= total_amount_of_job-$scope.discount_made_on_invoice+$scope.surcharge_amount+$scope.tax_amount_on_fare;
		}
		else
		{
			$scope.show_tax_within_the_fare_part	= false;
			$scope.show_total_part					= false;
			$scope.show_discount_part				= false;
			$scope.show_invoice_surcharge_part		= false;
			$scope.show_tax_on_fare_part			= false;
			$scope.total_invoice_amount_to_be_paid  = total_amount_of_job;
		}
		$scope.job_total_amount =total_amount_of_job;
		$scope.preview_unpaid_invoice_and_send_mail = ! $scope.preview_unpaid_invoice_and_send_mail;
	}
	
	$scope.preview_unpaid_payment=false;
	$scope.showPreviewForPaymentOfUnPaidInvoice=function(invoice)
	{  
		console.log(invoice);
		$rootScope.make_payment_for_unpaid_invoice.id				=	invoice._id;
		$rootScope.make_payment_for_unpaid_invoice.invoice_amount	=	invoice.amount;
		$rootScope.make_payment_for_unpaid_invoice.invoice_id		=	invoice.invoice_id;
		$rootScope.make_payment_for_unpaid_invoice.customer_name	=	invoice.customer_id.name;
		$rootScope.make_payment_for_unpaid_invoice.invoice_amount	=   invoice.invoice_amount;
		$rootScope.make_payment_for_unpaid_invoice.payments			=   invoice.payments;
		
		if(invoice.payments.length>0)
		{
			$scope.show_previous_payment_in_model = true;
		}
		else
		{
			$scope.show_previous_payment_in_model = false;
		}
		$scope.preview_unpaid_payment = ! $scope.preview_unpaid_payment;
		
	}
	/******CHANGING PAYMENT STATUS FORM UNPAID TO PAID   **************/
	$scope.makePaymentOfInvoice=function()
	{	$scope.loader = true;
		API.updateInvoiceDetails($rootScope.make_payment_for_unpaid_invoice).success(function(data)
		{
			$scope.response_message=data.response_message;
			if(data.response_code==200)
			{
				API.getInvoiceListing($scope.unpaid_invoice_list).success(function(data)
				{
					$scope.unpaid_user_details=data.response_data;
					$scope.preview_unpaid_payment 	= !$scope.preview_unpaid_payment;
					$scope.success_message_model	= true;
					$scope.alert_message_success	= "Payment for this invoice successfully added";
					$scope.loader					= false;
					$timeout(function() 
					{
						$scope.preview_unpaid_payment = false;
					}, 3000);
				});
			}
			else
			{
				$scope.loader				= false;
				$scope.error_message_model	= true;
				$scope.alert_message_error	= $scope.response_message;
			}
		})
		
	}
	/* resend invoice to the customer */
	$scope.reSendInvoiceToCustomer=function()
	{	
		$scope.loader							= true;
		$scope.resend_invoice_to_customer.id 	= $rootScope.invoice_detail_to_view._id
		API.resendInvoiceDetails($scope.resend_invoice_to_customer).success(function(data)
		{
			if(data.response_code==200)
			{
				$scope.loader								= false;
				$scope.preview_paid_invoice_and_send_mail	= false;
				$scope.preview_unpaid_invoice_and_send_mail	= false;
				$scope.success_message_model				= true;
				$scope.alert_message_success				= "invoice send successfully";
				$timeout(function() 
				{
					$scope.alert_message_success = false;
				}, 3000);
			}
			else
			{
				$scope.loader				= false;
				$scope.error_message_model	= true;
				$scope.alert_message_error	= $scope.response_message;
			}
		});
	}
	/* Open modal for PDF. */
	$scope.generate_un_paid_invoice_pdf_modal = false;
	$scope.openGenerateUnPaidInvoicePDFData = function()
	{
		$scope.generate_un_paid_invoice_pdf_modal = true;
	}
	/* Export data to CSV. */
	$scope.generateUnPaidInvoiceCSVData = function()
	{
		$scope.unpaid_user_details_csv = orderByFilter($scope.unpaid_user_details, $scope.sort_table, $scope.reverse);
		var data = [];
		data.push(["INVOICE NUMBER","SENT ON","CUSTOMER NAME","CUSTOMER TYPE","INVOICE AMOUNT","NOTES","STATUS"]);
		data.push(["","","","","","",""]);
		for(i=0;i<$scope.unpaid_user_details_csv.length;i++)
		{
			var inv_amt = $scope.unpaid_user_details_csv[i].invoice_amount;
			data.push([
							$scope.unpaid_user_details_csv[i].invoice_id,
							$filter('date')($scope.unpaid_user_details_csv[i].created_on,'dd-MM-yyyy'),
							$scope.unpaid_user_details_csv[i].customer_id.name,
							$filter('uppercase')($scope.unpaid_user_details_csv[i].customer_id.type),
							$rootScope.currency_symbol+""+inv_amt,
							$scope.unpaid_user_details_csv[i].invoice_notes,
							$filter('uppercase')($scope.unpaid_user_details_csv[i].status)
					  ]);
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
		link.setAttribute("download", "unpaid-invoice-data.csv");

		link.click();
	}
	$scope.sortUnpaidInvoiceTableBy = function (keyname)
	{	
		$scope.sortKey = keyname; //set the sortKey to the param passed
		$scope.reverse = !$scope.reverse; //if true make it false and vice versa
		$scope.sort_table = keyname
	}
})


app.controller('uninvoice_job',function ($scope,$rootScope,API,$location,$window,$localStorage,$sessionStorage,$cookieStore,$timeout,$filter,orderByFilter)
{
	// Check login status.
	if (localStorage.getItem('loginStatus') != 1 ||  $sessionStorage.loginStatus == 0 || $sessionStorage.userId == 0)
	{
		$location.path('/login');
	}
	var page_url					=   $window.location.href;
	var url_path					=	page_url.split('/');
	$rootScope.data_base_name		=	url_path[4];
	$scope.total_uninvoice_job_amount=	0.00;
	$scope.loader					=	true;
	$scope.invoiced_job_list 	= {"database_name":$rootScope.data_base_name,"webservice_case":"client_application_not_invoiced_booking_list"}
	API.getInvoiceListing($scope.invoiced_job_list).success(function(data)
	{
		for(i=0;i<data.response_data.length;i++)
		{
			if(typeof data.response_data[i].jobs.fare!='undefined')
			{
				if(data.response_data[i].jobs.fare.length>0)  
				{
					if(typeof data.response_data[i].jobs.fare[0].total_fare!='undefined')
					{
						$scope.total_uninvoice_job_amount+=data.response_data[i].jobs.fare[0].total_fare;
					}
					else
					{
						data.response_data[i].jobs.fare.push({total_fare:0.00});
					}
				}
				else
				{
					data.response_data[i].jobs.fare.push({total_fare:0.00});
				}
			}else
			{
				data.response_data[i].jobs.fare.push({total_fare:0.00});
			}
		}
		// Sorting key
		$scope.sort_table = 'customer_id.name';
		$scope.reverse = false;
		$scope.unvoiced_job_details = data.response_data;
		$scope.loader				= false;
	});
	/* Open modal for PDF. */
	$scope.un_invoiced_job_pdf_modal = false;
	$scope.openGenerateUnInvoicedJobPDFData = function()
	{
		$scope.un_invoiced_job_pdf_modal = true;
	}
	/* Export data to CSV. */
	$scope.generateUnInvoicedJobCSVData = function()
	{
		$scope.unvoiced_job_details_csv = orderByFilter($scope.unvoiced_job_details, $scope.sort_table, $scope.reverse);
		var data = [];
		var extras = "", from_label = "", to_label = "", from_line1 = "", to_line1 = "", from_line2 = "", to_line2 = "", from_dist = "", to_dist = "", from_post = "", to_post = "", from_state = "", to_state = "", from_country = "", to_country = "";
		data.push(["JOB ID","CUSTOMER NAME","STATUS","DATE & TIME","EXTRA","PAX DETAILS","FROM","TO","PAYMENT","FARE","DRIVER"]);
		data.push(["","","","","","","","","","",""]);
		for(i=0;i<$scope.unvoiced_job_details_csv.length;i++)
		{
			try{
				for(j=0;j<$scope.unvoiced_job_details_csv[i].jobs.extras.length;j++)
				{
					extras = extras+""+$scope.unvoiced_job_details_csv[i].jobs.extras[j].extra_type_id.name+"/";
				}
			}catch(err){
				extras = "";
			}
			try{ 	from_label = ( typeof $scope.unvoiced_job_details_csv[i].jobs.from_address.label !== 'undefined' )?$scope.unvoiced_job_details_csv[i].jobs.from_address.label.replace(/,/g, ''):""; }catch(err){}
			try{ 	to_label = ( typeof $scope.unvoiced_job_details_csv[i].jobs.to_address.label !== 'undefined' )?$scope.unvoiced_job_details_csv[i].jobs.to_address.label.replace(/,/g, ''):""; }catch(err){}
			try{ 	from_line1 = ( typeof $scope.unvoiced_job_details_csv[i].jobs.from_address.line_1 !== 'undefined' )?$scope.unvoiced_job_details_csv[i].jobs.from_address.line_1.replace(/,/g, ''):""; }catch(err){}
			try{ 	to_line1 = ( typeof $scope.unvoiced_job_details_csv[i].jobs.to_address.line_1 !== 'undefined' )?$scope.unvoiced_job_details_csv[i].jobs.to_address.line_1.replace(/,/g, ''):""; }catch(err){}
			try{ 	from_line2 = ( typeof $scope.unvoiced_job_details_csv[i].jobs.from_address.line_2 !== 'undefined' )?$scope.unvoiced_job_details_csv[i].jobs.from_address.line_2.replace(/,/g, ''):""; }catch(err){}
			try{ 	to_line2 = ( typeof $scope.unvoiced_job_details_csv[i].jobs.to_address.line_2 !== 'undefined' )?$scope.unvoiced_job_details_csv[i].jobs.to_address.line_2.replace(/,/g, ''):""; }catch(err){}
			try{ 	from_dist = ( typeof $scope.unvoiced_job_details_csv[i].jobs.from_address.suburb_district !== 'undefined' )?$scope.unvoiced_job_details_csv[i].jobs.from_address.suburb_district.replace(/,/g, ''):""; }catch(err){}
			try{ 	to_dist = ( typeof $scope.unvoiced_job_details_csv[i].jobs.to_address.suburb_district !== 'undefined' )?$scope.unvoiced_job_details_csv[i].jobs.to_address.suburb_district.replace(/,/g, ''):""; }catch(err){}
			try{ 	from_post = ( typeof $scope.unvoiced_job_details_csv[i].jobs.from_address.post_code !== 'undefined' )?$scope.unvoiced_job_details_csv[i].jobs.from_address.post_code.replace(/,/g, ''):""; }catch(err){}
			try{ 	to_post = ( typeof $scope.unvoiced_job_details_csv[i].jobs.to_address.post_code !== 'undefined' )?$scope.unvoiced_job_details_csv[i].jobs.to_address.post_code.replace(/,/g, ''):""; }catch(err){}
			try{ 	from_state = ( typeof $scope.unvoiced_job_details_csv[i].jobs.from_address.state !== 'undefined' )?$scope.unvoiced_job_details_csv[i].jobs.from_address.state.replace(/,/g, ''):""; }catch(err){}
			try{ 	to_state = ( typeof $scope.unvoiced_job_details_csv[i].jobs.to_address.state !== 'undefined' )?$scope.unvoiced_job_details_csv[i].jobs.to_address.state.replace(/,/g, ''):""; }catch(err){}
			try{ 	from_country = ( typeof $scope.unvoiced_job_details_csv[i].jobs.from_address.country !== 'undefined' )?$scope.unvoiced_job_details_csv[i].jobs.from_address.country.replace(/,/g, ''):""; }catch(err){}
			try{ 	to_country = ( typeof $scope.unvoiced_job_details_csv[i].jobs.to_address.country !== 'undefined' )?$scope.unvoiced_job_details_csv[i].jobs.to_address.country.replace(/,/g, ''):""; }catch(err){}
			try{	var fare = $rootScope.currency_symbol+" "+$scope.unvoiced_job_details_csv[i].jobs.fare[0].total_fare; }catch(err){	var fare = "";	}
			try{	var driver_tile =  ( typeof $scope.unvoiced_job_details_csv[i].jobs.driver[0].driver_id.title !== 'undefined' )?$scope.unvoiced_job_details_csv[i].jobs.driver[0].driver_id.title:""; }catch(err){	var driver_title = ""; }
			try{	var driver_fname = ( typeof $scope.unvoiced_job_details_csv[i].jobs.driver[0].driver_id.first_name !== 'undefined' )?$scope.unvoiced_job_details_csv[i].jobs.driver[0].driver_id.first_name:""; }catch(err){	var driver_fname = ""; }
			try{	var driver_lname = ( typeof $scope.unvoiced_job_details_csv[i].jobs.driver[0].driver_id.last_name !== 'undefined' )?$scope.unvoiced_job_details_csv[i].jobs.driver[0].driver_id.last_name:""; }catch(err){ var driver_lname = ""; }
			try{	var pax_fname = $scope.unvoiced_job_details_csv[i].jobs.pax_first_name; }catch(err){ var pax_fname = ""; }
			try{	var pax_lname = $scope.unvoiced_job_details_csv[i].jobs.pax_last_name; }catch(err){	var pax_lname = ""; }
			data.push([
							$scope.unvoiced_job_details_csv[i].jobs.job_id,
							$scope.unvoiced_job_details_csv[i].customer_id.name,
							$filter('uppercase')($scope.unvoiced_job_details_csv[i].jobs.job_status),
							$filter('date')($scope.unvoiced_job_details_csv[i].jobs.job_date,'dd-MM-yyyy')+" "+$scope.unvoiced_job_details_csv[i].jobs.pickup_date_time.pickup_time,
							extras,
							pax_fname+" "+pax_lname,
							from_label+" "+from_line1+" "+from_line2+" "+from_dist+" "+from_post+" "+from_state+" "+from_country,
							to_label+" "+to_line1+" "+to_line2+" "+to_dist+" "+to_post+" "+to_state+" "+to_country,
							$filter('uppercase')($scope.unvoiced_job_details_csv[i].jobs.payment_status),
							fare,
							driver_title+" "+driver_fname+" "+driver_lname
					  ]);
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
		link.setAttribute("download", "uninvoiced-job-data.csv");

		link.click();
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
	$scope.sortUnInvoiceJobTableBy = function (keyname)
	{	
		$scope.sortKey = keyname; //set the sortKey to the param passed
		$scope.reverse = !$scope.reverse; //if true make it false and vice versa
		$scope.sort_table = keyname
	}
	
});

app.controller('invoiced_job',function ($scope,$rootScope,API,$location,$window,$localStorage,$sessionStorage,$cookieStore,$timeout,$filter,orderByFilter)
{
	$scope.total_invoiced_job_amount =0.00;
	$scope.loader					= true;
	// Check login status.
	if (localStorage.getItem('loginStatus') != 1 ||  $sessionStorage.loginStatus == 0 || $sessionStorage.userId == 0)
	{
		$location.path('/login');
	}
	var page_url					=   $window.location.href;
	var url_path					=	page_url.split('/');
	$rootScope.data_base_name		=	url_path[4];
	$scope.invoiced_job_list 	= {"database_name":$rootScope.data_base_name,"webservice_case":"client_application_invoiced_booking_list"}
	API.getInvoiceListing($scope.invoiced_job_list).success(function(data)
	{
		$scope.invoiced_job_details=data.response_data; 
		$scope.show_unpaid_invoice_details			= true;
		$scope.loader								= false;
		// Sorting key
		$scope.sort_table = 'customer_id.name';
		$scope.reverse = false;
		for(i=0;i<data.response_data.length;i++)
		{
			
			if(typeof data.response_data[i].jobs.fare!='undefined')
			{
				if(data.response_data[i].jobs.fare.length>0)
				{
					if(typeof data.response_data[i].jobs.fare[0].total_fare!='undefined')
					{
						$scope.total_invoiced_job_amount+=data.response_data[i].jobs.fare[0].total_fare;
					}
					else
					{
						data.response_data[i].jobs.fare.push({total_fare:0.00});
					}
				}
				else
				{
					data.response_data[i].jobs.fare.push({total_fare:0.00});
				}
			}else
			{
				data.response_data[i].jobs.fare.push({total_fare:0.00});
			}
		}
	});
	/* Open modal for PDF. */
	$scope.invoiced_job_pdf_modal = false;
	$scope.openGenerateInvoicedJobPDFData = function()
	{
		$scope.invoiced_job_pdf_modal = true;
	}
	/* Export data to CSV. */
	$scope.generateInvoicedJobCSVData = function()
	{
		$scope.invoiced_job_details_csv = orderByFilter($scope.invoiced_job_details, $scope.sort_table, $scope.reverse);
		var data = [];
		var extras = "", from_label = "", to_label = "", from_line1 = "", to_line1 = "", from_line2 = "", to_line2 = "", from_dist = "", to_dist = "", from_post = "", to_post = "", from_state = "", to_state = "", from_country = "", to_country = "";
		data.push(["JOB ID","CUSTOMER NAME","STATUS","DATE & TIME","EXTRA","PAX DETAILS","FROM","TO","PAYMENT","FARE","DRIVER"]);
		data.push(["","","","","","","","","","",""]);
		for(i=0;i<$scope.invoiced_job_details_csv.length;i++)
		{
			try{
				for(j=0;j<$scope.invoiced_job_details_csv[i].jobs.extras.length;j++)
				{
					extras = extras+""+$scope.invoiced_job_details_csv[i].jobs.extras[j].extra_type_id.name+"/";
				}
			}catch(err){
				extras = "";
			}
			try{ 	from_label = ( typeof $scope.invoiced_job_details_csv[i].jobs.from_address.label !== 'undefined' )?$scope.invoiced_job_details_csv[i].jobs.from_address.label.replace(/,/g, ''):""; }catch(err){}
			try{ 	to_label = ( typeof $scope.invoiced_job_details_csv[i].jobs.to_address.label !== 'undefined' )?$scope.invoiced_job_details_csv[i].jobs.to_address.label.replace(/,/g, ''):""; }catch(err){}
			try{ 	from_line1 = ( typeof $scope.invoiced_job_details_csv[i].jobs.from_address.line_1 !== 'undefined' )?$scope.invoiced_job_details_csv[i].jobs.from_address.line_1.replace(/,/g, ''):""; }catch(err){}
			try{ 	to_line1 = ( typeof $scope.invoiced_job_details_csv[i].jobs.to_address.line_1 !== 'undefined' )?$scope.invoiced_job_details_csv[i].jobs.to_address.line_1.replace(/,/g, ''):""; }catch(err){}
			try{ 	from_line2 = ( typeof $scope.invoiced_job_details_csv[i].jobs.from_address.line_2 !== 'undefined' )?$scope.invoiced_job_details_csv[i].jobs.from_address.line_2.replace(/,/g, ''):""; }catch(err){}
			try{ 	to_line2 = ( typeof $scope.invoiced_job_details_csv[i].jobs.to_address.line_2 !== 'undefined' )?$scope.invoiced_job_details_csv[i].jobs.to_address.line_2.replace(/,/g, ''):""; }catch(err){}
			try{ 	from_dist = ( typeof $scope.invoiced_job_details_csv[i].jobs.from_address.suburb_district !== 'undefined' )?$scope.invoiced_job_details_csv[i].jobs.from_address.suburb_district.replace(/,/g, ''):""; }catch(err){}
			try{ 	to_dist = ( typeof $scope.invoiced_job_details_csv[i].jobs.to_address.suburb_district !== 'undefined' )?$scope.invoiced_job_details_csv[i].jobs.to_address.suburb_district.replace(/,/g, ''):""; }catch(err){}
			try{ 	from_post = ( typeof $scope.invoiced_job_details_csv[i].jobs.from_address.post_code !== 'undefined' )?$scope.invoiced_job_details_csv[i].jobs.from_address.post_code.replace(/,/g, ''):""; }catch(err){}
			try{ 	to_post = ( typeof $scope.invoiced_job_details_csv[i].jobs.to_address.post_code !== 'undefined' )?$scope.invoiced_job_details_csv[i].jobs.to_address.post_code.replace(/,/g, ''):""; }catch(err){}
			try{ 	from_state = ( typeof $scope.invoiced_job_details_csv[i].jobs.from_address.state !== 'undefined' )?$scope.invoiced_job_details_csv[i].jobs.from_address.state.replace(/,/g, ''):""; }catch(err){}
			try{ 	to_state = ( typeof $scope.invoiced_job_details_csv[i].jobs.to_address.state !== 'undefined' )?$scope.invoiced_job_details_csv[i].jobs.to_address.state.replace(/,/g, ''):""; }catch(err){}
			try{ 	from_country = ( typeof $scope.invoiced_job_details_csv[i].jobs.from_address.country !== 'undefined' )?$scope.invoiced_job_details_csv[i].jobs.from_address.country.replace(/,/g, ''):""; }catch(err){}
			try{ 	to_country = ( typeof $scope.invoiced_job_details_csv[i].jobs.to_address.country !== 'undefined' )?$scope.invoiced_job_details_csv[i].jobs.to_address.country.replace(/,/g, ''):""; }catch(err){}
			try{	var fare = $rootScope.currency_symbol+" "+$scope.invoiced_job_details_csv[i].jobs.fare[0].total_fare; }catch(err){	var fare = "";	}
			try{	var driver_tile =  ( typeof $scope.invoiced_job_details_csv[i].jobs.driver[0].driver_id.title !== 'undefined' )?$scope.invoiced_job_details_csv[i].jobs.driver[0].driver_id.title:""; }catch(err){	var driver_title = ""; }
			try{	var driver_fname = ( typeof $scope.invoiced_job_details_csv[i].jobs.driver[0].driver_id.first_name !== 'undefined' )?$scope.invoiced_job_details_csv[i].jobs.driver[0].driver_id.first_name:""; }catch(err){	var driver_fname = ""; }
			try{	var driver_lname = ( typeof $scope.invoiced_job_details_csv[i].jobs.driver[0].driver_id.last_name !== 'undefined' )?$scope.invoiced_job_details_csv[i].jobs.driver[0].driver_id.last_name:""; }catch(err){ var driver_lname = ""; }
			try{	var pax_fname = $scope.invoiced_job_details_csv[i].jobs.pax_first_name; }catch(err){ var pax_fname = ""; }
			try{	var pax_lname = $scope.invoiced_job_details_csv[i].jobs.pax_last_name; }catch(err){	var pax_lname = ""; }
			data.push([
						$scope.invoiced_job_details_csv[i].jobs.job_id,
						$scope.invoiced_job_details_csv[i].customer_id.name,
						$filter('uppercase')($scope.invoiced_job_details_csv[i].jobs.job_status),
						$filter('date')($scope.invoiced_job_details_csv[i].jobs.job_date,'dd-MM-yyyy')+" "+$scope.invoiced_job_details_csv[i].jobs.pickup_date_time.pickup_time,
						extras,
						pax_fname+" "+pax_lname,
						from_label+" "+from_line1+" "+from_line2+" "+from_dist+" "+from_post+" "+from_state+" "+from_country,
						to_label+" "+to_line1+" "+to_line2+" "+to_dist+" "+to_post+" "+to_state+" "+to_country,
						$filter('uppercase')($scope.invoiced_job_details_csv[i].jobs.payment_status),
						fare,
						driver_title+" "+driver_fname+" "+driver_lname
					  ]);
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
		link.setAttribute("download", "invoiced-job-data.csv");

		link.click();
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
	$scope.sortInvoicedJobTableBy = function (keyname)
	{	
		$scope.sortKey = keyname; //set the sortKey to the param passed
		$scope.reverse = !$scope.reverse; //if true make it false and vice versa
		$scope.sort_table = keyname
	}
});