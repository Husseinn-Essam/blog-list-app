import { useQuery } from "@tanstack/react-query";
import blogService from "../services/blogs";
import Blog from "./Blog";
import { useContext } from "react";
import UserContext from "./UserContext";
const Bloglist = () => {
  const [user, dispatchUserAction] = useContext(UserContext);
  const currentBlogs = useQuery(["blogs"], blogService.getAll, {
    refetchOnWindowFocus: false,
  });
  if (currentBlogs.isLoading) {
    return <div>loading data...</div>;
  }

  if (currentBlogs.isError) {
    return <div>Service not available due to problems in server</div>;
  }
  return (
    <div className="blog-list">
      {currentBlogs.data
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog key={blog.id} blog={blog} user={user.client} />
        ))}
    </div>
  );
};

export default Bloglist;
