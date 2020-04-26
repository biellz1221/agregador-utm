const express = require('express');
const Link = require('../models/Links');
const auth = require('../middleware/auth');
const moment = require('moment');
const routes = express.Router();
const concatUTMParams = require('../utils/concatUtm');
const exportHandler = require('../utils/exportFiles');

//Retorna todos os links criados pelo usuário
routes.get('/links/mylinks', auth, async (req, res) => {
	//console.log('Logged User ID:', req.user._id);
	try {
		const lstLinks = await Link.find({
			'author.id': req.user._id,
		});
		res.status(200).send(lstLinks);
	} catch (err) {
		res.status(400).send({ error: err });
	}
});

//Busca de links, só exibe links que o próprio usuário criou e que contém os termos da busca
routes.get('/links/search/:query', auth, async (req, res) => {
	console.log('Logged User ID:', req.user._id);
	try {
		const lstLinks = await Link.find({
			$and: [
				{
					'author.id': req.user._id,
				},
				{
					$or: [
						{ name: { $regex: req.params.query, $options: 'i' } }, //
						{ description: { $regex: req.params.query, $options: 'i' } },
						{ 'utmParams.source': { $regex: req.params.query, $options: 'i' } },
						{ 'utmParams.campaign': { $regex: req.params.query, $options: 'i' } },
						{ 'utmParams.medium': { $regex: req.params.query, $options: 'i' } },
						{ 'utmParams.term': { $regex: req.params.query, $options: 'i' } },
						{ 'utmParams.content': { $regex: req.params.query, $options: 'i' } },
					],
				},
			],
			//name: { $regex: req.params.query },
		});
		res.status(200).send({
			query: req.params.query,
			...lstLinks,
		});
	} catch (err) {
		res.status(400).send(err);
	}
});

//Cria um novo link
routes.post('/links/create', auth, async (req, res) => {
	//Salvar Link no Banco
	try {
		const link = new Link({
			name: req.body.name,
			description: req.body.description,
			created: moment().format('DD/MM/YYYY HH:mm:ss'),
			author: {
				id: req.user._id,
				name: req.user.name,
			},
			ogLinkUrl: req.body.ogLinkUrl,
			utmParams: {
				source: req.body.utmParams.source,
				campaign: req.body.utmParams.campaign,
				media: req.body.utmParams.media,
				term: req.body.utmParams.term,
				content: req.body.utmParams.content,
			},
			paramLink: concatUTMParams(req.body.ogLinkUrl, req.body.utmParams.source, req.body.utmParams.campaign, req.body.utmParams.media, req.body.utmParams.term, req.body.utmParams.content),
		});
		//await link.save();
		res.status(201).send(link);
	} catch (err) {
		console.log(err);
		res.status(403).send({ error: 'Not Authorized to access this resource.' });
	}
});

//Deletar um link pelo ID
routes.delete('/links/delete/:id', auth, async (req, res) => {
	//console.log('Logged User ID:', req.user._id);
	try {
		const link = await Link.findOneAndDelete({
			$and: [
				{ 'author.id': req.user._id }, //
				{ _id: req.params.id },
			],
		});
		res.status(200).send({
			message: 'Item apagado do banco de dados',
			...link,
		});
	} catch (err) {
		res.status(401).send({ error: 'Link does not exist' });
	}
});

//Exportar lista de links
routes.get('/links/export/:query/:format', auth, async (req, res) => {
	console.log('Logged User ID:', req.user._id);
	try {
		const lstLinks = await Link.find({
			$and: [
				{
					'author.id': req.user._id,
				},
				{
					$or: [
						{ name: { $regex: req.params.query, $options: 'i' } }, //
						{ description: { $regex: req.params.query, $options: 'i' } },
						{ 'utmParams.source': { $regex: req.params.query, $options: 'i' } },
						{ 'utmParams.campaign': { $regex: req.params.query, $options: 'i' } },
						{ 'utmParams.medium': { $regex: req.params.query, $options: 'i' } },
						{ 'utmParams.term': { $regex: req.params.query, $options: 'i' } },
						{ 'utmParams.content': { $regex: req.params.query, $options: 'i' } },
					],
				},
			],
		});
		if (req.params.format === 'csv') {
			const fields = [
				{ label: 'ID', value: '_id' },
				{ label: 'Nome', value: 'name' },
				{ label: 'Descricao', value: 'description' },
				{ label: 'Dt. Criacao', value: 'created' },
				{ label: 'Criado Por', value: 'author.name' },
				{ label: 'Link Original', value: 'ogLinkUrl' },
				{ label: 'UTM Source', value: 'utmParams.source' },
				{ label: 'UTM Campaign', value: 'utmParams.campaign' },
				{ label: 'UTM Media', value: 'utmParams.media' },
				{ label: 'UTM Term', value: 'utmParams.term' },
				{ label: 'UTM Content', value: 'utmParams.content' },
				{ label: 'Link Parametrizado', value: 'paramLink' },
			];

			exportHandler.exportCSV(fields, lstLinks, req.params.query);

			res.status(200).send({
				query: req.params.query,
				...lstLinks,
			});
		}
		if (req.params.format === 'xls') {
			const fields = [
				{ displayName: 'ID', access: '_id', type: 'string' },
				{ displayName: 'Nome', access: 'name', type: 'string' },
				{ displayName: 'Descricao', access: 'description', type: 'string' },
				{ displayName: 'Dt. Criacao', access: 'created', type: 'string' },
				{ displayName: 'Criado Por', access: 'author[name]', type: 'string' },
				{ displayName: 'Link Original', access: 'ogLinkUrl', type: 'string' },
				{ displayName: 'UTM Source', access: 'utmParams[source]', type: 'string' },
				{ displayName: 'UTM Campaign', access: 'utmParams[campaign]', type: 'string' },
				{ displayName: 'UTM Media', access: 'utmParams[media]', type: 'string' },
				{ displayName: 'UTM Term', access: 'utmParams[term]', type: 'string' },
				{ displayName: 'UTM Content', access: 'utmParams[content]', type: 'string' },
				{ displayName: 'Link Parametrizado', access: 'paramLink', type: 'string' },
			];

			const options = {
				save: '',
				fileName: 'links_export_query_' + req.params.query + '.xlsx',
				path: './export/xls',
			};

			exportHandler.exportXLSX(fields, lstLinks, options, req.params.query);

			res.status(200).send({
				query: req.params.query,
				...lstLinks,
			});
		}
		if (!req.params.format) {
			res.status(400).send({ error: 'You have not specified a format for your file. Please use CSV or XLS.' });
		}
		if (req.params.format !== 'csv' || req.params.format !== 'xls') {
			res.status(400).send({ error: 'You have to specify a valid format for your file. Please use CSV or XLS.' });
		}
	} catch (err) {
		res.status(400).send(err);
	}
});

module.exports = routes;
