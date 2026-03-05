import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../auth/auth.store";
import { createStudentProfile } from "../../student.api";
import { getMe } from "../../../auth/auth.api";

const StudentForm = () => {
  const navigate = useNavigate();
  const { user, accessToken, hasHydrated } = useAuthStore();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    photo: null,
    linkedin: "",
    branch: "",
    year: "",
    bio: "",
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [submitError, setSubmitError] = useState("");

  /* ================= AUTH GUARD ================= */
  useEffect(() => {
    if (!hasHydrated) return;
    if (user?.isProfileComplete) {
      navigate("/student/dashboard");
    }
  }, [accessToken, hasHydrated, user, navigate]);

  /* ================= AUTO FILL ================= */
  useEffect(() => {
    if (!user) return;
    setFormData((prev) => ({
      ...prev,
      name: user.name || "",
      email: user.email || "",
    }));
  }, [user]);

  /* ================= CLEANUP PREVIEW ================= */
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, photo: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer?.files?.[0];
    if (!file || !file.type?.startsWith("image/")) return;
    setFormData((prev) => ({ ...prev, photo: file }));
    setPreview(URL.createObjectURL(file));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setSubmitError("");

    const phoneOk = /^\d{10}$/.test(String(formData.phone || "").trim());
    if (!formData.photo) return setSubmitError("Profile picture is required.");
    if (!phoneOk) return setSubmitError("Phone number must be 10 digits.");
    if (!String(formData.linkedin || "").trim()) return setSubmitError("LinkedIn is required.");
    if (!String(formData.branch || "").trim()) return setSubmitError("Branch is required.");
    if (!String(formData.year || "").trim()) return setSubmitError("Year is required.");
    if (!String(formData.bio || "").trim()) return setSubmitError("Bio is required.");

    try {
      setLoading(true);

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value === null || value === "") return;
        data.append(key, value);
      });

      await createStudentProfile(data);

      // Refresh user so StudentProfileGuard stops forcing /student/form
      if (accessToken) {
        const me = await getMe(accessToken);
        setAuth(me.data, accessToken);
      }

      navigate("/student/dashboard");
    } catch (err) {
      console.error("PROFILE CREATE ERROR:", err);
      setSubmitError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to submit profile."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!hasHydrated) return null;

  return (
    <div className="w-full flex items-center justify-center px-6 mt-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl max-h-[85vh] overflow-y-auto bg-white rounded-2xl p-8 md:p-10 shadow-xl"
      >
        <h1 className="text-2xl font-bold text-center mb-1">
          Complete Your Student Profile
        </h1>
        <p className="text-center text-blue-700 font-semibold text-sm mb-6">
          Profile pic
        </p>

        {submitError && (
          <p className="mb-4 text-center text-sm font-semibold text-red-600">
            {submitError}
          </p>
        )}

        {/* Profile pic dropzone */}
        <div className="mb-10">
          <label
            className={`block w-full max-w-2xl mx-auto cursor-pointer rounded-xl border-2 border-dashed p-8 transition ${
              dragActive ? "border-blue-700 bg-blue-50" : "border-blue-200"
            }`}
            onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); }}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); }}
            onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); }}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center gap-2 text-center">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-20 w-20 rounded-full object-cover border"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-700">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 3v12m0-12l-4 4m4-4l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              )}
              <div className="text-blue-900 font-semibold">
                <span className="text-blue-700">Upload a file</span>{" "}
                <span className="text-gray-600 font-medium">or drag and drop</span>
              </div>
              <div className="text-xs text-gray-500">PNG, JPG up to 5MB</div>
            </div>
            <input
              type="file"
              name="photo"
              accept="image/*"
              className="hidden"
              onChange={handleChange}
            />
          </label>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          <Input label="Name" name="name" value={formData.name} disabled />
          <Input label="Email" name="email" value={formData.email} disabled />
          <Input
            label="Phone number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter 10-digit phone number"
          />
          <Input
            label="LinkedIn"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            placeholder="LinkedIn profile link"
          />
          <Select
            label="Year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            placeholder="Select your Year"
            options={["1", "2", "3", "4"]}
          />
          <Select
            label="Branch"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            placeholder="Select Branch"
            options={["CSE", "ECE", "ME", "CE"]}
          />
        </div>

        {/* Bio */}
        <div className="mt-5">
          <label className="block text-sm font-semibold mb-1 text-blue-800">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself..."
            className="w-full border rounded-md px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 min-h-25 resize-none"
          />
        </div>

        <div className="mt-10 flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className={`px-12 py-2.5 rounded-md text-white font-semibold shadow-sm transition ${
              loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;

/* ================= REUSABLE COMPONENTS ================= */

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-semibold mb-1 text-blue-800">{label}</label>
    <input
      {...props}
      className="w-full border rounded-md px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
    />
  </div>
);

const Select = ({ label, options, placeholder, ...props }) => (
  <div>
    <label className="block text-sm font-semibold mb-1 text-blue-800">{label}</label>
    <select
      {...props}
      className="w-full border rounded-md px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
    >
      <option value="">{placeholder || `Select ${label}`}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);