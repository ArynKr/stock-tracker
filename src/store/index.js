import create from 'zustand';
import { stockSlice } from './slices';

const useStore = create((set) => ({
  ...stockSlice(set),
}));

export default useStore;
