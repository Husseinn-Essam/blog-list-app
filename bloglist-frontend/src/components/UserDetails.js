const UserDetails = ({ matchedUser }) => {
  return (
    <div>
      <h2>{matchedUser.username}</h2>
      <h3>Blogs</h3>
      <ul>
        {matchedUser.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserDetails;
