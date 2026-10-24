import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Post from "./components/Post";
import User from "./components/User";


const router = createBrowserRouter([
	{
		path: "/",
		Component: Layout,
		children: [
			{ index: true, Component: Home },
			{ path: "/posts/:id", Component: Post },
			{ path: "/users/:id", Component: User },
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
