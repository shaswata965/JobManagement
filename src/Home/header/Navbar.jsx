import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-24 items-center justify-start">
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <img
                className="h-8 w-auto"
                src="/logo-no-background.svg"
                alt="Your Company"
              />
            </div>
            <div className="sm:ml-6 sm:block">
              <div className="flex space-x-4">
                <Link
                  to="/"
                  className="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium"
                  aria-current="page"
                >
                  Dashboard
                </Link>
                <Link
                  to="/create-jobs"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                >
                  Create Jobs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
