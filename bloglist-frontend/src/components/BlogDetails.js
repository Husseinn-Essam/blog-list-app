import { useMutation, useQueryClient } from "@tanstack/react-query";
import blogService from "../services/blogs";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const BlogDetails = ({ matchedBlog, user }) => {
  const [commentText, setCommentText] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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
  const commentBlogMutation = useMutation({
    mutationFn: blogService.comment,
    onSuccess: () => {
      queryClient.invalidateQueries(["blogs"]);
    },
  });
  const handleSubmitComment = (e) => {
    e.preventDefault();
    commentBlogMutation.mutate({
      blogId: matchedBlog.id,
      commentText,
      userId: matchedBlog.user.id,
    });
  };
  const handleLike = () => {
    try {
      const newblog = {
        ...matchedBlog,
        likes: matchedBlog.likes + 1,
      };
      likeBlogMutation.mutate(newblog);
    } catch (error) {
      console.log("Failed to update likes", error);
    }
  };
  const handleRemoval = () => {
    const result = window.confirm(
      `Are you sure you want to remove ${matchedBlog.title}`
    );
    navigate("/blog-list");
    if (result) deleteBlogMutation.mutate(matchedBlog.id);
  };
  // Check if user created this blog to view the remove btn
  const isBlogCreatedByUser =
    user && matchedBlog.user && user.client.id === matchedBlog.user.id;

  // In case of undefined match
  if (!matchedBlog) return null;

  return (
    <div>
      <h2>{matchedBlog.title}</h2>
      <p>{matchedBlog.content}</p>
      <div>
        {matchedBlog.likes} likes{" "}
        <button onClick={handleLike} id="like">
          like
        </button>
      </div>
      <p>Added by {matchedBlog.user.username}</p>
      {isBlogCreatedByUser && (
        <button onClick={handleRemoval} id="remove-btn">
          remove
        </button>
      )}
      <h3>Make a comment</h3>
      <form onSubmit={handleSubmitComment}>
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
        />
        <button type="submit">comment</button>
      </form>
      <h2>Comments</h2>
      <ul>
        {matchedBlog.comments.map((comment) => (
          <li key={comment._id}>
            <strong>{comment.user.username}</strong>: {comment.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogDetails;
