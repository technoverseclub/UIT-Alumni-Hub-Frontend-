const AlumniFilters = ({ search, onSearch, batch, onBatch, branch, onBranch, batches, branches }) => (
  <div className="flex flex-wrap items-center gap-4 mb-8 pt-6">
    {/* Search */}
    <div className="flex-1 min-w-50 max-w-sm mx-auto">
      <input
        type="text"
        placeholder="Search alumni by name..."
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        className="w-full px-5 py-2 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/50 outline-none backdrop-blur-md"
      />
    </div>

    {/* Batch filter */}
    <select
      value={batch}
      onChange={(e) => onBatch(e.target.value)}
      className="bg-white text-[#1b3d6b] px-4 py-2 rounded-md font-semibold"
    >
      <option value="All">All Batches</option>
      {batches.map((b) => (
        <option key={b} value={b}>Batch {b}</option>
      ))}
    </select>

    {/* Branch filter */}
    <select
      value={branch}
      onChange={(e) => onBranch(e.target.value)}
      className="bg-white text-[#1b3d6b] px-4 py-2 rounded-md font-semibold"
    >
      <option value="All">All Branches</option>
      {branches.map((b) => (
        <option key={b} value={b}>{b}</option>
      ))}
    </select>
  </div>
);

export default AlumniFilters;