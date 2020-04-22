const concatUTMParams = function (ogLink, source, campaign, media, term, content) {
	let linkStr = ogLink;
	if (linkStr.includes('?')) {
		linkStr = linkStr + '&';
	} else {
		linkStr = linkStr + '?';
	}
	linkStr = linkStr + 'utm_source=' + source + '&utm_campaign=' + campaign + '&utm_media=' + media;
	if (term) {
		linkStr = linkStr + '&utm_term=' + term;
	}
	if (content) {
		linkStr = linkStr + '&utm_content=' + content;
	}
	return linkStr;
};

module.exports = concatUTMParams;
