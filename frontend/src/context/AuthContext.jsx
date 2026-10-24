import { createContext, useState, useEffect } from 'react'


const GET_MY_PROFILE_URL = import.meta.env.VITE_SERVER_URL + "/users/me";


// Initiate Context
const AuthContext = createContext(null);



// Provide Context
function AuthProvider({ children }) {
    const [JWT, setJWT] = useState(localStorage.getItem("JWT"));

    const [profile, setProfile] = useState(null);


    // fetch user info (username, id)
    useEffect(() => {
        async function getUserProfile() {
            if (JWT) {
                const res = await fetch(GET_MY_PROFILE_URL, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${JWT}`
                    }
                });

                const payload = await res.json();

                setProfile(payload.payload.user);
            }
        }

        getUserProfile();
    }, [JWT]);

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
        setProfile(null);
    }

    return (
        <AuthContext.Provider value={{ JWT, changeJWT, removeJWT, profile, setProfile }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
export { AuthProvider };
