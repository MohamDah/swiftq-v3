import React from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'

import { useSignupMutation } from '@/queries/mutations/useSignupMutation'
import { SignupProps } from '@/types/auth'

import logoFull from '../assets/logoFull.png'

// Signup component handles user authentication through email and password
export default function Signup() {
  const { mutateAsync: signup, error: apiError, isPending } = useSignupMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<SignupProps & { confirmPassword: string }>({
    defaultValues: {
      businessName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const navigate = useNavigate()

  const onSubmit = async ({ businessName, email, password }: SignupProps) => {
    await signup({ email, password, businessName })
    navigate('/my-queues')
  }

  return (
    <div className="flex flex-col justify-center px-4 py-4">
      <div>
        <img src={logoFull} alt="Logo" className="mx-auto" />
      </div>
      <div className="mx-auto w-full max-w-md">
        <div className="mx-auto w-full max-w-md bg-primary rounded-full">
          <h2 className="py-2 text-center text-2xl font-semibold text-gray-900">
            Create your account
          </h2>
        </div>
        <p className="mt-2 text-center text-sm">Sign up to create and manage queues</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 sm:px-10 border-8 border-primary rounded-3xl shadow-md shadow-black/25">
          {apiError && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  {apiError && (
                    <p className="text-sm text-red-700">{apiError.response?.data?.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="businessName" className="block text-base font-semibold">
                Business Name
              </label>
              <div className="mt-1">
                <input
                  id="businessName"
                  type="text"
                  autoComplete="name"
                  {...register('businessName', { required: 'Please enter your name' })}
                  className="appearance-none block w-full px-3 py-2 border border-primary rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm"
                  placeholder="John Doe"
                />
              </div>
              {errors.businessName && (
                <p className="mt-1 text-xs text-red-700">{errors.businessName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-base font-semibold">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email', {
                    required: 'Please enter your email',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Please enter a valid email address',
                    },
                  })}
                  className="appearance-none block w-full px-3 py-2 border border-primary rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-700">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-base font-semibold">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  {...register('password', {
                    required: 'Please enter a password',
                    minLength: { value: 6, message: 'Password must be at least 6 characters long' },
                  })}
                  className="appearance-none block w-full px-3 py-2 border border-primary rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-xs text-red-700">{errors.password.message}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-base font-semibold">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: value => value === getValues('password') || 'Passwords do not match',
                  })}
                  className="appearance-none block w-full px-3 py-2 border border-primary rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-700">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isPending}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-md shadow-black/25 text-base font-semibold bg-primary hover:bg-primary-sat ${
                  isPending ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isPending ? 'Creating account...' : 'Sign up'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
