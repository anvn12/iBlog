// import { useState } from 'react'

function Home() {
  const token = localStorage.getItem("JWT token") || null;
  // let isAuth = token ? true : false;

  return (
    <div>
      <h1>Home</h1>

      <p>Is auth: {token}</p>
    </div>
  );
}

export default Home;
