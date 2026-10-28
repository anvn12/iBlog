import { Link } from "react-router";

function NotFound() {
	return (
		<main className="container">
			<div>
				<h1>Not found route</h1>
				<Link to="/">Back to Home</Link>
			</div>
		</main>
	);
}

export default NotFound;
