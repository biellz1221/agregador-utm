import React, { useState, useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { api } from '../../Services/api';
import { store } from '../../store';
import { FiPlusCircle, FiCopy, FiEye, FiXCircle } from 'react-icons/fi';
import TopMenu from '../../Components/TopMenu';
import ToolTip from '../../Components/ToolTip';
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
				console.log(res.data);
				setLinks(res.data);
			});
		}
	}, [reload]);

	function copyLink(text) {
		navigator.clipboard.writeText(text);
	}

	if (authSession) {
		return (
			<div className="containerListaLinks">
				<TopMenu />
				<div className="topSection">
					<h1>Seus Links Salvos</h1>
					<Link to="/links/new">
						<FiPlusCircle size={16} /> Adicionar Novo
					</Link>
				</div>
				<div className="listaLinks">
					<div className="cabecalhos">
						<div className="field nome">Nome</div>
						<div className="field ogLink breakWord">Link Original</div>
						{/* <div className="field paramLink breakWord">Link Parametrizado</div> */}
						<div className="field utm utmSource">UTM Source</div>
						<div className="field utm utmCampaign">UTM Campaign</div>
						<div className="field utm utmMedia">UTM Media</div>
						<div className="field actions">Ações</div>
					</div>
					<ul>
						{links.map((link) => {
							return (
								<li key={link._id}>
									<div className="field nome">{link.name}</div>
									<div className="field ogLink breakWord">{link.ogLinkUrl}</div>
									{/* <div className="field paramLink breakWord">{link.paramLink}</div> */}
									<div className="field utm utmSource">{link.utmParams.source}</div>
									<div className="field utm utmCampaign">{link.utmParams.campaign}</div>
									<div className="field utm utmMedia">{link.utmParams.media}</div>
									<div className="field actions">
										<button>
											<ToolTip text="Ver Detalhes" />
											<FiEye size={16} />
										</button>
										{navigator.clipboard ? (
											<button
												onClick={() => {
													copyLink(link.paramLink);
												}}
											>
												<ToolTip text="Copiar Link Parametrizado" />
												<FiCopy size={16} />
											</button>
										) : (
											''
										)}
										<button>
											<ToolTip text="Excluir Link" />
											<FiXCircle size={16} />
										</button>
									</div>
								</li>
							);
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
