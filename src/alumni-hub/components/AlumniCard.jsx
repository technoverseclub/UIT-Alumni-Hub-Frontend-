import { useNavigate } from "react-router-dom";

const AlumniCard = ({ alumni, index }) => {
  const navigate = useNavigate();
  const isLastInRow = (index + 1) % 4 === 0;

  return (
    <div
      className={`flex flex-col items-center text-center ${
        !isLastInRow ? "lg:border-r lg:border-white/20 lg:pr-10" : ""
      }`}
    >
      <img
        src={
          alumni.imageUrl ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            alumni.user?.name || "Alumni"
          )}&background=1e3a5f&color=fff&size=128`
        }
        alt={alumni.user?.name}
        className="w-32 h-32 rounded-full object-cover shadow-lg"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
            alumni.user?.name || "Alumni"
          )}&background=1e3a5f&color=fff&size=128`;
        }}
      />
      <p className="mt-4 font-semibold text-lg text-white">
        {alumni.user?.name}
      </p>
      <p className="text-sm text-white/70">{alumni.position}</p>
      <p className="text-xs text-white/50">{alumni.company}</p>
      <button
        onClick={() => navigate(`/alumni-hub/${alumni.userId}`)}
        className="mt-3 bg-white text-[#1b3d6b] px-5 py-1.5 rounded-full font-medium hover:scale-105 transition"
      >
        View Profile
      </button>
    </div>
  );
};

export default AlumniCard;