import { useState, useContext } from "react";
import loginService from "../services/login";
import blogService from "../services/blogs";
import UserContext from "./UserContext";
import NotifContext from "./NotifContext";
import loginStyles from "../styles/login-page.module.css";
import { useNavigate } from "react-router-dom";
import Register from "./Register";
const Login = () => {
  const navigate = useNavigate();
  const [register, setRegister] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, dispatchMessage] = useContext(NotifContext);
  const [user, dispatchUserAction] = useContext(UserContext);
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("logging in with ", username);
    try {
      const client = await loginService.login({ username, password });
      dispatchUserAction({ type: "LOGIN", payload: client });
      window.localStorage.setItem("loggedUser", JSON.stringify(client));
      blogService.setToken(client.token);
      setUsername("");
      setPassword("");
      navigate("/blog-list");
    } catch (err) {
      // Login error notif
      dispatchMessage({ type: "ERROR" });
      setTimeout(() => {
        dispatchMessage({ type: "MUTE" });
      }, 5000);
    }
  };
  const navRegister = (e) => {
    e.preventDefault();
    setRegister(true);
  };
  const navLogin = (e) => {
    e.preventDefault();
    setRegister(false);
  };
  return (
    <>
      {register === false ? (
        <div className={loginStyles["container"]}>
          <form className={loginStyles["login-form"]} onSubmit={handleLogin}>
            <h1>Log in</h1>
            <div>
              username
              <input
                type="text"
                value={username}
                name="Username"
                id="username"
                onChange={({ target }) => setUsername(target.value)}
              />
            </div>
            <div>
              password
              <input
                type="password"
                value={password}
                name="password"
                id="password"
                onChange={({ target }) => setPassword(target.value)}
              />
              <button type="submit" id={loginStyles["log-in"]}>
                Log in
              </button>
              <div id={loginStyles["divider"]}>
                <span>or</span>
                <hr></hr>
              </div>
              <button onClick={navRegister}>Create an account</button>
            </div>
          </form>
        </div>
      ) : (
        <Register navLogin={navLogin} />
      )}
    </>
  );
};

export default Login;
