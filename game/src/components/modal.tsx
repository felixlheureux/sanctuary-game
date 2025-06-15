import React from "react";
import Tabs from "./tabs";

interface ModalProps {
  visible: boolean,
  onClose: () => void
}

const Modal: React.FC<ModalProps> = ({ visible, onClose }) => {
  return (
    <>
      {visible && (
        <div
          onClick={onClose}
          className={"absolute flex items-center justify-center h-screen w-full overflow-hidden left-0 top-0 bg-gray-500 bg-opacity-75"}>
          <div className={"flex-grow bg-white p-8 max-w-4xl rounded-md"} onClick={(e) => e.stopPropagation()}>
            <Tabs />
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;