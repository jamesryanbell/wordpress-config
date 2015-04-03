#!/usr/bin/env node

'use strict';

var chalk  = require('chalk');
var path = require('path');
var appDir = path.dirname(require.main.filename);

function saveFile(filename, content, cb) {
	var fs = require('fs');
	fs.writeFile(path.join(appDir, filename), content, function(err) {
		if(err) {
			return console.log(err);
		}
		cb();
	});
}

function getSalts(config) {
	var request = require('request');

	console.log(chalk.cyan('======================================'));
	console.log(chalk.cyan('Retrieving salts'));
	console.log(chalk.cyan('======================================'));

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
	});
}

function getUsernamesAndPasswords(projectname, cb) {
	var async = require('async');

	console.log(chalk.cyan('======================================'));
	console.log(chalk.cyan('Generating usernames and passwords'));
	console.log(chalk.cyan('======================================'));

	async.parallel([
		function(callback) {
			getRandomDinoPass('simple', callback)
		},
		function(callback) {
			getRandomDinoPass('simple', callback)
		},
		function(callback) {
			getRandomDinoPass('simple', callback)
		},
		function(callback) {
			getRandomDinoPass('strong', callback)
		},
		function(callback) {
			getRandomDinoPass('strong', callback)
		},
		function(callback) {
			getRandomDinoPass('strong', callback)
		}
	],
	function(err, results) {
		var usernames = [];
		var passwords = [];
		var config = {};
		config.projectname = projectname;

		usernames[0] = config.projectname;
		usernames[1] = config.projectname + '_' + results[0];
		usernames[2] = config.projectname + '_' + results[1];

		passwords[0] = results[2];
		passwords[1] = results[3];
		passwords[2] = results[4];

		config.passwords = passwords;
		config.usernames = usernames;

		cb(config);
	});
}

function getRandomDinoPass(strength, callback) {
	var rp = require('request-promise');

	if(typeof strength == 'undefined') {
		var strength = 'strong';
	}

	rp('http://www.dinopass.com/password/' + strength)
	.then(function (response) {
		callback(null, response);
	}, null);
}

function buildConfig(config) {
	var swig   = require('swig');
	var mkdirp = require('mkdirp');
	var fs     = require('fs');
	var del    = require('del');

	console.log(chalk.cyan('======================================'));
	console.log(chalk.cyan('Creating config files'));
	console.log(chalk.cyan('======================================'));

	var tpl = swig.compileFile('./template/config.tmpl');
	var config_template = tpl(config);

	tpl = swig.compileFile('./template/local.tmpl');
	var local_template = tpl(config.local);

	tpl = swig.compileFile('./template/staging.tmpl');
	var staging_template = tpl(config.staging);

	tpl = swig.compileFile('./template/live.tmpl');
	var live_template = tpl(config.live);


	var fileCount = 0;
	function allDone(fileCount) {
		if(fileCount === 2) {
			console.log(chalk.cyan('======================================'));
			console.log(chalk.cyan('All done!'));
			console.log(chalk.cyan('======================================'));
		}
	};

	del(['./output'], function (err, deletedFiles) {
		mkdirp('./output', function (err) {
			if (err) {
				console.error(err)
			} else {
				fs.writeFile("./output/wp-config.php", config_template, function(err) {
					if(err) {
						return console.log(chalk.red(err));
					} else {
						saveFile('./output/wp-config.development.php', local_template, function() { allDone(fileCount++) });
						saveFile('./output/wp-config.staging.php', staging_template, function() { allDone(fileCount++) });
						saveFile('./output/wp-config.live.php', live_template, function() { allDone(fileCount++) });
					}
				});
			}
		});
	});
}

function getSettings() {

	var prompt = require('prompt');

	var wp = [
			'',
			chalk.bold.yellow('          Wordpress Config Generator'),
			'',
			chalk.grey('                 ..::::::::::::..'),
			chalk.grey('             .:::   ')  + chalk.cyan('::::::::::')                          + chalk.grey('   ::..'),
			chalk.grey('           .:    ')     + chalk.cyan(':::::::::::::::')                     + chalk.grey('    :..'),
			chalk.grey('         .:   ')        + chalk.cyan(':::::::::::::::::::::')               + chalk.grey('   :.'),
			chalk.grey('        .:  ')          + chalk.cyan('::::::::::::::::::::::')              + chalk.grey('     :..'),
			chalk.grey('       .:  ')           + chalk.cyan('::::::::::::::::::::::')              + chalk.grey('       ::.'),
			chalk.grey('      .:         ')     + chalk.cyan(':::          :::')                    + chalk.grey('        :..'),
			chalk.grey('     .:       ')        + chalk.cyan('::::::::     :::::::')                + chalk.grey('        :.'),
			chalk.grey('     :  ')              + chalk.cyan(':      :::::::      :::::::     :')   + chalk.grey('  :.'),
			chalk.grey('    .:  ')              + chalk.cyan('::     ::::::::     :::::::    ::')   + chalk.grey('  :.'),
			chalk.grey('    :: ')               + chalk.cyan('::::     :::::::      :::::::   :::') + chalk.grey(' ::'),
			chalk.grey('    :: ')               + chalk.cyan('::::     ::::::::     :::::::   :::') + chalk.grey(' ::'),
			chalk.grey('    :: ')               + chalk.cyan(':::::     :::::::      ::::::  ::::') + chalk.grey(' ::'),
			chalk.grey('    :: ')               + chalk.cyan(':::::     ::::::       ::::::  ::::') + chalk.grey(' :.'),
			chalk.grey('    .:  ')              + chalk.cyan(':::::     :::::  ::    ::::  ::::')   + chalk.grey('  :.'),
			chalk.grey('     :  ')              + chalk.cyan('::::::     :::   ::    ::::  ::::')   + chalk.grey('  :.'),
			chalk.grey('     .:  ')             + chalk.cyan(':::::     ::   :::     ::  ::::')     + chalk.grey('  :.'),
			chalk.grey('      .:  ')            + chalk.cyan(':::::        :::::    ::  :::')       + chalk.grey('  ::.'),
			chalk.grey('      .::  ')           + chalk.cyan('::::       ::::::       :::')         + chalk.grey('  ::.'),
			chalk.grey('        .:  ')          + chalk.cyan('::::     ::::::::     :::')           + chalk.grey('  ::.'),
			chalk.grey('         .:   ')        + chalk.cyan('::    :::::::::    ::')               + chalk.grey('   :.'),
			chalk.grey('          .::      ')   + chalk.cyan('::::::::::')                          + chalk.grey('      ::.'),
			chalk.grey('            ..::    ') + chalk.cyan('::::::::')                             + chalk.grey('    ::..'),
			chalk.grey('               ..:::..     ..:::..'),
			chalk.grey('                    ..:::::.. '),
			''
		].join('\n');

	console.log(wp);

	console.log(chalk.cyan('======================================'));
	console.log(chalk.cyan('Configuration setup wizard'));
	console.log(chalk.cyan('======================================'));

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

		if(result && result.projectname) {
			var projectname = result.projectname;

			getUsernamesAndPasswords(projectname, function(config) {

				console.log(chalk.cyan('======================================'));
				console.log(chalk.cyan('Local'));
				console.log(chalk.cyan('======================================'));
				prompt.get([{name: 'url', default: 'http://local.' + projectname + '.co.uk', required: true, description: 'Local URL' }, {name: 'hostname', default: 'vs-dev-1', description: 'Hostname'}, {name: 'username', default: config.usernames[0], description: 'Username'}, {name: 'password', default: config.passwords[0], description: 'Password'}, {name: 'database', description: 'Database name', default: config.projectname}, {name: 'prefix', default: 'wp_', description: 'Table prefix'}, {name: 'development', default: 'http://' + projectname + '.developing.bloommedia.co.uk', required: true, description: 'Development URL' }], function(err, results) {
					if(results && results.url) {
						var local = results;
						local.domain = local.url.replace(/^https?:\/\//, '');
						local.development_url = results.development;
						local.development_domain = local.development_url.replace(/^https?:\/\//, '');

						console.log(chalk.cyan('======================================'));
						console.log(chalk.cyan('Staging'));
						console.log(chalk.cyan('======================================'));
						prompt.get([{name: 'url', required: true, default: 'http://' + projectname + '.staging.bloommedia.co.uk', description: 'Staging URL' }, {name: 'hostname', default: 'vs-dev-2', description: 'Hostname'}, {name: 'username', default: config.usernames[1], description: 'Username'}, {name: 'password', default: config.passwords[1], description: 'Password'}, {name: 'database', description: 'Database name', default: config.projectname}, {name: 'prefix', default: 'wp_', description: 'Table prefix'}], function(err, results) {
							if(results && results.url) {
								var staging = results;
								staging.domain = staging.url.replace(/^https?:\/\//, '');

								console.log(chalk.cyan('======================================'));
								console.log(chalk.cyan('Live'));
								console.log(chalk.cyan('======================================'));
								prompt.get([{name: 'url', required: true, default: 'http://' + projectname + '.co.uk', description: 'Live URL' }, {name: 'hostname', default: 'localhost', description: 'Hostname'}, {name: 'username', default: config.usernames[2], description: 'Username'}, {name: 'password', default: config.passwords[2], description: 'Password'}, {name: 'database', description: 'Database name', default: config.projectname}, {name: 'prefix', default: 'wp_', description: 'Table prefix'}], function(err, results) {
									if(results && results.url) {
										var live = results;
										live.domain = live.url.replace(/^https?:\/\//, '');

										getSalts({'local': local, 'staging': staging, 'live': live});
									}
								});
							}
						});
					}
				});
			});
		}
	});
}

getSettings();
