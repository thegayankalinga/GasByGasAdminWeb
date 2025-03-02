import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "./../provider/authProvider";
import { ProtectedRoute } from "./../utils/ProtectedRoute";
import Login from "./../pages/auth/Login";
import NotFound from "./../pages/notfound/NotFound";
import Home from "./../pages/common/Home";
import Register from "./../pages/auth/Register";
import SystemUser from "../scenes/SystemUser";
import UserService from "../services/user.service";
import {
    Dashboard,
    Outlets,
    Team,
    Tokens,Users
} from "./../scenes";

import {
    AdminDashboard,
    UserManagement,
    OutLets
} from "./../scenes/admin";

const Routes = () => {
    const { token } = useAuth();
    const user = UserService.getCurrentUser();

    const routesForPublic = [
        {
            path: "/",
            element: <Home/>,
        },
        {
            path: "*",
            element: <NotFound/>,
        }
    ];

    const routesForManagerAuthenticatedOnly = [
        {
            path: "/manager",
            element: <SystemUser />,
            children: [
                {
                    path: "/manager/",
                    element: <Dashboard />,
                },
                {
                    path: "/manager/mytoken",
                    element: <Tokens/>,
                },
                {
                    path: "/manager/outlets",
                    element: <Outlets/>,
                },
                {
                    path: "/manager/users",
                    element: <Users />,
                }
            ],
        },
    ];

    const routesForAdminAuthenticatedOnly = [
        {
            path: "/admin",
            element: <SystemUser />,
            children: [
                {
                    path: "/admin/",
                    element: <AdminDashboard />,
                },
                {
                    path: "/admin/users",
                    element: <UserManagement />,
                },
                {
                    path: "/admin/outlets",
                    element: <OutLets />,
                }
            ],
        },
    ];


    const routesForNotAuthenticatedOnly = [
        {
            path: "/login",
            element: <Login />,
        },
        {
            path: "/register",
            element: <Register />,
        },
    ];

    const notfound =  [
        {
            path: "*",
            element: <NotFound/>,
        }
    ];

    const router = createBrowserRouter([
        ...routesForPublic,
        ...(!token ? routesForNotAuthenticatedOnly : []),
        ...(token && user.userType === 4 ? routesForManagerAuthenticatedOnly : []),
        ...(token && user.userType === 3 ? routesForAdminAuthenticatedOnly : []),
    ]);

    return <RouterProvider router={router} />;
};

export default Routes;