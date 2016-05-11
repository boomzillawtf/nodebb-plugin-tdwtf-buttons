'use strict';
/*globals document, window */

var isIE = document.documentMode;
var blurRadius = 5;
var globalIdCounter = 0;

function convertToSVG(image) {
	var transform = function() {
		var w = image.width,
			h = image.height,
			id = ++globalIdCounter;
		var svg = '<svg data-spoiler-id="' + id + '" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' +
			w + '" height="' + h + '">' + '<defs><filter id="blur-' + id + '"><feGaussianBlur id="gaussian-' + id + '" stdDeviation="' + blurRadius +
			'"></feGaussianBlur></filter></defs>' + '<image class="not-responsive" xlink:href="' + image.src + '" filter="url(#blur-' + id +
			')" style="filter: url(#blur-' + id + ')" width="' + w + '" height="' + h + '"></image>' + '</svg>';
		$(image).replaceWith(svg);
	};
	if (image.naturalWidth === 0 || image.naturalHeight === 0) {
		image.onload = transform;
	} else {
		transform();
	}
}

function blurImage($spoiler, radius) {
	if (isIE) {
		$('svg', $spoiler).each(function(index, svg) {
			var id = svg.getAttribute('data-spoiler-id');
			var element = svg.getElementById('gaussian-' + id);
			if (element) {
				element.setAttribute('stdDeviation', radius);
			}
		});
	}
}

function toggleBlur(where) { // eslint-disable-line no-unused-vars
	if ($(where).hasClass('blur')) {
		$(where).removeClass('blur');
		blurImage(where, 0);
	} else {
		$(where).addClass('blur');
		blurImage(where, blurRadius);
	}
}

$('document').ready(function() {
	
	var style = $('<style>').prop('type', 'text/css');
	if (isIE) {
		style.html('\
			.blur {\
				background-color: transparent;\
				color: rgba(0,0,0,0);\
				text-shadow: 0 0 5px .1px rgba(0,0,0,0.5), 0 0 5px .1px white;\
			}\
			.blur a{ color: transparent; }\
		');
	} else {
		style.html('\
			.blur {\
				color: transparent;\
				text-shadow: 0 0 5px rgba(0,0,0,0.5), 0 0 5px white;\
			}\
		');
	}
	style.appendTo('head');
	
});

function doConvert() {
	if (isIE) {
		$('.blur').each(function(i, obj) {
			// convert all images to SVG
			$('img', obj).each(function(index, image) {
				convertToSVG(image);
			});
		});
	}
}

$(window).on('action:ajaxify.contentLoaded', doConvert);
$(window).on('action:posts.loaded', doConvert);

