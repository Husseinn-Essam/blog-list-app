import { useMutation, useQueryClient } from "@tanstack/react-query";
import blogService from "../services/blogs";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import blogDetailsStyles from "../styles/blog-details.module.css";
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
    <div className={blogDetailsStyles["blog-details"]}>
      <h2 className={blogDetailsStyles["blog-title"]}>{matchedBlog.title}</h2>
      <p className={blogDetailsStyles["blog-content"]}>{matchedBlog.content}</p>
      <div className={blogDetailsStyles.likes}>
        <button onClick={handleLike} className={blogDetailsStyles["like-btn"]}>
          <FontAwesomeIcon icon={faThumbsUp} style={{ color: "#fafafa" }} />{" "}
          like ({matchedBlog.likes})
        </button>
      </div>
      <p>Added by {matchedBlog.user.username}</p>
      {isBlogCreatedByUser && (
        <button
          onClick={handleRemoval}
          className={blogDetailsStyles["remove-btn"]}
        >
          <FontAwesomeIcon icon={faTrashCan} style={{ color: "#ffffff" }} />{" "}
          remove
        </button>
      )}
      <h2 className={blogDetailsStyles["comments-title"]}>Comments</h2>
      <h3 className={blogDetailsStyles["comment-form-title"]}>
        Make a comment
      </h3>
      <form onSubmit={handleSubmitComment}>
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
        />
        <button type="submit">comment</button>
      </form>
      <ul className={blogDetailsStyles["comment-list"]}>
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
