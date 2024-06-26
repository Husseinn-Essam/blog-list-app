import Blog from "./Blog";
import { useContext } from "react";
import UserContext from "./UserContext";
import blogListStyles from "../styles/blog-list.module.css";
import { Hero } from "./Hero";

const Bloglist = ({ currentBlogs }) => {
  const [user, dispatchUserAction] = useContext(UserContext);

  return (
    <div className={blogListStyles["container"]}>
      <Hero/>
      <div className={blogListStyles["blog-list"]}>
        {currentBlogs.data
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Blog key={blog.id} blog={blog} user={user.client} />
          ))}
      </div>
    </div>
  );
};

export default Bloglist;
