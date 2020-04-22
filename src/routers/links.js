const express = require('express');
const Link = require('../models/Links');
const auth = require('../middleware/auth');
const moment = require('moment');
const routes = express.Router();
const concatUTMParams = require('../utils/concatUtm');
const fs = require('fs');
const Json2csvParser = require('json2csv').Parser;

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
routes.get('/links/export/:query', auth, async (req, res) => {
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
		const json2csvParser = new Json2csvParser({ fields });
		const csv = json2csvParser.parse(lstLinks);
		console.log(csv);
		fs.writeFile('customer.csv', csv, function (err) {
			if (err) throw err;
			console.log('file saved');
		});

		res.status(200).send({
			query: req.params.query,
			...lstLinks,
		});
	} catch (err) {
		res.status(400).send(err);
	}
});

module.exports = routes;
