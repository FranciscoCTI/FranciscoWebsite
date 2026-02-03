import { create } from "zustand";

export const useProjectStore = create((set) => ({
    projects: [],
    setProjects: (projects) => set({ projects }),

    fetchProjects: async () => {
        const res = await fetch('/api/projects');
        const data = await res.json();
        set({ projects: data.datum });
    },
    createProject: async (formData) => {
        const title = formData.get("title");
        const type = formData.get("type");
        const description = formData.get("description");
        const employerId = formData.get("companyId");
        const myRoleOnIt = formData.get("myRoleOnIt");
        const image = formData.get("image");

        if (!title || !type || !description || !myRoleOnIt || !employerId || !image) {
            return { success: false, message: "Complete all the fields" }
        }

        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (data.success == true) {
                set((state) => ({ projects: [...state.projects, data.data] }));
                return { success: true, message: "project created succesfully" };
            }
            else {
                return { success: false, message: "project NOT created" };
            }
        }
        catch {
            return { success: false, message: "Error creating the new project" };
        }
    },
}));