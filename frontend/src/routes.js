import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Login from './Pages/Login';
import RegisterUser from './Pages/RegisterUser';
import LinksList from './Pages/LinksList';
import NewLink from './Pages/NewLink';

export default function Routes() {
	return (
		<BrowserRouter>
			<Switch>
				<Route path="/" exact component={Login} />
				<Route path="/register" component={RegisterUser} />
				<Route path="/links" component={LinksList} />
				<Route path="/links/new" component={NewLink} />
			</Switch>
		</BrowserRouter>
	);
}
