import { Link } from "react-router-dom";
import rose from "./rose.svg";
import userIcon from "./user.svg";

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <Link to="/" style={styles.logoLink}>
        <img src={rose} alt="Logo" style={styles.logo} />
      </Link>
      <Link to="/user" style={styles.userLink}>
        <img src={userIcon} alt="User" style={styles.userIcon} />
      </Link>
    </nav>
  );
};

const styles = {
  navbar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px",
    backgroundColor: "transparent",
    zIndex: 1000,
  },
  logoLink: {
    textDecoration: "none",
    cursor: "pointer",
  },
  logo: {
    width: "40px",
    height: "40px",
  },
  userLink: {
    textDecoration: "none",
    cursor: "pointer",
    marginLeft: "auto",
  },
  userIcon: {
    width: "40px",
    height: "40px",
    marginRight: "40px",
  },
};

export default Navbar;
