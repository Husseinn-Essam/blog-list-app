import { useState, useContext } from "react";
import loginService from "../services/login";
import blogService from "../services/blogs";
import UserContext from "./UserContext";
import NotifContext from "./NotifContext";
const Login = () => {
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

      console.log(user);
      //logs that user is not yet logged in
      window.localStorage.setItem("loggedUser", JSON.stringify(client));

      blogService.setToken(client.token);
      setUsername("");
      setPassword("");
    } catch (err) {
      // Login error notif
      dispatchMessage({ type: "ERROR" });
      setTimeout(() => {
        dispatchMessage({ type: "MUTE" });
      }, 5000);
    }
  };

  return (
    <>
      <form onSubmit={handleLogin}>
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
        </div>
        <button type="submit" id="Log-in">
          Log in
        </button>
      </form>
    </>
  );
};

export default Login;
