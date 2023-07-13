import { useState } from "react";

const Blog = ({ blog, user, likeBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };
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
        <>
          {blog.title} {blog.author}{" "}
          <button onClick={toggleDetails}>View</button>
        </>
      ) : (
        <>
          <p>
            {blog.title} {blog.author}{" "}
            <button onClick={toggleDetails}>Hide</button>
          </p>
          <p>{blog.url}</p>
          <div>
            {`Likes: ${blogObject.likes}`}{" "}
            <button onClick={handleLike}>like</button>
          </div>
          <p>{user.username}</p>
        </>
      )}
    </div>
  );
};

export default Blog;
