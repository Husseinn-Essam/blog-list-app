import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import blogService from "../services/blogs";
const Blog = ({ blog, user, removeBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };
  const queryClient = useQueryClient();

  const likeBlogMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: () => {
      queryClient.invalidateQueries(["blogs"]);
    },
  });
  const isBlogCreatedByUser = user && blog.user && user.id === blog.user.id;
  const [details, setDetails] = useState(false);
  const toggleDetails = () => {
    details ? setDetails(false) : setDetails(true);
  };
  const handleLike = () => {
    try {
      const newblog = {
        ...blog,
        likes: blog.likes + 1,
      };
      likeBlogMutation.mutate(newblog);
    } catch (error) {
      console.log("Failed to update likes", error);
    }
  };
  return (
    <div style={blogStyle}>
      {!details ? (
        <div className="blogHead">
          {blog.title} {blog.author}
          <button id="view" onClick={toggleDetails}>
            View
          </button>
        </div>
      ) : (
        <div className="blogDetails">
          <p>
            {blog.title} {blog.author}{" "}
            <button onClick={toggleDetails} id="hide">
              Hide
            </button>
          </p>
          <p>{blog.url}</p>
          <div>
            <div className="likes">{`Likes: ${blog.likes}`} </div>
            <button onClick={handleLike} id="like">
              like
            </button>
          </div>
          <p>{blog.user.username}</p>
          {isBlogCreatedByUser && (
            <button onClick={() => removeBlog(blog)} id="remove-btn">
              remove
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
