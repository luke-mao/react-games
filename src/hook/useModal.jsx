import { useContext } from 'react';
import { ModalContext } from '@/store/store.jsx';

export const useModal = () => {
  return useContext(ModalContext);
}