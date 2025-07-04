import { Navbar, Container, Dropdown, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faBell, faUsers } from "@fortawesome/free-solid-svg-icons";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";

import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { logout } from "../../store/slices/userSlice";
import avg from "../../assets/imgs/dummyAvactor.jpg";

import { resetSongs } from "../../store/slices/songsSlice";
import SearchBar from "../SearchBar";
import { resetAlbums } from "../../store/slices/albumsSlice";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const MainNavigation = () => {
  const [show, setShow] = useState(false);
  const token = useSelector((state: RootState) => state.user.token);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetAlbums());
    dispatch(resetSongs());
  };

  return (
    <Navbar
      variant="dark"
      expand="lg"
      className="px-3 py-2"
      style={{ background: "#000" }}
    >
      <Container
        fluid
        className="d-flex justify-content-md-between justify-content-sm-start align-items-center gap-4"
      >
        <Link to="/">
          <FontAwesomeIcon icon={faSpotify} size="2x" color="#1DB954" />
        </Link>
        <div className="d-flex align-items-center gap-3">
          <div
            className="d-none d-md-flex border-none rounded-circle bg-dark d-flex justify-content-center align-items-center text-truncate"
            style={{ width: "40px", height: "40px" }}
          >
            <Link
              to="/"
              className="text-white"
              style={{ transform: "translate(0px, -1px)" }}
            >
              <FontAwesomeIcon icon={faHome} size="lg" />
            </Link>
          </div>

          <SearchBar />
        </div>

        {token ? (
          <div className="d-none d-sm-flex align-items-center gap-4">
            <FontAwesomeIcon
              icon={faBell}
              color="white"
              title="Notification"
              cursor="pointer"
            />
            <FontAwesomeIcon
              icon={faUsers}
              color="white"
              title="Friends"
              cursor="pointer"
            />

            <Dropdown align="end" show={show} onToggle={() => setShow(!show)}>
              <Dropdown.Toggle
                variant="dark"
                className="p-0 border d-flex align-items-center justify-content-center rounded-circle"
                style={{ width: "40px", height: "40px" }}
                bsPrefix="custom-dropdown-toggle"
              >
                <Image src={avg} roundedCircle width={32} height={32} />
              </Dropdown.Toggle>

              <AnimatePresence>
                {show && (
                  <motion.div
                    key="menu"
                    className="dropdown-menu dropdown-menu-end show bg-dark text-white border rounded py-2"
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "100%",
                      zIndex: 1000,
                      minWidth: "10rem",
                    }}
                  >
                    <Link className="dropdown-item text-white" to="/user/me">
                      Profile
                    </Link>
                    <Link className="dropdown-item text-white" to="/account">
                      Edit Profile
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button
                      className="dropdown-item text-white"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </Dropdown>
          </div>
        ) : (
          <div className="d-flex align-items-center gap-4">
            <Link to="/login" className="btn btn-outline-light">
              Log in
            </Link>
            <Link to="/signup" className="btn btn-light">
              Sign up
            </Link>
          </div>
        )}
      </Container>
    </Navbar>
  );
};

export default MainNavigation;
