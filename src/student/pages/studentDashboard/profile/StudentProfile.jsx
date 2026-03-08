import { useStudentProfile } from "../../../../hooks/useStudentProfile";
import FormInput from "../../../../components/FormInput";

const StudentProfile = () => {
  const { profile, status, refetch } = useStudentProfile();

  if (status === "idle" || status === "loading") {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-gray-500">Loading profile...</div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <p className="text-red-500">Failed to load profile.</p>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-9">
      <h2 className="text-2xl font-bold text-blue-900">Student Profile</h2>

      <div className="grid grid-cols-3 gap-10 items-start">

        {/* Avatar */}
        <div className="flex flex-col items-center mt-15">
          <img
            src={
              profile?.imageUrl ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                profile?.user?.name || "Student"
              )}&background=1e3a5f&color=fff&size=128`
            }
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover mb-4 border shadow"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                profile?.user?.name || "Student"
              )}&background=1e3a5f&color=fff&size=128`;
            }}
          />
        </div>

        {/* Fields */}
        <div className="col-span-2 grid grid-cols-2 gap-x-10 gap-y-6">
          <FormInput label="Name"     value={profile?.user?.name} />
          <FormInput label="Email"    value={profile?.user?.email} />
          <FormInput label="Phone"    value={profile?.phone} />
          <FormInput label="LinkedIn" value={profile?.linkedin} />
          <FormInput label="Year"     value={profile?.year} />
          <FormInput label="Branch"   value={profile?.branch} />
          <FormInput label="Bio"      value={profile?.bio} />
        </div>

      </div>
    </div>
  );
};

export default StudentProfile;