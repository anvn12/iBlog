import { createContext, useState } from 'react'

// Initiate Context
const AuthContext = createContext(null);

// Provide Context
function AuthProvider({ children }) {
    const [JWTToken, setJWTToken] = useState(localStorage.getItem("JWT token"));

    function changeJWT(value) {
        localStorage.setItem("JWT token", value);
        setJWTToken(value);
    }

    return (
        <AuthContext.Provider value={{ JWTToken, changeJWT }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
export { AuthProvider };
