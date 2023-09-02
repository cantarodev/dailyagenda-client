import { useState } from "react";
import { useCookies } from "react-cookie";
import PasswordValidatorComponent from "./PasswordValidatorComponent.js";
import { IoIosClose } from "react-icons/io";
import { toast } from "react-toastify";

const Auth = ({ setShowModalLogin }) => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [isLogIn, setIsLogin] = useState(true);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [error, setError] = useState(null);

  const viewLogin = (status) => {
    setError(null);
    setIsLogin(status);
  };

  const handleSubmit = async (e, endpoint) => {
    e.preventDefault();
    if (
      email === null ||
      password === null ||
      email === "" ||
      password === ""
    ) {
      setError("There are empty fields!");
      return;
    }

    if (!isLogIn && password !== confirmPassword) {
      setError("Make sure passwords match!");
      return;
    }

    const response = await fetch(
      `${process.env.REACT_APP_SERVERURL}/users/${endpoint}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await response.json();
    if (data.detail) {
      setError(data.detail);
    } else {
      setCookie("Email", data.email);
      setCookie("AuthToken", data.token);

      requestNotificationPermission();
      toast.success("Welcome, check your schedule!");
      setShowModalLogin(false);
    }
  };

  // Solicitar permiso para enviar notificaciones push
  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("Permiso para enviar notificaciones push concedido");
      }
    }
  };

  return (
    <div className="overlay">
      <div className="auth-container">
        <div className="auth-container-box">
          <div className="content-close-modal">
            <IoIosClose
              className="close-modal"
              onClick={() => setShowModalLogin(false)}
            />
          </div>
          <form>
            <h2>{isLogIn ? "Please log in" : "Please sign up!"} </h2>
            <input
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
            {!isLogIn && (
              <input
                type="password"
                placeholder="Confirm your password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            )}
            <input
              type="submit"
              className="create"
              value="Send"
              onClick={(e) => handleSubmit(e, isLogIn ? "login" : "signup")}
            />
            {!isLogIn && password !== null && password !== "" && (
              <PasswordValidatorComponent password={password} />
            )}
            {error && <p className="error">{error}</p>}
          </form>
          <div className="auth-options">
            <button
              onClick={() => viewLogin(false)}
              style={{
                backgroundColor: !isLogIn
                  ? "rgb(255 255 255"
                  : "rgb(188 188 188",
              }}
            >
              Sign Up
            </button>
            <button
              onClick={() => viewLogin(true)}
              style={{
                backgroundColor: isLogIn
                  ? "rgb(255 255 255"
                  : "rgb(188 188 188",
              }}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
