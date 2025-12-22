import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
// import ProtectedRoute from "./components/ProtectedRoute";
import ErrorPage from "./components/ErrorPage";
import Layout from "./components/Layout";
// import { HostQueueLoader } from "./pages/host-queues/loader";
import CustomerLayout from "./components/CustomerLayout";
import CreateQueue from "./pages/CreateQueue";
// import HostQueues from "./pages/host-queues/HostQueues";
import Home from "./pages/Home";
import JoinQueue from "./pages/join-queue/JoinQueue";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
// import { JoinQueueLoader } from "./pages/join-queue/loader";
import CustomerView from "./pages/CustomerView";
// import HostQueueDetails from "./pages/HostQueueDetails";
// import Analytics from "./pages/Analytics";
import QR from "./pages/QR";
import { QueryProvider } from "./providers/QueryProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import HostQueues from "./pages/host-queues/HostQueues";
import HostQueueDetails from "./pages/HostQueueDetails";


const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      //     // Host Views
      {
        element: <CustomerLayout />,
        children: [
          {
            path: "/queue/:qrCode/customer",
            element: (
              <CustomerView />
            ),
          },
          {
            path: "/join/:qrCode",
            element: (
              <JoinQueue />
            ),
          },
          {
            path: "/create",
            element: (
              <ProtectedRoute>
                <CreateQueue />
              </ProtectedRoute>
            )
          }
        ]
      },
      {
        path: "/my-queues",
        element: (
          <ProtectedRoute>
            <HostQueues />
          </ProtectedRoute>
        ),
      },
      {
        path: "/my-queues/:queueId",
        element: (
          <ProtectedRoute>
            <HostQueueDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "/qr/:queueId",
        element: (
          <ProtectedRoute>
            <QR />
          </ProtectedRoute>
        ),
      },
      //     {
      //       path: "/analytics",
      //       element: (
      //         <ProtectedRoute>
      //           <Analytics />
      //         </ProtectedRoute>
      //       ),
      //     },


      //     // Auth Views
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/register",
        element:
          <Signup />
      },
    ]
  }
]);
function App() {


  return (
    <QueryProvider>
      {/* <AuthProvider> */}
      <RouterProvider router={router} />
      {/* </AuthProvider> */}
    </QueryProvider>
  );
}

export default App;
