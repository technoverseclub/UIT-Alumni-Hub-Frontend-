import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAlumniById } from "../alumniHub.api";

const AlumniHubProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await getAlumniById(userId);
        if (mounted) setProfile(res.data);
      } catch (err) {
  console.error("Failed to load profile", err);
} finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
  mounted = false;
};
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl flex gap-10 px-10 mx-auto">

      {/* Sidebar */}
      <aside className="w-64 bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl flex flex-col">

        <h2 className="text-xl font-bold text-blue-900 mb-10">
          Alumni
        </h2>

        <nav className="flex flex-col gap-4 flex-1">

          <button className="py-2 px-4 rounded-lg bg-blue-900 text-white">
            Profile
          </button>

          <button
            onClick={() =>
              navigate(`/student/messages?userId=${userId}`)
            }
            className="py-2 px-4 rounded-lg hover:bg-blue-100"
          >
            Messages Alumni
          </button>

        </nav>

        <button
          onClick={() => navigate(-1)}
          className="mt-10 bg-gray-200 hover:bg-gray-300 py-2 rounded-lg"
        >
          ← Back
        </button>

      </aside>


      {/* Main Content */}
      <main className="flex-1 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-9">

        <h2 className="text-2xl font-bold text-blue-900 mb-6">
          Alumni Profile
        </h2>

        <div className="grid grid-cols-3 gap-10 items-start">

          {/* Image */}
          <div className="flex flex-col items-center mt-10">
            <img
  src={
    profile?.imageUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      profile?.user?.name || "Alumni"
    )}&background=1e3a5f&color=fff&size=128`
  }
  alt="Profile"
  className="w-32 h-32 rounded-full object-cover mb-4 border shadow"
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = `https://ui-avatars.com/api/?name=Alumni&background=1e3a5f&color=fff&size=128`;
  }}
/>
          </div>

          {/* Details */}
          <div className="col-span-2 grid grid-cols-2 gap-x-10 gap-y-6">

            <FormInput label="Name" value={profile?.user?.name} />
            <FormInput label="Email" value={profile?.user?.email} />
            <FormInput label="Phone" value={profile?.phone} />
            <FormInput label="LinkedIn" value={profile?.linkedin} />
            <FormInput label="Company" value={profile?.company} />
            <FormInput label="Position" value={profile?.position} />
            <FormInput label="Batch" value={profile?.batch} />
            <FormInput label="Branch" value={profile?.branch} />

          </div>

        </div>

      </main>

    </div>
  );
};

export default AlumniHubProfile;


const FormInput = ({ label, value }) => (
  <div className="flex flex-col">
    <label className="text-sm font-semibold text-blue-700 mb-1">
      {label}
    </label>
    <input
      value={value || ""}
      readOnly
      className="border rounded-lg px-3 py-2 bg-gray-50 focus:outline-none"
    />
  </div>
);