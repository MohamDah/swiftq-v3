import { Link, Outlet, useLocation } from 'react-router-dom';
import { logout } from '../firebase/auth';
import { useAuth } from '../context/AuthContext';
import logoFull from "../assets/logoFull.png";
import { MenuIcon, XIcon } from 'lucide-react';
import { useState } from 'react';


export default function Layout() {
  const { currentUser } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [showModal, setShowModal] = useState(false);


  const handleSignOut = () => {
    logout();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 container mx-auto px-4 py-2 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src={logoFull} className='max-h-12' />
        </Link>
        {isHome ? (
          currentUser ?
            <div className="flex gap-2 ">
              <Link to="/my-queues">
                <button className="text-sm bg-primary px-4 py-1 rounded-full font-medium shadow-lg shadow-black/30">My Queues</button>
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm bg-white border border-red-500 text-red-500 px-4 py-1 rounded-full font-medium hover:bg-red-50 shadow-lg shadow-black/30"
              >
                Logout
              </button>
            </div>
            :
            <Link to="/login">
              <button className="bg-primary px-6 py-1 rounded-full font-bold shadow-lg shadow-black/30">Login</button>
            </Link>
        ) : (
          <button onClick={() => setShowModal(!showModal)} className='bg-primary border border-white p-2 rounded-full shadow-lg shadow-black/25'>
            <MenuIcon />
          </button>
        )}
      </header>

      {/* Menu Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col items-center"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowModal(false);
          }
        }}>
          <div className='container flex justify-end py-3 px-4'>
            <button onClick={(e) => {
              e.stopPropagation();
              setShowModal(!showModal);
            }} className='bg-primary p-1.5 rounded-full shadow-lg shadow-black/25 self-end border-2 border-white'>
              <XIcon />
            </button>
          </div>
          <div className="bg-primary border-4 border-white p-8 pt-14 rounded-[40px] shadow-lg relative max-w-sm w-[90%]">
            <div className="flex flex-col gap-5 items-center ">
              <Link to="/my-queues" className="w-full" onClick={() => setShowModal(false)}>
                <button className="w-full bg-white py-3 px-4 rounded-xl shadow-lg shadow-black/25 font-semibold text-center">
                  My Queues
                </button>
              </Link>
              <Link to="/create" className="w-full" onClick={() => setShowModal(false)}>
                <button className="w-full bg-white py-3 px-4 rounded-xl shadow-lg shadow-black/25 font-semibold text-center">
                  Create New Queue
                </button>
              </Link>
              {/* <Link to="/analytics" className="w-full" onClick={() => setShowModal(false)}>
                <button className="w-full bg-white py-3 px-4 rounded-xl shadow-md font-semibold text-center">
                  Analytics
                </button>
              </Link> */}
              <div className='flex flex-col gap-5 mt-12'>
                <Link to="/" onClick={() => setShowModal(false)}>
                  <button className="bg-primary-sat px-6 py-1 rounded-full font-medium shadow-lg shadow-black/30">
                    Join Queue
                  </button>
                </Link>
                {currentUser ?
                  <button
                    onClick={() => {
                      handleSignOut();
                      setShowModal(false);
                    }}
                    className="bg-white border-2 border-red-500 px-6 py-1 rounded-full font-semibold hover:bg-red-50 shadow-md mt-2"
                  >
                    Logout
                  </button>
                  :
                  <Link to="/login">
                    <button className="bg-primary-sat px-6 py-1 w-full rounded-full font-semibold shadow-lg shadow-black/30">Login</button>
                  </Link>
                }
              </div>
            </div>
          </div>
        </div>
      )}

      <Outlet />
    </div>
  );
}
