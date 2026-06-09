import { useEffect, useState } from "react";

import { userLogin, userRegister } from "../../API";

const fieldBaseClass =
  "w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-[#88a3ff] focus:bg-white/6";

const initialLoginForm = {
  email: "",
  password: "",
};

const initialRegisterForm = {
  first_name: "",
  last_name: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function AuthScreen({ mode = "login", onNavigate }) {
  const isLogin = mode === "login";
  const [loginForm, setLoginForm] = useState(initialLoginForm);
  const [registerForm, setRegisterForm] = useState(initialRegisterForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [toastState, setToastState] = useState({
    message: "",
    type: "success",
  });

  useEffect(() => {
    setErrorMessage("");
    setSuccessMessage("");
  }, [mode]);

  useEffect(() => {
    if (!toastState.message) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setToastState({
        message: "",
        type: "success",
      });
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [toastState]);

  const updateLoginField = (field, value) => {
    setLoginForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateRegisterField = (field, value) => {
    setRegisterForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!loginForm.email || !loginForm.password) {
      setErrorMessage("Email and password are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await userLogin(loginForm.email, loginForm.password);
      const accessToken = response?.data?.access_token;

      if (accessToken) {
        localStorage.setItem("access_token", accessToken);
      }

      setSuccessMessage("");
      setToastState({
        message: "Login successful.",
        type: "success",
      });
      onNavigate?.("dashboard");
    } catch (error) {
      setErrorMessage(error.message || "Unable to login.");
      setToastState({
        message: error.message || "Unable to login.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (registerForm.password !== registerForm.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await userRegister({
        first_name: registerForm.first_name.trim(),
        last_name: registerForm.last_name.trim(),
        phone: registerForm.phone.trim(),
        email: registerForm.email.trim(),
        password: registerForm.password,
      });

      setSuccessMessage("Account created successfully. Please login.");
      setToastState({
        message: "Registration successful.",
        type: "success",
      });
      setRegisterForm(initialRegisterForm);
      setLoginForm({
        email: registerForm.email.trim(),
        password: "",
      });
      onNavigate?.("login");
    } catch (error) {
      setErrorMessage(error.message || "Unable to create account.");
      setToastState({
        message: error.message || "Unable to create account.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&display=swap"
        rel="stylesheet"
      />

      <div
        className="flex min-h-screen items-center justify-center overflow-hidden bg-[#08090d] px-4 py-3 text-white"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          backgroundImage:
            "radial-gradient(circle at top left, rgba(94,96,255,0.18), transparent 28%), radial-gradient(circle at right, rgba(20,119,248,0.1), transparent 24%), linear-gradient(180deg, #09090d 0%, #07080c 100%)",
        }}
      >
        {toastState.message && (
          <div
            className={`fixed right-4 top-4 z-50 max-w-sm rounded-2xl border px-4 py-3 text-sm font-semibold shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur ${
              toastState.type === "error"
                ? "border-red-400/25 bg-red-500/12 text-red-100"
                : "border-emerald-400/25 bg-emerald-500/12 text-emerald-100"
            }`}
          >
            {toastState.message}
          </div>
        )}

        <div
          className="w-full max-w-[540px] rounded-[30px] border border-[#5f55e8]/75 bg-[#0f1015] p-5 shadow-[0_0_0_1px_rgba(125,101,255,0.16),0_28px_90px_rgba(0,0,0,0.55)] sm:p-6"
        >
          <div className="mb-6 flex items-center gap-4">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-3xl border border-[#5260ff]/45 bg-[#182241]"
          >
            <span
              className="material-icons text-[20px] text-[#9ea9ff]"
            >
                code
              </span>
            </div>
            <div>
              <p className="text-[18px] font-extrabold tracking-tight text-[#97a6ff] sm:text-[20px]">
                CritiqueAI
              </p>
              <p className="text-sm text-white/40">Code review workspace</p>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/8 bg-[#131419] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:p-6">
            <div className="mb-5 flex rounded-2xl border border-white/8 bg-[#0f1014] p-1.5">
              <button
                type="button"
                onClick={() => onNavigate?.("login")}
                className="flex-1 rounded-xl px-4 py-2.5 text-sm font-bold transition"
                style={{
                  background: isLogin ? "#1477f8" : "transparent",
                  color: isLogin ? "#ffffff" : "rgba(255,255,255,0.58)",
                }}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => onNavigate?.("register")}
                className="flex-1 rounded-xl px-4 py-2.5 text-sm font-bold transition"
                style={{
                  background: !isLogin ? "#1477f8" : "transparent",
                  color: !isLogin ? "#ffffff" : "rgba(255,255,255,0.58)",
                }}
              >
                Register
              </button>
            </div>

            <div>
              <p className="text-[2rem] font-extrabold tracking-[-0.04em] text-[#ece7df]">
                {isLogin ? "Welcome back" : "Create account"}
              </p>
              <p className="mt-1.5 text-sm leading-6 text-white/48">
                {isLogin
                  ? "Continue into your dashboard and resume active review sessions."
                  : "Set up your account and launch your first AI-assisted review workspace."}
              </p>
            </div>

            {(errorMessage || successMessage) && (
              <div
                className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
                  errorMessage
                    ? "border-red-400/20 bg-red-500/10 text-red-200"
                    : "border-emerald-400/20 bg-emerald-500/10 text-emerald-200"
                }`}
              >
                {errorMessage || successMessage}
              </div>
            )}

            <form
              onSubmit={isLogin ? handleLogin : handleRegister}
              className="mt-6 space-y-3"
            >
              {!isLogin && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-white/34">
                      First name
                    </span>
                    <input
                      value={registerForm.first_name}
                      onChange={(event) =>
                        updateRegisterField("first_name", event.target.value)
                      }
                      className={fieldBaseClass}
                      placeholder="Aarav"
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-white/34">
                      Last name
                    </span>
                    <input
                      value={registerForm.last_name}
                      onChange={(event) =>
                        updateRegisterField("last_name", event.target.value)
                      }
                      className={fieldBaseClass}
                      placeholder="Sharma"
                      required
                    />
                  </label>
                </div>
              )}

              {!isLogin && (
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-white/34">
                    Phone
                  </span>
                  <input
                    value={registerForm.phone}
                    onChange={(event) =>
                      updateRegisterField("phone", event.target.value)
                    }
                    className={fieldBaseClass}
                    placeholder="+91 9876543210"
                    minLength={7}
                    required
                  />
                </label>
              )}

              <label className="block">
                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-white/34">
                  Email
                </span>
                <input
                  type="email"
                  value={isLogin ? loginForm.email : registerForm.email}
                  onChange={(event) =>
                    isLogin
                      ? updateLoginField("email", event.target.value)
                      : updateRegisterField("email", event.target.value)
                  }
                  className={fieldBaseClass}
                  placeholder="you@company.com"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-white/34">
                  Password
                </span>
                <input
                  type="password"
                  value={isLogin ? loginForm.password : registerForm.password}
                  onChange={(event) =>
                    isLogin
                      ? updateLoginField("password", event.target.value)
                      : updateRegisterField("password", event.target.value)
                  }
                  className={fieldBaseClass}
                  placeholder={isLogin ? "Enter your password" : "Create a strong password"}
                  minLength={isLogin ? 1 : 8}
                  required
                />
              </label>

              {!isLogin && (
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-white/34">
                    Confirm password
                  </span>
                  <input
                    type="password"
                    value={registerForm.confirmPassword}
                    onChange={(event) =>
                      updateRegisterField("confirmPassword", event.target.value)
                    }
                    className={fieldBaseClass}
                    placeholder="Repeat your password"
                    minLength={8}
                    required
                  />
                </label>
              )}

              <div className={`flex flex-col text-sm sm:flex-row sm:items-center sm:justify-between ${isLogin ? "gap-2 pt-0.5" : "gap-2 pt-0.5"}`}>
                <label className="flex items-center gap-3 text-white/54">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-white/20 bg-transparent"
                    defaultChecked={isLogin}
                  />
                  {isLogin ? "Remember this device" : "Accept terms and workspace policy"}
                </label>
                {isLogin && (
                  <button
                    type="button"
                    className="text-left font-semibold text-[#9db1ff] transition hover:text-[#bfd0ff] sm:text-right"
                  >
                    Forgot password?
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-[#1477f8] px-5 py-3.5 text-sm font-extrabold text-white shadow-[0_16px_40px_rgba(20,119,248,0.34)] transition hover:bg-[#2b86fa] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting
                  ? isLogin
                    ? "Signing In..."
                    : "Creating Account..."
                  : isLogin
                    ? "Sign In"
                    : "Create Account"}
              </button>
            </form>

            <div className="my-5 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/8" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-white/24">
                Or continue with
              </span>
              <div className="h-px flex-1 bg-white/8" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {["Google", "GitHub"].map((provider) => (
                <button
                  key={provider}
                  type="button"
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-bold text-white/78 transition hover:bg-white/[0.06]"
                >
                  {provider}
                </button>
              ))}
            </div>

            <p className="mt-5 text-center text-sm text-white/42">
              {isLogin ? "Need an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => onNavigate?.(isLogin ? "register" : "login")}
                className="font-bold text-[#9db1ff]"
              >
                {isLogin ? "Register here" : "Login here"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
