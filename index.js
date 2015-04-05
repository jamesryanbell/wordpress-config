#!/usr/bin/env node

'use strict';

var chalk  = require('chalk');
var path = require('path');

function saveFile(filename, content, cb) {
	var fs = require('fs');
	fs.writeFile(filename, content, function(err) {
		if(err) {
			return console.log(err);
		}
		cb();
	});
}

function getSalt(callback) {
	var rp = require('request-promise');

	rp('https://api.wordpress.org/secret-key/1.1/salt/')
	.then(function (response) {
		callback(null, response);
	}, null);
}

function getSalts(config) {
	var async = require('async');

	console.log(chalk.cyan('---------------------------------------'));
	console.log(chalk.cyan('            Retrieving salts'));
	console.log(chalk.cyan('---------------------------------------'));

	async.parallel([
		function(callback) {
			getSalt(callback)
		},
		function(callback) {
			getSalt(callback)
		},
		function(callback) {
			getSalt(callback)
		}
	],
	function(err, results) {
		config.local.salts = results[0];
		config.staging.salts = results[1];
		config.live.salts = results[2];
		buildConfig(config);
	});
}

function getUsernamesAndPasswords(projectname, cb) {
	var async = require('async');

	console.log(chalk.cyan('---------------------------------------'));
	console.log(chalk.cyan('   Generating usernames and passwords'));
	console.log(chalk.cyan('---------------------------------------'));

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

	console.log(chalk.cyan('---------------------------------------'));
	console.log(chalk.cyan('          Creating config files'));
	console.log(chalk.cyan('---------------------------------------'));

	var appDir = path.dirname(require.main.filename);
	var templateDir = path.join(appDir, 'template');

	var tpl = swig.compileFile(path.join(templateDir, 'config.tmpl'));
	var config_template = tpl(config);

	tpl = swig.compileFile(path.join(templateDir, 'local.tmpl'));
	var local_template = tpl(config.local);

	tpl = swig.compileFile(path.join(templateDir, 'staging.tmpl'));
	var staging_template = tpl(config.staging);

	tpl = swig.compileFile(path.join(templateDir, 'live.tmpl'));
	var live_template = tpl(config.live);

	var fileCount = 0;
	function allDone(fileCount) {
		if(fileCount === 2) {
			console.log(chalk.cyan('---------------------------------------'));
			console.log(chalk.cyan('                All done!'));
			console.log(chalk.cyan('---------------------------------------'));
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

	var inquirer = require("inquirer");
	var slug     = require('slug');

	var wp = [
			'',
			chalk.bold.yellow('     Wordpress Config Generator'),
			'',
			chalk.grey('             ..::::::::::::..'),
			chalk.grey('         .:::   ')  + chalk.cyan('::::::::::')                          + chalk.grey('   ::..'),
			chalk.grey('       .:    ')     + chalk.cyan(':::::::::::::::')                     + chalk.grey('    :..'),
			chalk.grey('     .:   ')        + chalk.cyan(':::::::::::::::::::::')               + chalk.grey('   :.'),
			chalk.grey('    .:  ')          + chalk.cyan('::::::::::::::::::::::')              + chalk.grey('     :..'),
			chalk.grey('   .:  ')           + chalk.cyan('::::::::::::::::::::::')              + chalk.grey('       ::.'),
			chalk.grey('  .:         ')     + chalk.cyan(':::          :::')                    + chalk.grey('        :..'),
			chalk.grey(' .:       ')        + chalk.cyan('::::::::     :::::::')                + chalk.grey('        :.'),
			chalk.grey(' :  ')              + chalk.cyan(':      :::::::      :::::::     :')   + chalk.grey('  :.'),
			chalk.grey('.:  ')              + chalk.cyan('::     ::::::::     :::::::    ::')   + chalk.grey('  :.'),
			chalk.grey(':: ')               + chalk.cyan('::::     :::::::      :::::::   :::') + chalk.grey(' ::'),
			chalk.grey(':: ')               + chalk.cyan('::::     ::::::::     :::::::   :::') + chalk.grey(' ::'),
			chalk.grey(':: ')               + chalk.cyan(':::::     :::::::      ::::::  ::::') + chalk.grey(' ::'),
			chalk.grey(':: ')               + chalk.cyan(':::::     ::::::       ::::::  ::::') + chalk.grey(' :.'),
			chalk.grey('.:  ')              + chalk.cyan(':::::     :::::  ::    ::::  ::::')   + chalk.grey('  :.'),
			chalk.grey(' :  ')              + chalk.cyan('::::::     :::   ::    ::::  ::::')   + chalk.grey('  :.'),
			chalk.grey(' .:  ')             + chalk.cyan(':::::     ::   :::     ::  ::::')     + chalk.grey('  :.'),
			chalk.grey('  .:  ')            + chalk.cyan(':::::        :::::    ::  :::')       + chalk.grey('  ::.'),
			chalk.grey('  .::  ')           + chalk.cyan('::::       ::::::       :::')         + chalk.grey('  ::.'),
			chalk.grey('    .:  ')          + chalk.cyan('::::     ::::::::     :::')           + chalk.grey('  ::.'),
			chalk.grey('     .:   ')        + chalk.cyan('::    :::::::::    ::')               + chalk.grey('   :.'),
			chalk.grey('      .::      ')   + chalk.cyan('::::::::::')                          + chalk.grey('      ::.'),
			chalk.grey('        ..::    ') + chalk.cyan('::::::::')                             + chalk.grey('    ::..'),
			chalk.grey('           ..:::..     ..:::..'),
			chalk.grey('                ..:::::.. '),
			''
		].join('\n');

	console.log(wp);

	console.log(chalk.cyan('---------------------------------------'));
	console.log(chalk.cyan('       Configuration setup wizard'));
	console.log(chalk.cyan('---------------------------------------'));

	var start = [{
		type: "input",
		name: "projectname",
		message: "Project name e.g. bloomagency",
		validate: function (val) {
			return val.length > 0 ? true : 'You have to provide a project name';
		},
		filter: function (val) {
			return slug(val).toLowerCase();
		}
	}];

	inquirer.prompt(start, function(answers) {
		var projectname = answers.projectname;

		getUsernamesAndPasswords(projectname, function(usernames_and_passwords) {

			console.log(chalk.cyan('---------------------------------------'));
			console.log(chalk.cyan('                 Local'));
			console.log(chalk.cyan('---------------------------------------'));

			var dev = [
				{
					type: "input",
					name: 'url',
					default: 'http://local.' + projectname + '.co.uk',
					validate: function (val) {
						return val.length > 0 ? true : 'You have to provide a local URL';
					},
					message: 'Local URL'
				},
				{
					type: "input",
					name: 'hostname',
					default: 'vs-dev-1',
					message: 'Hostname'
				},
				{
					type: "input",
					name: 'username',
					default: usernames_and_passwords.usernames[0],
					message: 'Username'
				},
				{
					type: "input",
					name: 'password',
					default: usernames_and_passwords.passwords[0],
					message: 'Password'
				},
				{
					type: "input",
					name: 'database',
					message: 'Database name',
					default: answers.projectname
				},
				{
					type: "input",
					name: 'prefix',
					default: 'wp_',
					message: 'Table prefix'
				},
				{
					type: "input",
					name: 'development',
					default: 'http://' + projectname + '.developing.bloommedia.co.uk',
					validate: function (val) {
						return val.length > 0 ? true : 'You have to provide a developing URL';
					},
					message: 'Development URL'
				}
			];
			inquirer.prompt(dev, function( answers ) {

				var local = answers;
				local.domain = local.url.replace(/^https?:\/\//, '');
				local.development_url = answers.development;
				local.development_domain = local.development_url.replace(/^https?:\/\//, '');

				console.log(chalk.cyan('---------------------------------------'));
				console.log(chalk.cyan('                Staging'));
				console.log(chalk.cyan('---------------------------------------'));

				var staging = [
					{
						type: "input",
						name: 'url',
						default: 'http://' + projectname + '.staging.bloommedia.co.uk',
						validate: function (val) {
							return val.length > 0 ? true : 'You have to provide a staging URL';
						},
						message: 'Staging URL'
					},
					{
						type: "input",
						name: 'hostname',
						default: 'vs-dev-2',
						message: 'Hostname'
					},
					{
						type: "input",
						name: 'username',
						default: usernames_and_passwords.usernames[1],
						message: 'Username'
					},
					{
						type: "input",
						name: 'password',
						default: usernames_and_passwords.passwords[1],
						message: 'Password'
					},
					{
						type: "input",
						name: 'database',
						message: 'Database name',
						default: usernames_and_passwords.projectname
					},
					{
						type: "input",
						name: 'prefix',
						default: 'wp_',
						message: 'Table prefix'
					}
				];
				inquirer.prompt(staging, function( answers ) {

					var staging = answers;
					staging.domain = staging.url.replace(/^https?:\/\//, '');

					console.log(chalk.cyan('---------------------------------------'));
					console.log(chalk.cyan('                  Live'));
					console.log(chalk.cyan('---------------------------------------'));


					var live = [
						{
							type: "input",
							name: 'url',
							default: 'http://www.' + projectname + '.co.uk',
							validate: function (val) {
								return val.length > 0 ? true : 'You have to provide a live URL';
							},
							message: 'Staging URL'
						},
						{
							type: "input",
							name: 'hostname',
							default: 'localhost',
							message: 'Hostname'
						},
						{
							type: "input",
							name: 'username',
							default: usernames_and_passwords.usernames[1],
							message: 'Username'
						},
						{
							type: "input",
							name: 'password',
							default: usernames_and_passwords.passwords[1],
							message: 'Password'
						},
						{
							type: "input",
							name: 'database',
							message: 'Database name',
							default: usernames_and_passwords.projectname
						},
						{
							type: "input",
							name: 'prefix',
							default: 'wp_',
							message: 'Table prefix'
						}
					];
					inquirer.prompt(live, function( answers ) {
						var live = answers;
						live.domain = live.url.replace(/^https?:\/\//, '');
						getSalts({'local': local, 'staging': staging, 'live': live});
					});
				});
			});
		});
	});
}

getSettings();
