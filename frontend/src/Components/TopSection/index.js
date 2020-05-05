import React from 'react';

import './styles.scss';

export default function TopSection(props) {
	return (
		<div className="topSection">
			<h1>{props.titulo}</h1>
			{props.button ? <span>{props.button}</span> : ''}
		</div>
	);
}
