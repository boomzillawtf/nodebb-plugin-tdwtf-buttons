// Empty for now, eventually code to parse posts will go here

'use strict';

var plugins = module.parent.require('./plugins'),
	fs = require('fs'),
	path = require('path'),
	util = require('util'),
	app;

var plugin = {};

plugin.parse = function(data, callback) {

	if (data && typeof data === 'string') {
		// preview
		data = parser(data);
	} else if (data.postData && data.postData.content) {
		// post
		data.postData.content = parser(data.postData.content);
	} else if (data.userData && data.userData.signature) {
		// signature
		data.userData.signature = parser(data.userData.signature);
	}
	
	callback(null, data);
}

// replace [spoiler] fake tags with real tags
function parser(data) {
	data = data
		.replace('[spoiler]', '<span class="blur" onclick="toggleBlur(this);">')
		.replace('[/spoiler]', '</span>');
	return data;
}

module.exports = plugin;

