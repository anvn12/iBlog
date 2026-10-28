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
			<header className="navbar">
				<div className="container">
					<NavLink to="/" className="navbar-brand">
						iBlog
					</NavLink>

					<nav>
						<ul className="navbar-nav">
							{user.profile && (
								<li>
									<NavLink to={"/users/" + user.profile.id}>
										{user.profile.username}
									</NavLink>
								</li>
							)}

							{user.JWT ? (
								<li>
									<button
										className="btn btn-secondary btn-sm"
										onClick={logout}
									>
										Log out
									</button>
								</li>
							) : (
								<>
									<li>
										<NavLink to="/login">Log in</NavLink>
									</li>
									<li>
										<NavLink to="/signup">Sign up</NavLink>
									</li>
								</>
							)}
						</ul>
					</nav>
				</div>
			</header>

			<div id="content">
				<Outlet />
			</div>

			<footer
				className="text-center text-muted"
				style={{ padding: "24px" }}
			>
				&copy; {new Date().getFullYear()} iBlog. All rights reserved.
			</footer>
		</>
	);
}

export default Layout;
