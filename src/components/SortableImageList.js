import { useState } from "react"
import { ReactSortable } from "react-sortablejs";
import { FullScreenImageButton } from "./FullScreenImageButton";

export const SortableImageList = ({ images, onChange }) => {
   const initialHoverState = {};
   images.forEach(img => {
      initialHoverState[img.id] = false;
   });

   const [imageList, setImageList] = useState(images);
   const [draggedItemId, setDraggedItemId] = useState(null);
   const [isHover, setIsHover] = useState(initialHoverState);

   const handleChange = (order) => {
      setImageList(order);
      let ids_order = [];
      order.forEach(elem => ids_order.push(elem.id));
      if (onChange) onChange(ids_order);
   };

   const handleStart = (evt) => {
      const draggedItem = imageList[evt.oldIndex];
      setDraggedItemId(draggedItem.id);
   };

   const handleEnd = () => {
      setDraggedItemId(null);
   };

   // hover functions
   const handleMouseEnter = (id) => {
      setIsHover(prev => ({
         ...prev,
         [id]: true
      }));
   }
   const handleMouseLeave = (id) => {
      setIsHover(prev => ({
         ...prev,
         [id]: false
      }));
   }

   return (
      <div style={{ width: "100%", margin: "0" }}>
         <style>{`
            @media (max-width: 768px) {
               .sortable-item {
                  touch-action: manipulation !important;
                  user-select: none !important;
                  -webkit-user-select: none !important;
                  -moz-user-select: none !important;
                  -ms-user-select: none !important;
               }
               .sortable-item img {
                  pointer-events: none !important;
               }
               .mobile-always-visible {
                  display: block !important;
                  opacity: 1 !important;
               }
            }
         `}</style>
         <ReactSortable 
            tag="div" 
            list={imageList} 
            setList={handleChange} 
            animation={150} 
            onStart={handleStart}
            onEnd={handleEnd}
            touchStartThreshold={window.innerWidth <= 768 ? 3 : 0}
            delay={window.innerWidth <= 768 ? 200 : 0}
            delayOnTouchStart={window.innerWidth <= 768}
            forceFallback={false}
            fallbackOnBody={true}
            style={{ display: "flex", flexDirection: "column", gap: "10px"}}
         >
            {imageList.map((elem, idx) => {
               const isDragged = draggedItemId === elem.id;
               const itemStyle = {
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  padding: "10px", 
                  // width: "100%",
                  cursor: "grab",
                  opacity: isDragged ? 0.3 : 1,
                  filter: isDragged ? "grayscale(100%)" : "none",
                  transition: "opacity 0.2s ease, filter 0.2s ease",
                  backgroundColor: "#efefef",
                  borderRadius: "8px",
                  // borderStyle: "solid",
                  // borderWidth: "1px",
                  // borderColor: "#ddd",
                  // boxShadow: "0px 0px 4px #bbb"
               };

               const numberStyle = {
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#333",
                  minWidth: "30px",
                  textAlign: "center"
               };

               const imageContainerStyle = {
                  flex: 1,
                  maxWidth: "170px",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative"
               };
               
               const isMobile = window.innerWidth <= 768;
               
               return (
                  <div key={elem.id} className="sortable-item" style={itemStyle}>
                     <div style={numberStyle}>{idx + 1}</div>
                     <div 
                        style={imageContainerStyle}
                        onMouseEnter={() => handleMouseEnter(elem.id)}
                        onMouseLeave={() => handleMouseLeave(elem.id)}
                     >
                        <img 
                           src={`${process.env.PUBLIC_URL}/${elem.url}`} 
                           alt={`img-${idx}`} 
                           style={{ 
                              width: "100%", 
                              height: "auto",
                              borderRadius: "8px",
                              display: "block",
                           }} 
                        />
                        <FullScreenImageButton 
                           imageUrl={elem.url}
                           isVisible={isMobile || isHover[elem.id]}
                           className="mobile-always-visible"
                        />
                     </div>
                  </div>
               );
            })}
         </ReactSortable>
      </div>
   );
};
