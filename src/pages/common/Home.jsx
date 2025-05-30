import { Link } from "react-router-dom";
import { useAuth } from "../../provider/authProvider"; // Import useAuth
import UserService from "../../services/user.service"; // Import UserService

const LandingPage = () => {
  const { token } = useAuth(); // Get token from auth provider
  const user = UserService.getCurrentUser(); // Get current user

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-800 to-blue-500 flex flex-col">
      {/* Navigation Bar */}
      <nav className="w-full flex justify-between items-center p-5 bg-white shadow-md">
        <h1 className="text-3xl font-bold text-blue-600">GasByGas</h1>
        <div className="space-x-4">
          {token && user ? ( // Check if user is logged in
            <>
              {user.userType === 4 && ( // Manager profile button
                <Link
                  to="/manager"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                >
                  Manager Profile
                </Link>
              )}
              {user.userType === 3 && ( // Admin profile button
                <Link
                  to="/admin"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                >
                  Admin Profile
                </Link>
              )}
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Centered Content */}

      <div className="flex flex-1 flex-col items-center justify-center text-center text-white px-4">
        <h2 className="text-5xl font-bold mb-4">
          Hi, Internal Users <br />
          Welcome to GasByGas
        </h2>
        <p className="text-lg mb-6">
          Get your gas tokens easily, track orders, and manage payments all in
          one place.
        </p>
        
      </div>
    </div>
  );
};

export default LandingPage;