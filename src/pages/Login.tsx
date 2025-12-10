import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoFull from "../assets/logoFull.png"
import { useLoginMutation } from '@/queries/mutations/useLoginMutation';
import { displayError } from '@/utils/displayError';


export default function Login() {
  const { mutateAsync: login, error, isPending } = useLoginMutation()

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Handle form submission for email/password login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    await login({ email, password });
    navigate('/my-queues');
  };
  return (
    // Main container with flex layout
    <div className=" flex flex-col justify-center py-4 px-4">
      {/* Logo section */}
      <div>
        <img src={logoFull} alt="Logo" className='mx-auto' />
      </div>
      {/* Page title */}
      <div className="mx-auto w-full max-w-md bg-primary rounded-full">
        <h2 className="my-2 text-center text-2xl font-semibold text-gray-900">Sign in to your account</h2>
      </div>

      {/* Login form container */}
      <div className="mt-8 sm:mx-auto w-full max-w-md ">
        <div className="bg-white py-8 px-4 sm:px-10 border-8 border-primary rounded-3xl shadow-md shadow-black/25">
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {displayError(error)}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleEmailLogin}>
            <div>
              <label htmlFor="email" className="block text-base font-semibold">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-primary rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-base font-semibold">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-primary rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isPending}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-md shadow-black/25 text-base font-semibold bg-primary hover:bg-primary-sat ${isPending ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
              >
                {isPending ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/register')}
                className="font-medium text-blue-400 hover:text-blue-500"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};