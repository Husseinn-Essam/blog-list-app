import { useState } from "react";

const Blog = ({ blog, user, likeBlog, removeBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };
  const isBlogCreatedByUser = user && blog.user && user.id === blog.user.id;
  const [blogObject, setBlogObject] = useState(blog);
  const [details, setDetails] = useState(false);
  const toggleDetails = () => {
    details ? setDetails(false) : setDetails(true);
  };
  const handleLike = async () => {
    try {
      const updatedBlog = await likeBlog(blogObject);
      setBlogObject(updatedBlog);
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
            <div className="likes">{`Likes: ${blogObject.likes}`} </div>
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
