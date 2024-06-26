import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../services/userService";
import blogService from "../services/blogs";
import UserContext from "./UserContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import loginStyles from "../styles/login-page.module.css";
const Register = ({ navLogin }) => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [user, dispatchUserAction] = useContext(UserContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const addUsersMutation = useMutation({
    mutationFn: userService.addUser,
    onSuccess: () => {},
    onError: () => {
      console.log("ooakdoasd");
    },
  });
  const handleSubmit = async (user) => {
    try {
      addUsersMutation.mutate(user);
      queryClient.invalidateQueries(["users"]);
      dispatchUserAction({ type: "LOGIN", payload: user });
      window.localStorage.setItem("loggedUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUsername("");
      setPassword("");
      navigate("/blog-list");
    } catch (err) {
      console.log("caught", err);
    }
  };
  return (
    <div className={loginStyles["container"]}>
      <form
        className={loginStyles["login-form"]}
        onSubmit={() => handleSubmit({ username, name, password })}
      >
        <h1>Register</h1>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            id="username"
            onChange={({ target }) => setUsername(target.value)}
            required
          />
        </div>
        <div>
          full Name
          <input
            type="text"
            value={name}
            name="name"
            id="name"
            onChange={({ target }) => setName(target.value)}
            required
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
            required
          />
          <button type="submit" id={loginStyles["log-in"]}>
            Register
          </button>
          <div id={loginStyles["divider"]}>
            <span>or</span>
            <hr></hr>
          </div>
          <button onClick={navLogin}>Already have an account ?</button>
        </div>
      </form>
    </div>
  );
};

export default Register;
