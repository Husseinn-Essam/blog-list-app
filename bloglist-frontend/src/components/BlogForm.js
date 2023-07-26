import { useState, useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import NotifContext from "./NotifContext";
import blogService from "../services/blogs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import createStyles from "../styles/create-blog.module.css";
const BlogForm = ({ showModal, handleCloseModal }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [message, dispatchMessage] = useContext(NotifContext);

  const queryClient = useQueryClient();
  const addBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(["blogs"]);
    },
  });

  const notifyBlogSuccess = (blogObj) => {
    dispatchMessage({ type: "BLOG_CREATION_SUCCESS", payload: blogObj });
    setTimeout(() => {
      dispatchMessage({ type: "MUTE" });
    }, 5000);
  };

  const addBlog = (e) => {
    e.preventDefault();
    const createdBlog = {
      title,
      author,
      content,
    };
    addBlogMutation.mutate(createdBlog);
    notifyBlogSuccess(createdBlog);
    setTitle("");
    setAuthor("");
    setContent("");
  };

  return (
    <>
      {showModal && (
        <>
          <div className={createStyles.modal}>
            <div className={createStyles["modal-content"]}>
              <span
                className={createStyles["close-btn"]}
                onClick={handleCloseModal}
              >
                <FontAwesomeIcon icon={faX} style={{ color: "#f5f5f5" }} />
              </span>
              <h2>Create Blog</h2>
              <form onSubmit={addBlog}>
                <div>
                  title:
                  <input
                    type="text"
                    value={title}
                    name="title"
                    onChange={({ target }) => setTitle(target.value)}
                    placeholder="title"
                    required
                  />
                </div>
                <div>
                  author:
                  <input
                    type="text"
                    value={author}
                    name="author"
                    onChange={({ target }) => setAuthor(target.value)}
                    placeholder="author"
                  />
                </div>
                <div>
                  What do you want to share?:
                  <textarea
                    value={content}
                    name="content"
                    onChange={({ target }) => setContent(target.value)}
                    placeholder="woah empty"
                    required
                  />
                </div>
                <button type="submit" id="create-btn">
                  Create
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default BlogForm;
