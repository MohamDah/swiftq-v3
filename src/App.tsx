import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import SuspLoader from "./components/SuspLoader";
import ErrorPage from "./components/ErrorPage";

import { JoinQueueLoader } from "./pages/join/[queueId]/loader";
import { HostQueueLoader } from "./pages/my-queues/loader";


// Lazy loading components for better performance
const Home = lazy(() => import("./pages/Home"));
// Host
const CreateQueue = lazy(() => import("./pages/create/CreateQueue"));
const HostQueues = lazy(() => import("./pages/my-queues/HostQueues"));
const HostQueueDetails = lazy(() => import("./pages/my-queues/[queueId]/HostQueueDetails"));
const QR = lazy(() => import("./pages/qr/[queueId]/QR"))
// Customer
const JoinQueue = lazy(() => import("./pages/join/[queueId]/JoinQueue"));
const CustomerView = lazy(() => import("./pages/queue/[queueId]/customer/[customerId]/CustomerView"));
// Auth
const Login = lazy(() => import("./pages/login/Login"));
const Signup = lazy(() => import("./pages/register/Signup"));


const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Suspense fallback={<SuspLoader />}>
          <Home />
        </Suspense>
      },
      // Host Views
      {
        path: "/create",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<SuspLoader />}>
              <CreateQueue />
            </Suspense>
          </ProtectedRoute>
        )
      },
      {
        path: "/my-queues",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<SuspLoader />}>
              <HostQueues />
            </Suspense>
          </ProtectedRoute>
        ),
        loader: HostQueueLoader
      },
      {
        path: "/my-queues/:queueId",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<SuspLoader />}>
              <HostQueueDetails />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/qr/:queueId",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<SuspLoader />}>
              <QR />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      
      
      // Customer Views
      {
        path: "/join/:queueId",
        element: (
          <Suspense fallback={<SuspLoader />}>
            <JoinQueue />
          </Suspense>
        ),
        loader: JoinQueueLoader
      },
      {
        path: "/queue/:queueId/customer/:customerId",
        element: (
          <Suspense fallback={<SuspLoader />}>
            <CustomerView />
          </Suspense>
        ),
      },



      // Auth Views
      {
        path: "/login",
        element: <Suspense fallback={<SuspLoader />}>
          <Login />
        </Suspense>
      },
      {
        path: "/register",
        element: <Suspense fallback={<SuspLoader />}>
          <Signup />
        </Suspense>
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
