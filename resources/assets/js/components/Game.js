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

    const nextButton = () => {
        if (level.finished && state.scenario.currentLevel==state.scenario.levels.length-1) {
            return <button onClick={props.backToMenu}>Yay - You won! Back to Menu(Space)</button>
        } else if (level.finished) {
            return <button onClick={props.progressLevel}>Next Level(Space)</button>
        } else {
            return '';
        }
    }

    const menuButton = () => {
        return (<button onClick={props.backToMenu}>Back to Menu</button>)
    }

    return (
        <div>
            {menuButton()}
            ({state.scenario.currentLevel+1} / {state.scenario.levels.length}) - {level.title}
            {gameMap}
            <button onClick={props.resetLevel}>Reset Level(Esc)</button>
            {level.boxMoves+level.floorMoves}
            {nextButton()}
        </div>
    );
}
