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
    removeProject: async (id) => {
        const res = await fetch(`/api/projects/${id}`, {
            method: 'DELETE',
        });

        if (!res.ok) {
            // handle failure
            const err = await res.text();
            return { success: false, message: "project NOT removed" + err };
        }

        set(state => ({
            projects: state.projects.filter(e => e._id !== id)
        }))
    },
    updateProject: async (id, formData) => {
        const res = await fetch(`/api/projects/${id}`, {
            method: 'PUT',
            body: formData
        });

        if (!res.ok) {
            const err = await res.text();
            return { success: false, message: 'Project not updated: ' + err };
        }

        let data;
        try {
            data = await res.json();
        } catch {
            return { success: false, message: "Invalid server response" };
        }

        if (!data?.data?._id) {
            return { success: false, message: 'Malformed project returned' };
        }

        set((state) => ({
            projects: state.projects.map(e =>
                e._id === data.data._id ? data.data : e
            )
        }));

        return { success: true, message: 'Project updated successfully' };
    }
}));