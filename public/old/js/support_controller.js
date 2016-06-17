angular.module('support_controller', ['ngMessages', 'limo_client.services'])

.controller('supportController', function($scope, $rootScope, API, $location, $localStorage, $window, $sessionStorage, $stateParams, $cookieStore, $timeout)
{
	// Check login status.
	if( $sessionStorage.loginStatus == 0 || $sessionStorage.userId == 0 )
	{
		$location.path('/login');
	}
	// set all the hide div when page is load.
	var page_url = $window.location.href;
	var url_path = page_url.split('/');
	$rootScope.data_base_name = url_path[4];
	$scope.success_error_message = false;
	$scope.loading = false;
	$scope.support = {};
	// Function to insert data.
	$scope.addSupportData = function(isValid)
	{
		$scope.loading = true;
		if( isValid == false )
		{
			if( !$scope.support.subject )
			{
				$scope.subject = true;
			}
			if( !$scope.support.details )
			{
				$scope.details = true;
			}
			$scope.loading = false;
			return false;
		}
		// Set case and db name.
		$scope.support.database_name = 'a_limokit';
		$scope.support.folder_name = $rootScope.data_base_name;
		$scope.support.webservice_case = 'main_application_tech_support_add';
		$scope.support.user_id = ( $sessionStorage.userId != '' ) ? $sessionStorage.userId : $cookieStore.get("user_id");
		$scope.support.required_fields = [];
		// Call API to insert data.
		API.common_api($scope.support, 'tech_support').success(function(data)
		{
			if( data.response_code == 200 )
			{
				$scope.alert_message_error = '';
				if( $scope.support.category == 'suggestion' )
				{
					$scope.alert_message_success = 'Suggestion has been made successfully.';
				}
				else if( $scope.support.category == 'report_bug' )
				{
					$scope.alert_message_success = 'Bug has been successfully reported.';
				}
				if( $scope.support.category == 'complaint' )
				{
					$scope.alert_message_success = 'Complaint has been registered successfully.';
				}
				if( $scope.support.category == 'urgent_support' )
				{
					$scope.alert_message_success = 'Support request has been made successfully.';
				}
				$scope.success_error_message = true;
				$timeout(function() 
				{
					$scope.success_error_message = false;
				}, 2000);
				// Toggle modal.
				$scope.loading = false;
				$scope.edit_admin_user_modal = false;
			}
			else
			{
				$scope.alert_message_error = data.response_message;
				$scope.alert_message_success = '';
				$scope.success_error_message = true;
				$timeout(function() 
				{
					$scope.success_error_message = false;
				}, 2000);
				// Toggle modal.
				$scope.loading = false;
				$scope.edit_admin_user_modal = false;
			}
		})
	}
	
	$scope.countDownTimer = function()
	{
		$scope.counter_time = 10;
		$scope.startCountDownTimer();
	}
	$scope.startCountDownTimer = function()
	{
		$timeout(function()
		{
			if( $scope.counter_time > 0 )
			{
				$scope.counter_time--;   
				$scope.startCountDownTimer();  
			}
			else
			{
				$scope.stopCountDownTimer();
			}
		},1000);
	}
	$scope.stopCountDownTimer = function()
	{
		$timeout.cancel();
    }
})