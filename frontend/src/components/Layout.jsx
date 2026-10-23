import { NavLink } from "react-router";
import { Outlet } from "react-router";

import { useContext } from "react";
import AuthContext from "../context/AuthContext";

function Layout() {

	const user = useContext(AuthContext);
	console.log('user', user);


	const yearNow = new Date().getFullYear();
	return (
		<>
			<header>
				<nav>
					<NavLink to="/">iBlog</NavLink>
					<NavLink to="/login">Log in</NavLink>
					<NavLink to="/signup">Sign up</NavLink>
					<NavLink to="/logout">Log out</NavLink>
				</nav>
			</header>

			<Outlet />

			<footer>&copy; {yearNow} iBlog. All rights reserved.</footer>
		</>
	);
}

export default Layout;
