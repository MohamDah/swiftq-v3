import Analytics from '@/pages/Analytics'

import CustomerLayout from '../components/CustomerLayout'
import ErrorPage from '../components/ErrorPage'
import Layout from '../components/Layout'
import ProtectedRoute from '../components/ProtectedRoute'
import CreateQueue from '../pages/CreateQueue'
import CustomerView from '../pages/CustomerView'
import Home from '../pages/Home'
import HostQueues from '../pages/host-queues/HostQueues'
import HostQueueDetails from '../pages/HostQueueDetails'
import JoinQueue from '../pages/join-queue/JoinQueue'
import Login from '../pages/Login'
import QR from '../pages/QR'
import Signup from '../pages/Signup'

const mainRoutes = [
  {
    errorElement: <ErrorPage />,
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      //     // Host Views
      {
        element: <CustomerLayout />,
        children: [
          {
            path: '/queue/:qrCode/customer',
            element: <CustomerView />,
          },
          {
            path: '/join/:qrCode',
            element: <JoinQueue />,
          },
          {
            path: '/create',
            element: (
              <ProtectedRoute>
                <CreateQueue />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: '/my-queues',
        element: (
          <ProtectedRoute>
            <HostQueues />
          </ProtectedRoute>
        ),
      },
      {
        path: '/my-queues/:queueId',
        element: (
          <ProtectedRoute>
            <HostQueueDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: '/qr/:queueId',
        element: (
          <ProtectedRoute>
            <QR />
          </ProtectedRoute>
        ),
      },
      {
        path: '/analytics',
        element: (
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        ),
      },
      //     // Auth Views
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Signup />,
      },
    ],
  },
]

export default mainRoutes
