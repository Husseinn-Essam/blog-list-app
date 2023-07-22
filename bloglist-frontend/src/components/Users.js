import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import userService from "../services/userService";
const Users = ({ users }) => {
  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.data.map((user) => (
          <li key={user.id}>
            <Link to={`/users/${user.id}`}>{user.name}</Link> -{" "}
            {user.blogs.length} blogs
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
