import { useState } from "react";
import Modal from 'react-modal';

// Set the app element for accessibility
Modal.setAppElement('#root');

export const FullScreenImageButton = ({ 
   imageUrl,
   isVisible = true, 
   opacity = 0.75,
   buttonSize = 30,
   iconSize = 18,
   position = { bottom: "8px", right: "8px" }
}) => {
   const [modalIsOpen, setModalIsOpen] = useState(false);

   const openModal = () => {
      setModalIsOpen(true);

      // update full screen counter
      const fullScreenCounter = localStorage.getItem("fullScreenCounter");
      if (!fullScreenCounter) {
         localStorage.setItem("fullScreenCounter", 1);
      } else {
         localStorage.setItem("fullScreenCounter", Number(fullScreenCounter) + 1);
      }
   };

   const closeModal = () => {
      setModalIsOpen(false);
   };

   return (
      <>
         <div 
            style={{
               position: "absolute",
               bottom: position.bottom,
               right: position.right,
               backgroundColor: "#fff",
               borderRadius: "4px",
               width: `${buttonSize}px`,
               height: `${buttonSize}px`,
               display: "flex",
               alignItems: "center",
               justifyContent: "center",
               cursor: "pointer",
               boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
               opacity: isVisible ? opacity : 0.0,
               transition: "opacity 100ms"
            }}
            onClick={openModal}
         >
            <img 
               src={`${process.env.PUBLIC_URL}/full_screen_icon.svg`} 
               alt="full screen icon"
               style={{
                  width: `${iconSize}px`,
                  height: `${iconSize}px`,
                  opacity: 0.5
               }}
            />
         </div>

         <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={{
               overlay: {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000
               },
               content: {
                  position: 'relative',
                  border: 'none',
                  background: 'transparent',
                  overflow: 'visible',
                  borderRadius: '0',
                  outline: 'none',
                  padding: '20px',
                  maxWidth: '80vw',
                  maxHeight: '80vh',
                  margin: 'auto',
                  top: 'auto',
                  left: 'auto',
                  right: 'auto',
                  bottom: 'auto',
                  inset: 'auto'
               }
            }}
         >
            <div style={{ 
               position: 'relative',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               width: '100%',
               height: '100%'
            }}>
               <button
                  onClick={closeModal}
                  style={{
                     position: 'absolute',
                     top: '-10px',
                     right: '-10px',
                     background: '#fff',
                     border: 'none',
                     borderRadius: '50%',
                     width: '30px',
                     height: '30px',
                     cursor: 'pointer',
                     fontSize: '18px',
                     fontWeight: 'bold',
                     color: '#333',
                     boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                     zIndex: 1001,
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center'
                  }}
               >
                  ×
               </button>
               <img
                  src={`${process.env.PUBLIC_URL}/${imageUrl}`}
                  alt="Full size"
                  style={{
                     maxWidth: '100%',
                     maxHeight: '70vh',
                     objectFit: 'contain',
                     borderRadius: '8px',
                     boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                  }}
               />
            </div>
         </Modal>
      </>
   );
};
