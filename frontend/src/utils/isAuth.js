function isLoggedIn(user) {
	if (user.JWT) {
		return true;
	}
	return false;
}

export { isLoggedIn };
