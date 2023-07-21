import { useState, useEffect, useRef, useContext } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import Login from "./components/Login";
import loginService from "./services/login";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import NotifContext from "./components/NotifContext";
import UserContext from "./components/UserContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const App = () => {
  const [user, dispatchUserAction] = useContext(UserContext);
  // Gets the last logged in user from local
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
      const lastLoggedin = JSON.parse(loggedUserJSON);
      dispatchUserAction({ type: "LOGIN", payload: lastLoggedin });
      blogService.setToken(lastLoggedin.token);
    }
  }, []);
  const blogFormRef = useRef();

  // React Query

  // Get Blogs from DB
  const currentBlogs = useQuery(["blogs"], blogService.getAll, {
    refetchOnWindowFocus: false,
  });
  if (currentBlogs.isLoading) {
    return <div>loading data...</div>;
  }

  if (currentBlogs.isError) {
    return <div>Anecdote service not available due to problems in server</div>;
  }

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
          {console.log(
            user.client.token,
            "and",
            JSON.parse(window.localStorage.getItem("loggedUser")).token
          )}

          <p>{user.client.username} is logged in</p>
          <button onClick={handleLogout}>logout</button>
          <Togglable buttonLabel="Create a blog" ref={blogFormRef}>
            <BlogForm />
          </Togglable>
          <div className="blog-list">
            {currentBlogs.data.map((blog) => (
              <Blog key={blog.id} blog={blog} user={user.client} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
