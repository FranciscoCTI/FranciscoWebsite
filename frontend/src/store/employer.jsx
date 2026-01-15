import { create } from "zustand";
import { removeEmployer } from "../../../backend/controllers/employer.controller";

export const useEmployerStore = create((set) => ({
    employers: [],
    setEmployers: (employers) => set({ employers }),

    fetchEmployers: async () => {
        const res = await fetch("/api/employers");
        const data = await res.json();
        set({ employers: data.datum });
    },
    createEmployer: async (newEmployer) => {
        if (!newEmployer.name || !newEmployer.city || !newEmployer.country) {
            return { success: false, message: "Complete all the fields" }
        }

        try {
            const res = await fetch('/api/employers', {
                method: 'POST',
                headers:
                {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newEmployer),
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
    }
}));