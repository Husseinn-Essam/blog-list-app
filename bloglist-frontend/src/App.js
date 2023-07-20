import { useState, useEffect, useRef, useContext } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import Login from "./components/Login";
import loginService from "./services/login";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import NotifContext from "./components/NotifContext";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [message, dispatchMessage] = useContext(NotifContext);

  const blogFormRef = useRef();
  useEffect(() => {
    blogService
      .getAll()
      .then((blogs) => setBlogs(blogs.sort((a, b) => b.likes - a.likes)));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

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

  const handleBlogSubmit = async (blogObj) => {
    try {
      blogFormRef.current.toggleVisibility();
      const newBlog = await blogService.create(blogObj);
      // SUCCESS NOTIF
      dispatchMessage({ type: "BLOG_CREATION_SUCCESS", payload: blogObj });
      setTimeout(() => {
        dispatchMessage({ type: "MUTE" });
      }, 5000);
      setBlogs(blogs.concat(newBlog));
    } catch (e) {
      console.log(e);
      console.log("failed to update blog");
    }
  };

  const handleLikeBlog = async (blogToUpdate) => {
    const newblog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1,
    };

    const updatedBlog = await blogService.update(blogToUpdate.id, newblog);
    const updatedBlogs = await blogService.getAll();
    setBlogs(updatedBlogs.sort((a, b) => b.likes - a.likes));
    return updatedBlog;
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
            <BlogForm createBlog={handleBlogSubmit} />
          </Togglable>
          <div className="blog-list">
            {blogs.map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                user={user}
                likeBlog={handleLikeBlog}
                removeBlog={handleRemoveBlog}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
