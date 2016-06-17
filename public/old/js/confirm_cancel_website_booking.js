/*----------------------------------------

THINGS TO DO

1. Once confirm button is pressed by the admin, if the admin presses it for the second time, the following message must be shown
	"You have already confirmed this job. To re-confirm, please log to BMS and send a re-confirmation to the customer"
2. Once a job has been cancelled, on accidental pressing of the button confirm show the following message
	"This job has been cancelled. To Re-activate this job, please login to BMS and change the status of the job"
----------------------------------------*/
var app = angular.module('confirm_cancel_website_booking',['limo_client.services']);

app.controller('websiteBooking',function($scope, $rootScope, API, $location, $localStorage, $window, $sessionStorage, $stateParams, $timeout)
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
			console.log($scope.website_booking);
			API.common_api($scope.website_booking, 'booking').success(function (data)
			{	
				// 200 response code for job confirm
				if (data.response_code == 200)
				{	
					$scope.alert_color = 'success';
					$scope.return_message = 'This booking has been confirmed. A confirmation email has been sent to the customer. Thanks.';
					$scope.success_message = true;
					$scope.success_error_message = false;
				}
				
				// 203 response code - if something goes wrong (Not defined yet)
				if (data.response_code == 203)
				{	
					$scope.alert_color = 'danger';
					$scope.return_message = 'Oops something has gone wrong. Please try again.';
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
				// 200 response code for job allotted to another driver
				if (data.response_code == 200)
				{	
					$scope.alert_color = 'danger';
					$scope.return_message = 'This booking has been cancelled. An email to notify the customer of this cancellation has been sent. Thanks.';
					$scope.success_message = true;
					$scope.success_error_message = false;
				}
				
				// 203 response code - if something goes wrong (Not defined yet)
				if (data.response_code == 203)
				{	
					$scope.alert_color = 'danger';
					$scope.return_message = 'Oops something has gone wrong. Please try again.';
					$scope.success_message = true;
					$scope.success_error_message = false;
				}
			});
		}
		else
		{}
	}
}) 