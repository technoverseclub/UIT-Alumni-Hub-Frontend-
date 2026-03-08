import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      // ── Auth ──────────────────────────────────────────
      user: null,
      accessToken: null,
      tempEmail: null,
      isAuthenticated: false,
      hasHydrated: false,

      // ── Student Profile ───────────────────────────────
      studentProfile: null,
      studentProfileStatus: "idle", // "idle" | "loading" | "success" | "error"

      // ── Alumni Profile ────────────────────────────────
      alumniProfile: null,
      alumniProfileStatus: "idle",

      // ── Auth Actions ──────────────────────────────────
      setTempEmail: (email) => set({ tempEmail: email }),

      setAuth: (user, token) =>
        set({ user, accessToken: token, isAuthenticated: true }),

      setHasHydrated: (state) => set({ hasHydrated: state }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          tempEmail: null,
          studentProfile: null,
          studentProfileStatus: "idle",
          alumniProfile: null,
          alumniProfileStatus: "idle",
        }),

      // ── Student Profile Actions ───────────────────────
      setStudentProfile: (profile) =>
        set({ studentProfile: profile, studentProfileStatus: "success" }),
      setStudentProfileStatus: (status) =>
        set({ studentProfileStatus: status }),

      // ── Alumni Profile Actions ────────────────────────
      setAlumniProfile: (profile) =>
        set({ alumniProfile: profile, alumniProfileStatus: "success" }),
      setAlumniProfileStatus: (status) =>
        set({ alumniProfileStatus: status }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
        studentProfile: state.studentProfile, // ✅ survives refresh
        alumniProfile: state.alumniProfile,   // ✅ survives refresh
        // ✅ statuses intentionally NOT persisted — always re-derive on load
      }),
      onRehydrateStorage: () => (state) => {
        // ✅ restore status based on persisted data
        if (state?.studentProfile) state.studentProfileStatus = "success";
        if (state?.alumniProfile)  state.alumniProfileStatus  = "success";
        state?.setHasHydrated(true);
      },
    }
  )
);