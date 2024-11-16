import { create } from "zustand";

export const useStore = create((set) => ({
  TRANSITION_DELAY: 0.8,
  TRANSITION_DURATION: 3.2,
  transition: true,
  setTransition: (value) => set({ transition: value }),
  screen: "home",
  setScreen: (value) => set({ screen: value }),
  index: 0,
  setIndex: (value) => set({ index: value }),
  isMobile: null,
  setIsMobile: (value) => set({ isMobile: value }),
}));
