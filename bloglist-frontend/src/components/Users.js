import { useQuery } from "@tanstack/react-query";
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
      {users.data.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </div>
  );
};

export default Users;
