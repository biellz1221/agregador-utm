import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { api } from '../../Services/api';
import { FiArrowLeft, FiTrash, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import TopMenu from '../../Components/TopMenu';
import ToolTip from '../../Components/ToolTip';
import Modal from '../../Components/Modal';
import TopSection from '../../Components/TopSection';
import Cookies from 'js-cookie';

import './styles.scss';
import ContainerGeral from '../../Components/Container';

export default function ViewLink(props) {
	//const currentUser = useContext(store);
	const history = useHistory();
	const [link, setLink] = useState({});
	const [reload, setReload] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [linkId, setLinkId] = useState('');

	//console.log(currentUser);
	const authSession = JSON.parse(Cookies.get('utmloginsession'));
	useEffect(() => {
		if (authSession) {
			api.get('/links/single/' + props.match.params.id, {
				headers: {
					Authorization: 'Bearer ' + JSON.parse(Cookies.get('utmloginsession')).token,
				},
			}).then((res) => {
				//console.log(res.data[0]);
				setLink(res.data[0]);
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
					titulo={link.name}
					button={
						<Link to="/links">
							<FiArrowLeft size={16} /> Voltar
						</Link>
					}
				/>
				<div className="linkInfos"></div>
			</ContainerGeral>
		);
	} else {
		alert('Você não fez login na aplicação');
		history.push('/');
		return <div />;
	}
}
