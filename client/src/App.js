import { createBrowserRouter, RouterProvider } from "react-router-dom";
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

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        path: "login",
        element: <Login />
      },
      {
        path: "results",
        element: <Results />,
      },
      {
        path: "elections",
        element: <Elections />,
      },
      {
        path: "elections/:id",
        element: <ElectionDetails />,
      },
      {
        path: "elections/:id/candidates",
        element: <Candidates />,
      },
      {
        path: "congrats",
        element: <Congrats />,
      },
      {
        path: "Logout",
        element: <Logout />,
      },
      {
        path: "Register",
        element: <Register/>,
      }

    ]
  }
])

function App() {
  return (<RouterProvider router={router} />);
}

export default App;
