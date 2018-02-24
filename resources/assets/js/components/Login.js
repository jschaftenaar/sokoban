import React from 'react';
import {setEmail, setPassword, attemptLogin, loginFailure, loginSuccess} from '../actions/user.js';
import {switchState} from '../actions/game.js';
import Loader from '../components/Loader.js';
import $ from "jquery";

export default function Login(props) {

    const
        state = props.store.getState(),
        user = state.user;

    const onEmailChange = (event) => {
        event.preventDefault();
        props.store.dispatch(setEmail(event.target.value));
    }

    const onPasswordChange = (event) => {
        event.preventDefault();
        props.store.dispatch(setPassword(event.target.value));
    }

    const onAttemptLogin = (event) => {
        event.preventDefault();
        props.store.dispatch(attemptLogin());

        $.ajax({
            method: 'POST',
            url: '/login',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            data: {
                email: user.email,
                password: user.password,
                _token: state.csrf
            }
        }).
        done((response) => {
            props.store.dispatch(loginSuccess(response))
            props.store.dispatch(switchState('MENU'));
        }).
        fail((xhrRequest, status) => {
            props.store.dispatch(errorHappened(JSON.parse(xhrRequest.responseText)));
        });

    }

    function displayErrors(errors) {
        if (!errors) {
            return '';
        }

        let items = [];
        let counter = 0;
        Object.keys(errors).forEach(function (index) {
            items.push(<li key={counter}>{errors[index]}</li>);
            counter++;
        });

        return <ul>{items}</ul>;
    };

    if (props.store.getState().user.attemptingLogin) {
        return <Loader/>;
    } else {
        return (
            <div>
                {displayErrors(user.loginFailureReason)}
                <fieldset>
                    <label>Email</label>
                    <input
                        type="text"
                        onChange={onEmailChange}
                        value={props.store.getState().user.email}
                    />
                </fieldset>
                <fieldset>
                    <label>Password</label>
                    <input
                        type="password"
                        onChange={onPasswordChange}
                        value={props.store.getState().user.password}
                    />
                </fieldset>
                <button onClick={onAttemptLogin}>Submit</button>
                or login with<br/>
                <a href="/login/facebook">facebook</a><br/>
                <a href="/login/twitter">twitter</a><br/>
                <a href="/login/linkedin">linkedin</a><br/>
                <a href="/login/google">google</a><br/>
                <a href="/login/github">github</a><br/>
                <a href="/login/bitbucket">bitbucket</a>
            </div>
        );
    }
}
