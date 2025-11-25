import { create } from 'zustand';

export const useGlobalState = create((set) => ({
  isConected: true,
  setIsConected: (isConected) => set({ isConected }),

  isRestoringConnection: false,
  setIsRestoringConnection: (isRestoringConnection) => set({ isRestoringConnection }),

  versionAndroid: null,
  setVersionAndroid: (versionAndroid) => set({ versionAndroid }),

  versionIos: null,
  setVersionIos: (versionIos) => set({ versionIos }),

  showTabs: true,
  setShowTabs: (showTabs) => set({ showTabs }),

  colors: ["#3d88f8ff", "#14b8a5"],
  setColors: (colors) => set({ colors }),

  token: null,
  setToken: (token) => set({ token }),

  user: null,
  setUser: (user) => set({ user }),

  destino: null,
  setDestino: (destino) => set({ destino }),

  origen: null,
  setOrigen: (origen) => set({ origen }),

  inicio: null,
  setInicio: (inicio) => set({ inicio }),
}));

export default useGlobalState;
