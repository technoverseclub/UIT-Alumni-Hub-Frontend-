import { useEffect, useRef, useState } from "react";
import { getAlumniProfile } from "../../../alumni.api";
import { useAuthStore } from "../../../../auth/auth.store";
import FormInput from "../../../../components/FormInput"; // adjust path

const AlumniProfile = () => {
  const accessToken = useAuthStore((s) => s.accessToken);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  const hasFetched = useRef(false);
  const [profile, setProfile] = useState(null);
  const loadingRef = useRef(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasHydrated || !accessToken) return;
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchProfile = async () => {
      try {
        const res = await getAlumniProfile();
        setProfile(res.data);
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [hasHydrated, accessToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-white">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-9">

      <h2 className="text-2xl font-bold text-blue-900 ">
        Alumni Profile
      </h2>

      <div className="grid grid-cols-3 gap-10 items-start ">

        {/* Profile Image */}
        <div className="flex flex-col items-center mt-15">
          <img
  src={profile?.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.user?.name || "Alumni")}&background=1e3a5f&color=fff&size=128`}
  alt="Profile"
  className="w-32 h-32 rounded-full object-cover mb-4 border shadow"
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.user?.name || "Alumni")}&background=1e3a5f&color=fff&size=128`;
  }}
/>
        </div>

        {/* Profile Details */}
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
    </div>
  );
};

export default AlumniProfile;