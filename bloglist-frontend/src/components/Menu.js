import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import UserContext from "./UserContext";
import { useContext, useState } from "react";
import menuStyles from "../styles/menu.module.css";
import BlogForm from "./BlogForm";
const Menu = () => {
  const navigate = useNavigate();
  const [user, dispatchUserAction] = useContext(UserContext);

  const handleLogout = async (e) => {
    console.log("logged out");
    try {
      window.localStorage.removeItem("loggedUser");
      navigate("/");
      dispatchUserAction({ type: "LOGOUT" });
    } catch (e) {
      console.log("Failed to logout");
    }
  };
  const padding = {
    paddingRight: 5,
  };
  // Modal logic
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  return (
    <>
      <BlogForm handleCloseModal={handleCloseModal} showModal={showModal} />
      <div className={menuStyles["navbar"]}>
        <h1>blogs</h1>
        <div className={menuStyles["links"]}>
          <Link to="/users">Users</Link>
          <Link style={padding} to="/blog-list">
            All Blogs
          </Link>
          <button onClick={handleOpenModal} id={menuStyles["createBlog"]}>
            Create a Blog
          </button>
        </div>
        <div className={menuStyles["login"]}>
          <p>{user.client.username} is logged in</p>
          <button onClick={handleLogout}>Log out</button>
        </div>
      </div>
    </>
  );
};

export default Menu;
