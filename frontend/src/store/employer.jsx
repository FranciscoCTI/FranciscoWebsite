import { create } from "zustand";

export const useEmployerStore = create((set) => ({
    employers: [],
    setEmployers: (employers) => set({ employers }),

    fetchEmployers: async () => {
        const res = await fetch("/api/employers");
        const data = await res.json();
        set({ employers: data.datum });
    },
    createEmployer: async (formData) => {
        const name = formData.get("name");
        const city = formData.get("city");
        const country = formData.get("country");
        const image = formData.get("image");

        if (!name || !city || !country || !image) {
            return { success: false, message: "Complete all the fields" }
        }

        try {
            const res = await fetch('/api/employers', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (data.success == true) {
                set((state) => ({ employers: [...state.employers, data.data] }));
                return { success: true, message: "employer created succesfully" };
            }
            else {
                return { success: false, message: "employer NOT created" };
            }
        }
        catch {
            return { success: false, message: "Error creating the new employer" };
        }
    },
    removeEmployer: async (id) => {
        const res = await fetch(`/api/employers/${id}`, {
            method: 'DELETE',
        });

        if (!res.ok) {
            // handle failure
            const err = await res.text();
            return { success: false, message: "employer NOT created" + err };
        }

        set(state => ({
            employers: state.employers.filter(e => e._id !== id)
        }));
    },

    updateEmployer: async (id, formData) => {

        const res = await fetch(`/api/employers/${id}`, {
            method: 'PUT',
            body: formData
        });

        if (!res.ok) {
            const err = await res.text();
            return { success: false, message: 'Employer not updated: ' + err };
        }

        // Optionally read the updated employer returned from backend
        const data = await res.json();

        // Update local store
        set((state) => ({
            employers: state.employers.map(e =>
                e._id === id ? data.datum : e
            )
        }));

        return { success: true, message: 'Employer updated successfully' };
    }


}));