import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Results from "./pages/Results";
import Elections from "./pages/Elections";
import ElectionDetails from "./pages/ElectionDetails";
import Candidates from "./pages/Candidates";
import Congrats from "./pages/Congrats";
import Logout from "./pages/Logout";
import RootLayout from "./pages/RootLayout";
import ErrorPage from "./pages/ErrorPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useSelector } from "react-redux";

// 1. Create a Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = useSelector((state) => state?.vote?.currentVoter?.token);
  
  // If no token found, force redirect to Login
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // If token exists, render the requested page
  return children;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        // FIX: Wrap Elections in ProtectedRoute
        element: (
          <ProtectedRoute>
            <Elections />
          </ProtectedRoute>
        )
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "register",
        element: <Register/>,
      },
      {
        path: "results",
        // FIX: Wrap Results in ProtectedRoute
        element: (
          <ProtectedRoute>
            <Results />
          </ProtectedRoute>
        ),
      },
      {
        path: "elections",
        // FIX: Wrap Elections (direct link) in ProtectedRoute
        element: (
          <ProtectedRoute>
            <Elections />
          </ProtectedRoute>
        ),
      },
      {
        path: "elections/:id",
        // FIX: Wrap Details in ProtectedRoute
        element: (
          <ProtectedRoute>
            <ElectionDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "elections/:id/candidates",
        // FIX: Wrap Candidates in ProtectedRoute
        element: (
          <ProtectedRoute>
            <Candidates />
          </ProtectedRoute>
        ),
      },
      {
        path: "congrats",
        // FIX: Wrap Congrats in ProtectedRoute
        element: (
          <ProtectedRoute>
            <Congrats />
          </ProtectedRoute>
        ),
      },
      {
        path: "logout",
        element: <Logout />,
      }
    ]
  }
])

function App() {
  return (<RouterProvider router={router} />);
}

export default App;