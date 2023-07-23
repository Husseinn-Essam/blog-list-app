import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import blogService from "../services/blogs";
import styles from "../styles/blog.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faComment } from "@fortawesome/free-solid-svg-icons";
const Blog = ({ blog }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const likeBlogMutation = useMutation({
    mutationFn: blogService.update,
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

  return (
    <div className={styles["blog"]}>
      <h2>{blog.title}</h2>
      <p className={styles["content"]}>{blog.content}</p>
      <Link to={`/blogs/${blog.id}`}>Read More</Link>

      <button onClick={handleLike} id="like">
        <FontAwesomeIcon icon={faThumbsUp} /> Like ({blog.likes})
      </button>
      <button onClick={() => navigate(`/blogs/${blog.id}`)} id="like">
        <FontAwesomeIcon icon={faComment} /> Comment ({blog.comments.length})
      </button>

      <p className={styles["user"]}>By: {blog.user.username}</p>
    </div>
  );
};

export default Blog;
