import React from "react";

const AlumniDashboardForm = () => {
  return (
    <div className="flex gap-10 px-10 py-25 ">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-60 bg-white rounded-2xl p-6 shadow-lg ">
        <button className="w-full mb-5 py-2 rounded bg-blue-700 text-white font-medium">
          Profile
        </button>

        <button className="w-full mb-5 py-2 rounded bg-blue-700 text-white font-medium">
          Message
        </button>

        <button className="w-full py-2 rounded bg-blue-700 text-white font-medium">
          Setting
        </button>
      </aside>

      {/* ================= PROFILE FORM ================= */}
      <main className="flex-1 bg-white rounded-2xl p-8 shadow-lg">

        <h2 className="text-lg font-semibold mb-6">
          Profile
        </h2>

        <div className="grid grid-cols-3 gap-8">

          {/* PROFILE IMAGE */}
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 rounded-full bg-gray-300 mb-3" />
            <p className="text-blue-700 font-medium">
              Profile
            </p>
          </div>

          {/* FORM INPUTS */}
          <div className="col-span-2 grid grid-cols-2 gap-x-10 gap-y-5">

            <FormInput label="Name" />
            <FormInput label="Email" />

            <FormInput label="Phone no." />
            <FormInput label="Linkedin" />

            <FormInput label="Company" />
            <FormInput label="Position" />

            <FormInput label="Batch" />
            <FormInput label="Branch" />

          </div>
        </div>
      </main>
    </div>
  );
};

export default AlumniDashboardForm;

/* ================= REUSABLE INPUT ================= */

const FormInput = ({ label }) => {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-blue-700 mb-1">
        {label}
      </label>
      <input
        type="text"
        className="border rounded px-3 py-1 outline-none focus:ring-1 focus:ring-blue-600"
      />
    </div>
  );
};
