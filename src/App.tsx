import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorPage from "./components/ErrorPage";

import { JoinQueueLoader } from "./pages/join/[queueId]/loader";
import { HostQueueLoader } from "./pages/my-queues/loader";
import Layout from "./pages/Layout";
import CustomerLayout from "./components/CustomerLayout";
import CreateQueue from "./pages/create/CreateQueue";
import HostQueues from "./pages/my-queues/HostQueues";
import HostQueueDetails from "./pages/my-queues/[queueId]/HostQueueDetails";
import QR from "./pages/qr/[queueId]/QR";
import Analytics from "./pages/analytics/Analytics";
import Home from "./pages/Home";
import JoinQueue from "./pages/join/[queueId]/JoinQueue";
import CustomerView from "./pages/queue/[queueId]/customer/[customerId]/CustomerView";
import Login from "./pages/login/Login";
import Signup from "./pages/register/Signup";


const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    element: <CustomerLayout />,
    children: [
      // Customer Views
      {
        path: "/join/:queueId",
        element: (
          <JoinQueue />
        ),
        loader: JoinQueueLoader
      },
      {
        path: "/queue/:queueId/customer/:customerId",
        element: (
          <CustomerView />
        ),
      },
    ]
  },
  {
    errorElement: <ErrorPage />,
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      // Host Views
      {
        element: <CustomerLayout />,
        children: [
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
        loader: HostQueueLoader
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
      {
        path: "/analytics",
        element: (
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        ),
      },


      // Auth Views
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
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
