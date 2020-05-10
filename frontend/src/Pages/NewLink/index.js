import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { api } from '../../Services/api';
import { FiArrowLeft, FiSave, FiXCircle } from 'react-icons/fi';
import TopMenu from '../../Components/TopMenu';
import TopSection from '../../Components/TopSection';
import Cookies from 'js-cookie';
import ContainerGeral from '../../Components/Container';

import './styles.scss';

export default function NewLink() {
	const history = useHistory();

	const regExUrl = new RegExp(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm);

	const [addAnotherLink, setAddAnotherLink] = useState(false);

	const [linkName, setLinkName] = useState('');
	const [linkDescription, setLinkDescription] = useState('');
	const [linkUrl, setLinkUrl] = useState('');
	const [linkUTMSource, setLinkUTMSource] = useState('');
	const [linkUTMCampaign, setLinkUTMCampaign] = useState('');
	const [linkUTMMedia, setLinkUTMMedia] = useState('');
	const [linkUTMTerm, setLinkUTMTerm] = useState('');
	const [linkUTMContent, setLinkUTMContent] = useState('');

	function clearFields() {
		setLinkName('');
		setLinkDescription('');
		setLinkUrl('');
		setLinkUTMSource('');
		setLinkUTMMedia('');
		setLinkUTMCampaign('');
		setLinkUTMTerm('');
		setLinkUTMContent('');
	}

	async function salvarLink(e) {
		e.preventDefault();
		console.log('form working');
		console.log(e);
		const data = {
			name: linkName,
			description: linkDescription,
			ogLinkUrl: linkUrl,
			utmParams: {
				source: linkUTMSource,
				campaign: linkUTMCampaign,
				media: linkUTMMedia,
				term: linkUTMTerm,
				content: linkUTMContent,
			},
		};
		if (regExUrl.test(linkUrl)) {
			console.log('url ok');
			await api
				.post('/links/create', data, {
					headers: {
						Authorization: 'Bearer ' + JSON.parse(Cookies.get('utmloginsession')).token,
					},
				})
				.then((r) => {
					console.log(r);
				});
		}
		clearFields();
		if (!addAnotherLink) {
			history.goBack();
		}
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
			<form className="formWrapper" onSubmit={salvarLink}>
				<div className="fieldGroup">
					<label htmlFor="name">Nome:</label>
					<input
						type="text"
						name="name"
						placeholder="Nome"
						required
						value={linkName}
						onChange={(e) => {
							setLinkName(e.target.value);
						}}
					/>
				</div>
				<div className="fieldGroup">
					<label htmlFor="description">Descrição:</label>
					<input
						type="text"
						name="description"
						placeholder="Descrição"
						required
						value={linkDescription}
						onChange={(e) => {
							setLinkDescription(e.target.value);
						}}
					/>
				</div>
				<div className="fieldGroup">
					<label htmlFor="oglink">Link:</label>
					<input
						type="link"
						name="description"
						placeholder="http://seulink.com.br"
						required
						value={linkUrl}
						onChange={(e) => {
							setLinkUrl(e.target.value);
						}}
					/>
				</div>
				<div className="utmBlock">
					<div className="fieldGroup">
						<label htmlFor="source">UTM Source:</label>
						<p className="explain">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam consequat risus quis finibus mollis.</p>
						<input
							type="link"
							name="source"
							placeholder=""
							required
							value={linkUTMSource}
							onChange={(e) => {
								setLinkUTMSource(e.target.value);
							}}
						/>
					</div>
					<div className="fieldGroup">
						<label htmlFor="campaign">UTM Campaign:</label>
						<p className="explain">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam consequat risus quis finibus mollis.</p>
						<input
							type="link"
							name="campaign"
							placeholder=""
							required
							value={linkUTMCampaign}
							onChange={(e) => {
								setLinkUTMCampaign(e.target.value);
							}}
						/>
					</div>
					<div className="fieldGroup">
						<label htmlFor="media">UTM Media:</label>
						<p className="explain">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam consequat risus quis finibus mollis.</p>
						<input
							type="link"
							name="media"
							placeholder=""
							required
							value={linkUTMMedia}
							onChange={(e) => {
								setLinkUTMMedia(e.target.value);
							}}
						/>
					</div>
					<div className="fieldGroup">
						<label htmlFor="term">UTM Term:</label>
						<p className="explain">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam consequat risus quis finibus mollis.</p>
						<input
							type="link"
							name="term"
							placeholder=""
							value={linkUTMTerm}
							onChange={(e) => {
								setLinkUTMTerm(e.target.value);
							}}
						/>
					</div>
					<div className="fieldGroup">
						<label htmlFor="content">UTM Content:</label>
						<p className="explain">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam consequat risus quis finibus mollis.</p>
						<input
							type="link"
							name="content"
							placeholder=""
							value={linkUTMContent}
							onChange={(e) => {
								setLinkUTMContent(e.target.value);
							}}
						/>
					</div>
				</div>
				<div className="buttonsHolder">
					<button type="submit">
						<FiSave
							size={16}
							onClick={() => {
								setAddAnotherLink(false);
							}}
						/>
						Salvar
					</button>
					<button
						type="submit"
						onClick={() => {
							setAddAnotherLink(true);
						}}
					>
						<FiSave size={16} />
						Salvar e Adicionar Outro
					</button>
					<button
						type="button"
						className="red"
						onClick={() => {
							history.goBack();
						}}
					>
						<FiXCircle size={16} />
						Cancelar e Voltar
					</button>
				</div>
			</form>
		</ContainerGeral>
	);
}
