// store.js
import React, { createContext, useReducer } from 'react';

const currentUser = {
	token: '',
	userEmail: '',
	userName: '',
};
const store = createContext(currentUser);
const { Provider } = store;

const StateProvider = ({ children }) => {
	const [state, dispatch] = useReducer((state, action) => {
		switch (action.type) {
			case 'LOGIN':
				return {
					token: action.token,
					userEmail: action.userEmail,
					userName: action.userName,
				};
			default:
				throw new Error();
		}
	}, currentUser);

	return <Provider value={{ state, dispatch }}>{children}</Provider>;
};
export { store, StateProvider };
