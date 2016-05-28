import React from 'react';
export default function Menu(props) {
	return (
		<div>
			<h1>SokoBan Game</h1>
			<ul>
				<li><a href="#" onClick={props.onStartGame}>New Game</a></li>
				<li>Load Custom Scenario Pack</li>
				<li>Load Game</li>
				<li>Scenario Pack Creator</li>
				<li>About</li>
				<li>Test2</li>
			</ul>
		</div>
	);
}
