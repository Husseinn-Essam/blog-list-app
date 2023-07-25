import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import blogService from "../services/blogs";
import styles from "../styles/blog.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faComment,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
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
      <img src={`https://picsum.photos/id/4/5000/3333`} />
      <div className={styles["blog-main"]}>
        <p className={styles["blog-title"]}>{blog.title}</p>
        <p className={styles["content"]}>{blog.content}</p>
      </div>
      <div className={styles["act-container"]}>
        <Link id={styles["readmore"]} to={`/blogs/${blog.id}`}>
          Read More
        </Link>
        <div>
          <button onClick={handleLike} id={styles["like"]}>
            <FontAwesomeIcon icon={faThumbsUp} /> Like ({blog.likes})
          </button>
          <button onClick={() => navigate(`/blogs/${blog.id}`)}>
            <FontAwesomeIcon icon={faComment} /> Comment ({blog.comments.length}
            )
          </button>
        </div>
      </div>
      <div className={styles["author"]}>
        <p> {blog.user.username}</p>
        <FontAwesomeIcon icon={faUser} style={{ color: "#479beb" }} />
      </div>
    </div>
  );
};

export default Blog;
