import { useQuery } from "@tanstack/react-query";
import blogService from "../services/blogs";
import Blog from "./Blog";
import { useContext } from "react";
import UserContext from "./UserContext";
import { Link } from "react-router-dom";
import blogListStyles from "../styles/blog-list.module.css";

const Bloglist = ({ currentBlogs }) => {
  const [user, dispatchUserAction] = useContext(UserContext);

  return (
    <div className={blogListStyles["container"]}>
      <h1>All Blogs</h1>
      <div className={blogListStyles["divider"]}></div>
      <div className={blogListStyles["blog-list"]}>
        {currentBlogs.data
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <li key={blog.id}>
              <Blog key={blog.id} blog={blog} user={user.client} />
            </li>
          ))}
      </div>
    </div>
  );
};

export default Bloglist;
