import { create } from 'zustand';

interface TrackTableState {
  selectedIds: number[];
  setSelectedIds: (ids: number[]) => void;
  onCheck: (id: number, checked: boolean) => void;
}

export const useTrackTableStore = create<TrackTableState>((set) => ({
  selectedIds: [],
  onCheck: (id, checked) => set((state) => {
    if (checked) {
      return { selectedIds: [...state.selectedIds, id] };
    }

    return { selectedIds: state.selectedIds.filter((selectedId) => selectedId !== id) };
  }),
  setSelectedIds: (ids) => set({ selectedIds: ids }),
}));