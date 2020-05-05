import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { api } from '../../Services/api';
import { FiPlusCircle, FiCopy, FiEye, FiXCircle, FiCheckCircle } from 'react-icons/fi';
import TopMenu from '../../Components/TopMenu';
import ToolTip from '../../Components/ToolTip';
import Modal from '../../Components/Modal';
import TopSection from '../../Components/TopSection';
import Cookies from 'js-cookie';

import './styles.scss';
import ContainerGeral from '../../Components/Container';

export default function LinksList() {
	//const currentUser = useContext(store);
	const history = useHistory();
	const [links, setLinks] = useState([]);
	const [reload, setReload] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [linkId, setLinkId] = useState('');

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
	function handleModal() {
		setShowModal(!showModal);
	}

	function confirmExclusion(id) {
		handleModal();
		setLinkId(id);
	}

	function excluirLink() {
		api.delete('/links/delete/' + linkId, {
			headers: {
				Authorization: 'Bearer ' + JSON.parse(Cookies.get('utmloginsession')).token,
			},
		}).then((res) => {
			console.log(res.data);
			setReload(!reload);
			handleModal();
			//setLinks(res.data);
		});
	}

	if (authSession) {
		return (
			<ContainerGeral>
				<Modal title="Confirmar exclusão" show={showModal} parentCallback={handleModal}>
					<p>Tem certeza que deseja excluir esse link?</p>
					<div className="btnsConfirm">
						<button className="confirm" onClick={excluirLink}>
							<FiCheckCircle size={16} />
							Sim, excluir
						</button>
						<button className="cancel" onClick={handleModal}>
							<FiXCircle size={16} /> Não, cancelar
						</button>
					</div>
				</Modal>
				<TopMenu />
				<TopSection
					titulo="Seus Links Salvos"
					button={
						<Link to="/links/new">
							<FiPlusCircle size={16} /> Adicionar Novo
						</Link>
					}
				/>
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
										<button
											onClick={() => {
												confirmExclusion(link._id);
											}}
										>
											<ToolTip text="Excluir Link" />
											<FiXCircle size={16} />
										</button>
									</div>
								</li>
							);
						})}
					</ul>
				</div>
			</ContainerGeral>
		);
	} else {
		alert('Você não fez login na aplicação');
		history.push('/');
		return <div />;
	}
}
