import React from 'react';

import './styles.scss';

export default function Modal(props) {
	function handleModal() {
		props.parentCallback();
	}
	return (
		<div className={`modalWrapper ${props.show ? 'show' : ''}`}>
			<div className="modal">
				<span className="modalTitle">{props.title}</span>
				<div className="modalBody">{props.children}</div>
			</div>
			<div className="overlay" onClick={handleModal}></div>
		</div>
	);
}
