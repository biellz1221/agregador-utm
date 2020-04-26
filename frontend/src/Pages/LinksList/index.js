import React, { useState, useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { api } from '../../Services/api';
import { store } from '../../store';
import { FiPlusCircle } from 'react-icons/fi';
import TopMenu from '../../Components/TopMenu';
import Cookies from 'js-cookie';

import './styles.scss';

export default function LinksList() {
	const currentUser = useContext(store);
	const history = useHistory();
	const [links, setLinks] = useState([]);
	const [reload, setReload] = useState(true);

	//console.log(currentUser);
	const [authSession, setAuthSession] = useState(JSON.parse(Cookies.get('utmloginsession')));
	useEffect(() => {
		if (authSession) {
			api.get('/links/mylinks', {
				headers: {
					Authorization: 'Bearer ' + JSON.parse(Cookies.get('utmloginsession')).token,
				},
			}).then((res) => {
				//console.log(res.data);
				setLinks(res.data);
			});
		}
	}, [reload]);
	if (authSession) {
		return (
			<div className="container">
				<TopMenu />
				<div className="topSection">
					<h1>Seus Links Salvos</h1>
					<button>
						<FiPlusCircle size={16} /> Adicionar Novos
					</button>
				</div>
				<div className="listaLinks">
					<ul>
						{links.map((link) => {
							return <li key={link._id}>{link.name}</li>;
						})}
					</ul>
				</div>
			</div>
		);
	} else {
		alert('Você não fez login na aplicação');
		history.push('/');
		return <div />;
	}
}
