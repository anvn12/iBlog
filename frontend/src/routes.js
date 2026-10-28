import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Post from "./components/Post";
import User from "./components/User";
import UserPosts from "./components/UserPosts";

import { redirect } from "react-router";
// import { userContext } from "~/context";

const router = createBrowserRouter([
	{
		path: "/",
		loader: loader,
		Component: Layout,
		children: [
			{
				index: true,
				Component: Home,
			},
			{
				path: "/posts/:id",
				Component: Post,
			},
			{ path: "/users/:id", Component: User },
			{ path: "/users/:id/posts", Component: UserPosts },
		],
	},
	{
		path: "login",
		Component: Login,
	},
	{
		path: "signup",
		Component: Signup,
	},
]);

async function authMiddleware({ context }) {
	// const userId = getUserId();

	if (!userId) {
		throw redirect("/login");
	}

	// context.set(userContext, await getUserById(userId));
}

async function loader() {
	console.log("loading");

	return { message: "Hello, world!" };
}

export default router;
