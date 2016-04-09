'use strict';

// Login/Signup module. 

(function(){
	// Parent module.
	angular.module('phone-book-app.login-signup', [])
	
	// Login controller.
	.controller('LoginSignupController', [ 	'$rootScope', '$scope', '$q', '$location', '$timeout', 'ServerApiService', 'JStorageCache',
	    function(						 	 $rootScope,   $scope,   $q,   $location,   $timeout,   ServerApiService,   JStorageCache) 
	    {
			// User credentials.
		    $scope.credentials = 
		    {
		        userId: 	"",
		        foreName:	"",
		        password: 	""
		    };
		    
		    $scope.title = "Please Login."
		
		    // Auto fill in.
		    $scope.credentials.userId = JStorageCache.cache.get("userId");
		    
		    // Reset canLogout flag.
		    JStorageCache.cache.set("canLogout", false);
		    
		    // Logout.
		    $scope.logout = function()
		    {
		    	$rootScope.logout();
		    };
		    
		    // Login.
		    $scope.onLogin = function(redirectTo)
		    {
		        function handleLoginSuccess(user)
		        {
		        	// Remember id.
		        	JStorageCache.cache.set("userId", $scope.credentials.userId);
		        	JStorageCache.cache.set("canLogout", true);
		        	
		        	$rootScope.navigateTo("/phonebooks");
		        	
		        	return user;
		        }
		
		        function handleLoginFail(error)
		        {
		        	//alert("Failed to login. Please signup first if you are a new user.");
		        	$rootScope.navigateTo("/phonebooks");
		        	JStorageCache.cache.set("canLogout", true);
		        }
		        
		        ServerApiService.login($scope.credentials.foreName, $scope.credentials.password)
		        	.then(handleLoginSuccess, handleLoginFail);
		    };
		    
		    // Signup.
		    $scope.signUp = function()
		    {
		        function handleSignUpSuccess(user)
		        {
		        	// Remember id.
		        	JStorageCache.cache.set("userId", $scope.credentials.userId);
		        	JStorageCache.cache.set("canLogout", true);
		        	
		        	
		        	$rootScope.navigateTo("/phonebooks");
		        	
		        	return user;
		        }
		
		        function handleSignUpFail(error)
		        {
		        	alert("Failed to sign up.")
		        }
		        
		        ServerApiService.createContact($scope.credentials.foreName, $scope.credentials.password)
		        	.then(handleSignUpSuccess, handleSignUpFail);
		    };
		} 
	]);
})();