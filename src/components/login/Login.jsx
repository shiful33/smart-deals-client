import React, { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { FaEye } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";
import {
  getAuth,
  sendPasswordResetEmail,
} from "firebase/auth";

const auth = getAuth();

const Login = () => {
  const [show, setShow] = useState(false);
  const [error, setError] = useState(null); 
  const { signIn, googleSignIn } = useAuth();
  const emailRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleGoogleLogIn = () => {
    googleSignIn()
      .then((result) => {
        toast.success("Your LogIn Successful.");

        navigate(from, { replace: true });
      })
      .catch((e) => {
        setError(e.message);
        toast.error(e.message);
      });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    signIn(email, password)
      .then((result) => {
        toast.success("Your LogIn Successful.");

        navigate(from, { replace: true });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        if (
          errorCode === "auth/user-not-found" ||
          errorCode === "auth/wrong-password"
        ) {
          setError("Invalid email or password. Please try again.");
          toast.error("Invalid credentials.");
        } else {
          console.error("Login Error:", error);
          setError(errorMessage);
          toast.error(`Error: ${errorMessage}`);
        }
      });
  };

  const handleForgetPassword = () => {
    const email = emailRef.current.value;
    if (!email) {
      toast.error("Please enter your email address first.");
      return;
    }
    sendPasswordResetEmail(auth, email)
      .then(() => {
        toast.success("Check your email to reset password");
      })
      .catch((e) => {
        console.error("Reset Password Error:", e);
        toast.error(e.message);
      });
  };

  return (
    <div>
      <div className="hero bg-gradient-to-r from-[#ffffff] to-[#cc5200] shadow-2xl rounded-lg min-h-screen">
        <div className="flex-col lg:hero-content lg:flex-row">
          <div className="mb-6 text-center lg:text-left lg:mb-0">
            <h1 className="text-3xl font-bold text-shadow bg-gradient-primary text-gradient lg:text-4xl">
              Login Your Account!
            </h1>
            <p className="py-6 px-4 lg:px-0 lg:w-[550px] text-shadow text-[18px] font-medium">
              Stay active by logging into our Kids Zone. Provide all your
              information in a legal way. If you use any illegal way, your
              activation will be suspended.
            </p>
          </div>
          <div className="w-full max-w-sm mx-auto shadow-2xl card bg-base-100 shrink-0">
            <form onSubmit={handleLoginSubmit} className="card-body">
              <fieldset className="fieldset">
                {/* Email */}
                <label className="label">Email</label>
                <input
                  type="email"
                  name="email"
                  ref={emailRef}
                  className="input"
                  placeholder="Email"
                  required
                />

                {/* Password */}
                <div className="relative">
                  <label className="label">Password</label>
                  <input
                    type={show ? "text" : "password"}
                    name="password"
                    className="input"
                    placeholder="........"
                    required
                  />

                  <span
                    onClick={() => setShow(!show)}
                    className="absolute text-[16px] right-8 top-8 cursor-pointer"
                  >
                    {show ? <FaEye /> : <IoMdEyeOff />}
                  </span>
                </div>

                {/* Forgot Password */}
                <button
                  onClick={handleForgetPassword}
                  type="button"
                  className="hover:underline cursor-pointer text-start text-[15px] mt-1"
                >
                  Forgot password?
                </button>

                {error && <p className="text-xs text-red-400">{error}</p>}

                <button
                  type="submit"
                  className="btn bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 text-white text-[18px] mt-4"
                >
                  Login
                </button>

                <div>
                  <div className="flex items-center justify-center gap-2 my-2">
                    <div className="w-16 h-px bg-black/30"></div>
                    <span className="text-sm text-black/70">Or</span>
                    <div className="w-16 h-px bg-black/30"></div>
                  </div>
                  <div className="mb-8">
                    <button
                      onClick={handleGoogleLogIn}
                      type="button"
                      className="w-full text-blue-900 btn btn-secondary hover:bg-gradient-to-r from-purple-500 to-pink-500 hover:text-white btn-outline"
                    >
                      <FcGoogle className="text-[20px]" /> Login With Google
                    </button>
                  </div>
                </div>

                <p className="text-[14px] text-center">
                  Don't have an account?{" "}
                  <Link
                    to="/auth/register"
                    className="font-medium text-red-400 cursor-pointer hover:underline"
                  >
                    Register
                  </Link>
                </p>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
