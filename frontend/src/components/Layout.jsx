import { NavLink } from "react-router";
import { Outlet } from "react-router";

function Layout() {
  const yearNow = new Date().getFullYear();
  return (
    <>
      <header>
        <nav>
          <NavLink to="/">iBlog</NavLink>
          <NavLink to="/login">Log in</NavLink>
          <NavLink to="/signup">Sign up</NavLink>
        </nav>
      </header>

      <Outlet />

      <footer>&copy; {yearNow} iBlog. All rights reserved.</footer>
    </>
  );
}

export default Layout;
