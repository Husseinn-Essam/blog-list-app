import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import Login from "./components/Login";
import loginService from "./services/login";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [succMessage, setSucc] = useState(null);
  const [errMessage, setErr] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [loginVisible, setLoginVisible] = useState(false);
  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
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
    } catch (e) {
      setErr("Wrong username or password");
      setTimeout(() => {
        setErr(null);
      }, 5000);
    }
  };

  const handleLogout = async (e) => {
    console.log("logged out");
    try {
      window.localStorage.removeItem("loggedUser");
      setUser(null);
    } catch {
      console.log("Failed to logout");
    }
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    try {
      const newBlog = {
        title,
        author,
        url,
      };
      blogService.create(newBlog);

      setSucc(`A new blog "${newBlog.title}" by ${newBlog.author}`);
      setTimeout(() => {
        setSucc(null);
      }, 5000);
      const updatedBlogs = await blogService.getAll();
      setBlogs(updatedBlogs);
    } catch (e) {
      console.log(e);
      console.log("failed to update blog");
    }
  };

  return (
    <div>
      <h2>blogs</h2>
      <Notification succMessage={succMessage} errMessage={errMessage} />
      {user === null ? (
        <Login
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          handleLogin={handleLogin}
        />
      ) : (
        <div>
          <p>{user.username} is logged in</p>
          <button onClick={handleLogout}>logout</button>
          <BlogForm
            title={title}
            setTitle={setTitle}
            author={author}
            setAuthor={setAuthor}
            url={url}
            setUrl={setUrl}
            handleBlogSubmit={handleBlogSubmit}
          />
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
