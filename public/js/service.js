angular.module('lottoService.services', [])
    .factory('API', function ( $http) {
<<<<<<< HEAD
	var base = "http://45.55.56.22:3000/api/";
=======
	var base = "http://45.55.56.22:3000/";
>>>>>>> 3d62b7bcf9555e4b3da8d78977fd60a8a1d0ccc4
        return {
					get_details : function (url) {
						return $http.get(base+url,
											  {
												  method : 'GET',  
												  headers:{'Content-Type': 'application/x-www-form-urlencoded'}
											  }
											  );
						
					},
					post_details : function (form,url) {
						return $http.post(base+url,
											 form,
											  {
												  method : 'POST',  
												  headers:{'Content-Type': 'application/x-www-form-urlencoded'}
											  }
											  );
						
					}
				}
    });
