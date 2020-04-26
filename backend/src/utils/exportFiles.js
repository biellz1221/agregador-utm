const fs = require('fs');
const Json2csvParser = require('json2csv').Parser;
const mongoXlsx = require('mongo-xlsx');

/**
 * Exports CSV from MongoDB.find() query
 * @param {array} fields
 * @param {array} data
 * @param {string} query
 */
exports.exportCSV = function (fields, data, query) {
	const json2csvParser = new Json2csvParser({ fields, excelStrings: true });
	const csv = json2csvParser.parse(data);
	let pathToCSV = './export/csv/';
	let nomeArquivo = 'links_export_query_' + query + '.csv';
	fs.writeFile(pathToCSV + nomeArquivo, csv, function (err) {
		if (err) throw err;
		console.log('file saved');
	});
};

/**
 * Exports CSV from MongoDB.find() query
 * @param {array} fields
 * @param {array} data
 * @param {Object} options
 */
exports.exportXLSX = function (fields, data, options) {
	mongoXlsx.mongoData2Xlsx(data, fields, options, (err, data) => {
		if (err) throw err;
		console.log('XLSX Saved at:', data.fullPath);
	});
};
