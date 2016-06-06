export function setEmail(email) {
	return {
		type: 'SET_EMAIL',
		email
	};
}

export function setPassword(password) {
	return {
		type: 'SET_PASSWORD',
		password
	}
}

export function attemptLogin() {
	return {
		type: 'ATTEMPT_LOGIN'
	}
}

export function loginSuccess(user) {
	return {
		type: 'SET_USER',
		user
	}
}

export function loginFailure(reason) {
	return {
		type: 'LOGIN_FAILURE',
		reason
	}
}

export function logoutUser() {
	return {
		type: 'LOGOUT_USER'
	}
}
