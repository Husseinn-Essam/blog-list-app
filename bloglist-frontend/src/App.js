import { useEffect, useRef, useContext } from "react";
import Blog from "./components/Blog";
import Menu from "./components/Menu";
import UserDetails from "./components/UserDetails";
import blogService from "./services/blogs";
import Login from "./components/Login";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import UserContext from "./components/UserContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useMatch,
  useNavigate,
} from "react-router-dom";
import Users from "./components/Users";
import Bloglist from "./components/Bloglist";
import userService from "./services/userService";
const App = () => {
  const [user, dispatchUserAction] = useContext(UserContext);
  // Gets the last logged in user from local
  const userMatch = useMatch("/users/:id");

  const blogFormRef = useRef();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
      const lastLoggedin = JSON.parse(loggedUserJSON);
      dispatchUserAction({ type: "LOGIN", payload: lastLoggedin });
      blogService.setToken(lastLoggedin.token);
    }
  }, []);
  const users = useQuery(["users"], userService.getUsers, {
    refetchOnWindowFocus: false,
  });
  if (users.isLoading) {
    return <div>loading data...</div>;
  }
  console.log(users.data);
  // console.log(userMatch.params.id);
  const matchedUser = userMatch
    ? users.data.find((user) => user.id === userMatch.params.id)
    : null;
  console.log(matchedUser);

  // if (users.isError) {
  //   return <div>Service not available due to problems in server</div>;
  // }

  // React Query :Get Blogs from DB
  // const currentBlogs = useQuery(["blogs"], blogService.getAll, {
  //   refetchOnWindowFocus: false,
  // });
  // if (currentBlogs.isLoading) {
  //   return <div>loading data...</div>;
  // }

  // if (currentBlogs.isError) {
  //   return <div>Service not available due to problems in server</div>;
  // }

  // const queryClient = useQueryClient();
  // const usersQuery = queryClient.getQueryData(["users"]);
  // console.log(usersQuery);
  //Log out logic
  const handleLogout = async (e) => {
    console.log("logged out");
    try {
      window.localStorage.removeItem("loggedUser");
      dispatchUserAction({ type: "LOGOUT" });
    } catch (e) {
      console.log("Failed to logout");
    }
  };

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      {user.isLoggedin === false ? (
        <Togglable buttonLabel="Log in">
          <Login />
        </Togglable>
      ) : (
        <div>
          <p>{user.client.username} is logged in</p>
          <Menu />
          <Routes>
            <Route path="/blog-list" element={<Bloglist />} />
            <Route path="/users" element={<Users />}></Route>
            <Route
              path="/users/:id"
              element={<UserDetails matchedUser={matchedUser} />}
            />
          </Routes>
          <button onClick={handleLogout}>logout</button>
          <Togglable buttonLabel="Create a blog" ref={blogFormRef}>
            <BlogForm />
          </Togglable>
        </div>
      )}
    </div>
  );
};

export default App;
