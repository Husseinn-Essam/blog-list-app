import { useEffect, useContext } from "react";
import Menu from "./components/Menu";
import UserDetails from "./components/UserDetails";
import blogService from "./services/blogs";
import Login from "./components/Login";
import Notification from "./components/Notification";
import UserContext from "./components/UserContext";
import { Routes, Route, useMatch } from "react-router-dom";
import Users from "./components/Users";
import Bloglist from "./components/Bloglist";
import { useInitializerContext } from "./components/initializerContext";
import BlogDetails from "./components/BlogDetails";
import "./global.css";
const App = () => {
  const [user, dispatchUserAction] = useContext(UserContext);
  const userMatch = useMatch("/users/:id");
  const blogMatch = useMatch("/blogs/:id");

  // Gets the last logged in user from local
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
      const lastLoggedin = JSON.parse(loggedUserJSON);
      dispatchUserAction({ type: "LOGIN", payload: lastLoggedin });
      blogService.setToken(lastLoggedin.token);
    }
  }, []);

  // Custom hook that access react queries in initializerContext.js
  // Queries to get data from DB to initialize the App
  const { users, currentBlogs } = useInitializerContext();
  if (users.isLoading || currentBlogs.isLoading) {
    return <div>loading data...</div>;
  }

  if (users.isError || currentBlogs.isError) {
    return <div>Service not available due to problems in server</div>;
  }
  // Get matched user
  const matchedUser = userMatch
    ? users.data.find((user) => user.id === userMatch.params.id)
    : null;
  // Get matched blog
  const matchedBlog = blogMatch
    ? currentBlogs.data.find((blog) => blog.id === blogMatch.params.id)
    : null;

  //Log out logic

  return (
    <>
      <Notification />
      {user.isLoggedin === false ? (
        <Login />
      ) : (
        <div id="main">
          <Menu />

          <Routes>
            <Route
              path="/"
              element={<Bloglist currentBlogs={currentBlogs} />}
            />
            <Route
              path="/blog-list"
              element={<Bloglist currentBlogs={currentBlogs} />}
            />
            <Route path="/users" element={<Users users={users} />}></Route>
            <Route
              path="/users/:id"
              element={<UserDetails matchedUser={matchedUser} />}
            />
            <Route
              path="/blogs/:id"
              element={<BlogDetails matchedBlog={matchedBlog} user={user} />}
            />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      )}
    </>
  );
};

export default App;
