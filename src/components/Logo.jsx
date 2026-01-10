import logo from "../assets/logo.svg";

const Logo = () => {
  return (
    <div className="absolute top-6 left-4">
      <img src={logo} alt="Logo" className="h-14 w-auto" />
    </div>
  );
};

export default Logo;

