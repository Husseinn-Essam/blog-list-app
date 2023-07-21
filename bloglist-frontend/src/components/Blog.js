import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import blogService from "../services/blogs";
const Blog = ({ blog, user }) => {
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

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries(["blogs"]);
    },
  });

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

  const handleRemoval = () => {
    const result = window.confirm(
      `Are you sure you want to remove ${blog.title}`
    );
    if (result) deleteBlogMutation.mutate(blog.id);
  };
  const isBlogCreatedByUser = user && blog.user && user.id === blog.user.id;
  const [details, setDetails] = useState(false);
  const toggleDetails = () => {
    details ? setDetails(false) : setDetails(true);
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
            <button onClick={handleRemoval} id="remove-btn">
              remove
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
