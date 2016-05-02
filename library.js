'use strict';

var tdwtfButtons = {};

// This is needed to add the tooltip title to the composer because 
// composer.addButton() is missing an argument.  This argument was added
// in composer version 3.0.27.  
tdwtfButtons.registerFormatting = function(data, callback) {
	var formatting = [
		{name: 'del-ins', className: 'fa fa-eraser', title: '[[tdwtfButtons:del-ins]]'},
		{name: 'abbr', className: 'fa fa-info-circle', title: '[[tdwtfButtons:abbr]]'},
		{name: 'spoiler', className: 'fa fa-eye-slash', title: '[[tdwtfButtons:spoiler]]'}
	];

	data.options = data.options.concat(formatting);

	callback(null, data);	
}

tdwtfButtons.parse = function(data, callback) {

	if (data && typeof data === 'string') {
		// preview
		data = tdwtfButtons.parseSpoiler(data);
	} else if (data.postData && data.postData.content) {
		// post
		data.postData.content = tdwtfButtons.parseSpoiler(data.postData.content);
	} else if (data.userData && data.userData.signature) {
		// signature
		data.userData.signature = tdwtfButtons.parseSpoiler(data.userData.signature);
	}

	callback(null, data);
}

// replace [spoiler] fake tags with real tags
tdwtfButtons.parseSpoiler = function(data) {

	if (data === null || typeof data !== 'string') {
		data = '';
	}
	
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

module.exports = tdwtfButtons;

