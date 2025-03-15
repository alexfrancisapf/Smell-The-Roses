import { Link } from "react-router-dom";
import rose from "./rose.svg";

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <Link to="/" style={styles.logoLink}>
        <img src={rose} alt="Logo" style={styles.logo} />
      </Link>
    </nav>
  );
};

const styles = {
    navbar: {
      position: "absolute", // Keep it at the top
      top: 0,
      left: 0,
      width: "100%",
      height: "60px",
      display: "flex",
      alignItems: "center",
      padding: "35px 20px",
      backgroundColor: "transparent",
    },
    logoLink: {
      textDecoration: "none",
      cursor: "pointer",
    },
    logo: {
      width: "40px", // Adjust size as needed
      height: "40px",
    },
  };

export default Navbar;
