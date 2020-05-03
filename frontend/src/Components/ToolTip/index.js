import React from 'react';

import './styles.scss';

export default function ToolTip({ text }) {
	return <div className="toolTip">{text ? <small className="toolTipText">{text}</small> : <small className="toolTipText">Not Set</small>}</div>;
}
