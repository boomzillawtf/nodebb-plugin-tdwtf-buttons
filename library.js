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
	// replace inline spoilers
	var spoilers = /\[spoiler\].*?\[\/spoiler\]/g;
	data = data.replace(spoilers, function(match) {
		return '<span class="spoiler blur" onclick="toggleBlur(this);">' + match.substring(9, match.length - 10) + '</span>';
	});
	// replace multi-line spoilers
	data = data.replace('[spoiler]', '<div class="spoiler blur" onclick="toggleBlur(this);">').replace('[/spoiler]', '</div>');
	return data;
}

module.exports = plugin;
