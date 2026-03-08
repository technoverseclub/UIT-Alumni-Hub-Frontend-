import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../auth/auth.store";

export const useProfile = ({
  apiFn,
  selectProfile,
  selectStatus,
  setProfile,
  setStatus,
}) => {
  const navigate    = useNavigate();
  const accessToken = useAuthStore((s) => s.accessToken);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const profile     = useAuthStore(selectProfile);
  const status      = useAuthStore(selectStatus);
  const saveProfile = useAuthStore(setProfile);
  const saveStatus  = useAuthStore(setStatus);
  const logout      = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (!hasHydrated) return;

    if (!accessToken) {
      navigate("/login");
      return;
    }

    // ✅ Cache hit — skip fetch
    if (status === "success" && profile) return;

    // ✅ Already in flight — skip duplicate
    if (status === "loading") return;

    let cancelled = false;
    saveStatus("loading");

    const fetchProfile = async () => {
      try {
        const res = await apiFn();
        if (!cancelled) saveProfile(res.data);
      } catch (err) {
        if (cancelled) return;
        console.error("Profile fetch error:", err);
        saveStatus("error");
        if (err.response?.status === 401) {
          logout();
          navigate("/login");
        }
      }
    };

    fetchProfile();

    return () => { cancelled = true; };

  }, [hasHydrated, accessToken]);

  const refetch = () => saveStatus("idle");

  return { profile, status, refetch };
};