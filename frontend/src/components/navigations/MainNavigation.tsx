import { Navbar, Container, Dropdown, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faBell, faUsers } from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { logout } from "../../store/slices/userSlice";
import avg from "../../assets/imgs/dummyAvactor.jpg";

import { resetSongs } from "../../store/slices/songsSlice";
import SearchBar from "../SearchBar";
import { resetAlbums } from "../../store/slices/albumsSlice";

const MainNavigation = () => {
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
        className="d-flex justify-content-md-between justify-content-sm-start gap-4"
      >
        <Link to="/">
          <i className="fa fa-spotify">Spotify</i>
        </Link>
        <div className="d-flex align-items-center gap-3">
          <div
            className="border-none rounded-circle bg-dark d-flex justify-content-center align-items-center"
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

            <Dropdown align="end">
              <Dropdown.Toggle
                variant="dark"
                className="p-0 border d-flex align-items-center justify-content-center rounded-circle "
                style={{ width: "40px", height: "40px" }}
                bsPrefix="custom-dropdown-toggle"
              >
                <Image src={avg} roundedCircle width={32} height={32} />
              </Dropdown.Toggle>

              <Dropdown.Menu className="dropdown-menu-end" variant="dark">
                <Dropdown.Item as={Link} to={"/user/me"}>
                  Profile
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/account">
                  Edit Profile
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
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
