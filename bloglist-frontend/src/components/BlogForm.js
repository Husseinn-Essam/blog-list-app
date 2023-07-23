import { useState, useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import NotifContext from "./NotifContext";
import blogService from "../services/blogs";
const BlogForm = () => {
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
    <div>
      <h2>Create Blog</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            type="text"
            value={title}
            name="title"
            id="title"
            onChange={({ target }) => setTitle(target.value)}
            placeholder="title"
          />
        </div>
        <div>
          author:
          <input
            type="text"
            value={author}
            name="author"
            id="author"
            onChange={({ target }) => setAuthor(target.value)}
            placeholder="author"
          />
        </div>
        <div>
          What do you want to share?:
          <input
            type="text"
            value={content}
            name="url"
            id="url"
            onChange={({ target }) => setContent(target.value)}
            placeholder="woah empty"
          />
        </div>
        <button type="submit" id="create-btn">
          Create
        </button>
      </form>
    </div>
  );
};

export default BlogForm;
