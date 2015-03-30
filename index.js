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
							getUsernamesAndPasswords(config)
						}
					});
				}
			});
		}
	});
}

function getUsernamesAndPasswords(config) {
	var usernames = [];
	var passwords = [];

	usernames[0] = config.projectname;
	usernames[1] = config.projectname + getRandomDinoPass('simple');
	usernames[1] = config.projectname + getRandomDinoPass('simple');

	passwords[0] = getRandomDinoPass();
	passwords[1] = getRandomDinoPass();
	passwords[1] = getRandomDinoPass();

	config.usernames = usernames;
	config.passwords = passwords;

	buildConfig(config);
}

function getRandomDinoPass(strength) {
	var request = require('request');

	if(typeof strength === 'undefined') {
		strength = 'strong';
	}

	request('http://www.dinopass.com/password/' + strength, function (error, response, body) {
		if(!error && response.statusCode === 200) {
			return body;
		}
	});
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
	prompt.get([{name: 'projectname', required: true, description: 'Project name e.g. bloomagency' }], function (err, result) {
		//
		// Log the results.
		//

		var projectname = result.projectname;

		console.log('======================================');
		console.log('Local');
		console.log('======================================');
		prompt.get([{name: 'url', default: 'http://local.' + projectname + '.co.uk', required: true, description: 'Local URL' }, {name: 'hostname', default: 'vs-dev-1', description: 'Hostname'}, {name: 'username', default: config.usernames[0], description: 'Username'}, {name: 'password', default: config.passwords[0], description: 'Password'}, {name: 'database', description: 'Database name'}, {name: 'prefix', default: 'wp_', description: 'Table prefix'}, {name: 'development', default: 'http://' + projectname + '.developing.bloommedia.co.uk', required: true, description: 'Development URL' }], function(err, results) {
			var local = results;
			local.domain = local.url.replace(/^https?:\/\//, '');
			local.development_url = results.development;
			local.development_domain = local.development_url.replace(/^https?:\/\//, '');

			console.log('======================================');
			console.log('Staging');
			console.log('======================================');
			prompt.get([{name: 'url', required: true, default: 'http://' + projectname + '.staging.bloommedia.co.uk', description: 'Staging URL' }, {name: 'hostname', default: 'vs-dev-2', description: 'Hostname'}, {name: 'username', default: config.usernames[1], description: 'Username'}, {name: 'password', default: config.passwords[1], description: 'Password'}, {name: 'database', description: 'Database name'}, {name: 'prefix', default: 'wp_', description: 'Table prefix'}], function(err, results) {
				var staging = results;
				staging.domain = staging.url.replace(/^https?:\/\//, '');

				console.log('======================================');
				console.log('Live');
				console.log('======================================');
				prompt.get([{name: 'url', required: true, default: 'http://' + projectname + '.co.uk', description: 'Live URL' }, {name: 'hostname', default: 'localhost', description: 'Hostname'}, {name: 'username', default: config.usernames[2], description: 'Username'}, {name: 'password', default: config.passwords[2], description: 'Password'}, {name: 'database', description: 'Database name'}, {name: 'prefix', default: 'wp_', description: 'Table prefix'}], function(err, results) {
					var live = results;
					live.domain = live.url.replace(/^https?:\/\//, '');

					getSalts({'local': local, 'staging': staging, 'live': live});
				});
			});
		});
	});
}

getSettings();
