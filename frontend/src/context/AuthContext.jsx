import { createContext, useState } from 'react'

// Initiate Context
const AuthContext = createContext(null);

// Provide Context
function AuthProvider({ children }) {
    const [JWT, setJWT] = useState(localStorage.getItem("JWT"));

    function changeJWT(value) {
        if (value === null) {
            removeJWT();
            return;
        }

        localStorage.setItem("JWT", value);
        setJWT(value);
    }

    function removeJWT() {
        localStorage.removeItem("JWT");
        setJWT(null);
    }

    return (
        <AuthContext.Provider value={{ JWT, changeJWT, removeJWT }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
export { AuthProvider };
