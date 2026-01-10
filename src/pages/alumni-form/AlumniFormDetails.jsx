import { useState } from "react";

const AlumniFormDetails = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photo: null,
    batch: "",
    linkedin: "",
    designation: "",
    company: "",
    branch: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-22">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-6xl bg-white rounded-2xl border-2 border-black p-6 sm:p-10 shadow-xl"
      >
        {/* 🔵 HEADING */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-5">
          Alumni Form
        </h2>

        {/* 🧩 FORM GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {/* Name */}
          <div>
            <label className="block text-blue-700 font-semibold mb-1">
              Name
            </label>
            <input
              name="name"
              placeholder="Enter your name here.."
              className="w-full border rounded-md px-4 py-2"
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-blue-700 font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email id"
              className="w-full border rounded-md px-4 py-2"
              onChange={handleChange}
            />
          </div>

          {/* Photo */}
          <div>
            <label className="block text-blue-700 font-semibold mb-1">
              Photo
            </label>
            <input
              type="file"
              name="photo"
              className="w-full border rounded-md px-4 py-2 bg-white"
              onChange={handleChange}
            />
          </div>

          {/* Batch */}
          <div>
            <label className="block text-blue-700 font-semibold mb-1">
              Batch
            </label>
            <select
              name="batch"
              className="w-full border rounded-md px-4 py-2"
              onChange={handleChange}
            >
              <option value="" disabled>Choose your Batch</option>
              <option>2020</option>
              <option>2021</option>
              <option>2022</option>
              <option>2023</option>
            </select>
          </div>

          {/* Linkedin */}
          <div>
            <label className="block text-blue-700 font-semibold mb-1">
              Linkedin
            </label>
            <input
              name="linkedin"
              placeholder="Linkedin Profile link"
              className="w-full border rounded-md px-4 py-2"
              onChange={handleChange}
            />
          </div>

          {/* Designation */}
          <div>
            <label className="block text-blue-700 font-semibold mb-1">
              Current Designation
            </label>
            <input
              name="designation"
              placeholder="Enter your working position"
              className="w-full border rounded-md px-4 py-2"
              onChange={handleChange}
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-blue-700 font-semibold mb-1">
              Company
            </label>
            <input
              name="company"
              placeholder="Enter your company name here.."
              className="w-full border rounded-md px-4 py-2"
              onChange={handleChange}
            />
          </div>

          {/* Branch */}
          <div>
            <label className="block text-blue-700 font-semibold mb-1">
              Branch
            </label>
            <input
              name="branch"
              placeholder="Enter your branch"
              className="w-full border rounded-md px-4 py-2"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* 🔘 SUBMIT */}
        <div className="mt-10 text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-10 py-2 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AlumniFormDetails;
