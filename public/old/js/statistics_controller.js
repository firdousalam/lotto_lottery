/*
statistics module .
All statistics related operation done on this page.
Note : If hit any api and get response code 200 mean success outher wise error returns
*/
angular.module('statistics_module', [])

.controller('statisticsControllerCustomerWise', function ($scope,$rootScope,API,$location,$sessionStorage,$timeout,$window,$filter) 
	{
	  	$rootScope.myDataSource = {};
		var page_url = $location.url();
		// Get the URL of the page.
		var page_url = $window.location.href;
		// Get the database name of the client from the URL of the page.
		var url_path = page_url.split('/');
		$rootScope.database_name = url_path[4];
		API.common_api({"webservice_case":'client_application_job_wise_booking_list_count','database_name':$rootScope.database_name},'listing')
					.success(function(data)
					{	//console.log(data);
						$rootScope.customer_data=[];
						$rootScope.customer_data.push(["Element", "Number Of Jobs", { role: "style" } ]);
						for(i=0;i<data.response_data.length;i++)
						{
							if(data.response_data[i].customer_id!=null)
							{
								//console.log(data.response_data[i].customer_id.name);
								//$scope.data={'label':data.response_data[i].customer_id.name,'value':data.response_data[i].count};
								$rootScope.customer_data.push({label:data.response_data[i].customer_id.name,y:data.response_data[i].count});
							}
							
						}
						// For bar chart
						var chart = new CanvasJS.Chart("chartContainer",
																		{
																			title:
																			{
																				text: "Statistics - Customer Wise (no. of jobs)"    
																			},
																			animationEnabled: true,
																			axisX: 
																			{
																				labelAutoFit: true,    //false by default.
																				labelAngle: 60,
																				labelFontSize: 15,
																				//prefix: "This is long label that gets wrapped at y : "
																			},
																			legend: 
																			{
																				verticalAlign: "bottom",
																				horizontalAlign: "center"
																			},
																			theme: "theme1",
																			data: 
																			[
																				{        
																					type: "column", 
																					bevelEnabled: true, 
																					showInLegend: false, 
																					legendMarkerColor: "grey",
																					legendText: "Customer wise jobs",
																					dataPoints:$rootScope.customer_data
																				}   
																			]
																		});
																	chart.render();
					})
	
	})
.controller('statisticsControllerMonthWise',function($scope,$rootScope,API,$location,$sessionStorage,$timeout,$window,$filter)
	{
		var page_url = $location.url();
		// Get the URL of the page.
		var page_url = $window.location.href;
		// Get the database name of the client from the URL of the page.
		var url_path = page_url.split('/');
		$rootScope.database_name = url_path[4];
		// Month wise statistics
		
		$scope.no_data_found		=true;
				
		API.common_api({"webservice_case":'client_application_job_wise_booking_list_count_by_date','database_name':$rootScope.database_name},'listing')
			.success(function(data)
				{
					//console.log(data);
					$rootScope.jobs_data=[];
					//console.log(data);
					$rootScope.jobs_data=[];
					//For jobs count month wise
					$scope.no_data_found		=false;
					
					// For create array
					for(j=0;j<data.response_data.length;j++)
					{
						switch (j) 
						{
							case 0:
								$rootScope.jobs_data.push({ x: new Date(data.response_data[j]._id.year, 00, 1),y:data.response_data[j].count});
								break; 
							case 1:
								$rootScope.jobs_data.push({ x: new Date(data.response_data[j]._id.year, 01, 1),y:data.response_data[j].count});
								break; 
							case 2:
								$rootScope.jobs_data.push({ x: new Date(data.response_data[j]._id.year, 02, 1),y:data.response_data[j].count});
								break; 
							case 3:
								$rootScope.jobs_data.push({ x: new Date(data.response_data[j]._id.year, 03, 1),y:data.response_data[j].count});
								break; 
							case 4:
								$rootScope.jobs_data.push({ x: new Date(data.response_data[j]._id.year, 04, 1),y:data.response_data[j].count});
								break; 
							case 5:
								$rootScope.jobs_data.push({ x: new Date(data.response_data[j]._id.year, 05, 1),y:data.response_data[j].count});
								break; 
							case 6:
								$rootScope.jobs_data.push({ x: new Date(data.response_data[j]._id.year, 06, 1),y:data.response_data[j].count});
								break; 
							case 7:
								$rootScope.jobs_data.push({ x: new Date(data.response_data[j]._id.year, 07, 1),y:data.response_data[j].count});
								break; 
							case 8:
								$rootScope.jobs_data.push({ x: new Date(data.response_data[j]._id.year, 08, 1),y:data.response_data[j].count});
								break;
							case 9:
								$rootScope.jobs_data.push({ x: new Date(data.response_data[j]._id.year, 09, 1),y:data.response_data[j].count});
								break;
							case 10:
								$rootScope.jobs_data.push({ x: new Date(data.response_data[j]._id.year, 10, 1),y:data.response_data[j].count});
								break;
							case 11:
								$rootScope.jobs_data.push({ x: new Date(data.response_data[j]._id.year, 11, 1),y:data.response_data[j].count});
								break;
						}
					}
					
					//console.log($rootScope.jobs_data);
					var chart = new CanvasJS.Chart("chartContainer1",
   																	{
																		theme: "theme2",
																		title:
																		{
																			text: "Statistics - Jobs Month Wise"
																		},
																		animationEnabled: true,
																		axisX: 
																		{
																			valueFormatString: "MMM",
																			interval:1,
																			intervalType: "month"
																		},
																		axisY:
																		{
																			includeZero: false
																		},
																		data: 
																		[
																			{        
																				type: "line",
																				//lineThickness: 3,        
																				dataPoints: $rootScope.jobs_data
																			}
																		]
    																});
																chart.render();
				})
	})
.controller('statisticsControllerJobTypeWise',function($scope,$rootScope,API,$location,$sessionStorage,$timeout,$window,$filter)
	{
		var page_url = $location.url();
		// Get the URL of the page.
		var page_url = $window.location.href;
		// Get the database name of the client from the URL of the page.
		var url_path = page_url.split('/');
		$rootScope.database_name = url_path[4];
		// Job type wise
		
		API.common_api({"webservice_case":'client_application_job_wise_booking_list_count_by_booking_type','database_name':$rootScope.database_name},'listing')
			.success(function(data)
			{
				//console.log(data);
				$rootScope.job_type_data=[];
				for(i=0;i<data.response_data.length;i++)
				{
					if(data.response_data[i]._id=='one_way')
					{
						$scope.name='One Way Job';
					}
					if(data.response_data[i]._id=='return')
					{
						$scope.name='Return Way Job';
					}
					if(data.response_data[i]._id=='hourly')
					{
						$scope.name='Hourly Job';
					}
					$rootScope.job_type_data.push({  y: data.response_data[i].count, name: $scope.name, legendMarkerType: "circle"});
				}
				var chart = new CanvasJS.Chart("chartContainer2",
																{
																	title:
																	{
																		text: "Statistics - Job Type Wise",
																		fontFamily: "arial black"
																	},
																	animationEnabled: true,
																	legend: 
																	{
																		verticalAlign: "bottom",
																		horizontalAlign: "center"
																	},
																	theme: "theme1",
																	data: 
																	[
																		{        
																			type: "pie",
																			indexLabelFontFamily: "Garamond",       
																			indexLabelFontSize: 20,
																			indexLabelFontWeight: "bold",
																			startAngle:0,
																			indexLabelFontColor: "MistyRose",       
																			indexLabelLineColor: "darkgrey", 
																			indexLabelPlacement: "inside", 
																			toolTipContent: "{name}: {y} Jobs",
																			showInLegend: true,
																			indexLabel: "#percent%", 
																			dataPoints: $rootScope.job_type_data
																		}
																	]
																});
															chart.render();
			})
	})
  
