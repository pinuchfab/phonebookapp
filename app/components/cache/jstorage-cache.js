'use strict';

// jStorage wrapper module.
//
// Provides access to the local browser cache managed by jStorage.

(function(){
	// Parent module.
	angular.module('phone-book-app.jstorage-cache', [])
	
	// JStorageCache service. Provides bridge to jStorage via a "cache" variable.
	.service('JStorageCache', [ 
		function() 
		{
	    	this.cache = $.jStorage;
		}
	]);
})();