import { create } from "zustand";

interface BearState {
  bears: number;
  increase: (by: number) => void;
}

const useBearStore = create<BearState>()((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
}));

export default useBearStore;

// what's the problem?
// - url is main source of truth which is useful for:
// 1. search
// 2. filter
// 3. sort
// 4. pagination
// within the same amount of array and page.

// what's the solution?
// create a single hook for searching, filtering, sorting and pagination of array.

// 
