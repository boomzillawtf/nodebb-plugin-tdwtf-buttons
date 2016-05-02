'use strict';
var winston = require('winston');

process.on('uncaughtException', function (err) {
	winston.error('Encountered error while running test suite: ' + err.message);
});

var chai = require('chai');
var expect = chai.expect;
var should = chai.should();
var tdwtfButtons = require('../library');

describe('tdwtfButtons', () => {

	describe('The spoiler regex parser', () => {
		it('should return a string', () => {
			tdwtfButtons.parseSpoiler().should.be.a('string');
		});
		it('should convert spoilers with images', () => {
			var post = 'This is a hidden image\n[spoiler]<img src="a.png">[/spoiler]';
			var exp = 'This is a hidden image\n<div class="blur" onclick="toggleBlur(this);"><img src="a.png"></div>';
			tdwtfButtons.parseSpoiler(post).should.equal(exp);
		});
		it('should convert spoilers with images and text', () => {
			var post = 'This is a hidden image\n[spoiler]<img src="a.png">And some text![/spoiler]';
			var exp = 'This is a hidden image\n<div class="blur" onclick="toggleBlur(this);"><img src="a.png">And some text!</div>';
			tdwtfButtons.parseSpoiler(post).should.equal(exp);
		});
		it('should convert spoilers inline', () => {
			var post = 'This is some [spoiler]hidden[/spoiler] text.';
			var exp = 'This is some <span class="blur" onclick="toggleBlur(this);">hidden</span> text.';
			tdwtfButtons.parseSpoiler(post).should.equal(exp);
		});
		it('should convert blocks of text', () => {
			var post = 'This is an introduction.\n[spoiler]This is a hidden<br />\nblock of text.[/spoiler]\nThe end.';
			var exp = 'This is an introduction.\n<div class="blur" onclick="toggleBlur(this);">This is a hidden<br />\nblock of text.</div>\nThe end.';
			tdwtfButtons.parseSpoiler(post).should.equal(exp);
		});
		it('should convert blocks of text with blank lines', () => {
			var post = 'This is an introduction.\n[spoiler]This is a hidden\n\nblock of text.[/spoiler]\nThe end.';
			var exp = 'This is an introduction.\n<div class="blur" onclick="toggleBlur(this);">This is a hidden\n\nblock of text.</div>\nThe end.';
			tdwtfButtons.parseSpoiler(post).should.equal(exp);
		});
		it('should not convert spoilers in inline code', () => {
			var post = 'This is some <code>[spoiler]hidden[/spoiler]/code> text with an example of <code>[spoiler]/code> and <code>[/spoiler]</code>.';
			tdwtfButtons.parseSpoiler(post).should.equal(post);
		});
		it('should not convert spoilers in code blocks', () => {
			var post = 'This is an introduction.\n\n<pre><code>[spoiler]This is a hidden<br />\nblock of text.[/spoiler]</code></pre>\nThe end.';
			tdwtfButtons.parseSpoiler(post).should.equal(post);
		});
	});
	
	describe('The plugin hook', () => {
		it('should parse edit previews', () => {
			var post = 'This is some [spoiler]hidden[/spoiler] text.';
			var exp = 'This is some <span class="blur" onclick="toggleBlur(this);">hidden</span> text.';
			tdwtfButtons.parse(post, function(callback, data) {
				data.should.be.a('string');
				data.should.equal(exp);
			});
		});
		it('should parse posts', () => {
			var post = {
				postData: {
					content: 'This is some [spoiler]hidden[/spoiler] text.'
				}
			};
			var exp = 'This is some <span class="blur" onclick="toggleBlur(this);">hidden</span> text.';
			tdwtfButtons.parse(post, function(callback, data) {
				data.should.be.an('object');
				data.postData.should.be.an('object');
				data.postData.content.should.be.a('string');
				data.postData.content.should.equal(exp);
			});
		});
		it('should parse signatures', () => {
			var post = {
				userData: {
					signature: 'This is some [spoiler]hidden[/spoiler] text.'
				}
			};
			var exp = 'This is some <span class="blur" onclick="toggleBlur(this);">hidden</span> text.';
			tdwtfButtons.parse(post, function(callback, data) {
				data.should.be.an('object');
				data.userData.should.be.an('object');
				data.userData.signature.should.be.a('string');
				data.userData.signature.should.equal(exp);
			});
		});
	});

});

