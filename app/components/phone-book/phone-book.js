'use strict';

// PhoneBook module. 

(function(){
	// Parent module.
	angular.module('phone-book-app.phone-book', [])
	
	// PhoneBook controller.
	.controller('PhoneBookController', [ 	'$rootScope', '$scope', '$q', '$location',	'$route',   '$routeParams', 'ServerApiService', 'JStorageCache',
	    function(						 	 $rootScope,   $scope,   $q,   $location,    $route,   	 $routeParams,	 ServerApiService,   JStorageCache) 
	    {
			// Store route in scope.
        	$scope.$route = $route;
        	
			// Contacts.
        	$scope.contacts = 
		    [
		     	{id: "1111", foreName: "AAAA", surName: "AAA", phones: ["123", "1234"]},
		     	{id: "2222", foreName: "BBBB", surName: "BBB", phones: ["123", "1234"]},
		     	{id: "3333", foreName: "CCCC", surName: "CCC", phones: ["123", "1234"]},
		    ];
		    
		    // New contact.
		    $scope.contactToAdd = 
		    {
		    	id: ""
		    };
		    
		    // Phone book.
		    var phoneBookId = $routeParams.phoneBookId;
		    $scope.phoneBook = {};
		    
		    // Load all contacts.
		    var loadAllContacts = function()
		    {
		    	function handleLoadSuccess(contacts)
		        {
		    		// Filter out the contacts that are already in the phoneBook.
		    		$scope.contacts = contacts.filter(
		    			function(contact)
		    			{
		    				for (var index in $scope.phoneBook.contacts)
		    					if ($scope.phoneBook.contacts[index].contactId === contact.id)
		    						return false;
		    			}
		    		);
		        	return true;
		        }
		    	
		    	function handleLoadFail(error)
		        {
		        	alert("Failed to load contacts.");
		        	throw "Failed to load contacts.";
		        }
		    	
		    	ServerApiService.getAllContacts()
	        		.then(handleLoadSuccess, handleLoadFail);
		    };
		    
		    // Load phone book contacts.
		    var loadPhoneBookContacts = function(phoneBook)
		    {
		    	function handleLoadSuccess(contacts)
		        {
		        	$scope.phoneBook.contacts = contacts;
		        	return true;
		        }
		    	
		    	function handleLoadFail(error)
		        {
		        	alert("Failed to load contacts for phoneBook.");
		        	throw "Failed to load contacts for phoneBook.";
		        }
		    	
		    	ServerApiService.getPhoneBookContacts(phoneBookId)
	        		.then(handleLoadSuccess, handleLoadFail);
		    };
		    
		    // Load phone book.
		    var loadPhoneBook = function()
		    {
		    	function handleLoadSuccess(phoneBook)
		        {
		        	$scope.phoneBook = phoneBook;
		        	return true;
		        }
		    	
		        function handleLoadFail(error)
		        {
		        	alert("Failed to load phoneBook.");
		        	throw "Failed to load phoneBook";
		        }
		        
		    	ServerApiService.getPhoneBook(phoneBookId)
		    		.then(handleLoadSuccess, handleLoadFail)
	        		.then(loadPhoneBookContacts)
		        	.then(loadAllContacts);
		    }();
		    
		    // Add a contact.
		    $scope.onAddContact = function()
		    {
		        function handleCreateSuccess(response)
		        {
		        	// Refresh.
		        	$rootScope.navigateTo("/phonebook/" + phoneBookId);
		        	return true;
		        }
		
		        function handleCreateFail(error)
		        {
		        	alert("Failed to create contact.");
		        	throw "Failed to create contact.";
		        }
		        
		        ServerApiService.addContactToPhoneBook($scope.contactToAdd.id, $scope.phoneBook.id)
		        	.then(handleCreateSuccess, handleCreateFail);
		    };
		    
		    // On contact click.
		    $scope.onContactClick = function(contact)
		    {
		    	// Go to contact.
	        	$rootScope.navigateTo("/contact/" + contact.id);
		    };
		    
		    // On phone book save.
		    $scope.onSavePhoneBook = function(phoneBook)
		    {
		    	function handleSaveSuccess(response)
		        {
		        	// Refresh.
		        	$rootScope.navigateTo("/phonebook/" + phoneBookId);
		        	return true;
		        }
		
		        function handleSaveFail(error)
		        {
		        	alert("Failed to save phone book.");
		        	throw "Failed to save phone book.";
		        }
		        
		        ServerApiService.updatePhoneBook($scope.phoneBook.id, $scope.phoneBook.name)
		        	.then(handleSaveSuccess, handleSaveFail);
		    };
		} 
	]);
})();