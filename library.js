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
	
	// replace escaped text with a guid temporarily
	var pre = /(?:<pre(.|\n)*?<\/pre>|<code(.|\n)*?<\/code>)/g;
	var preBlocks = [];
	var preTag = '88888888-8888-4888-2888-888888888888'.replace(/[82]/g, (c) => (Math.random() * c * 2 ^ 8).toString(16));
	data = data.replace(pre, function(match) {
		preBlocks.push(match);
		return preTag;
	});

	// replace image spoilers
	data = data.replace(/\[spoiler\]((.|\n)*?<img(.|\n)*?)\[\/spoiler\]/g, function(_, match) {
		return '<div class="blur" onclick="toggleBlur(this);">' + match + '</div>';
	});
	// replace inline spoilers
	data = data.replace(/\[spoiler\](.*?)\[\/spoiler\]/g, function(_, match) {
		return '<span class="blur" onclick="toggleBlur(this);">' + match + '</span>';
	});
	// replace multi-line spoilers
	data = data.replace(/\[spoiler\]((.|\n)*?)\[\/spoiler\]/g, function(_, match) {
		return '<div class="blur" onclick="toggleBlur(this);">' + match + '</div>';
	});

	// replace guid with original escaped text
	var preTagRegex = new RegExp(preTag, 'g');
	data = data.replace(preTagRegex, function() {
		return preBlocks.shift();
	});

	return data;
}

module.exports = plugin;
