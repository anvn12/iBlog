import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router";
import AuthContext from "../context/AuthContext";

const SIGNUP_URL = import.meta.env.VITE_SERVER_URL + "/auth/signup";


function Signup() {
	const navigate = useNavigate();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
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
	function handleChangeConfirmPassword(event) {
		setConfirmPassword(event.target.value);
	}


	async function handleSubmit(event) {
		event.preventDefault();
		setError(null);
		setValidationErrors([]);


		// Client-side quick check
		if (password !== confirmPassword) {
			setValidationErrors([
				{ path: "confirmPassword", msg: "Passwords do not match" },
			]);
			return;
		}

		try {
			const res = await fetch(SIGNUP_URL, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username,
					password,
					confirmPassword,
				}),
			});

			const result = await res.json();

			if (!res.ok) {
				if (result.errors) {
					setValidationErrors(result.errors);
				} else {
					setError(result.error || result.message || "Failed to sign up.");
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
			setError("Unable to connect to the server. Please try again later.");
		}
	}

	function getFieldError(fieldName) {
		return validationErrors
			.filter((err) => err.path === fieldName)
			.map((err, i) => (
				<p key={i} role="alert" style={{ color: "red" }}>
					{err.msg}
				</p>
			));
	}

	return (
		<main className="container">
			<div className="page-header">
				<h1>Create Account</h1>
				<p>Join our community today</p>
			</div>

			<div className="card" style={{ maxWidth: '480px', margin: '0 auto' }}>
				<div className="card-body">
					<form onSubmit={handleSubmit}>
						{error && (
							<div className="form-group">
								<p style={{ color: '#ef4444' }}>{error}</p>
							</div>
						)}

						<div className="form-group">
							{getFieldError("username")}
							<label className="form-label" htmlFor="username">Username</label>
							<input
								type="text"
								name="username"
								id="username"
								className="form-input"
								value={username}
								autoFocus
								onChange={handleChangeUsername}
								placeholder="Choose a username"
							/>
						</div>

						<div className="form-group">
							{getFieldError("password")}
							<label className="form-label" htmlFor="password">Password</label>
							<input
								type="password"
								name="password"
								id="password"
								className="form-input"
								value={password}
								onChange={handleChangePassword}
								placeholder="Create a password"
							/>
						</div>

						<div className="form-group">
							{getFieldError("confirmPassword")}
							<label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
							<input
								type="password"
								name="confirmPassword"
								id="confirmPassword"
								className="form-input"
								value={confirmPassword}
								onChange={handleChangeConfirmPassword}
								placeholder="Confirm your password"
							/>
						</div>

						<button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Sign up</button>
					</form>
				</div>
				<div>
					<span>Already has an account?</span>
					&nbsp;
					<Link to="/login">Log in</Link>
				</div>
			</div>
		</main>
	);
}

export default Signup;
