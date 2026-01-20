import Link from 'next/link'
import { slugify } from '../utils/helpers'
import { navItemLength } from '../ecommerce.config'
import { useAuth } from '../context/authContext'

export default function Layout({ children, categories }) {
  const { user, logout, isAuthenticated } = useAuth();

  if (categories.length > navItemLength) {
    categories = categories.slice(0, navItemLength)
  }
  return (
    <div>
      <nav>
        <div className="flex justify-center">
          <div className="
            mobile:px-12 sm:flex-row sm:pt-12 sm:pb-6 desktop:px-0
            px-4 pt-8 flex flex-col w-fw
          ">
            <div className="mb-4 sm:mr-16 max-w-48 sm:max-w-none">
              <Link href="/">
                <a aria-label="Home">
                  <img src="/logo.png" alt="logo" width="90" height="28" />
                </a>
              </Link>
            </div>
            <div className="flex flex-wrap mt-1">
              <Link href="/">
                <a aria-label="Home">
                  <p className="
                    sm:mr-8 sm:mb-0
                    mb-4 text-left text-smaller mr-4
                  ">
                    Home
                  </p>
                </a>
              </Link>
              {
                categories.map((category, index) => (
                  <Link
                    href={`/category/${slugify(category)}`}
                    key={index}
                  >
                    <a aria-label={category}>
                      <p className="
                          sm:mr-8 sm:mb-0
                          mb-4 text-left text-smaller mr-4
                        ">
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </p>
                    </a>
                  </Link>
                ))
              }
              <Link href="/categories">
                <a aria-label="All categories">
                  <p className="
                    sm:mr-8 sm:mb-0
                    mb-4 text-left text-smaller mr-4 
                  ">
                    All
                  </p>
                </a>
              </Link>
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">Hi, {user?.name}</span>
                  <button
                    onClick={logout}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link href="/login">
                  <a aria-label="Login">
                    <p className="sm:mr-8 sm:mb-0 mb-4 text-left text-smaller mr-4 font-medium text-blue-600">
                      Login
                    </p>
                  </a>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <div className="mobile:px-10 px-4 pb-10 flex justify-center">
        <main className="w-fw">{children}</main>
      </div>
      <footer className="flex justify-center">
        <div className="
        sm:flex-row sm:items-center
        flex-col
        flex w-fw px-12 py-8
        desktop:px-0
        border-solid
        border-t border-gray-300">
          <span className="block text-gray-700 text-xs">Copyright © 2025 Next.js Store. All rights reserved.</span>
          <div className="
            sm:justify-end sm:m-0
            flex flex-1 mt-4
          ">
            <Link href="/admin">
              <a aria-label="Admin panel">
                <p className="text-sm font-semibold">Admins</p>
              </a>
            </Link>
          </div>
        </div>
      </footer>

    </div>
  )
}