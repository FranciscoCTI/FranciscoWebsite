import { create } from "zustand";

export const useTechnologyStore = create((set) => ({
    technologies: [],
    setTechnologies: (technologies) => set({ technologies }),

    fetchTechnologies: async () => {
        const res = await fetch('/api/technologies');
        const data = await res.json();
        set({ technologies: data.datum });
    }
}));