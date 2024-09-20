import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useGoogleLogin } from "@react-oauth/google";
import { useGlobalContext } from "../../context/ContextProvider";
import { login } from "../../api/user";
import logo from "../../assets/logo.svg";
import googleLogo from "../../assets/googleLogo.svg";
import { IoIosEyeOff, IoIosEye } from "react-icons/io";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const { setUser } = useGlobalContext();
  const { user } = useGlobalContext();

  const navigate = useNavigate();
  const location = useLocation();

  const redirect = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [navigate, user, redirect]);

  // const googleLogin = useGoogleLogin({
  //   onSuccess: (tokenResponse) => {
  //     // handle the Google login token
  //     // Call API to login or register the user
  //     console.log(tokenResponse);
  //   },
  //   onError: (error) => {
  //     console.error("Google Login Failed:", error);
  //   },
  // });

  const submitHandler = async (e) => {
    e.preventDefault();
    if (email && password) {
      const { data } = await login(email, password);
      if (data) {
        setUser(data);
      }
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="md:bg-slate-900 p-6 rounded-lg shadow-lg w-full md:w-96">
        <img src={logo} alt="Logo" className="mx-auto -mb-16 w-72 -mt-16" />
        <h1 className="text-xl font-semibold text-center mb-6 text-white">
          Login to your account
        </h1>
        <form onSubmit={submitHandler}>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-2 mb-4 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full p-2 mb-4 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-3 text-gray-500 focus:outline-none"
            >
              {showPassword ? (
                <IoIosEyeOff className="text-xl" />
              ) : (
                <IoIosEye className="text-xl" />
              )}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white p-2 rounded"
          >
            Login
          </button>
        </form>
        <div className="flex items-center my-4">
          <div className="flex-grow border-b border-gray-300"></div>
          <span className="mx-4 text-gray-500 font-semibold">OR</span>
          <div className="flex-grow border-b border-gray-300"></div>
        </div>
        <button
          // onClick={googleLogin}
          className="flex items-center justify-center w-full bg-white p-2 rounded shadow-md mt-4 hover:bg-gray-100 transition duration-200"
        >
          <img src={googleLogo} alt="Google Logo" className="w-6 h-6 mr-2" />
          <span className="font-medium text-gray-800">Sign in with Google</span>
        </button>
        <div className="text-center mt-4">
          <span className="text-white">{"Don't have an account?"}</span>{" "}
          <Link to="/register" className="text-tertiary">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
