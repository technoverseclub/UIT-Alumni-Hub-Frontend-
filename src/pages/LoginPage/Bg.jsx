import bg from "../../assets/bg.jpg";

const Bg = ({ children }) => {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Bg;




