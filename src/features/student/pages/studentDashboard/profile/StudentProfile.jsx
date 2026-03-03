import { useEffect, useState } from "react"; // 👈 remove useRef
import { useNavigate } from "react-router-dom";
import { getStudentProfile } from "../../../student.api";
import { useAuthStore } from "../../../../auth/auth.store";

let ProfileFetched = false; // 👈 module level

const StudentProfile = () => {
  const navigate = useNavigate();
  const accessToken = useAuthStore((s) => s.accessToken);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  // 👆 remove hasFetched useRef line entirely

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasHydrated || !accessToken) return;
    if (ProfileFetched) return;
    ProfileFetched = true;

    const fetchProfile = async () => {
      try {
        const res = await getStudentProfile();
        setProfile(res.data);
      } catch (err) {
        console.error("Profile fetch error:", err);
        if (err.response?.status === 401) navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated, accessToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-gray-500">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-9">

      <h2 className="text-2xl font-bold text-blue-900">
        Student Profile
      </h2>

      <div className="grid grid-cols-3 gap-10 items-start">

        {/* Profile Image */}
        <div className="flex flex-col items-center mt-15">
          <img
  src={profile?.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.user?.name || "Student")}&background=1e3a5f&color=fff&size=128`}
  alt="Profile"
  className="w-32 h-32 rounded-full object-cover mb-4 border shadow"
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.user?.name || "Student")}&background=1e3a5f&color=fff&size=128`;
  }}
/>
        </div>

        {/* Profile Details */}
        <div className="col-span-2 grid grid-cols-2 gap-x-10 gap-y-6">

          <FormInput label="Name" value={profile?.user?.name} />
          <FormInput label="Email" value={profile?.user?.email} />
          <FormInput label="Phone" value={profile?.phone} />
          <FormInput label="LinkedIn" value={profile?.linkedin} />
          <FormInput label="Year" value={profile?.year} />
          <FormInput label="Branch" value={profile?.branch} />
          <FormInput label="Bio" value={profile?.bio} />

        </div>

      </div>
    </div>
  );
};

export default StudentProfile;

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