import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
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
                        result.error || result.message || "Failed to log in.",
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
        <>
            <h1>Login</h1>

            <main>
                <form onSubmit={handleSubmit}>
                    {error && (
                        <section>
                            <p>{error}</p>
                        </section>
                    )}

                    <section>
                        {validationErrors
                            .filter((error) => error.path === "username")
                            .map((error, i) => {
                                return <p key={i}>{error.msg}</p>;
                            })}

                        <label htmlFor="username">Username*</label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            value={username}
                            autoFocus
                            onChange={handleChangeUsername}
                            placeholder="Username"
                        />
                    </section>

                    <section>
                        {validationErrors
                            .filter((error) => error.path === "password")
                            .map((error, i) => {
                                return <p key={i}>{error.msg}</p>;
                            })}

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

                    <button type="submit">Log in</button>
                </form>
            </main>
        </>
    );
}

export default Login;
