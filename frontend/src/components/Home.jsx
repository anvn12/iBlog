import { useContext } from "react";
import AuthContext from "../context/AuthContext";

function Home() {
  const user = useContext(AuthContext);


  return (
    <div>
      <h1>Home</h1>

      <p>JWT: {user.JWT || "None"}</p>
    </div>
  );
}

export default Home;
