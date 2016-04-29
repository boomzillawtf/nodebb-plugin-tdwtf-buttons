'use strict';

var isIE = document.documentMode;

function toggleBlur(where) {
	if ($(where).hasClass("blur")) {
		$(where).removeClass("blur");
	} else {
		$(where).addClass("blur");
	}
}

$(document).ready(function() {
	
	var style = $("<style>").prop("type", "text/css")
	if (isIE) {
		style.html("\
			.blur {\
				background-color: transparent;\
				color: rgba(0,0,0,0);\
				text-shadow: 0 0 5px .1px rgba(0,0,0,0.5), 0 0 5px .1px white;\
		}");
	} else {
		style.html("\
			.blur {\
				color: transparent;\
				text-shadow: 0 0 5px rgba(0,0,0,0.5), 0 0 5px white;\
		}");
	}
	style.appendTo("head");
	
});


