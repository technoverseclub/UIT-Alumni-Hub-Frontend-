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

export default FormInput;