import { RouterProvider } from "react-router/dom";

import router from "./routes"

const App = () => {
    // can have 2 routers: private, public

    return (
        <RouterProvider router={router} />
    );
};

export default App;