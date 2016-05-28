import React from 'react';
export default function Game(props) {

	const state = props.store.getState(),
	    level = state.level,
	    gameMap = level.map.map(function(row, index) {
			const cells = row.map(function(cell, index) {
				const mapCharToStyle = {
					player: '@',
					playerGoal: '+',
					wall: '#',
					box: '$',
					boxGoal: '*',
					goal: '.',
					floor: ' -_'
				};

				const itemStyle = {
					background: level.style[Object.keys(mapCharToStyle).find(function(key) {
						if (mapCharToStyle[key].indexOf(cell)!==-1) {
							return key;
						}
					})]
				};

				return (
					<div className="gameCell" style={itemStyle} key={index}></div>
				);
			}
		);

		return (
			<div className="gameRow" key={index} >
				{cells}
			</div>
		);
	});

	const nextLevel = level.finished ? <button onClick={props.progressLevel}>Next Level(Space)</button> : '';

	return (
		<div>
			({state.scenario.currentLevel+1} / {state.scenario.levels.length}) - {level.title}
			{gameMap}
			<button onClick={props.resetLevel}>Reset Level(Esc)</button>
			{level.boxMoves+level.floorMoves}
			{nextLevel}
		</div>
	);
}
