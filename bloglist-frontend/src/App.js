import { useState, useEffect, useRef, useContext } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import Login from "./components/Login";
import loginService from "./services/login";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import NotifContext from "./components/NotifContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [message, dispatchMessage] = useContext(NotifContext);
  // React Query
  const blogFormRef = useRef();

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

  // causes error will fix later , get last logged in user
  // useEffect(() => {
  //   const loggedUserJSON = window.localStorage.getItem("loggedUser");
  //   if (loggedUserJSON) {
  //     const user = JSON.parse(loggedUserJSON);
  //     setUser(user);
  //     blogService.setToken(user.token);
  //   }
  // }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("logging in with ", username);
    try {
      const user = await loginService.login({ username, password });
      setUser(user);
      window.localStorage.setItem("loggedUser", JSON.stringify(user));
      blogService.setToken(user.token);
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

  const handleLogout = async (e) => {
    console.log("logged out");
    try {
      window.localStorage.removeItem("loggedUser");
      setUser(null);
    } catch (e) {
      console.log("Failed to logout");
    }
  };

  const handleLikeBlog = async (blogToUpdate) => {
    const newblog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1,
    };

    // const updatedBlog = await blogService.update(blogToUpdate.id, newblog);
    // const updatedBlogs = await blogService.getAll();
    // setBlogs(updatedBlogs.sort((a, b) => b.likes - a.likes));
    // return updatedBlog;
  };

  const handleRemoveBlog = async (blog) => {
    try {
      const result = window.confirm(
        `Are you sure you want to remove ${blog.title}`
      );
      if (result) {
        await blogService.remove(blog.id);
        const updatedBlogs = await blogService.getAll();
        setBlogs(updatedBlogs);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      {user === null ? (
        <Togglable buttonLabel="Log in">
          <Login
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            handleLogin={handleLogin}
          />
        </Togglable>
      ) : (
        <div>
          <p>{user.username} is logged in</p>
          <button onClick={handleLogout}>logout</button>
          <Togglable buttonLabel="Create a blog" ref={blogFormRef}>
            <BlogForm />
          </Togglable>
          <div className="blog-list">
            {currentBlogs.data.map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                user={user}
                // likeBlog={}
                // removeBlog={console.log("gamers")}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
