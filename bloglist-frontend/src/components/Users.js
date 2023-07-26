import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import userService from "../services/userService";
import usersStyle from "../styles/users.module.css";
const Users = ({ users }) => {
  return (
    <>
      <div className={usersStyle["container"]}>
        <h2>Users</h2>
        <ul>
          {users.data.map((user) => (
            <li className={usersStyle["list-item"]} key={user.id}>
              <Link to={`/users/${user.id}`}>{user.name}</Link> -{" "}
              {user.blogs.length} blogs
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Users;
