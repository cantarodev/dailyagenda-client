import { useState } from "react";
import { useCookies } from "react-cookie";
import PasswordValidatorComponent from "../commons/PasswordValidatorComponent.js";
import apiUser from "../utils/api/modules/user.api.js";
import { IoIosClose } from "react-icons/io";
import { toast } from "sonner";
import { subscription } from "../utils/subscription";
import moment from "moment";

const Auth = ({ setShowModalLogin, setSendToUser, startWebSocket }) => {
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
    const { response, err } =
      endpoint === "login"
        ? await apiUser.login({ email, password })
        : await apiUser.signup({ email, password });

    if (response && !response.detail) {
      setCookie("Email", response.email);
      setCookie("AuthToken", response.token);
      requestNotificationPermission();
      toast.success("Welcome, check your schedule!");

      setShowModalLogin(false);
      startWebSocket(response.token, response.email);
    }

    if (err || response.detail) {
      setError(
        err?.detail ||
          `${response?.detail} ${
            response?.lockDate
              ? moment(response?.lockDate).format("DD-MM-YYYY HH:mm:ss A")
              : ""
          }`
      );
    }
  };

  const requestNotificationPermission = () => {
    if ("Notification" in window) {
      return Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          if ("serviceWorker" in navigator) {
            subscription().catch((err) => console.log(err));
          }
        }
      });
    }
  };

  return (
    <div className="overlay" onClick={() => setShowModalLogin(false)}>
      <div
        className="modal auth-container-box"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="form-title-container">
          <h3>{isLogIn ? "Please log in" : "Please sign up!"} </h3>
          <IoIosClose
            className="close-modal"
            onClick={() => setShowModalLogin(false)}
          />
        </div>
        <form>
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
            className="signup"
            style={{
              backgroundColor: !isLogIn ? "rgb(255 255 255" : "rgb(188 188 188",
            }}
          >
            Sign Up
          </button>
          <button
            onClick={() => viewLogin(true)}
            className="login"
            style={{
              backgroundColor: isLogIn ? "rgb(255 255 255" : "rgb(188 188 188",
            }}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
