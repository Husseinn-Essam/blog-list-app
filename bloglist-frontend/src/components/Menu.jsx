import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "./UserContext";
import BlogForm from "./BlogForm";
import menuStyles from "../styles/menu.module.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, dispatchUserAction] = useContext(UserContext);

  const handleLogout = async () => {
    console.log("logged out");
    try {
      window.localStorage.removeItem("loggedUser");
      navigate("/login");
      dispatchUserAction({ type: "LOGOUT" });
    } catch (e) {
      console.log("Failed to logout");
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const toggleMenu = () => {
    if (!isOpen) {
      setIsOpen(true);
    } else {
      setIsAnimating(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsAnimating(false);
      }, 500);
    }
  };

  return (
    <>
      <BlogForm handleCloseModal={handleCloseModal} showModal={showModal} />
      <nav className={menuStyles.navbar}>
        <div className={menuStyles.navbarContainer}>
          <div>
            <Link className={menuStyles.navbarBrand} to="/home">
              <span style={{ color: "#fbbf24" }}>{"{"}</span>
              <span style={{ color: "#4a5568" }}>( )</span>
              <span style={{ color: "#fbbf24" }}>{" =>"}</span>
              <span style={{ color: "#ffffff" }}> Slash.</span>
              <span style={{ color: "#fbbf24" }}>{"}"}</span>
            </Link>
          </div>
          <div className={menuStyles.navbarLinks}>
            <Link className={menuStyles.navbarLink} to="/home">Home</Link>
            <Link className={menuStyles.navbarLink} to="/createPost">Create Post</Link>
            <button className={menuStyles.navbarLink}  onClick={handleLogout}>Log out</button>
          </div>

          <div className={ menuStyles["hideOnMobile"]}>
            <p>{user.client.username} is logged in</p>
          </div>
          <div className={menuStyles.navbarTogglerContainer}>
            <button
              onClick={toggleMenu}
              type="button"
              className={menuStyles.navbarToggler}
              aria-controls="mobile-menu"
              aria-expanded={isOpen ? "true" : "false"}
            >
              <span className="sr-only">main menu</span>
              {!isOpen ? (
                <svg
                  style={{ height: "24px", width: "24px" }}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              ) : (
                <svg
                  style={{ height: "24px", width: "24px" }}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div
          className={`${menuStyles.navbarMobileMenu} ${
            isOpen
              ? isAnimating
                ? menuStyles.animateSlideUp
                : menuStyles.navbarMobileMenuOpen
              : menuStyles.hidden
          }`}
          id="mobile-menu"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link className={menuStyles.navbarMobileLink} to="/home">Home</Link>
            <Link className={menuStyles.navbarMobileLink} to="/createPost">Create Post</Link>
            <button className={menuStyles.navbarMobileLink} onClick={handleLogout}>Log out</button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
