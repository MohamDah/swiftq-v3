import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../firebase/auth';
import { useAuth } from '../context/AuthContext';
import { useRef } from 'react';

export default function Home() {
  const handleSignOut = () => {
    logout()
  };
  const {currentUser} = useAuth()
  const idInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Sign Out Button (top-right corner) */}
      <div className="absolute top-4 right-4 space-x-2">
        {currentUser
        ?
        <>
        <Link
        to="/my-queues"
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition duration-200"
        >
          My Queues
        </Link>
        <button
        onClick={handleSignOut}
        className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition duration-200"
        >
          Sign Out
        </button>
        </>
        :
        <Link
        to="/login"
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition duration-200"
        >
          Log In
        </Link>
        }
      </div>
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">SwiftQ</h1>
          <p className="text-lg text-gray-600">
            A simple and efficient way to manage your queues and improve customer experience
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 justify-center">
          <div className="bg-white p-8 rounded-xl shadow-lg flex-1">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">Create a Queue</h2>
            <p className="text-gray-600 mb-6">
              Are you a business or service provider? Create a new queue to manage your customers efficiently.
            </p>
            <ul className="mb-8 space-y-2">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Manage customer flow</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Reduce perceived wait times</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Improve customer satisfaction</span>
              </li>
            </ul>
            <Link 
              to="/create" 
              className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-center font-medium rounded-lg transition duration-200"
            >
              Create Queue
            </Link>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg flex-1">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">Join a Queue</h2>
            <p className="text-gray-600 mb-6">
              Need service? Join an existing queue using a QR code or queue ID provided by the business.
            </p>
            <ul className="mb-8 space-y-2">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Skip physical waiting lines</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Receive notifications when it's your turn</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>See estimated wait time</span>
              </li>
            </ul>
            <div className="space-y-4">
              <input
                ref={idInputRef}
                type="text"
                placeholder="Enter Queue ID"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button 
                className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-center font-medium rounded-lg transition duration-200"
                onClick={() => navigate(`/join/${idInputRef.current?.value}`)}
              >
                Join Queue
              </button>
              <p className="text-center text-gray-500 text-sm">or</p>
              <button 
                className="block w-full py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 text-center font-medium rounded-lg transition duration-200"
                onClick={() => alert('QR scan feature will be implemented soon!')}
              >
                Scan QR Code
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-blue-800 mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Create or Join</h3>
              <p className="text-gray-600">Businesses create queues. Customers join with a QR code or ID.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Wait Virtually</h3>
              <p className="text-gray-600">No need to physically wait in line. Do other things while you wait.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Get Notified</h3>
              <p className="text-gray-600">Receive a notification when it's your turn to be served.</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-100 mt-16 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-600">© 2025 SwiftQ. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}