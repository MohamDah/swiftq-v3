import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import HostQueues from "./pages/HostQueues";
import SuspLoader from "./components/SuspLoader";
import HostQueueDetails from "./pages/HostQueueDetails";
import JoinQueue from "./pages/JoinQueue";

// Lazy loading components for better performance
const Home = lazy(() => import("./pages/Home"));
const CreateQueue = lazy(() => import("./pages/CreateQueue"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
// const HostDashboard = lazy(() => import("./pages/HostDashboard"));
// const QueueDetails = lazy(() => import("./pages/QueueDetails"));
// const JoinQueue = lazy(() => import("./pages/JoinQueue"));
// const CustomerView = lazy(() => import("./pages/CustomerView"));


const router = createBrowserRouter([
  {
    path: "/",
    element: <Suspense fallback={<SuspLoader />}>
      <Home />
    </Suspense>
  },
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
    path: "/join/:queueId",
    element: (
      <ProtectedRoute>
        <Suspense fallback={<SuspLoader />}>
          <JoinQueue />
        </Suspense>
      </ProtectedRoute>
    ),
  },

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
]);
function App() {


  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
