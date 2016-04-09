'use strict';

// ServerApi api module.
//
// Everything we need to interact with the phone book app server.
 
(function(){
	// Parent module.
	angular.module("phone-book-app.server-api-service", [])

	// ServerApiService.
	.factory('ServerApiService', [ 	'$rootScope', '$http', '$location',    '$q',   'HttpClientService',    'JStorageCache',    'BROADCAST_EVENTS',
        function(					 $rootScope,   $http,   $location,      $q,     HttpClientService,      JStorageCache,      BROADCAST_EVENTS) 
        {
            var serverApiService = {};
            
            //
            // Login.
            //

            // Login to server, this returns a promise.
            serverApiService.login = function(name, password) 
            {
            	var httpConfig = 
            	{
        			params: 
        			{
        				foreName: name,
        				password: password
        			}
            	};
            	
                return HttpClientService.doPost("/contact/", httpConfig)
                	.then(
		                // Success.
		                function(user) 
		                {
		                    return user;
		                },
		                // Error.
		                function(error) 
		                {
		                	throw error;
		                }
                	);
            };
            
            //
            // Phone book.
            //
            
            // Get all phone books for given user id.
            serverApiService.getAllPhoneBooks = function(userId) 
		    {
		    	var httpConfig = 
		    	{
	        		params: 
	        		{
	        			id: userId
	        		}
	            };
		        return HttpClientService.doGet("/phoneBookContact?relType=10&contactId=" + encodeURIComponent(userId), httpConfig)
		        	.then(
		        		function(phoneBooks) 
			        	{
			        		return phoneBooks;
			        	}
		        	);
		    };
		
		    // Get a specific phone book.
		    serverApiService.getPhoneBook = function(phoneBookId) 
		    {
		        return HttpClientService.doGet("/phoneBook/" + encodeURIComponent(phoneBookId))
		        	.then(
		        		function(phoneBook)
		        		{
		        			return phoneBook;
		        		}
		        	);
		    };
		    
		    // Get contacts for the given phoneBook.
		    serverApiService.getPhoneBookContacts = function(phoneBookId) 
		    {
		        return HttpClientService.doGet("/phoneBookContact?relType=20&phoneBookId=" + encodeURIComponent(phoneBookId))
		        	.then(
		        		function(contacts)
		        		{
		        			return contacts;
		        		}
		        	);
		    };
		
		    // Create a new phone book for the given user id.
		    serverApiService.createPhoneBook = function(name, userId) 
		    {
		    	// Convert to ISO string.
		    	var date = new Date().toISOString();
		    	
		    	var httpConfig = 
		    	{
		    		params: 
		    		{
		    			name: name,
		    			dateCreated: date
		    		}
		        };
		        return HttpClientService.doPost("/phoneBook/", httpConfig)
		        	.then(
		        		function(id) 
		        		{
		        			// Now assign ownership.
		        			return assignOwnerToPhoneBook(id /* phoneBook id */, userId);
		        		}
		        	)
		    };
		
		    // Update an existing phone book.
		    serverApiService.updatePhoneBook = function(phoneBookId, name) 
		    {
		    	var httpConfig = 
		    	{
		    		params: 
		    		{
		    			name: name
		    		}
		        };
		        return HttpClientService.doPut("/phoneBook/" + encodeURIComponent(phoneBookId), httpConfig)
		        	.then(
		        		function(result) 
		        		{
		        			// ?? Nothing to do really.
		        		}
		        	);
		    };
		    
		    // Assign owner to a phone book.
		    serverApiService.assignOwnerToPhoneBook = function(contactId, phoneBookId) 
		    {
		    	var httpConfig = 
		    	{
		    		params: 
		    		{
		    			contactId: contactId,
		    			phoneBookId: phoneBookId,
		    			relationType: 10
		    		}
		        };
		        return HttpClientService.doPost("/phoneBookContact/", httpConfig)
		        	.then(
		        		function(result) 
		        		{
		        			// ?? Nothing to do really.
		        		}
		        	);
		    };
		    
		    // Add an existing contact to the given phoneBook.
		    serverApiService.addContactToPhoneBook = function(contactId, phoneBookId) 
		    {
		    	var httpConfig = 
		    	{
		    		params: 
		    		{
		    			contactId: contactId,
		    			phoneBookId: phoneBookId,
		    			relationType: 20
		    		}
		        };
		        return HttpClientService.doPost("/phoneBookContact/", httpConfig)
		        	.then(
		        		function(result) 
		        		{
		        			// ?? Nothing to do really.
		        		}
		        	);
		    };
		    
            //
            // Contact.
            //
            
            // Get all contacts.
		    serverApiService.getAllContacts = function() 
		    {
		    	var httpConfig = 
		    	{
	            };
		        return HttpClientService.doGet("/contact/", httpConfig)
		        	.then(
		        		function(contacts) 
			        	{
			        		return contacts;
			        	}
		        	);
		    };
		
		    // Get a specific contact.
		    serverApiService.getContact = function(contactId) 
		    {
		        return HttpClientService.doGet("/contact/" + encodeURIComponent(contactId))
		        	.then(
		        		function(contact)
		        		{
		        			return contact;
		        		}
		        	);
		    };
		
		    // Create a new contact.
		    serverApiService.createContact = function(foreName, surName) 
		    {
		    	var httpConfig = 
		    	{
		    		params: 
		    		{
		    			surName: surName,
		    			foreName: foreName
		    		}
		        };
		        return HttpClientService.doPost("/contact/", httpConfig)
		        	.then(
		        		function(id) 
		        		{
		        			return id;
		        		}
		        	);
		    };
				
		    // Update an existing contact.
		    serverApiService.updateContact = function(contactId, foreName, surName) 
		    {
		    	var httpConfig = 
		    	{
		    		params: 
		    		{
		    			surName: surName,
		    			foreName: foreName
		    		}
		        };
		        return HttpClientService.doPut("/contact/" + encodeURIComponent(contactId), httpConfig)
		        	.then(
		        		function(result) 
		        		{
		        			// ?? Nothing to do really.
		        		}
		        	);
		    };
		    
		    //
		    // Phone.
		    //
		    
		    // Get all phones for given contact.
		    serverApiService.getPhones = function(contactId) 
		    {
		        return HttpClientService.doGet("/phone")
		        	.then(
		        		function(phones)
		        		{
		        			// Only keep phones for the given contact.
		        			return phones.filter(
		        				function(phone)
		        				{
		        					if (phone.contactId === contactId)
		        						return true;
		        				}
		        			);
		        		}
		        	);
		    };
		    
		    // Add phone to the given contact.
		    serverApiService.addPhoneToContact = function(phoneNumber, contactId, phoneType) 
		    {
		    	var httpConfig = 
		    	{
		    		params: 
		    		{
		    			contactId: contactId,
		    			Number: phoneNumber,
		    			Type: phoneType
		    		}
		        };
		        return HttpClientService.doPost("/phone/", httpConfig)
		        	.then(
		        		function(id) 
		        		{
		        			return id;
		        		}
		        	);
		    };
		    
		    // Update an existing phone.
		    serverApiService.updatePhone = function(phoneId, phoneNumber, phoneType) 
		    {
		    	var httpConfig = 
		    	{
		    		params: 
		    		{
		    			Number: phoneNumber,
		    			Type: phoneType
		    		}
		        };
		        return HttpClientService.doPut("/phone/" + encodeURIComponent(phoneId), httpConfig)
		        	.then(
		        		function(result) 
		        		{
		        			// ?? Nothing to do really.
		        		}
		        	);
		    };
            
            return serverApiService;
        } 
	]);
})();
