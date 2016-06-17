angular.module('homeController', ['lottoService.services'])

.controller('homeController', function($scope,API)
{
	API.get_details('read_number_of_previous_winner').success(function(data)
	{
		$scope.winning_number_details = data;

	});
});