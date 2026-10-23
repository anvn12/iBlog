import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";


const router = createBrowserRouter([
	{
		path: "/",
		Component: Layout,
		children: [
			{ index: true, Component: Home },
			// { path: "about", Component: About },
		],
	},
	{
		path: "login",
		Component: Login,
	},
	{
		path: "signup",
		Component: Signup,
	}
]);


export default router;
