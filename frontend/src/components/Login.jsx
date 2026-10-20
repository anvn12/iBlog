import { useState } from "react";
import { useNavigate } from "react-router";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);

  function handleChangeUsername(event) {
    setUsername(event.target.value);
  }
  function handleChangePassword(event) {
    setPassword(event.target.value);
  }

  const loginURL = import.meta.env.VITE_SERVER_URL + "/auth/login";
  function sendLoginForm() {
    fetch(loginURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.error) {
          setError(result.error);
        } else if (result.errors) {
          setValidationErrors(result.errors);
        } else {
          localStorage.setItem("JWT token", result.token);

          navigate("/");
        }
      })

      .catch((err) => {
        console.error(err);
      });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setValidationErrors([]);

    sendLoginForm();
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
