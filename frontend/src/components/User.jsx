import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router";
import AuthContext from "../context/AuthContext";


const USERS_URL = import.meta.env.VITE_SERVER_URL + "/users";



function User() {
    const params = useParams();
    const userId = params.id;

    const user = useContext(AuthContext);


    // const [reload, setReload] = useState(false); // change this var to reload
    const [displayUser, setdisplayUser] = useState(null);


    // Fetch user
    useEffect(() => {
        async function fetchUser() {
            const TARGET_URL = USERS_URL + '/' + userId;
            try {
                const res = await fetch(TARGET_URL);
                const result = await res.json();

                console.log('fetch user profile', result);

                setdisplayUser(result.user);
            } catch (err) {
                console.error(err);
            }
        }

        fetchUser();
    }, [userId]);


    if (!displayUser) {
        return <></>
    }

    return (
        <main>
            <p>Username: {displayUser.username || "Null"}</p>
            <p>Name: {displayUser.name || "Null"}</p>
            <p>Email: {displayUser.email || "Null"}</p>

            {/* {(user.profile && user.profile.id === displayUser.id) && (
                <button>Edit</button>
            )} */}
        </main>
    );
}

export default User;
