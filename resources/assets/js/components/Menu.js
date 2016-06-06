import React from 'react';
import {switchState} from '../actions/game.js';

export default function Menu(props) {

	const onLogoutClick = (event) => {
		props.store.dispatch({type: 'LOGOUT'});
	};

	const onLoginClick = (event) => {
	    props.store.dispatch({type: 'LOGIN'});
	};

	const user = props.store.getState().user;

	const login = user.id ?
		(<li><a href="#" onClick={onLogoutClick}>Logout</a></li>) :
		(<li><a href="#" onClick={onLoginClick}>Login</a></li>);


	return (
		<div>
			<h1>SokoBan Game</h1>
			<ul>
				<li><a href="#" onClick={props.onStartNewGameClick}>New Game</a></li>
				<li>Load Game</li>
				<li>Start Custom Scenario Pack</li>
				<li>Scenario Pack Creator</li>
				<li>About</li>
				{login}
			</ul>
		</div>
	);
}
