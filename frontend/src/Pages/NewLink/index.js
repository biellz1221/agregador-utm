import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { api } from '../../Services/api';
import { FiArrowLeft, FiSave, FiXCircle } from 'react-icons/fi';
import TopMenu from '../../Components/TopMenu';
import ToolTip from '../../Components/ToolTip';
import Modal from '../../Components/Modal';
import TopSection from '../../Components/TopSection';
import Cookies from 'js-cookie';
import ContainerGeral from '../../Components/Container';

import './styles.scss';

export default function NewLink() {
	const history = useHistory();
	const [authSession, setAuthSession] = useState(JSON.parse(Cookies.get('utmloginsession')));
	function salvarLink(e) {
		e.preventDefault();
		console.log('form working');
	}
	return (
		<ContainerGeral>
			<TopMenu />
			<TopSection
				titulo="Adicionar Novo Link"
				button={
					<button
						onClick={() => {
							history.goBack();
						}}
					>
						<FiArrowLeft size={16} /> Voltar
					</button>
				}
			/>
			<form className="formWapper" onSubmit={salvarLink}>
				<div className="fieldGroup">
					<label htmlFor="name">Nome:</label>
					<input type="text" name="name" placeholder="Nome" required />
				</div>
				<div className="fieldGroup">
					<label htmlFor="description">Descrição:</label>
					<input type="text" name="description" placeholder="Descrição" />
				</div>
				<div className="fieldGroup">
					<label htmlFor="oglink">Link:</label>
					<input type="link" name="description" placeholder="http://seulink.com.br" />
				</div>
				<div className="utmBlock">
					<div className="fieldGroup">
						<label htmlFor="source">UTM Source:</label>
						<input type="link" name="source" placeholder="" />
					</div>
					<div className="fieldGroup">
						<label htmlFor="campaign">UTM Campaign:</label>
						<input type="link" name="campaign" placeholder="" />
					</div>
					<div className="fieldGroup">
						<label htmlFor="media">UTM Media:</label>
						<input type="link" name="media" placeholder="" />
					</div>
					<div className="fieldGroup">
						<label htmlFor="term">UTM Term:</label>
						<input type="link" name="term" placeholder="" />
					</div>
					<div className="fieldGroup">
						<label htmlFor="content">UTM Content:</label>
						<input type="link" name="content" placeholder="" />
					</div>
				</div>
				<button type="submit">
					<FiSave size={16} />
					Salvar e Adicionar Outro
				</button>
				<button type="submit">
					<FiSave size={16} />
					Salvar
				</button>
				<button type="button">
					<FiXCircle size={16} />
					Cancelar e Voltar
				</button>
			</form>
		</ContainerGeral>
	);
}
