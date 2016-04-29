'use strict';

var tdwtfButtons = {};

// This is needed to add the tooltip title to the composer because 
// composer.addButton() is missing an argument.  This argument was added
// in composer version 3.0.27.  
tdwtfButtons.registerFormatting = function(data, callback) {
	var formatting = [
		{name: 'del-ins', className: 'fa fa-eraser', title: '[[tdwtfButtons:del-ins]]'},
		{name: 'abbr', className: 'fa fa-info-circle', title: '[[tdwtfButtons:abbr]]'}
	];

	data.options = data.options.concat(formatting);

	callback(null, data);	
}

module.exports = tdwtfButtons;

