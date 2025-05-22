// create modal context
import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

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
        setModalState({ ...modalState, showModal: false });
        if (onClose) {
          onClose();
        }
      }
    });
  };

  // return the functions
  return (
    <ModalContext.Provider value={{ modalState, openModal }}>
      {children}
    </ModalContext.Provider>
  )
}