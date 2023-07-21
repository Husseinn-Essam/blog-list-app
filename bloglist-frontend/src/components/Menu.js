import { Link } from "react-router-dom";
const Menu = () => {
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
    </div>
  );
};

export default Menu;
