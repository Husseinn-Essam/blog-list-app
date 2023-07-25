import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import UserContext from "./UserContext";
import { useContext } from "react";
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
  return (
    <div>
      <Link style={padding} to="/users">
        Users
      </Link>
      <Link style={padding} to="/blog-list">
        All Blogs
      </Link>
      <button onClick={handleLogout}>logout</button>
    </div>
  );
};

export default Menu;
