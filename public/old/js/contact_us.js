angular.module('ContactUs.controllers', ['udpCaptcha'])
.controller('ContactUs',function($scope,$rootScope,API,$captcha)
{
	$scope.contact_us_form={};
	/* Submit contact us */
	$scope.submit_contact_us=function()
	{
		if($captcha.checkResult($scope.resultado) == true)
		{
		 	alert("El captcha ha pasado la validación");
		}
		//si falla la validacion
		else
		{
		 	alert("Error, captcha incorrecto");
		}
		console.log($scope.contact_us_form);
	}
})