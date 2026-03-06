import { useEffect, useState } from "react";
import AlumniCard from "../components/AlumniCard";
import AlumniFilters from "../components/AlumniFilters";
import { getAllAlumni } from "../alumniHub.api";

const AlumniHub = () => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [batch, setBatch] = useState("All");
  const [branch, setBranch] = useState("All");

  // Derived filter options
  const batches = [...new Set(alumni.map((a) => a.batch).filter(Boolean))].sort();
  const branches = [...new Set(alumni.map((a) => a.branch).filter(Boolean))].sort();

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await getAllAlumni();
        if (mounted) setAlumni(res.data);
      } catch (err) {
  if (mounted) setError("Failed to load alumni.");
} finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  const filtered = alumni.filter((a) => {
const matchSearch = a.user?.name?.toLowerCase()?.includes(search.toLowerCase());    const matchBatch = batch === "All" || String(a.batch) === String(batch);
    const matchBranch = branch === "All" || a.branch === branch;
    return matchSearch && matchBatch && matchBranch;
  });

return (
  <div className="h-screen flex flex-col">

    {/* TOP SECTION */}
    <div className="pt-2 px-8 flex flex-col items-center shrink-0">

      <AlumniFilters
        search={search}
        onSearch={setSearch}
        batch={batch}
        onBatch={setBatch}
        branch={branch}
        onBranch={setBranch}
        batches={batches}
        branches={branches}
      />

    </div>

    {/* SCROLL AREA */}
<div className="flex-1">
  <div className="px-8 pb-16">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-20 gap-x-10 ">

        {loading &&
          Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="w-32 h-32 rounded-full bg-white/10 animate-pulse mx-auto"
            />
          ))
        }

        {error && (
          <p className="col-span-full text-center text-red-400 mt-10">
            {error}
          </p>
        )}

        {!loading && !error && filtered.length === 0 && (
          <p className="col-span-full text-center text-white/60 mt-10">
            No alumni found.
          </p>
        )}

        {!loading && !error &&
          filtered.map((item, index) => (
<AlumniCard key={item.id || index} alumni={item} index={index} />          ))}

      </div>


    </div>

  </div>
  </div>

);
};

export default AlumniHub;