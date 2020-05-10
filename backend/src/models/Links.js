const mongoose = require('mongoose');
const validator = require('validator');

const linkSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		maxlength: 250,
	},
	created: {
		type: String,
	},
	author: {
		id: {
			type: String,
		},
		name: {
			type: String,
		},
	},
	ogLinkUrl: {
		type: String,
		required: true,
		lowercase: true,
		match: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm,
	},
	utmParams: {
		source: {
			type: String,
			required: true,
		},
		campaign: {
			type: String,
			required: true,
		},
		media: {
			type: String,
			required: true,
		},
		term: {
			type: String,
		},
		content: {
			type: String,
		},
	},
	paramLink: {
		type: String,
		required: true,
		//lowercase: true,
		match: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm,
	},
});

const Link = mongoose.model('Link', linkSchema);

module.exports = Link;
