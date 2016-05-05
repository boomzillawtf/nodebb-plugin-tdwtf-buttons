'use strict';
/*globals describe, it, beforeEach*/

const winston = require('winston');

process.on('uncaughtException', function (err) {
	winston.error('Encountered error while running test suite: ' + err.message);
});

const chai = require('chai');
chai.should();
const expect = chai.expect;
const tdwtfButtons = require('../library');

describe('tdwtfButtons:', () => {

	describe('The spoiler regex parser', () => {
		it('should return a string', () => {
			tdwtfButtons.parseSpoiler().should.be.a('string');
		});
		it('should convert spoilers with images', () => {
			const post = 'This is a hidden image\n[spoiler]<img src="a.png">[/spoiler]';
			const exp = 'This is a hidden image\n' +
				'<div class="blur" onclick="toggleBlur(this);"><img src="a.png"></div>';
			tdwtfButtons.parseSpoiler(post).should.equal(exp);
		});
		it('should convert spoilers with images and text', () => {
			const post = 'This is a hidden image\n[spoiler]<img src="a.png">And some text![/spoiler]';
			const exp = 'This is a hidden image\n' +
				'<div class="blur" onclick="toggleBlur(this);"><img src="a.png">And some text!</div>';
			tdwtfButtons.parseSpoiler(post).should.equal(exp);
		});
		it('should convert spoilers inline', () => {
			const post = 'This is some [spoiler]hidden[/spoiler] text.';
			const exp = 'This is some <span class="blur" onclick="toggleBlur(this);">hidden</span> text.';
			tdwtfButtons.parseSpoiler(post).should.equal(exp);
		});
		it('should convert blocks of text', () => {
			const post = 'This is an introduction.\n[spoiler]This is a hidden<br />\nblock of text.[/spoiler]\nThe end.';
			const exp = 'This is an introduction.\n' +
				'<div class="blur" onclick="toggleBlur(this);">This is a hidden<br />\nblock of text.</div>\nThe end.';
			tdwtfButtons.parseSpoiler(post).should.equal(exp);
		});
		it('should convert blocks of text with blank lines', () => {
			const post = 'This is an introduction.\n[spoiler]This is a hidden\n\nblock of text.[/spoiler]\nThe end.';
			const exp = 'This is an introduction.\n' +
				'<div class="blur" onclick="toggleBlur(this);">This is a hidden\n\nblock of text.</div>\nThe end.';
			tdwtfButtons.parseSpoiler(post).should.equal(exp);
		});
		it('should not convert spoilers in inline code', () => {
			const post = 'This is some <code>[spoiler]hidden[/spoiler]/code> ' +
				'text with an example of <code>[spoiler]/code> and <code>[/spoiler]</code>.';
			tdwtfButtons.parseSpoiler(post).should.equal(post);
		});
		it('should not convert spoilers in code blocks', () => {
			const post = 'This is an introduction.\n\n<pre><code>[spoiler]This is a hidden<br />\n' +
				'block of text.[/spoiler]</code></pre>\nThe end.';
			tdwtfButtons.parseSpoiler(post).should.equal(post);
		});
	});
	
	describe('The spoiler plugin hook', () => {
		it('should parse edit previews', () => {
			const post = 'This is some [spoiler]hidden[/spoiler] text.';
			const exp = 'This is some <span class="blur" onclick="toggleBlur(this);">hidden</span> text.';
			tdwtfButtons.parse(post, function(callback, data) {
				data.should.equal(exp);
			});
		});
		it('should parse posts', () => {
			const post = {
				postData: {
					content: 'This is some [spoiler]hidden[/spoiler] text.'
				}
			};
			const exp = {
				postData: {
					content: 'This is some <span class="blur" onclick="toggleBlur(this);">hidden</span> text.'
				}
			};
			tdwtfButtons.parse(post, function(callback, data) {
				data.should.deep.equal(exp);
			});
		});
		it('should parse signatures', () => {
			const post = {
				userData: {
					signature: 'This is some [spoiler]hidden[/spoiler] text.'
				}
			};
			const exp = {
				userData: {
					signature: 'This is some <span class="blur" onclick="toggleBlur(this);">hidden</span> text.'
				}
			};
			tdwtfButtons.parse(post, function(callback, data) {
				data.should.deep.equal(exp);
			});
		});
		it('should not parse other object', () => {
			const foo = {
				bar: 'baz'
			};
			const oldFoo = JSON.parse(JSON.stringify(foo));
			tdwtfButtons.parse(foo, function(callback, data) {
				data.should.deep.equal(oldFoo);
			});
		});
	});
	
	describe('The registerFormatting plugin hook', () => {
	
		let formatting;
		beforeEach(() => {
			formatting = {
				options: []
			};
		});
	
		it('should return at least one button', () => {
			tdwtfButtons.registerFormatting(formatting, function(callback, data) {
				data.options.should.have.length.of.at.least(1);
			});
		});
		it('should return valid options', () => {
			tdwtfButtons.registerFormatting(formatting, function(callback, data) {
				for (var i = 0; i < data.options.length; i++) {
					data.options[i].should.have.all.keys('name', 'className', 'title');
				}
			});
		});
		it('should return valid class names', () => {
			tdwtfButtons.registerFormatting(formatting, function(callback, data) {
				for (var i = 0; i < data.options.length; i++) {
					expect(data.options[i].className).to.match(/^fa fa-/);
				}
			});
		});
	});

});

