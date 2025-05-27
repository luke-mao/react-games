// create modal context
import React, { createContext, useState } from "react";

export const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  // showModal, title, content, onClose
  const [modalState, setModalState] = useState({
    showModal: false,
    title: "",
    content: "",
    // onClose is also the onYes
    onClose: () => {},
    onNo: () => {},
    modalType: "info",  // info, or yesno
  });

  // function to open the modal
  const openModal = (title, content, onClose, modalType = "info", onNo = () => {}) => {
    setModalState({
      showModal: true,
      title,
      content,
      modalType,
      onClose: () => {
        setModalState(prev => ({ ...prev, showModal: false }));
        if (onClose) {
          onClose();
        }
      },
      onNo: () => {
        setModalState(prev => ({ ...prev, showModal: false }));
        if (onNo) {
          onNo();
        }
      },
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
  );
};