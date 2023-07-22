import { useQuery } from "@tanstack/react-query";
import blogService from "../services/blogs";
import Blog from "./Blog";
import { useContext } from "react";
import UserContext from "./UserContext";
import { Link } from "react-router-dom";
const Bloglist = ({ currentBlogs }) => {
  const [user, dispatchUserAction] = useContext(UserContext);

  return (
    <div className="blog-list">
      {currentBlogs.data
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          // <Blog key={blog.id} blog={blog} user={user.client} /> Old Blog component
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
    </div>
  );
};

export default Bloglist;
