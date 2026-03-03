import bg from "../assets/Bg.jpg";

const Bg = ({ children }) => {
  return (
    <div
      className="h-screen w-full bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Optional overlay for smoother edges */}
      <div className="absolute inset-0"></div>

      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};

export default Bg;