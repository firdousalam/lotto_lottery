angular.module('limo_client.services', [])
    .factory('API', function ( $http) {
	
	var base = "http://limotool.com:3400/";
	//var base = "http://limotool.com:3400/";
	//var satnam_base  ="http://192.168.20.70:3400/"

        return {
					common_api : function (form,url) {
						return $http.post(base+url,
											 form,
											  {
												  method : 'POST',  
												  headers:{'Content-Type': 'application/x-www-form-urlencoded'}
											  }
											  );
						
					},
					test_api : function (form,url) {
						return $http.post('http://192.168.20.59:3400/registration',
											 form,
											  {
												  method : 'POST',  
												  headers:{'Content-Type': 'application/x-www-form-urlencoded'}
											  }
											  );
						
					},
					addCustomerByAdmin : function (form,url) {
						return $http.post(base+'registration',
											 form,
											  {
												  method : 'POST',  
												  headers:{'Content-Type': 'application/x-www-form-urlencoded'}
											  }
											  );
					
					},
					
					car : function (form,url) {
						return $http.post(base+'car',
											 form,
											  {
												  method : 'POST',  
												  headers:{'Content-Type': 'application/x-www-form-urlencoded'}
											  }
											  );
					
					},
					extra : function (form,url) {
						return $http.post(base+'extra',
											 form,
											  {
												  method : 'POST',  
												  headers:{'Content-Type': 'application/x-www-form-urlencoded'}
											  }
											  );
					
					},
					getCountry : function (form,url) {
						return $http.post(base+'country',
											 form,
											  {
												  method : 'POST',  
												  headers:{'Content-Type': 'application/x-www-form-urlencoded'}
											  }
											  );
					},	
					showUserProfileDetailToAdmin : function (form,url) {
						return $http.post(base+'profile',
											 form,
											  {
												  method : 'POST',  
												  headers:{'Content-Type': 'application/x-www-form-urlencoded'}
											  }
											  );
					},
					updateCustomerStatusByAdmin : function (form,url) {
						return $http.post(base+'profile',
											 form,
											  {
												  method : 'POST',  
												  headers:{'Content-Type': 'application/x-www-form-urlencoded'}
											  }
											  );
						},
					
					updateUserProfileDetailByAdmin : function (form,url) {
						return $http.post(base+'profile',
											 form,
											  {
												  method : 'POST',  
												  headers:{'Content-Type': 'application/x-www-form-urlencoded'}
											  }
											  );
						},
					showUserDetailByAdmin : function (form,url) {
						return $http.post(base+'profile',
											 form,
											  {
												  method : 'POST',  
												  headers:{'Content-Type': 'application/x-www-form-urlencoded'}
											  }
											  );
					},
					searchCustomerBySearchTypeByAdmin : function (form,url) {
						return $http.post(base+'profile',
											 form,
											  {
												  method : 'POST',  
												  headers:{'Content-Type': 'application/x-www-form-urlencoded'}
											  }
											  );
						},
					searchUserBySearchTypeByAdmin : function (form,url) {
						return $http.post(base+'profile',
											 form,
											  {
												  method : 'POST',  
												  headers:{'Content-Type': 'application/x-www-form-urlencoded'}
											  }
											  );
						},
					updateUserStatusByAdmin : function (form,url) {
						return $http.post(base+'profile',
											 form,
											  {
												  method : 'POST',  
												  headers:{'Content-Type': 'application/x-www-form-urlencoded'}
											  }
											  );
						},
						
					updateCustomerImageByAdmin : function (form,url) {
						 var fd = new FormData();
							fd.append('file', form);
							//console.log(form);
							
						return $http.post(base+'profile',
											 fd,
											  {
												  method : 'POST', 
												  transformRequest: angular.identity,
												  headers:{'Content-Type': 'application/x-www-form-urlencoded'}
											  }
											  );
						},
					updateUserImageByAdmin : function (form,url) {
						 var fd = new FormData();
							fd.append('file', form);
							//console.log(form);
							
						return $http.post(base+'profile',
											 fd,
											  {
												  method : 'POST', 
												  transformRequest: angular.identity,
												  headers:{'Content-Type': 'application/x-www-form-urlencoded'}
											  }
											  );
						},
				
					addUserByAdmin : function (form,url) {
						return $http.post(base+'registration',
											 form,
											  {
												  method : 'POST',  
												  headers:{'Content-Type': 'application/x-www-form-urlencoded'}
											  }
											  );
					},
					
					addBooking : function (form,url) {
						return $http.post(base+'booking',
											 form,
											  {
												  method : 'POST',  
												  headers:{'Content-Type': 'application/x-www-form-urlencoded'}
											  }
											  );
					},
					
					editBooking : function (form,url) {
						return $http.post(base+'booking',
											 form,
											  {
												  method : 'POST',  
												  headers:{'Content-Type': 'application/x-www-form-urlencoded'}
											  }
											  );
					},
					bulkAllot : function (form,url) {
						return $http.post(base+'bulk_add_And_update',
											 form,
											  {
												  method : 'POST',  
												  headers:{'Content-Type': 'application/x-www-form-urlencoded'}
											  }
											  );
					},
					// Resend the mail to driver 	
					resendDriverMail  : function (form,url) {
						return $http.post(base+'booking',
											 form,
											  {
												  method : 'POST',  
												  headers:{'Content-Type': 'application/x-www-form-urlencoded'}
											  }
											  );
					},
					// Change the driver mode : Allocate,allot,Offer from edit booking page
					
					editDriverMode  : function (form,url) {
						return $http.post(base+'booking',
											 form,
											  {
												  method : 'POST',  
												  headers:{'Content-Type': 'application/x-www-form-urlencoded'}
											  }
											  );
					},
				
					updateUserByAdmin : function (form,url) {
						return $http.post(base+'update',
											 form,
											  {
												  method : 'POST',  
												  headers:{'Content-Type': 'application/x-www-form-urlencoded'}
											  }
											  );
					},
					
					signup : function (form,url) {
						return $http.post(base+'registration',
											 form,
											  {
												  method : 'POST',  
												  headers:{'Content-Type': 'application/x-www-form-urlencoded'}
											  }
											  );
					},

					addNewCustomerBooking: function (form,url) {
						return $http.post(base+'registration',
											 form,
											  {
												  method : 'POST',  
												  headers:{'Content-Type': 'application/x-www-form-urlencoded'}
											  }
											  );
					},
					
					
					getListing : function (form,url) {
						return $http.post(base+'listing',
											 form,
											  {
												  method : 'POST',  
												  headers:{'Content-Type': 'application/x-www-form-urlencoded'}
											  }
											  );
					},
					getInvoiceListing : function (form,url) {
						return $http.post(base+'invoice/listing',
											 form,
											  {
												  method : 'POST',  
												  headers:{'Content-Type': 'application/x-www-form-urlencoded'}
											  }
											  );
					},
					addNewInvoice	: function (form,url) {
						return $http.post(base+'invoice/add',
											 form,
											  {
												  method : 'POST',  
												  headers:{'Content-Type': 'application/x-www-form-urlencoded'}
											  }
											  );
					},
					updateInvoiceDetails	: function (form,url) {
						return $http.post(base+'invoice/update',
											 form,
											  {
												  method : 'POST',  
												  headers:{'Content-Type': 'application/x-www-form-urlencoded'}
											  }
											  );
					},
					resendInvoiceDetails	: function (form,url) {
						return $http.post(base+'invoice/resend',
											 form,
											  {
												  method : 'POST',  
												  headers:{'Content-Type': 'application/x-www-form-urlencoded'}
											  }
											  );
					},
					deleteInvoiceDetails	: function (form,url) {
						return $http.post(base+'delete',
											 form,
											  {
												  method : 'POST',  
												  headers:{'Content-Type': 'application/x-www-form-urlencoded'}
											  }
											  );
					},
					updateBusinessSetting	: function (form,url) {
						return $http.post('http://192.168.20.89:3400/'+url,
											 form,
											  {
												  method : 'POST',  
												  headers:{'Content-Type': 'application/json'}
											  }
											  );
					}
				}
    })
/**/
.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}])
// the service that retrieves some movie title from an url
.factory('invoice_line', function($http, $q, $timeout,$rootScope){
	var invoice_line = new Object();

	invoice_line.get_invoice_line = function(i) {
	var invoice_data = $q.defer();
	var invoice;
	var more_invoice = $rootScope.auto_complete_data
	if(i && i.indexOf('T')!=-1)
		invoice=more_invoice;
	else
		invoice=more_invoice;
	$timeout(function(){
		invoice_data.resolve(invoice);
	},500);
	return invoice_data.promise
	}
	return invoice_line;
});