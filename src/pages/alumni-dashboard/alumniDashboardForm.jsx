import { useEffect, useState } from "react";
import axios from "axios";

const AlumniDashboardForm = () => {
  const token = localStorage.getItem("token");

  const [profile, setProfile] = useState(null);

  /* ✅ FETCH PROFILE DATA */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "https://uit-alumni-hub-backend.onrender.com/alumni/profile/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProfile(res.data);
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };

    fetchProfile();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center">

      {/* MAIN CONTAINER */}
      <div className="w-full max-w-7xl flex gap-10 px-10">

        {/* ================= SIDEBAR ================= */}
        <aside className="w-64 bg-white gap-10 rounded-2xl p-6 shadow-xl flex flex-col justify-center">
          <button className="mb-5 py-2 rounded bg-blue-800 text-white font-medium">
            Profile
          </button>
          <button className="mb-5 py-2 rounded bg-blue-800 text-white font-medium">
            Message
          </button>
          <button className="py-2 rounded bg-blue-800 text-white font-medium">
            Setting
          </button>
        </aside>

        {/* ================= PROFILE CARD ================= */}
        <main className="flex-1 bg-white rounded-2xl p-10 shadow-2xl">

          <h2 className="text-lg font-semibold mb-6 text-blue-900">
            Profile
          </h2>

          <div className="grid grid-cols-3 gap-10 items-center">

            {/* PROFILE IMAGE */}
            <div className="flex flex-col items-center">
              <div className="w-28 h-28 rounded-full bg-gray-300 mb-3" />
              <p className="text-blue-700 font-medium">
                Profile
              </p>
            </div>

            {/* FORM INPUTS */}
            <div className="col-span-2 grid grid-cols-2 gap-x-10 gap-y-6">

              <FormInput label="Name" value={profile?.user?.name} />
              <FormInput label="Email" value={profile?.user?.email} />

              <FormInput label="Phone no." value={profile?.phone} />
              <FormInput label="Linkedin" value={profile?.linkedin} />

              <FormInput label="Company" value={profile?.company} />
              <FormInput label="Position" value={profile?.position} />

              <FormInput label="Batch" value={profile?.batch} />
              <FormInput label="Branch" value={profile?.branch} />

            </div>
          </div>
        </main>

      </div>
    </div>
  );
};

export default AlumniDashboardForm;

/* ================= REUSABLE INPUT ================= */

const FormInput = ({ label, value }) => {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-blue-700 mb-1 font-medium">
        {label}
      </label>
      <input
        type="text"
        value={value || ""}
        readOnly
        className="border rounded-md px-3 py-2 bg-gray-50 outline-none"
      />
    </div>
  );
};
