const LoginButton = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-white text-black py-1.5 px-5 rounded-full font-bold 
                 hover:scale-110 hover:underline transition cursor-pointer"
    >
      LOG IN
    </button>
  );
};

export default LoginButton;