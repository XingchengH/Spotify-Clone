import { Link } from "react-router-dom";

export default function User() {
  return (
    <div>
      <h2>User Account Info</h2>
      <Link to="profile" className="btn btn-primary mt-3">
        Edit Profile
      </Link>
    </div>
  );
}
