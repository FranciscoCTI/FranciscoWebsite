import { create } from "zustand";
import Employer from "../../../backend/models/employer.model";

export const useTechnologyStore = create((set) => ({
    technologies: [],
    setTechnologies: (technologies) => set({ technologies }),

    fetchTechnologies: async () => {
        const res = await fetch('/api/technologies');
        const data = await res.json();
        set({ technologies: data.datum });
    },

    updateTechnology: async (id, technology) => {
        const res = await fetch(`/api/technologies/${id}`, {
            method: 'PUT',
            headers:
            {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(technology)
        });
        if (!res.ok) {
            const err = await res.text();
            return { success: false, message: 'Technology not updated' + err };
        }

        const data = await res.json();

        set((state) => ({
            technologies: state.technologies.map(e =>
                e.id == id ? data : e
            )
        }));

        return { success: true, message: 'Technology updated successfully' };
    }
}));