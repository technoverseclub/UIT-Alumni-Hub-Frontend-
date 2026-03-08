import { useProfile } from "./useProfile";
import { getAlumniProfile } from "../alumni/alumni.api";

export const useAlumniProfile = () =>
  useProfile({
    apiFn:         getAlumniProfile,
    selectProfile: (s) => s.alumniProfile,
    selectStatus:  (s) => s.alumniProfileStatus,
    setProfile:    (s) => s.setAlumniProfile,
    setStatus:     (s) => s.setAlumniProfileStatus,
  });