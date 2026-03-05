import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAlumniById } from "../alumniHub.api";

const AlumniHubProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await getAlumniById(userId);
        if (mounted) setProfile(res.data);
      } catch {
        if (mounted) setError("Failed to load profile.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [userId]);

  if (loading) return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white/60">Loading...</p>
      </div>
  );

  if (error) return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-400">{error}</p>
      </div>
  );

  return (
      <div className="relative min-h-screen w-full px-8 pb-16">

        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium transition"
        >
          ← Back
        </button>

        <div className="flex items-center justify-center pt-24">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-10 w-full max-w-2xl text-white">
            <div className="flex flex-col items-center mb-8">
              <img
                src={
                  profile?.imageUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    profile?.user?.name || "Alumni"
                  )}&background=1e3a5f&color=fff&size=128`
                }
                alt={profile?.user?.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white/20 shadow-xl mb-4"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    profile?.user?.name || "Alumni"
                  )}&background=1e3a5f&color=fff&size=128`;
                }}
              />
              <h2 className="text-2xl font-bold">{profile?.user?.name}</h2>
              <p className="text-white/70">{profile?.position} at {profile?.company}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ProfileField label="Email" value={profile?.user?.email} />
              <ProfileField label="Phone" value={profile?.phone} />
              <ProfileField label="Branch" value={profile?.branch} />
              <ProfileField label="Batch" value={profile?.batch} />
              <ProfileField label="Company" value={profile?.company} />
              <ProfileField label="Position" value={profile?.position} />
            </div>

            {profile?.linkedin && (
              <div className="mt-6 text-center">
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-white text-[#1b3d6b] px-8 py-2 rounded-full font-semibold hover:scale-105 transition"
                >
                  View LinkedIn
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default AlumniHubProfile;

const ProfileField = ({ label, value }) => (
  <div className="bg-white/5 rounded-lg px-4 py-3">
    <p className="text-xs text-white/50 mb-1">{label}</p>
    <p className="font-semibold">{value || "—"}</p>
  </div>
);