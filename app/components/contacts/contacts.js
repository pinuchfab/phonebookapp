'use strict';

// Contacts module. 

(function(){
	// Parent module.
	angular.module('phone-book-app.contacts', [])
	
	// Contacts controller.
	.controller('ContactsController', [ 	'$rootScope', '$scope', '$q', '$location',	'ServerApiService', 'JStorageCache',
	    function(						 	 $rootScope,   $scope,   $q,   $location,    ServerApiService,   JStorageCache) 
	    {
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
		    	foreName: "",
		    	surName: ""
		    };
		    
		    // Add a contact.
		    $scope.onAddContact = function()
		    {
		        function handleCreateSuccess(response)
		        {
		        	// Refresh.
		        	$rootScope.navigateTo("/contacts");
		        }
		
		        function handleCreateFail(error)
		        {
		        	alert("Failed to create contact.");
		        	throw "Failed to create contact.";
		        }
		        
		        ServerApiService.createContact($scope.contactToAdd.foreName, $scope.contactToAdd.surName)
		        	.then(handleCreateSuccess, handleCreateFail);
		    };
		    
		    // On contact click.
		    $scope.onContactClick = function(contact)
		    {
		    	// Go to contact.
	        	$rootScope.navigateTo("/contact/" + contact.id);
		    };
		    
		    // Load all contacts.
		    var loadAllContacts = function()
		    {
		    	function handleLoadSuccess(contacts)
		        {
		    		$scope.contacts = contacts;
		        	return true;
		        }
		    	
		    	function handleLoadFail(error)
		        {
		        	alert("Failed to load contacts.");
		        	throw "Failed to load contacts.";
		        }
		    	
		    	ServerApiService.getAllContacts()
	        		.then(handleLoadSuccess, handleLoadFail);
		    }();
		} 
	]);
})();