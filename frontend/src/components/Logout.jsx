import { useNavigate } from "react-router";

function Logout() {
  const navigate = useNavigate();

  localStorage.removeItem("JWT token");

  navigate("/");

  return <></>;
}

export default Logout;
