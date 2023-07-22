import { useMutation, useQueryClient } from "@tanstack/react-query";
import blogService from "../services/blogs";
const BlogDetails = ({ matchedBlog, user }) => {
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
    if (result) deleteBlogMutation.mutate(matchedBlog.id);
  };
  const isBlogCreatedByUser =
    user && matchedBlog.user && user.id === matchedBlog.user.id;

  return (
    <div>
      <h2>{matchedBlog.title}</h2>
      <p>{matchedBlog.url}</p>
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
    </div>
  );
};

export default BlogDetails;
