import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-800 to-blue-500 flex flex-col">
      {/* Navigation Bar */}
      <nav className="w-full flex justify-between items-center p-5 bg-white shadow-md">
        <h1 className="text-3xl font-bold text-blue-600">GasByGas</h1>
        <div className="space-x-4">
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
        </div>
      </nav>


      {/* Centered Content */}
      
      <div className="flex flex-1 flex-col items-center justify-center text-center text-white px-4">
      <h2 className="text-5xl font-bold mb-4">Hi, Internal Users <br />Welcome to GasByGas</h2>
        <p className="text-lg mb-6">
          Get your gas tokens easily, track orders, and manage payments all in one place.
        </p>
        <Link
          to="/register"
          className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition duration-300"
        >
          Get Started
        </Link>
      </div>

    </div>
  );
};

export default LandingPage;

