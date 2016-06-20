angular.module('homeController', ['lottoService.services'])

.controller('homeController', function($scope,API)
{
	$scope.show_loader =true;
	API.get_details('read_number_of_previous_winner').success(function(data)
	{
		$scope.winning_number_details = data;
		$scope.show_loader =false;
	});
	$scope.sort = function(keyname){
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }
    	// Pagination for the grid.
	$scope.selected_page_pagination = '25';
	$scope.page_per_pagination = [
									{name:'5', value: '5'}, 
									{name:'10', value: '10'}, 
									{name:'25', value: '25'}, 
									{name:'50', value: '50'}, 
									{name:'100', value: '100'},
									{name:'200', value: '200'}					
								 ];
})
.controller('rightPanelController', function($scope,API)
{
	$scope.show_loader =true;
	API.get_details('get_current_jackpot_number').success(function(data)
	{
		$scope.current_jackpot_details= data;
		$scope.show_loader =false;

	});
});
