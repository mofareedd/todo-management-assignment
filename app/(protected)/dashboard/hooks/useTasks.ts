import { create } from "zustand";
import { TaskType } from "@/server/db/schema";
import { arrayMove } from "@dnd-kit/sortable";

type NewTaskInput = Pick<TaskType, "id" | "name">;
type UniqueIdentifier = string | number;

interface TodoStore {
  tasks: TaskType[];
  addTask: (newTask: TaskType) => void;
  setTasks: (newTasks: TaskType[]) => void;
  moveTask: (activeId: UniqueIdentifier, overId: UniqueIdentifier) => void;
}

let storeInitialized = false;

export const createTasksStore = (initialTasks: TaskType[]) => {
  if (!storeInitialized) {
    useTasksStore.setState({ tasks: initialTasks });
    storeInitialized = true;
  }
};

export const useTasksStore = create<TodoStore>((set, get) => ({
  tasks: [],

  addTask: (newTask) =>
    set((state) => ({
      tasks: [...state.tasks, newTask],
    })),

  setTasks: (newTasks) =>
    set(() => ({
      tasks: newTasks,
    })),

  moveTask: (activeId, overId) => {
    const { tasks } = get();

    // Helper function to find the position of a task by ID
    const getTaskPos = (id: UniqueIdentifier) =>
      tasks.findIndex((task) => task.id === id);

    // Get the original and new positions
    const originalPos = getTaskPos(activeId);
    const newPos = getTaskPos(overId);

    // If positions are invalid or unchanged, do nothing
    if (originalPos === -1 || newPos === -1 || originalPos === newPos) return;

    // Update tasks using arrayMove
    set((state) => ({
      tasks: arrayMove(state.tasks, originalPos, newPos),
    }));
  },
}));
