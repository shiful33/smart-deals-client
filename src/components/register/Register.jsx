import React, { useState } from "react";
// FIX: Changed 'react-router' to 'react-router-dom'
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { toast } from "react-toastify";
import { IoMdEyeOff } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const auth = getAuth();
// NOTE: googleProvider is not used here, only in AuthProvider, but keeping it for completeness
// const googleProvider = new GoogleAuthProvider();

const Register = () => {
  const [show, setShow] = useState(false);
  const { createUser, setUser, updateUser, googleSignIn } = useAuth(); // Destructuring googleSignIn
  const [nameError, setNameError] = useState("");
  const navigate = useNavigate();

  // FIX: In a register component, 'from' is usually '/', or you could pass it as a prop if needed.
  const from = "/";

  const handleGoogleLogIn = () => {
    googleSignIn()
      .then((result) => {
        // const user = result.user; // Unused variable
        toast.success("Your Registration via Google Successful.");

        // FIX: Using the default 'from' path
        navigate(from, { replace: true });
      })
      .catch((e) => {
        // setError(e.message); // This component doesn't have an setError state
        console.error("Google Sign-In Error:", e);
        toast.error(e.message);
        // navigate("/auth/login"); // Typically navigate to home or the intended page after successful login
      });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const photo = form.photo.value;
    const password = form.password.value;

    // Name validation
    if (name.length < 5) {
      setNameError("The Name should be more than five characters.");
      return;
    } else {
      setNameError("");
    }

    // Password validation (Ensuring the regex is correctly checked before calling createUser)
    const regExp =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;

    if (!regExp.test(password)) {
      toast.error(
        "Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return; // Stop execution if password fails validation
    }

    createUser(email, password)
      .then((result) => {
        const user = result.user;

        updateUser({ displayName: name, photoURL: photo })
          .then(() => {
            // FIX: Ensure setUser is called with the updated user data
            setUser({ ...user, displayName: name, photoURL: photo });
            toast.success("Your Registration Successful.");
            navigate("/auth/login");
          })
          .catch((error) => {
            console.error("Error updating profile", error);
            // If update fails, still navigate and confirm creation
            setUser(user);
            toast.success(
              "Your Registration Successful (Profile update failed)."
            );
            navigate("/auth/login");
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Registration Error:", error); // Log for debugging
        toast.error(`Error: ${errorCode} - ${errorMessage}`);
      });
  };

  return (
    <div>
      <div className="hero bg-gradient-to-r from-[#ffffff] to-[#02ec50] shadow-2xl rounded-lg min-h-screen">
        <div className="flex-col lg:hero-content lg:flex-row">
          <div className="mb-6 text-center lg:text-left lg:mb-0">
            <h1 className="text-3xl font-bold text-shadow bg-gradient-primary text-gradient lg:text-4xl">
              Register Your Account!
            </h1>
            <p className="py-6 px-4 lg:px-0 lg:w-[550px] text-shadow text-[18px] font-medium">
              Stay active by logging into our Kids Zone. Provide all your
              information in a legal way. If you use any illegal way, your
              activation will be suspended.
            </p>
          </div>
          <div className="w-full max-w-sm mx-auto shadow-2xl card bg-base-100 shrink-0">
            <form onSubmit={handleRegister} className="card-body">
              <fieldset className="fieldset">
                {/* Name */}
                <label className="label">Your Name</label>
                <input
                  type="text"
                  name="name"
                  className="input"
                  placeholder="Name"
                  required
                />

                {nameError && <p className="text-xs text-error">{nameError}</p>}

                {/* Email */}
                <label className="label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="input"
                  placeholder="Email"
                  required
                />

                {/* Photo URL */}
                <label className="label">Photo URL</label>
                <input
                  type="text"
                  name="photo"
                  className="input"
                  placeholder="Photo URL"
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

                <button
                  type="submit"
                  className="btn bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 text-white text-[18px] mt-4"
                >
                  Register
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

                <p className="text-[14px] text-center mt-2">
                  Already you have an account?{" "}
                  <Link
                    to="/auth/login"
                    className="font-medium text-red-400 cursor-pointer hover:underline"
                  >
                    Login
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

export default Register;
