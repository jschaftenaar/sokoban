import React from 'react';
import {switchState} from '../actions/game.js';
import {logoutUser} from '../actions/user.js';
import $ from "jquery";

export default function Menu(props) {

    const onLogoutClick = (event) => {
        event.preventDefault();
        props.store.dispatch(switchState('LOADING'));
        $.ajax({
            method: 'GET',
            url: '/logout',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            }
        }).
        done((response) => {
            props.store.dispatch(logoutUser())
            props.store.dispatch(switchState('MENU'));
        }).
        fail((xhrRequest, status) => {
            props.store.dispatch(errorHappened(JSON.parse(xhrRequest.responseText)));
        });
        
    };

    const onLoginClick = (event) => {
        event.preventDefault();
        props.store.dispatch(switchState('LOGIN'));
    };

    const user = props.store.getState().user;

    const login = user.id ?
        (<li><a href="#" onClick={onLogoutClick}>Logout</a></li>) :
        (<li><a href="#" onClick={onLoginClick}>Login</a><br/>Gives options to edit maps, save and load games</li>);

    let newMap = '';
    let loadMap = '';
    let loadGame = '';

    if (user.id) {
        loadGame = (<li>Load Game</li>);
        newMap = (<li>Editor - New Map</li>);
        loadMap = (<li>Editor - Load Map</li>);
    }


    return (
        <div>
            <h1>SokoBan Game</h1>
            <ul>
                <li onClick={props.onStartNewGameClick}>New Game</li>
                <li>Community Scenarios</li>
                {loadGame}
                {newMap}
                {loadMap}
                <li>About</li>
                {login}
            </ul>
        </div>
    );
}
