import React from 'react';
import ReactDOM from 'react-dom';
import store from './store.js';
import Menu from './components/Menu.js';
import Game from './components/Game.js';
import Loader from './components/Loader.js';
import Login from './components/Login.js';
import $ from "jquery";
import {switchState, initializeFailure, loadUser, movePlayer} from './actions/game.js';


import '../sass/app.scss';

function addMyKeyboardEvent(element, eventName, callback) {
    if (element.addEventListener) {
        element.addEventListener(eventName, callback, false);
    } else if (element.attachEvent) {
        element.attachEvent("on" + eventName, callback);
    } else {
        element["on" + eventName] = callback;
    }
};

var SokoBanGame = React.createClass({

    componentWillMount:function() {
        addMyKeyboardEvent(document, "keydown", (event) => {
            const state = store.getState();
            event = event || window.event;
            if (state.state=='GAME') {
                if (state.level.finished && event.keyCode==32) {
                    if (state.scenario.currentLevel==state.scenario.levels.length-1) {
                        store.dispatch(switchState('MENU'));
                    } else {
                        this.progressLevel(event);
                    }
                }
                if (event.keyCode=='27') {
                    this.resetLevel(event);
                }
                if (!state.level.finished) {
                    switch (event.keyCode) {
                        case 38:
                            store.dispatch(movePlayer('UP'));
                        break;

                        case 40:
                            store.dispatch(movePlayer('DOWN'));
                        break;
                        
                        case 37:
                            store.dispatch(movePlayer('LEFT'));
                        break;
                        
                        case 39:
                            store.dispatch(movePlayer('RIGHT'));
                        break;
                    }
                }
            }
        });
    },

    resetLevel: function(event) {
        event && event.preventDefault();
        store.dispatch({
            type:'LOAD_LEVEL',
            scenario: store.getState().scenario
        });
    },
  
    progressLevel: function(event) {
        event && event.preventDefault();
        store.dispatch({
            type: 'PROGRESS_LEVEL'
        });
        store.dispatch({
            type: 'LOAD_LEVEL',
            scenario: store.getState().scenario
        });
    },
  
    render: function () {
        let gameState = '';
        const state = store.getState();
        switch (state.state) {
            case 'GAME':
                gameState = (
                    <Game
                        store={store}
                        resetLevel={this.resetLevel}
                        progressLevel={this.progressLevel}
                        backToMenu={this.backToMenu}
                    />
                );
            break;
    
            case 'LOADING':
                gameState = <Loader/>;
            break;
    
            case 'LOGIN':
                gameState = (
                    <Login
                        store={store}
                        attemptLogin={this.attemptLogin}
                    />
                );
            break;
    
            case 'ERROR':
                gameState = (<div>Error happened</div>);
            break;
    
            default: 
                gameState = (
                    <Menu
                        store={store}
                        onStartNewGameClick={this.startGame}
                        onLoadGame={this.loadGame}
                        onAboutGame={this.aboutGame}
                        onLoginClick={this.loginAccount}
                    />
                );
            break;
        }
        return (
            <div className="container">
                {gameState}
            </div>
        )
    },
  
    startGame: function(event) {
        event.preventDefault();
        this.loadScenario('mappack1');
    },
  
    loadScenario: function(scenario) {
        store.dispatch(switchState('LOADING'));
        fetch('/index.php/scenario/'+scenario+'.json',{
            method: 'get'
        })
        .then((response) => {
            if (response.ok) {
                return response.json();  
            } else {
                throw new Error(response.statusText);
            }
        })
        .then((data) => {
            store.dispatch({
                type: 'LOAD_SCENARIO',
                scenario: data
            });
            store.dispatch({
                type: 'LOAD_LEVEL',
                scenario: store.getState().scenario
            });
            store.dispatch(switchState('GAME'));
        })
        .catch((error) => {
            store.dispatch(switchState('ERROR'));
            console.log(error);
        });
    }
})

const targetGameElement = document.getElementById('SokoBanGame');

const render = () => {
    ReactDOM.render(
        <SokoBanGame store={store}/>,
        targetGameElement 
    )
};

store.subscribe(render);

store.dispatch({
    type: 'SET_CSRF',
    csrf: targetGameElement.getAttribute("csrf")
});

$.ajax({
    method: 'POST',
    url: '/user',
    dataType: 'json',
    xhrFields: {
        withCredentials: true
    },
    data: {
        _token: store.getState().csrf
    }
}).
done((response) => {
    if (response.id && response.name) {
        store.dispatch(loadUser(response))
    }
    store.dispatch(switchState('MENU'));
}).
fail((xhrRequest, status) => {
    store.dispatch(initializeFailure(JSON.parse(xhrRequest.responseText)));
});
