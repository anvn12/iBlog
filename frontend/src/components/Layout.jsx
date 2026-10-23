import { NavLink, Outlet } from "react-router";
import { useContext } from "react";

import AuthContext from "../context/AuthContext";

function Layout() {
	const user = useContext(AuthContext);


	function logout() {
		user.removeJWT();
	}


	return (
		<>
			<header>
				<nav>
					<NavLink to="/">iBlog</NavLink>
					{user.JWT ? (
						<button onClick={logout}>Log out</button>
					) : (
						<>
							<NavLink to="/login">Log in</NavLink>
							<NavLink to="/signup">Sign up</NavLink>
						</>
					)}
				</nav>
			</header>

			<div id="content">
				<Outlet />
			</div>

			<footer>&copy; {new Date().getFullYear()} iBlog. All rights reserved.</footer>
		</>
	);
}

export default Layout;
