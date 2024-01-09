import React from "react";
import { BsX } from "react-icons/bs";

function Modal({ closeModal, children, w = "calc(100vw-100px)", h = "650px" }) {
  return (
    <div className="w-screen h-screen fixed z-50 bg-black/50 top-0 left-0 right-0 bottom-0 overflow-hidden">
      <div className="w-full h-full flex items-center justify-center">
        <div
          className={`bg-white rounded-md w-[${w}] max-w-[1100px] min-h-[${h}] relative shadow-lg h-[max-content] max-h-[calc(100vh-150px)] overflow-auto`}
        >
          <button
            onClick={closeModal}
            className="absolute top-2 right-2 text-red-600 text-3xl z-50"
          >
            <BsX />
          </button>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
