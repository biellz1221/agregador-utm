import React, { useState, useContext } from 'react';
import Cookies from 'js-cookie';
import { Link, useHistory } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';
import { api } from '../../Services/api';
import { store } from '../../store';

import './styles.scss';

export default function Login() {
	const currentUser = useContext(store);
	//console.log(currentUser);
	const { dispatch } = currentUser;
	function setUser(token, userEmail, userName) {
		dispatch({
			type: 'LOGIN',
			token: token,
			userEmail: userEmail,
			userName: userName,
		});
		//console.log('currentUser', currentUser.state.token);
	}
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

			//console.log(response);

			if (response.data.token) {
				//setUser(response.data.token, response.data.user.email, response.data.user.name);
				Cookies.set(
					'utmloginsession',
					JSON.stringify({
						token: response.data.token,
						name: response.data.user.name,
						email: response.data.user.name,
					})
				);
				console.log(Cookies.get('utmloginsession'));
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
