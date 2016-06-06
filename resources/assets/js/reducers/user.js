export default function user(state = { password: '', email: '' }, action) {

    let newState = Object.assign({}, state);

	switch (action.type) {

		case 'SET_PASSWORD':
            newState.password = action.password;
		break;

		case 'SET_EMAIL': 
            newState.email = action.email;
		break;

		case 'ATTEMPT_LOGIN':
            newState.attemptingLogin = true;
		break;

		case 'SET_USER':
			newState.attemptingLogin = false;
			newState.name = action.user.name;
			newState.email = action.user.email;
			newState.id = action.user.id;
		break;

		case 'LOGIN_FAILURE':
			newState.attemptingLogin = false;
			newState.loginFailureReason = action.reason;
		break;

	}

    return newState;
}
