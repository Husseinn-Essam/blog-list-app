import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import userService from "../services/userService";
const Users = () => {
  const users = useQuery(["users"], userService.getUsers, {
    refetchOnWindowFocus: false,
  });
  if (users.isLoading) {
    return <div>loading data...</div>;
  }

  if (users.isError) {
    return <div>Service not available due to problems in server</div>;
  }

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
