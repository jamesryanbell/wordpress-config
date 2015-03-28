'use strict';

function saveFile(filename, content, callback) {
	var fs = require('fs');
	fs.writeFile(filename, content, function(err) {
		if(err) {
			return console.log(err);
		}
	});
}

function getSalts(config) {
	var request = require('request');

	console.log('======================================');
	console.log('Retrieving salts');
	console.log('======================================');

	request('https://api.wordpress.org/secret-key/1.1/salt/', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			config.local.salts = body;
			request('https://api.wordpress.org/secret-key/1.1/salt/', function (error, response, body) {
				if (!error && response.statusCode == 200) {
					config.staging.salts = body;
					request('https://api.wordpress.org/secret-key/1.1/salt/', function (error, response, body) {
						if (!error && response.statusCode == 200) {
							config.live.salts = body;
							buildConfig(config);
						}
					});
				}
			});
		}
	})
}

function buildConfig(config) {
	var swig   = require('swig');
	var mkdirp = require('mkdirp');
	var fs     = require('fs');
	var del    = require('del');

	console.log('======================================');
	console.log('Creating config files');
	console.log('======================================');

	var tpl = swig.compileFile('./template/config.tmpl');
	var config_template = tpl(config);

	tpl = swig.compileFile('./template/local.tmpl');
	var local_template = tpl(config.local);

	tpl = swig.compileFile('./template/staging.tmpl');
	var staging_template = tpl(config.staging);

	tpl = swig.compileFile('./template/live.tmpl');
	var live_template = tpl(config.live);


	del(['./output'], function (err, deletedFiles) {
		mkdirp('./output', function (err) {
			if (err) {
				console.error(err)
			} else {
				fs.writeFile("./output/wp-config.php", config_template, function(err) {
					if(err) {
						return console.log(err);
					} else {
						saveFile('./output/wp-config.development.php', local_template);
						saveFile('./output/wp-config.staging.php', staging_template);
						saveFile('./output/wp-config.live.php', live_template);
					}
				});
			}
		});
	});
}

function getSettings() {
	var prompt = require('prompt');

	prompt.message = '';
	prompt.delimiter = '';

	//
	// Start the prompt
	//
	prompt.start();

	//
	// Get two properties from the user: username and email
	//
	console.log('======================================');
	console.log('Local');
	console.log('======================================');
	prompt.get([{name: 'local', required: true, description: 'Local URL' }, {name: 'development', required: true, description: 'Development URL' }], function (err, result) {
		//
		// Log the results.
		//
		console.log('======================================');
		console.log('Database connection');
		console.log('======================================');
		prompt.get([{name: 'hostname', description: 'Hostname'}, {name: 'username', description: 'Username'}, {name: 'password', description: 'Password'}, {name: 'database', description: 'Database name'}, {name: 'prefix', default: 'wp_', description: 'Table prefix'}], function(err, results) {
			var local = results;
			local.url = result.local;
			local.domain = local.url.replace(/^https?:\/\//, '');
			local.development_url = result.development;
			local.development_domain = local.development_url.replace(/^https?:\/\//, '');

			console.log('======================================');
			console.log('Staging');
			console.log('======================================');
			prompt.get([{name: 'staging', required: true, description: 'Staging URL' }], function (err, result) {
				//
				// Log the results.
				//
				console.log('======================================');
				console.log('Database connection');
				console.log('======================================');
				prompt.get([{name: 'hostname', description: 'Hostname'}, {name: 'username', description: 'Username'}, {name: 'password', description: 'Password'}, {name: 'database', description: 'Database name'}, {name: 'prefix', default: 'wp_', description: 'Table prefix'}], function(err, results) {
					var staging = results;
					staging.url = result.staging;
					staging.domain = staging.url.replace(/^https?:\/\//, '');

					console.log('======================================');
					console.log('Live');
					console.log('======================================');
					prompt.get([{name: 'live', required: true, description: 'Live URL' }], function (err, result) {
						//
						// Log the results.
						//
						console.log('======================================');
						console.log('Database connection');
						console.log('======================================');
						prompt.get([{name: 'hostname', description: 'Hostname'}, {name: 'username', description: 'Username'}, {name: 'password', description: 'Password'}, {name: 'database', description: 'Database name'}, {name: 'prefix', default: 'wp_', description: 'Table prefix'}], function(err, results) {
							var live = results;
							live.url = result.live;
							live.domain = live.url.replace(/^https?:\/\//, '');

							getSalts({'local': local, 'staging': staging, 'live': live});
						});
					});
				});
			});
		});
	});
}

getSettings();
