module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        compass: {
        	dev: {
        		// Sass compile for development.
        		options: {
        			sassDir:		'app/main',
        			cssDir:			'app/generated',
        			environment:	'development',
        			specify:		'app/main/main.scss',
        			outputStyle:	'expanded',
        			banner:			'/* \n * THIS FILE IS GENERATED FROM SCSS FILES.\n * DO NOT EDIT.  Edit the source .scss files instead.\n */\n'
        		}
        	},
        	clean: {
        		// Sass destination and cache clean.
        		options: {
	    			sassDir:		'app/main',
	    			cssDir:			'app/generated',
	    			environment:	'production',
	    			specify:		'app/main/main.scss',
	    			clean:			true
        		}
        	},
        	dist: {
        		// Sass compile for distribution.
        		options: {
        			sassDir:		'app/main',
        			cssDir:			'app/generated',
        			environment:	'production',
        			specify:		'app/main/main.scss',
        			outputStyle:	'compressed',      			
        		}
        	}
        }
    });

    // Load the plugin that provides the "compass" task - for compiling Sass files.
    grunt.loadNpmTasks('grunt-contrib-compass');
    
    // Task to run a clean Sass build for distribution.
    grunt.registerTask('sass-clean-dist', ['compass:clean', 'compass:dist']);
    
    // Task to run a clean Sass build for development.
    grunt.registerTask('sass-clean-dev', ['compass:clean', 'compass:dev']);   
    
    // Default task(s).
    grunt.registerTask('default', [ 'sass-clean-dist' ]);
};