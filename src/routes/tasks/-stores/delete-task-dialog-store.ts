import { create } from "zustand";

interface DeleteTaskDialogStore {
  isOpen: boolean;
  taskId: number | null;
  taskName: string | null;
  open: (taskId: number, taskName: string) => void;
  close: () => void;
}

export const useDeleteTaskDialogStore = create<DeleteTaskDialogStore>(
  (set) => ({
    isOpen: false,
    taskId: null,
    taskName: null,
    open: (taskId, taskName) => set({ isOpen: true, taskId, taskName }),
    close: () => set({ isOpen: false, taskId: null, taskName: null }),
  }),
);
