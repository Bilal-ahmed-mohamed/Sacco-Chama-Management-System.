import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Lock } from "lucide-react";
import axios, { Axios } from "axios";
import { useAuthContext } from "../../hooks/useAuthContext";


const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {dispatch} = useAuthContext();

  const handleLogin = (e) => {
    e.preventDefault();


    try {
        axios.post("http://localhost:4000/api/users/Login" , {
          email : email,
          password : password
      })
      .then(response => {
          const {user , token} = response.data;
          const userData = {...user, token};

          localStorage.setItem('user' , JSON.stringify(userData));
          dispatch({type: 'LOGIN', payload : userData});
          setEmail("");
          setPassword("");
        
        navigate("/dashboard");
    })
    } catch (error) {
          console.error("Login failed:", error);
        alert(
          error.response?.data?.message ||
          "Invalid credentials. Please try again."
        );
    }

    
    
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome Back!
          </h1>
          <p className="text-gray-600 text-lg">
            Login to manage your Sacco account.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="email"
              placeholder="Username or Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:border-cyan-400 focus:ring-0 outline-none transition-all text-gray-900 placeholder:text-gray-400"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:border-cyan-400 focus:ring-0 outline-none transition-all text-gray-900 placeholder:text-gray-400"
              required
            />
          </div>

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-cyan-500 hover:text-cyan-600 font-medium transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-4 text-lg font-semibold bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl transition-all shadow-md"
          >
            Login
          </button>

          <p className="text-center text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-cyan-500 hover:text-cyan-600 font-medium transition-colors">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;