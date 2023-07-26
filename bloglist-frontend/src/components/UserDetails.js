import userStyles from "../styles/users.module.css";

const UserDetails = ({ matchedUser }) => {
  return (
    <>
      <div className={userStyles["container"]}>
        <h2>{matchedUser.username}</h2>
        <h2>Blogs</h2>
        <ul>
          {matchedUser.blogs.map((blog) => (
            <li className={userStyles["list-item"]} key={blog.id}>
              {blog.title}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default UserDetails;
