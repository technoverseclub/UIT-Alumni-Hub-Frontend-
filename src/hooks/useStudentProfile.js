import { useProfile } from "./useProfile";
import { getStudentProfile } from "../student/student.api";

export const useStudentProfile = () =>
  useProfile({
    apiFn:         getStudentProfile,
    selectProfile: (s) => s.studentProfile,
    selectStatus:  (s) => s.studentProfileStatus,
    setProfile:    (s) => s.setStudentProfile,
    setStatus:     (s) => s.setStudentProfileStatus,
  });