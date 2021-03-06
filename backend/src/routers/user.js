const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/users', async (req, res) => {
	//Criar novo usuário
	try {
		const user = new User(req.body);
		await user.save();
		const token = await user.generateAuthToken();
		res.status(201).send({ user, token });
	} catch (err) {
		res.status(400).send(err);
	}
});

router.post('/users/login', async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findByCredentials(email, password);
		if (!user) {
			return res.status(401).send({ error: 'Login failed! Check auth credentials' });
		}
		const token = await user.generateAuthToken();
		res.send({ user, token });
	} catch (err) {
		res.status(400).send(err);
	}
});

router.get('/users/me', auth, async (req, res) => {
	//Ver perfil do usuário logado
	res.send(req.user);
});

router.post('/users/me/logout', auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token != req.token;
		});
		await req.user.save();
		res.status(200).send({ status: 'usuário deslogado' });
	} catch (err) {
		res.status(500).send(err);
	}
});

router.post('/users/me/logoutall', auth, async (req, res) => {
	try {
		req.user.tokens.splice(0, req.user.tokens.length);
		await req.user.save();
		res.status(200).send('Deslogado de todos os lugares e tokens apagados');
	} catch (err) {
		res.status(500).send(err);
	}
});

module.exports = router;
