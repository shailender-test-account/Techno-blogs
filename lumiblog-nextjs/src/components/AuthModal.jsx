



"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { closeModal, switchForm } from "@/redux/slices/modalSlice";
import { addAlert } from "@/redux/slices/alertSlice";
import { showSuccessOverlay } from "@/redux/slices/uiSlice";
import { loginSuccess, registerSuccess } from "@/redux/slices/authSlice";
import api from "@/axios.js";
import { openSubscriptionModal } from "@/redux/slices/subscriptionslice";
import { useRouter } from "next/navigation";



const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getPasswordStrength(val) {
  let strength = 0;
  if (val.length >= 6) strength++;
  if (val.match(/[a-z]/) && val.match(/[A-Z]/)) strength++;
  if (val.match(/\d/)) strength++;
  if (val.match(/[^a-zA-Z\d]/)) strength++;
  return strength;
}

const STRENGTH_META = {
  0: { label: "Weak Password", color: "text-rose-500", bars: 1, barColor: "bg-rose-500" },
  1: { label: "Weak Password", color: "text-rose-500", bars: 1, barColor: "bg-rose-500" },
  2: { label: "Fair Password", color: "text-yellow-500", bars: 2, barColor: "bg-yellow-500" },
  3: { label: "Good Password", color: "text-blue-500", bars: 3, barColor: "bg-blue-500" },
  4: { label: "Strong Password", color: "text-green-500", bars: 4, barColor: "bg-green-500" },
};

// Extract a readable message from an axios error
function getApiErrorMessage(err, fallback = "Something went wrong. Please try again.") {
  // Check for axios error shape without relying on axios.isAxiosError
  if (err?.isAxiosError || err?.response) {
    const data = err.response?.data;
    if (data) {
      if (typeof data === "string") return data;
      if (data.message) return data.message;
      if (data.error) return data.error;
      if (Array.isArray(data.errors) && data.errors.length > 0) {
        const first = data.errors[0];
        return typeof first === "string" ? first : first.message || fallback;
      }
    }
    if (err.code === "ERR_NETWORK") {
      return "Network error. Please check your connection and try again.";
    }
    if (err.code === "ECONNABORTED") {
      return "Request timed out. Please try again.";
    }
  }
  return err?.message || fallback;
}

export default function AuthModal() {

  const router=useRouter()
 
  const dispatch = useDispatch();
  const { isOpen, formType } = useSelector((state) => state.modal);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginTouched, setLoginTouched] = useState({});

  // Register form state (single object)
  const [registerFormValues, setRegisterFormValues] = useState({
    name: "",
    role: "",
    email: "",
    password: "",
  });
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regTouched, setRegTouched] = useState({});

  // Close on Escape
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape" && isOpen) dispatch(closeModal());
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, dispatch]);

  if (!isOpen) return null;

  const touchField = (setter, field) => setter((prev) => ({ ...prev, [field]: true }));

  const emptyFieldClass = (touched, value) =>
    touched && value.trim() === "" ? "border-rose-500 ring-2 ring-rose-200" : "border-gray-200";

  // Single change handler for all register fields
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = loginEmail.trim();
    const password = loginPassword.trim();

    // ---- Validation: mark all invalid fields touched, show ONE alert ----
    const loginErrors = {};

    if (!email) {
      loginErrors.email = true;
      dispatch(addAlert("Please enter your email address.", "error"));
    } else if (!EMAIL_REGEX.test(email)) {
      loginErrors.email = true;
      dispatch(addAlert("Please enter a valid email address.", "error"));
    }

    if (!password) {
      loginErrors.password = true;
      if (!loginErrors.email) {
        dispatch(addAlert("Please enter your password.", "error"));
      }
    }

    if (Object.keys(loginErrors).length > 0) {
      setLoginTouched((prev) => ({ ...prev, ...loginErrors }));
      return;
    }

    setLoginLoading(true);

    try {
      const loginresponse = await api.post(
        "/api/auth/login",
        { email, password },
        
      );

      if(loginresponse.data.success) {
        setLoginEmail("");
        setLoginPassword("");
        setLoginTouched({});
        dispatch(loginSuccess({ email }));
        dispatch(closeModal());
        dispatch(
          showSuccessOverlay({
            title: "Welcome Back!",
            message: "Login successful! Welcome back to LumiBlog.",
            withConfetti: false,
          })
        );

        localStorage.setItem("token",loginresponse.data.token)

        if(loginresponse.data.user.role=="admin"){
          router.push("/Dashboard/add-blog")
        }

        

       

        setTimeout(() => {
          dispatch(openSubscriptionModal());
        }, 2500 + 300);

      } else {
        dispatch(
          addAlert(
            loginresponse.data.message || "Login failed. Please check your credentials.",
            "error"
          )
        );
        return;
      }


    } catch (err) {
      dispatch(addAlert(getApiErrorMessage(err, "Login failed. Please try again."), "error"));
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const name = registerFormValues.name.trim();
    const email = registerFormValues.email.trim();
    const password = registerFormValues.password.trim();
    const role = registerFormValues.role;

    // ---- Validation: mark all invalid fields touched, show ONE alert ----
    const regErrors = {};
    let firstAlert = null;

    if (!name) {
      regErrors.name = true;
      firstAlert = firstAlert || "Please enter your full name.";
    }

    if (!email) {
      regErrors.email = true;
      firstAlert = firstAlert || "Please enter your email address.";
    } else if (!EMAIL_REGEX.test(email)) {
      regErrors.email = true;
      firstAlert = firstAlert || "Please enter a valid email address.";
    }

    if (!password) {
      regErrors.password = true;
      firstAlert = firstAlert || "Please create a password.";
    } else if (password.length < 6) {
      regErrors.password = true;
      firstAlert = firstAlert || "Password must be at least 6 characters long.";
    }

    if (!role) {
      regErrors.role = true;
      firstAlert = firstAlert || "Please select your role.";
    }

    if (Object.keys(regErrors).length > 0) {
      setRegTouched((prev) => ({ ...prev, ...regErrors }));
      if (firstAlert) dispatch(addAlert(firstAlert, "error"));
      return;
    }

    setRegLoading(true);

    try {
      const registerresponse = await api.post(
        `/api/auth/register`,
        { name, email, password, role },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (registerresponse.data.success) {
        setRegLoading(false);
        setRegisterFormValues({ name: "", role: "", email: "", password: "" });
        setRegTouched({});
        dispatch(registerSuccess({ name, email, role }));
        dispatch(closeModal());
        dispatch(switchForm("login"));
        dispatch(
          showSuccessOverlay({
            title: "Registration Successful! 🎉",
            message: `Welcome, ${name}! Your account has been created successfully. Start exploring inspiring stories now.`,
            withConfetti: true,
          })
        );
      } else {
        setRegLoading(false);
        dispatch(
          addAlert(
            registerresponse.data.message || "Registration failed. Please try again.",
            "error"
          )
        );
        return;
      }
    } catch (err) {
      setRegLoading(false);

      // Handle "Email already registered" (status >= 400) and any other API errors
      const errorMessage = getApiErrorMessage(
        err,
        "Registration failed. Please try again."
      );

      dispatch(addAlert(errorMessage, "error"));
    } finally {
      setRegLoading(false);
    }
  };

  const strength = getPasswordStrength(registerFormValues.password);
  const strengthMeta = STRENGTH_META[strength];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm transition-opacity duration-300 opacity-100"
        onClick={() => dispatch(closeModal())}
      ></div>

      <div className="relative bg-white rounded-[1.5rem] shadow-2xl w-full max-w-[420px] flex flex-col overflow-hidden z-10 transform scale-100 opacity-100 transition-all duration-300">
        <div className="bg-gradient-to-br from-brand-lightPink to-brand-purpleLight p-4 text-center relative overflow-hidden flex-shrink-0">
          <div className="absolute -top-8 -right-8 text-7xl text-white/40 rotate-12">
            <i className="fa-solid fa-envelope-open-text"></i>
          </div>
          <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center mx-auto mb-1.5 shadow-sm relative z-10">
            <i
              className={`fa-solid ${formType === "login" ? "fa-right-to-bracket" : "fa-user-plus"
                } text-brand-pink text-base`}
            ></i>
          </div>
          <h3 className="text-lg font-bold text-brand-dark relative z-10 mb-0.5">
            {formType === "login" ? "Welcome Back" : "Create Account"}
          </h3>
          <p className="text-brand-gray text-[11px] relative z-10">
            {formType === "login"
              ? "Log in to your LumiBlog account."
              : "Join LumiBlog to get the latest stories."}
          </p>
        </div>

        <div className="p-4 sm:p-5">
          {formType === "login" ? (
            <form onSubmit={handleLogin} className="space-y-2.5" noValidate>
              <div>
                <label className="block text-[11px] font-medium text-brand-dark mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fa-regular fa-envelope text-gray-400 text-xs"></i>
                  </div>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    onBlur={() => touchField(setLoginTouched, "email")}
                    placeholder="john@example.com"
                    className={`w-full pl-9 pr-4 py-2.5 rounded-lg border focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none text-sm transition ${emptyFieldClass(
                      loginTouched.email,
                      loginEmail
                    )}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-brand-dark mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fa-solid fa-lock text-gray-400 text-xs"></i>
                  </div>
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    onBlur={() => touchField(setLoginTouched, "password")}
                    placeholder="••••••••"
                    className={`w-full pl-9 pr-10 py-2.5 rounded-lg border focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none text-sm transition ${emptyFieldClass(
                      loginTouched.password,
                      loginPassword
                    )}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-brand-pink transition focus:outline-none"
                  >
                    <i className={`fa-regular ${showLoginPassword ? "fa-eye-slash" : "fa-eye"} text-xs`}></i>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <label className="flex items-center gap-1.5 cursor-pointer text-brand-gray">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-brand-pink focus:ring-brand-pink w-3 h-3"
                  />{" "}
                  Remember me
                </label>
                <a href="#" className="text-brand-pink font-medium hover:underline">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className={`w-full bg-brand-pink hover:bg-rose-600 text-white font-medium py-2.5 rounded-lg transition shadow-lg shadow-rose-200 hover:shadow-rose-300 transform text-sm mt-1 flex items-center justify-center gap-2 ${loginLoading
                  ? "opacity-95 cursor-not-allowed animate-pulse-glow"
                  : "hover:-translate-y-0.5"
                  }`}
              >
                {loginLoading ? (
                  <>
                    <span className="btn-loader"></span>
                    <span className="loading-text font-medium tracking-wide">Processing...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-right-to-bracket"></i> Log In
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-brand-gray pt-1">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => dispatch(switchForm("register"))}
                  className="text-brand-pink font-medium hover:underline"
                >
                  Register now
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-2.5" noValidate>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-medium text-brand-dark mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fa-regular fa-user text-gray-400 text-xs"></i>
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={registerFormValues.name}
                      onChange={handleRegisterChange}
                      onBlur={() => touchField(setRegTouched, "name")}
                      placeholder="John Doe"
                      className={`w-full pl-9 pr-2 py-2.5 rounded-lg border focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none text-sm transition ${emptyFieldClass(
                        regTouched.name,
                        registerFormValues.name
                      )}`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-brand-dark mb-1">Role</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fa-solid fa-briefcase text-gray-400 text-xs"></i>
                    </div>
                    <select
                      name="role"
                      value={registerFormValues.role}
                      onChange={handleRegisterChange}
                      onBlur={() => touchField(setRegTouched, "role")}
                      className={`w-full pl-9 pr-6 py-2.5 rounded-lg border focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none text-sm transition appearance-none bg-white cursor-pointer ${emptyFieldClass(
                        regTouched.role,
                        registerFormValues.role
                      )}`}
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>

                    </select>
                    <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                      <i className="fa-solid fa-chevron-down text-gray-400 text-[10px]"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-brand-dark mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fa-regular fa-envelope text-gray-400 text-xs"></i>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={registerFormValues.email}
                    onChange={handleRegisterChange}
                    onBlur={() => touchField(setRegTouched, "email")}
                    placeholder="john@example.com"
                    className={`w-full pl-9 pr-4 py-2.5 rounded-lg border focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none text-sm transition ${emptyFieldClass(
                      regTouched.email,
                      registerFormValues.email
                    )}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-brand-dark mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fa-solid fa-lock text-gray-400 text-xs"></i>
                  </div>
                  <input
                    type={showRegPassword ? "text" : "password"}
                    name="password"
                    value={registerFormValues.password}
                    onChange={handleRegisterChange}
                    onBlur={() => touchField(setRegTouched, "password")}
                    placeholder="••••••••"
                    className={`w-full pl-9 pr-10 py-2.5 rounded-lg border focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none text-sm transition ${emptyFieldClass(
                      regTouched.password,
                      registerFormValues.password
                    )}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-brand-pink transition focus:outline-none"
                  >
                    <i className={`fa-regular ${showRegPassword ? "fa-eye-slash" : "fa-eye"} text-xs`}></i>
                  </button>
                </div>

                {registerFormValues.password.length > 0 && (
                  <div className="mt-1.5">
                    <div className="flex gap-1 mb-0.5">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`strength-bar flex-1 ${i < strengthMeta.bars ? strengthMeta.barColor : "bg-gray-200"
                            }`}
                        ></div>
                      ))}
                    </div>
                    <p className={`text-[10px] font-medium ${strengthMeta.color}`}>
                      {strengthMeta.label}
                    </p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={regLoading}
                className={`w-full bg-brand-pink hover:bg-rose-600 text-white font-medium py-2.5 rounded-lg transition shadow-lg shadow-rose-200 hover:shadow-rose-300 transform text-sm mt-1 flex items-center justify-center gap-2 ${regLoading
                  ? "opacity-95 cursor-not-allowed animate-pulse-glow"
                  : "hover:-translate-y-0.5"
                  }`}
              >
                {regLoading ? (
                  <>
                    <span className="btn-loader"></span>
                    <span className="loading-text font-medium tracking-wide">Processing...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-user-plus"></i> Register Now
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-brand-gray pt-1">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => dispatch(switchForm("login"))}
                  className="text-brand-pink font-medium hover:underline"
                >
                  Log in
                </button>
              </p>
            </form>
          )}
        </div>

        <button
          onClick={() => dispatch(closeModal())}
          className="absolute top-3 right-3 w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-brand-dark hover:bg-white hover:text-brand-pink transition shadow-sm z-20"
        >
          <i className="fa-solid fa-xmark text-xs"></i>
        </button>
      </div>
    </div>
  );
}