'use strict';

// Contact module. 

(function(){
	// Parent module.
	angular.module('phone-book-app.contact', [])
	
	// Contact controller.
	.controller('ContactController', [ 	'$rootScope', '$scope', '$q', '$location',	'$route',   '$routeParams', 'ServerApiService', 'JStorageCache',
	    function(						 $rootScope,   $scope,   $q,   $location,    $route,   	 $routeParams,	 ServerApiService,   JStorageCache) 
	    {
			// Store route in scope.
        	$scope.$route = $route;
        	
		    // New phone.
		    $scope.phoneToAdd = 
		    {
		    	Number: "",
		    	Type: 10
		    };
		    
		    // Contact.
		    var contactId = $routeParams.contactId;
		    $scope.contact = 
		    {
		    	phones: [ {Number: "111", Type: 10}, {Number: "222", Type: 20} ]
		    };
		    
		    // Phone types.
		    $scope.phoneTypes =
		    {	
		    	10: "Home",
		    	20: "Work",
		    	30: "Mobile"
		    };
		    
		    // get phpne type as friendly text.
		    $scope.getPhoneTypeAsText = function(phoneType)
		    {
		    	if (!phoneType)
		    		throw "no valid phone type";
		    	
		    	return $scope.phoneTypes[phoneType];
		    }
		    
		    // Load contact phones.
		    var loadContactPhones = function()
		    {
		    	function handleLoadSuccess(phones)
		        {
		        	$scope.contact.phones = phones;
		        	return true;
		        }
		    	
		    	function handleLoadFail(error)
		        {
		        	alert("Failed to load phones for contact.");
		        	throw "Failed to load phones for contacts.";
		        }
		    	
		    	ServerApiService.getPhones($scope.contact.id)
	        		.then(handleLoadSuccess, handleLoadFail);
		    };
		    
		    // Load contact.
		    var loadContact = function()
		    {
		    	function handleLoadSuccess(contact)
		        {
		        	$scope.contact = contact;
		        	return true;
		        }
		    	
		        function handleLoadFail(error)
		        {
		        	alert("Failed to load contact.");
		        	throw "Failed to load contact";
		        }
		        
		    	ServerApiService.getContact(contactId)
	        		.then(handleLoadSuccess, handleLoadFail)
	        		.then(loadContactPhones);
		    }();
		    
		    // Add a phone.
		    $scope.onAddPhone = function()
		    {
		        function handleCreateSuccess(response)
		        {
		        	// Refresh.
		        	$rootScope.navigateTo("/contact/" + contactId);
		        	return true;
		        }
		
		        function handleCreateFail(error)
		        {
		        	alert("Failed to create phone.");
		        	throw "Failed to create phone.";
		        }
		        
		        ServerApiService.addPhoneToContact($scope.phoneToAdd.Number, $scope.contact.id, $scope.phoneToAdd.Type)
		        	.then(handleCreateSuccess, handleCreateFail);
		    };

		    // On phone save.
		    $scope.onSavePhone = function(phone)
		    {
		    	function handleSaveSuccess(response)
		        {
		        	// Refresh.
		    		$rootScope.navigateTo("/contact/" + contactId);
		        	return true;
		        }
		
		        function handleSaveFail(error)
		        {
		        	alert("Failed to save phone.");
		        	throw "Failed to save phone.";
		        }
		        
		        ServerApiService.updatePhone(phone.id, phone.Number, phone.Type)
		        	.then(handleSaveSuccess, handleSaveFail);
		    };
		    
		} 
	]);
})();