 angular.module('bidJobAndWebsiteBooking.controllers', ['google.places','720kb.tooltips','date-picker','ngMessages','limo_client.services'])
// For bidding
.controller('bidJob',function($scope, $rootScope, API, $location, $localStorage, $window, $sessionStorage, $stateParams, $timeout)
{	
	// Get URL parameters
	if ($stateParams.booking_id != 'undefined' && $stateParams.job_id != 'undefined' && $stateParams.driver_id != 'undefined' && $stateParams.job_type != 'undefined')
	{	
		// $stateParams use to get url parameters
		$scope.booking_id = $stateParams.booking_id;
		$scope.job_id = $stateParams.job_id;
		$scope.driver_id = $stateParams.driver_id;
		// Define bid_now json to send user data to server
		$scope.bid_now = {};
		// Get the database name of the client from the URL of the page.
		$scope.bid_now.database_name = $location.absUrl().split('/')[4] || "Unknown";
		$scope.bid_now.booking_id = $scope.booking_id;
		$scope.bid_now.job_id = $scope.job_id;
		$scope.bid_now.driver_id = $scope.driver_id;
		$scope.bid_now.required_fields = [{name : "booking_id"},{name : "job_id"},{name : "driver_id"}]; 
		// When click bid now button
		if ($stateParams.job_type == 'bid')
		{
			$scope.bid_now.webservice_case = 'client_application_booking_job_driver_bidding';
			API.common_api($scope.bid_now, 'booking').success(function (data)
			{	
				// 201 response code for job allotted to another driver
				if (data.response_code == 201)
				{
					$scope.alert_message_color = 'danger';
					$scope.job_status = '';
					$scope.congratulation_win_message = '';
					$scope.job_message = data.response_message;
					$scope.success_error_message = true;
				}
				// 200 response code for job roggered
				if (data.response_code == 200)
				{	
					if (data.response_data.length > 0)
					{	
						$scope.alert_color = 'success';
						$scope.job_status = 'Bid job';
						$scope.job_message = '';
						$scope.success = 'Congratulation,';
						$scope.congratulation_win_message = "You have won this job. Please check your email for details of this job.";
						$scope.success_message = true;
						$scope.success_error_message = false;
					}
					if (data.response_data.length == 0)
					{	
						$scope.alert_color = 'danger';
						$scope.job_status = '';
						$scope.congratulation_win_message = data.response_message;
						$scope.success_message = true;
					}
				}
			});
		}
		// When click job confirm allotment	
		else if ($stateParams.job_type == 'confirm')
		{
		//	$scope.alert_message_color = 'success';
		//	$scope.job_status = 'Job allotment notification';
		//	$scope.job_message = 'Thanks for confirming. Admin has been notified of your confirmation.';
			$scope.bid_now.webservice_case = "client_application_booking_job_driver_roggered";
			$scope.bid_now.access_platform = "bms";
			$scope.bid_now.required_fields = [{name : "booking_id"},{name : "job_id"},{name:"driver_id"}];
			API.common_api($scope.bid_now, 'booking').success(function (data)
			{	
				// 201 response code for job allotted to another driver
				if (data.response_code == 200)
				{	
					if (data.response_data.length)
					{	
						$scope.alert_message_color = 'success';
						$scope.job_status = 'Job Acceptance Notification';
						$scope.job_message = 'Thanks for accepting this job. An email has been sent to the Admin.';
						$scope.success_error_message = true;
					}
					if (!data.response_data.length)
					{	
						$scope.alert_message_color = 'danger';
						$scope.job_status = '';
						$scope.job_message = data.response_message;
						$scope.success_error_message = true;
					}
				}
			});
		}
		// When click send arrivel notification for job
		else if ($stateParams.job_type == 'arrive')
		{
			$scope.alert_message_color = 'success';
			$scope.job_status = 'Job Arrival Notification';
			$scope.job_message = 'Thanks for notifying your arrival for this job. An email has been sent to the Admin.';
			$scope.bid_now.webservice_case = "client_application_booking_job_driver_status_arrival";
			$scope.bid_now.access_platform = "bms";
			$scope.bid_now.required_fields = [{name : "booking_id"},{name : "job_id"},{name:"driver_id"}];
			API.common_api($scope.bid_now, 'booking').success(function (data)
			{	
				// 201 response code for job allotted to another driver
				if (data.response_code == 200)
				{	
					$scope.success_error_message = true;
				}
			});
		}
		// When click send completed notification for job
		else if ($stateParams.job_type == 'complete')
		{
			$scope.alert_message_color = 'success';
			$scope.job_status = 'Job Completed Notification';
			$scope.job_message = 'Thanks for notifying the completion of this job. An email has been sent to the Admin.<br/>You can also lodge an extras sheet if you have incurred any extras. To go to extras sheet, please go the job details email and select the button LODGE EXTRAS SHEET.';
			$scope.bid_now.webservice_case = "client_application_booking_job_and_driver_status_complete";
			$scope.bid_now.access_platform = "bms";
			$scope.bid_now.required_fields = [{name : "booking_id"},{name : "job_id"},{name:"driver_id"}];
			API.common_api($scope.bid_now, 'booking').success(function (data)
			{	
				// 201 response code for job allotted to another driver
				if (data.response_code == 200)
				{	
					$scope.success_error_message = true;
				}
			});
		}
		// When click load extra sheet for job
		else if ($stateParams.job_type == 'extra')
		{	
			$scope.logde_job_extra_sheet_field_number = [{name : "1."},{name : "2."},{name : "3."},{name : "4."},{name : "5."}];
			$scope.extra_sheet_name_and_value = [{name : ""}, {value : ""}];
			$scope.extra_sheet_value = [];
			$scope.bid_now.webservice_case = "client_application_booking_job_driver_extra_lodge";
			$scope.bid_now.access_platform = "bms";
			$scope.bid_now.required_fields = [{name : "booking_id"},{name : "job_id"}];
			API.common_api($scope.bid_now, 'booking').success(function (data)
			{	
				// 201 response code for job allotted to another driver
				if (data.response_code == 200)
				{	
					$scope.job_status = 'Job Extras - Claim Sheet';
					$scope.logde_job_extra_sheet_div = true;
					$scope.job_details_message = 'Please fill out this form to notify admin of any extra charges incurred with this job.';
					// Get booking details data from DB
					$scope.booking_details = data.response_data[0].jobs[0];  
				}
			})
			.error(function (data, status, headers, config) 
			{
				$scope.alert_message_color = 'danger';
				$scope.job_status = '';
				$scope.success_error_message = true;
				$scope.job_message = 'Sorry, this job is not available.';
			});
			$scope.updateLogdeJobExtraSheet = function (logde_job_extra_sheet)
			{	
				$scope.logde_extra = {};
				$scope.logde_job_extra_sheet_loader = true;
				$scope.logde_extra.booking_id = $scope.booking_id;
				$scope.logde_extra.job_id = $scope.job_id;
				$scope.logde_extra.driver_id = $scope.driver_id;
				$scope.logde_extra.webservice_case = "client_application_booking_job_driver_extra_lodge";
				$scope.logde_extra.database_name = $location.absUrl().split('/')[4] || "Unknown";
				$scope.logde_extra.access_platform = "bms";
				$scope.logde_extra.required_fields = [];
				$scope.logde_extra.extra = [];
				for (var i = 0; i < $scope.logde_job_extra_sheet_field_number.length; i++)
				{	
					// Form fields validation
					if (angular.isDefined(logde_job_extra_sheet['extra_sheet_value_'+i].$viewValue) && logde_job_extra_sheet['extra_sheet_value_'+i].$viewValue != '')
					{
						if (angular.isUndefined(logde_job_extra_sheet['extra_sheet_name_'+i].$modelValue) || logde_job_extra_sheet['extra_sheet_name_'+i].$modelValue == '')
						{	
							$scope.extra_sheet_name_and_value[i].value.length = true; 
							$('input.ng-invalid').first().focus();
							$scope.logde_job_extra_sheet_loader = false;
							return false;
						}
					}
					if (typeof $scope.extra_sheet_name_and_value[i] != 'undefined')
					{
						// extra array hold input data using push function
						$scope.logde_extra.extra.push({name : $scope.extra_sheet_name_and_value[i].name, value : $scope.extra_sheet_name_and_value[i].value});   
					}
				}
				API.common_api($scope.logde_extra, 'booking').success(function (data)
				{	
					$scope.logde_job_extra_sheet_loader = false;
					// 201 response code for job allotted to another driver
					if (data.response_code == 200)
					{	
						$scope.logde_job_extra_sheet_div = false;
						$scope.alert_message_color = 'success'; 
						$scope.job_status = 'Job Extras - Claim Sheet';
						$scope.success_error_message = true;
						$scope.job_message = 'Extras have been saved successfully. A message has been sent to the Admin. Thanks';
					}
				});
			}
			// Set duble zero after amount
			$scope.toFixedTwo = function (field_value, position)
			{	
				if(field_value)
				{
					$scope.extra_sheet_name_and_value[position].value = parseFloat(field_value).toFixed(2);
				}
				else if (field_value == 'undefined' || field_value == '')
				{
					$scope.extra_sheet_name_and_value[position].value = '';//parseFloat(0).toFixed(2);
				}
				else
				{}
			}
		}
		// For admin 
		else if ($stateParams.job_type == 'cancel')
		{
			$scope.alert_message_color = 'success';
			$scope.job_status = 'Job Cancelled';
			$scope.job_message = 'Job has been cancelled successfully.';
			$scope.bid_now.webservice_case = "client_application_booking_job_status_change_by_admin";
			$scope.bid_now.access_platform = "bms";
			$scope.bid_now.required_fields = [{name : "booking_id"},{name : "job_id"},{name:"driver_id"}];
			API.common_api($scope.bid_now, 'booking').success(function (data)
			{	
				// 201 response code for job allotted to another driver
				if (data.response_code == 200)
				{	
					// Modal
					$scope.success_error_message = true;
					$timeout(function ()
					{
						$scope.success_error_message = false; 
					}, 20000);
				}
			});
		}
		else
		{}
	}
}) 

.controller('websiteBooking',function($scope, $rootScope, API, $location, $localStorage, $window, $sessionStorage, $stateParams, $timeout)
{	
	// Get URL parameters
	if ($stateParams.button_type != 'undefined' && $stateParams.email != 'undefined')
	{	
		// $stateParams use to get url parameters
		$scope.button_type = $stateParams.button_type;
		$scope.database_name = $location.absUrl().split('/')[4] || "Unknown";
		$scope.email = $stateParams.email;
		$scope.booking_type = $stateParams.booking_type;
		$scope.job_id = $stateParams.job_id; 
		// Define bid_now json to send user data to server
		$scope.website_booking = {};
		// Get the database name of the client from the URL of the page.
		$scope.website_booking.database_name = $scope.database_name;
		$scope.website_booking.confirm_source = $scope.email;
		$scope.website_booking.booking_type = $scope.booking_type;
		$scope.website_booking.job_id = $scope.job_id;
		$scope.website_booking.required_fields = []; 
		// When click confirm button
		if ($stateParams.button_type == 'confirm_booking')
		{
			$scope.website_booking.webservice_case = 'client_application_confirm_all_jobs';
			API.common_api($scope.website_booking, 'booking').success(function (data)
			{	
				// 200 response code for job confirm
				if (data.response_code == 200)
				{	
					$scope.alert_color = 'success';
					$scope.success = 'Congratulation,';
					$scope.website_booking = "Booking is confirm.";
					$scope.success_message = true;
					$scope.success_error_message = false;
				}
			});
		}
		// When click job confirm allotment	
		else if ($stateParams.button_type == 'cancel_booking')
		{
			$scope.website_booking.webservice_case = 'client_application_cancel_all_jobs';
			API.common_api($scope.website_booking, 'booking').success(function (data)
			{	
				// 201 response code for job allotted to another driver
				if (data.response_code == 200)
				{	
					$scope.alert_color = 'danger';
					$scope.website_booking = "Booking is cancel.";
					$scope.success_message = true;
					$scope.success_error_message = false;
				}
			});
		}
		else
		{}
	}
}) 

/*  
.filter('formatValue', function() {
    return function(data) {

        if(angular.isNumber(data)) {
            return data.toFixed(2);
        }
        return data;
    }
});
*/
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
                    this.value = text.replace(/[a-zA-Z*@^!]/g,'');
                });
            }
		}
    };
});
