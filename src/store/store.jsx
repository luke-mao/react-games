// create modal context
import React, { createContext, useContext, useState } from 'react';

export const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  // showModal, title, content, onClose
  const [modalState, setModalState] = useState({
    showModal: false,
    title: '',
    content: '',
    onClose: () => {},
  });

  // function to open the modal
  const openModal = (title, content, onClose) => {
    setModalState({
      showModal: true,
      title,
      content,
      onClose: () => {
        setModalState(prev => ({ ...prev, showModal: false }));
        if (onClose) {
          onClose();
        }
      }
    });
  };

  // close the modal
  const closeModal = () => {
    setModalState(prev => ({ ...prev, showModal: false }));
  };

  // return the functions
  return (
    <ModalContext.Provider value={{ modalState, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  )
}