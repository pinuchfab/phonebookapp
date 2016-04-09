'use strict';

// PhoneBooks module. 

(function(){
	// Parent module.
	angular.module('phone-book-app.phone-books', [])
	
	// PhoneBooks controller.
	.controller('PhoneBooksController', [ 	'$rootScope', '$scope', '$q', '$location',	'ServerApiService', 'JStorageCache',
	    function(						 	 $rootScope,   $scope,   $q,   $location,    ServerApiService,   JStorageCache) 
	    {
			// Phone books.
		    $scope.phoneBooks = 
		    [
		     	{id: "1111", name: "AAAA"},
		     	{id: "2222", name: "BBBB"},
		     	{id: "3333", name: "CCCC"},
		    ];
		    
		    // New phone book.
		    $scope.phoneBookToAdd = 
		    {
		    	name: ""
		    };
		    
		    // Add a phone book.
		    $scope.onAddPhoneBook = function()
		    {
		        function handleCreateSuccess(user)
		        {
		        	// Refresh.
		        	$rootScope.navigateTo("/phonebooks");
		        }
		
		        function handleCreateFail(error)
		        {
		        	alert("Failed to create phone book.");
		        }
		        
		        ServerApiService.createPhoneBook($scope.phoneBookToAdd.name, JStorageCache.cache.get("userId"))
		        	.then(handleCreateSuccess, handleCreateFail);
		    };
		    
		    // On phone book click.
		    $scope.onPhoneBookClick = function(phoneBook)
		    {
		    	// Go to phone book.
	        	$rootScope.navigateTo("/phonebook/" + phoneBook.id);
		    };
		    
		    // Load all phone books for user.
		    var loadAllPhoneBooks = function()
		    {
		    	function handleLoadSuccess(phoneBooks)
		        {
		    		$scope.phoneBooks = phoneBooks;
		        	return true;
		        }
		    	
		    	function handleLoadFail(error)
		        {
		        	alert("Failed to load phone books.");
		        	throw "Failed to load phone books.";
		        }
		    	
		    	ServerApiService.getAllPhoneBooks(JStorageCache.cache.get("userId"))
	        		.then(handleLoadSuccess, handleLoadFail);
		    }();
		} 
	]);
})();