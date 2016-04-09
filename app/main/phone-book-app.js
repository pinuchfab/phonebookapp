'use strict';

// Main app module. 

(function(){
	// Parent module.
	var theApp = angular.module(
		'phone-book-app', 	
		[ 
			'ngSanitize',
			'ngResource',
			'ngRoute',
			'phone-book-app.jstorage-cache',
			'phone-book-app.http-client',
			'phone-book-app.server-api-service',
			'phone-book-app.login-signup',
			'phone-book-app.phone-books',
			'phone-book-app.phone-book',
			'phone-book-app.contacts',
			'phone-book-app.contact'
		]
	);

	// Broadcast event name constants.
	theApp.constant(
		'BROADCAST_EVENTS', 
		{
		    error: 'error'
		}
	);
	
	// Main app controller.
	theApp.controller('MainController', [ 	'$rootScope', 	'$scope', 	'JStorageCache',
        function(							 $rootScope, 	 $scope, 	 JStorageCache) 
        {
			// Can the user logout?
			$scope.canLogout = function()
			{
				return JStorageCache.cache.get("canLogout");
			};
			
		    // Logout. 
			$scope.logout = function() 
		    {
		        $rootScope.logout();
		    };
		} 
	]);
	
	// Routing.
	theApp.config([ '$routeProvider', 
	    function(	 $routeProvider) 
	    {
		    // Routing, this will trigger view/controller reload.
		    $routeProvider
		    .when(	'/phonebooks', 
		    		{
				        templateUrl : 	'components/phone-books/phone-books.html',
				        controller : 	'PhoneBooksController',
				        publicAccess : 	false
				    }
		    )
		    .when(	'/phonebook/:phoneBookId', 
		    		{
				        templateUrl : 	'components/phone-book/phone-book.html',
				        controller : 	'PhoneBookController',
				        publicAccess : 	false
				    }
		    )
		    .when(	'/contacts', 
		    		{
				        templateUrl : 	'components/contacts/contacts.html',
				        controller : 	'ContactsController',
				        publicAccess : 	false
				    }
		    )
		    .when(	'/contact/:contactId', 
		    		{
				        templateUrl : 	'components/contact/contact.html',
				        controller : 	'ContactController',
				        publicAccess : 	false
				    }
		    )
		    .when(	'/login-signup', 
		    		{
				        templateUrl : 	'components/login-signup/login-signup.html',
				        controller : 	'LoginSignupController',
				        publicAccess : 	true
				    }
		    )
		    .otherwise(
			    	{
			    		redirectTo : 	'/login-signup'
			    	}
		    );
		} 
	]);
	
	theApp.run([    '$rootScope',  '$route',   '$routeParams',     '$location',    '$q',   '$timeout',     'JStorageCache',     
	    function(    $rootScope,    $route,     $routeParams,       $location,      $q,     $timeout,       JStorageCache)
	    {
	        
	        // Internal navigation helper method, used by services and controllers to navigate to a different location.
	        // Returns a promise.
	        // Params:
	        // - location:      path to navigate to, e.g: "/user"
	        // - searchStr:     search string, e.g: "?orgId=xkxkx&.."
	        $rootScope.navigateTo = function(location, searchStr) 
	        {
	        	// Now, navigate to the location using angular.
                $location.path(location).search(searchStr ? searchStr : "");
	        };
	        
	        // Logout.
	        $rootScope.logout = function() 
	        {
	        	JStorageCache.cache.set("canLogout", false);
	        	$rootScope.navigateTo('/login-signup', null);
	        };
	    }
	]);
})();