import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useWorkspaceStore = create(
  persist(
    (set) => ({
      workspace: null,
      setWorkspace: (workspace) => set({ workspace }),
      clearWorkspace: () => set({ workspace: null }),
    }),
    {
      name: 'workspace-storage',
    }
  )
)

export default useWorkspaceStore