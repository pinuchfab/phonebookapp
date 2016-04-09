'use strict';

// Http client module. 
//
// Provides an api for all http requests.

(function(){
	// Parent module.
	angular.module("phone-book-app.http-client", [])
	
	// We got three servers.
	.constant(
		"SERVERS",
		[
		 	"http://localhost:5001"
//		 	"http://localhost:5002",
//		 	"http://localhost:5003"
		]
	)
	
	// Http client interceptor.
	// The interceptor gives us a chance to process response before they get dispatched as promises to higher levels.
	.config([ 		'$httpProvider', 
	    function(	 $httpProvider) 
	    {
	    	$httpProvider.interceptors.push([ 	'$rootScope', '$q', 'JStorageCache', 
	            function(						 $rootScope,   $q,   JStorageCache) 
			    {
			    	return {
			            // Something went wrong (http error).
			            responseError : 	function(rejection) 
			            					{
								               //alert(rejection);
								                
								                // Default behaviour, reject the request.
								                return $q.reject(rejection);
								            },
				        response : 			function(response) 
				        					{
								                return response;
								            },
				        request : 			function(config) 
				        					{
								                if (!config.params)
								                    config.params = {};
								                
								            	if (config.method === "POST" || config.method === "PUT")
								            	{	
								            		// For all POSTs and PUTs, convert all parameters to be in the body of the message, 
								            		// rather than in the URL, so that we are doing a form post request.  
								            		// If there is any data in the body, convert that to be a parameter as well.
								            		var body = "";
								            		for (var paramName in config.params)
								            		{
								            			var paramValue = config.params[paramName];
								            			if (jQuery.type(paramValue) !== 'string')
								            				paramValue = angular.toJson(paramValue);
								            			
								            			if (body)
								            				body += '&';
								
								            			body += encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
								            		}
								            		config.params = {};
								            		
								            		var data = config.data;
								            		if (data)
								            		{
								            			// We shouldn't have data body, but just in case, put it into a parameter.
								            			if (jQuery.type(data) !== 'string')
								            				data = angular.toJson(data);
								            			
								            			if (body)
								            				body += '&';
								
								            			body += '_data=' + encodeURIComponent(data);
								            		}
								            		config.data = body;
								            		config.headers = config.headers || {};
								            		config.headers["Content-Type"] = "application/x-www-form-urlencoded";
								            	}
								                
								                return config;
								            }
			        };
			    }
	    	]);
	    }
	])
	
	// The actual http client service. 
	.factory('HttpClientService', [ '$http', 'JStorageCache',	'SERVERS',	'$q', 
	   function(					 $http,   JStorageCache,	 SERVERS,	 $q) 
	   {
			var httpClientService = {};
			
			// GET.
			httpClientService.doGet = function(path, httpConfig)
			{
				var getFromServer = function(server, path)
				{
					var promise = $http.get(
						server + path,
						httpConfig)
							.then(
								function(result) 
								{
									// Return the data part.
									return result.data;
								},
								function(error)
								{
									// return an empty array
									return [];
								}
							);
					
					return promise;
				};
				
				var result = [];
				var promisesArr = [];
				
				for(var i = 0; i < SERVERS.length; i++)
					promisesArr.push(getFromServer(SERVERS[i], path));
				
				// Wait for all.
				return $q.all(promisesArr)
					.then(
						function(resultArr)
						{
							for(var i = 0; i < resultArr.length; i++)
								if (resultArr[i])
									result = result.concat(resultArr[i]);
							
							if (result.length === 0)
								return $q.reject("No Result");
						}
					);
			};
			
			// PUT.
			httpClientService.doPut = function(path, httpConfig /*, data*/ )
			{
				var putToServer = function(server, path)
				{
					var promise = $http.put(
						server + path,
						null,	// Data part not used as all is passed as body parameters via httpConfig. 
						httpConfig)
							.then(
								function(result) 
								{
									// Return the data part.
									return result.data;
								}
							);
					
					return promise;
				};
				
				var result = [];
				var promisesArr = [];
				
				for(var i = 0; i < SERVERS.length; i++)
					promisesArr.push(putToServer(SERVERS[i], path));
				
				// Wait for all.
				return $q.all(promisesArr)
					.then(
						function(resultArr)
						{
							var success = false;
							
							// Check one put succeeded.
							for(var i = 0; i < resultArr.length; i++)
								if (resultArr[i] && resultArr[i].ok)
									success = true;
							
							if (!success)
								return $q.reject("Fail to put");
						}
					);
			};
			
			// POST.
			httpClientService.doPost = function(path, httpConfig /*, data*/ )
			{
				return $http.post(
					SERVERS[0] + path,
					null,	// Data part not used as all is passed as body parameters via httpConfig. 
					httpConfig)
						.then(
							function(result) 
							{
								// Return the data part.
								return result.data;
							}
						);
			};
			
			return httpClientService;
		}
	]);
})();
