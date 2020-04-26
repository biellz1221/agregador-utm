import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';
import { FiMenu, FiLink, FiLogOut, FiPlusCircle } from 'react-icons/fi';
import { api } from '../../Services/api';

import './styles.scss';

export default function TopMenu() {
	const history = useHistory();
	const userInfo = JSON.parse(Cookies.get('utmloginsession'));
	const [showMeta, setShowMeta] = useState(false);
	//console.log(JSON.parse(Cookies.get('utmloginsession')).token);
	function handleLogout(e) {
		e.preventDefault();

		let authToken = 'Bearer ' + JSON.parse(Cookies.get('utmloginsession')).token.toString();
		console.log(authToken);
		api.post(
			'/users/me/logout',
			{}, // body vazio
			{
				headers: {
					Authorization: authToken,
				},
			}
		)
			.then((res) => {
				console.log(res);
				console.log('saiu');
				Cookies.remove('utmloginsession');
				history.push('/');
			})
			.catch((err) => console.error(err));
	}
	return (
		<nav className="topMenu">
			<h1>Agregador de Links</h1>
			<div
				className="metaLinks"
				onClick={() => {
					setShowMeta(!showMeta);
				}}
			>
				<span className="userName">
					<span>{userInfo.name}</span>
					<FiMenu size={16} />
				</span>
				<ul className={`${showMeta ? 'show' : ''}`}>
					<li>
						<Link to="/links">
							<span>
								<FiLink />
							</span>
							Meus Links
						</Link>
					</li>
					<li>
						<Link to="/links/new">
							<span>
								<FiPlusCircle />
							</span>
							Novo Link
						</Link>
					</li>
					<li>
						<a href="#" onClick={handleLogout}>
							<span>
								<FiLogOut />
							</span>
							Sair
						</a>
					</li>
				</ul>
			</div>
		</nav>
	);
}
