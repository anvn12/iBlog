import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router";
import AuthContext from "../context/AuthContext";

import UserModal from "./UserModal";


const USERS_URL = import.meta.env.VITE_SERVER_URL + "/users";


function User() {
    const params = useParams();
    const userId = params.id;

    const user = useContext(AuthContext);


    const [reloadUser, setReloadUser] = useState(false); // change this var to reload
    const [displayUser, setdisplayUser] = useState(null);


    // Fetch user
    useEffect(() => {
        async function fetchUser() {
            const TARGET_URL = USERS_URL + '/' + userId;
            try {
                const res = await fetch(TARGET_URL);
                const result = await res.json();

                setdisplayUser(result.user);
            } catch (err) {
                console.error(err);
            }
        }

        fetchUser();
    }, [userId, reloadUser]);


    // edit user profile
    const [validationErrors, setValidationErrors] = useState([]);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);

    function showEditUserModal() {
        setIsUserModalOpen(true);
    }

    async function editUser(username, name, email) {
        const TARGET_URL = USERS_URL + '/' + userId;

        try {
            const res = await fetch(TARGET_URL, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.JWT}`
                },
                body: JSON.stringify({
                    username: username.trim() || "",
                    name: name.trim() || "",
                    email: email.trim() || "",
                })
            });

            const result = await res.json();

            if (!res.ok) {
                if (result.errors) {
                    setValidationErrors(result.errors);
                }
                return;
            }

            setValidationErrors([]);
            setIsUserModalOpen(false);

            reload();
        } catch (err) {
            console.error(err);
        }
    }

    if (!displayUser) {
        return <></>
    }

    function reload() {
        setReloadUser(!reloadUser)
    }

    return (
        <main className="container">
            <div>
                <div>
                    <p>Username: {displayUser.username || "Null"}</p>
                    <p>Name: {displayUser.name || "Null"}</p>
                    <p>Email: {displayUser.email || "Null"}</p>
                </div>

                <div>
                    {(user.profile && user.profile.id === displayUser.id) && (
                        <button onClick={showEditUserModal}>Edit</button>
                    )}
                </div>

                <div>
                    <Link to={"/users/" + userId + "/posts"}>View posts</Link>
                </div>
            </div>

            <div>
                <UserModal
                    modalTitle="Edit Profile"
                    isOpen={isUserModalOpen}
                    setIsOpen={setIsUserModalOpen}
                    profile={displayUser}
                    targetFunction={editUser}
                    validationErrors={validationErrors}
                />
            </div>
        </main>
    );
}

export default User;
