import logo from "../assets/Logo.svg";

const Logo = ({ className = "" }) => {
  return (
    <img
      src={logo}
      alt="Alumni Hub Logo"
      className={`h-14 w-auto ${className}`}
    />
  );
};

export default Logo;