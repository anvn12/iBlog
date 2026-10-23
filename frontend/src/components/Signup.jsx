import { useState } from "react";
import { useNavigate } from "react-router";


const SIGNUP_URL = import.meta.env.VITE_SERVER_URL + "/auth/signup";


function Signup() {
	const navigate = useNavigate();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState(null);
	const [validationErrors, setValidationErrors] = useState([]);


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
				localStorage.setItem("JWT token", result.token);
				navigate("/");
			} else {
				setError("Invalid response received from server.");
			}
		} catch (error) {
			console.error(err);
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
		<>
			<h1>Sign up</h1>

			<main>
				<form onSubmit={handleSubmit}>
					{error && (
						<section>
							<p>{error}</p>
						</section>
					)}

					<section>
						{getFieldError("username")}
						<label htmlFor="username">Username*</label>
						<input
							type="text"
							name="username"
							id="username"
							value={username}
							onChange={handleChangeUsername}
							placeholder="Username"
						/>
					</section>

					<section>
						{getFieldError("password")}
						<label htmlFor="password">Password*</label>
						<input
							type="password"
							name="password"
							id="password"
							value={password}
							onChange={handleChangePassword}
							placeholder="Password"
						/>
					</section>

					<section>
						{getFieldError("confirmPassword")}
						<label htmlFor="confirmPassword">Confirm Password*</label>
						<input
							type="password"
							name="confirmPassword"
							id="confirmPassword"
							value={confirmPassword}
							onChange={handleChangeConfirmPassword}
							placeholder="Confirm Password"
						/>
					</section>

					<button type="submit">Sign up</button>
				</form>
			</main>
		</>
	);
}

export default Signup;
