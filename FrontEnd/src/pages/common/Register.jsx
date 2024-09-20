import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../context/ContextProvider";
import { register } from "../../api/user";
import logo from "../../assets/logo.svg";
import googleLogo from "../../assets/googleLogo.svg";
import { IoIosEyeOff, IoIosEye } from "react-icons/io";

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const { setUser } = useGlobalContext();
  const { user } = useGlobalContext();

  const redirect = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [navigate, user, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      if (email && password) {
        try {
          const { data } = await register(
            username,
            firstName,
            lastName,
            email,
            password
          );
          if (data) {
            setUser(data);
          }
        } catch (error) {
          setMessage("Registration failed. Please try again.");
        }
      }
    }
  };

  return (
    <div className=" my-10 flex items-center justify-center">
      <div className="md:bg-slate-900 p-6 rounded-lg shadow-lg w-full md:w-2/5">
        <img src={logo} alt="Logo" className="mx-auto -mb-16 w-72 -mt-16" />
        <h1 className="text-xl font-semibold text-center mb-6 text-white">
          Register for an account
        </h1>
        {message && <p className="text-red-500">{message}</p>}

        <form onSubmit={submitHandler}>
          <div className="flex flex-col space-y-5">
            <div>
              <label
                htmlFor="username"
                className="text-s font-semibold px-1 text-white"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                className="w-full pl-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-cyan-500"
                placeholder="Enter your username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="flex space-x-3">
              <div className="w-1/2">
                <label
                  htmlFor="first-name"
                  className="text-s font-semibold px-1 text-white"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="first-name"
                  className="w-full pl-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-cyan-500"
                  placeholder="Enter your first name"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="w-1/2">
                <label
                  htmlFor="last-name"
                  className="text-s font-semibold px-1 text-white"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="last-name"
                  className="w-full pl-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-cyan-500"
                  placeholder="Enter your last name"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="text-s font-semibold px-1 text-white"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full pl-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-cyan-500"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-s font-semibold px-1 text-white"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="w-full pl-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-cyan-500"
                  placeholder="Enter your password"
                  required
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
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="text-s font-semibold px-1 text-white"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirm-password"
                  className="w-full pl-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-cyan-500"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-3 text-gray-500 focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <IoIosEyeOff className="text-xl" />
                  ) : (
                    <IoIosEye className="text-xl" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white p-2 rounded"
            >
              Register
            </button>
          </div>
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
          <span className="font-medium text-gray-800">Sign up with Google</span>
        </button>
        <div className="text-center mt-4">
          <span className="text-white">Already have an account?</span>{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-tertiary hover:text-white"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
