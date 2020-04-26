import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';
import { api } from '../../Services/api';

import './styles.scss';

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const history = useHistory();
	async function handleLogin(e) {
		e.preventDefault();

		try {
			const response = await api.post('/users/login', {
				email: email,
				password: password,
			});

			if (response.data.token) {
				history.push('/links');
			} else {
				alert('Response retornou sem token');
			}
		} catch (err) {
			console.error(err);
		}
	}
	return (
		<div className="container">
			<div className="login">
				<p>Use o formulário abaixo para fazer login no app</p>
				<form onSubmit={handleLogin} className="formLogin">
					<label htmlFor="email">Email:</label>
					<input type="email" name="email" required placeholder="Seu@email.com" onChange={(e) => setEmail(e.target.value)} value={email} />
					<label htmlFor="senha">Senha:</label>
					<input type="password" name="senha" required onChange={(e) => setPassword(e.target.value)} value={password} />
					<button>
						<span>Entrar</span>
						<FiLogIn size={16} />
					</button>
					<Link className="back-link" to="/register">
						Ainda não tenho cadastro, quero criar minha conta!
					</Link>
				</form>
			</div>
		</div>
	);
}
