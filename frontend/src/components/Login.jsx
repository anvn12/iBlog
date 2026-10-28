import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import AuthContext from "../context/AuthContext";

const LOGIN_URL = import.meta.env.VITE_SERVER_URL + "/auth/login";

function Login() {
	const navigate = useNavigate();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);
	const [validationErrors, setValidationErrors] = useState([]);

	const user = useContext(AuthContext);
	useEffect(() => {
		if (user.JWTToken) {
			navigate("/");
		}
	}, [navigate, user.JWTToken]);

	function handleChangeUsername(event) {
		setUsername(event.target.value);
	}
	function handleChangePassword(event) {
		setPassword(event.target.value);
	}

	async function handleSubmit(event) {
		event.preventDefault();
		setError(null);
		setValidationErrors([]);

		try {
			const res = await fetch(LOGIN_URL, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: username.trim(),
					password: password,
				}),
			});

			const result = await res.json();

			if (!res.ok) {
				if (result.errors) {
					setValidationErrors(result.errors);
				} else {
					setError(
						result.error || result.message || "Failed to log in."
					);
				}
				return;
			}

			if (result.token) {
				user.changeJWT(result.token);
				navigate("/");
			} else {
				setError("Invalid response received from server.");
			}
		} catch (err) {
			console.error(err);
			setError("Unable to connect to the server. Please try again.");
		}
	}

	return (
		<main className="container">
			<div className="page-header">
				<h1>Welcome Back</h1>
				<p>Sign in to your account</p>
			</div>

			<div
				className="card"
				style={{ maxWidth: "480px", margin: "0 auto" }}
			>
				<div className="card-body">
					<form onSubmit={handleSubmit}>
						{error && (
							<div className="form-group">
								<p
									className="text-muted"
									style={{ color: "#ef4444" }}
								>
									{error}
								</p>
							</div>
						)}

						<div className="form-group">
							{validationErrors
								.filter((error) => error.path === "username")
								.map((error, i) => {
									return (
										<p key={i} style={{ color: "#ef4444" }}>
											{error.msg}
										</p>
									);
								})}
							<label className="form-label" htmlFor="username">
								Username
							</label>
							<input
								type="text"
								name="username"
								id="username"
								className="form-input"
								value={username}
								autoFocus
								onChange={handleChangeUsername}
								placeholder="Enter your username"
							/>
						</div>

						<div className="form-group">
							{validationErrors
								.filter((error) => error.path === "password")
								.map((error, i) => {
									return (
										<p key={i} style={{ color: "#ef4444" }}>
											{error.msg}
										</p>
									);
								})}
							<label className="form-label" htmlFor="password">
								Password
							</label>
							<input
								type="password"
								name="password"
								id="password"
								className="form-input"
								value={password}
								onChange={handleChangePassword}
								placeholder="Enter your password"
							/>
						</div>

						<button
							type="submit"
							className="btn btn-primary"
							style={{ width: "100%" }}
						>
							Log in
						</button>
					</form>
				</div>
				<div>
					<span>Or create a new account?</span>
					&nbsp;
					<Link to="/signup">Sign up</Link>
				</div>
			</div>
		</main>
	);
}

export default Login;
