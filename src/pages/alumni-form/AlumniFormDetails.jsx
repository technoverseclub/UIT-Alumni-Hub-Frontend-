import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const AlumniFormDetails = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    photo: null,
    linkedin: "",
    company: "",
    position: "",
    batch: "",
    branch: "",
  });

  const [preview, setPreview] = useState(null); // 🔥 preview state
  const [loading, setLoading] = useState(false);

   /* ✅ AUTO-FILL NAME & EMAIL */
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      name: localStorage.getItem("name") || "",
      email: localStorage.getItem("email") || "",
    }));
  }, []);


  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      setPreview(URL.createObjectURL(file)); // 🔥 generate preview
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

    /* ✅ REAL SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();
      data.append("phone", formData.phone);
      data.append("linkedin", formData.linkedin);
      data.append("company", formData.company);
      data.append("position", formData.position);
      data.append("batch", formData.batch);
      data.append("branch", formData.branch);

      if (formData.photo) {
        data.append("image", formData.photo); // MUST match multer field
      }

      await axios.post(
  "https://uit-alumni-hub-backend.onrender.com/alumni/profile",
  data,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

alert("✅ Profile created successfully");
navigate("/alumni/dashboard");


    } catch (err) {
      console.error(err.response?.data || err);
      alert("❌ Failed to submit profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 pt-22">
      <form
        onSubmit={handleSubmit}
        autoComplete="on"
        className="w-full max-w-5xl bg-white rounded-2xl p-8 shadow-xl"
      >
        {/* TITLE */}
        <h2 className="text-2xl font-bold text-center mb-6">Form</h2>

        {/* PROFILE PIC */}
        <div className="flex flex-col items-center mb-10">
          <p className="text-blue-600 font-semibold mb-3">Profile pic</p>

          <label
            htmlFor="photo-upload"
            className={`w-full max-w-md h-36 border-2 border-dashed rounded-xl 
              flex items-center justify-center cursor-pointer transition
              ${
                preview
                  ? "border-blue-500 bg-blue-50"
                  : "border-blue-400 hover:bg-blue-50"
              }`}
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="h-28 w-28 object-cover rounded-full border-2 border-blue-500"
              />
            ) : (
              <div className="flex flex-col items-center">
                <svg
                  className="w-10 h-10 text-blue-500 mb-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"
                  />
                </svg>

                <p className="text-blue-600 font-medium">
                  Upload a file{" "}
                  <span className="text-gray-500 font-normal">
                    or drag and drop
                  </span>
                </p>

                <p className="text-sm text-gray-400 mt-1">
                  PNG, JPG up to 5MB
                </p>
              </div>
            )}

            <input
              id="photo-upload"
              type="file"
              name="photo"
              accept="image/*"
              className="hidden"
              onChange={handleChange}
            />
          </label>
        </div>

        {/* FORM GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
          {/* Name */}
          <div>
            <label className="block text-blue-600 font-semibold mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Enter your name here.."
              className="w-full border rounded-md px-4 py-2"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-blue-600 font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Enter your email id"
              className="w-full border rounded-md px-4 py-2"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-blue-600 font-semibold mb-1">
              Phone number
            </label>
            <input
              type="tel"
              name="phone"
              autoComplete="tel"
              placeholder="Enter phone number"
              className="w-full border rounded-md px-4 py-2"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          {/* Linkedin */}
          <div>
            <label className="block text-blue-600 font-semibold mb-1">
              Linkedin
            </label>
            <input
              type="url"
              name="linkedin"
              autoComplete="url"
              placeholder="Linkedin Profile link"
              className="w-full border rounded-md px-4 py-2"
              value={formData.linkedin}
              onChange={handleChange}
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-blue-600 font-semibold mb-1">
              Company
            </label>
            <input
              type="text"
              name="company"
              autoComplete="organization"
              placeholder="Enter your company name here.."
              className="w-full border rounded-md px-4 py-2"
              value={formData.company}
              onChange={handleChange}
            />
          </div>

          {/* Position */}
          <div>
            <label className="block text-blue-600 font-semibold mb-1">
              Position
            </label>
            <input
              type="text"
              name="position"
              placeholder="Enter your working position"
              className="w-full border rounded-md px-4 py-2"
              value={formData.position}
              onChange={handleChange}
            />
          </div>

          {/* Batch */}
          <div>
            <label className="block text-blue-600 font-semibold mb-1">
              Batch
            </label>
            <select
              name="batch"
              className="w-full border rounded-md px-4 py-2"
              value={formData.batch}
              onChange={handleChange}
            >
              <option value="">Choose your Batch</option>
              <option>2020</option>
              <option>2021</option>
              <option>2022</option>
              <option>2023</option>
            </select>
          </div>

          {/* Branch */}
          <div>
            <label className="block text-blue-600 font-semibold mb-1">
              Branch
            </label>
            <input
              type="text"
              name="branch"
              placeholder="Enter your branch"
              className="w-full border rounded-md px-4 py-2"
              value={formData.branch}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* SUBMIT */}
        <div className="mt-8 text-center">
          <button
            type="submit"
            disabled={loading}
            className={`px-10 py-2 rounded-md font-semibold text-white ${
              loading
                ? "bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AlumniFormDetails;

