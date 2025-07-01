import { useState } from "react"
import { ReactSortable } from "react-sortablejs";

export const ImageSorter = ({ images, onChange }) => {
   const [imageList, setImageList] = useState(images);
   const [draggedItemId, setDraggedItemId] = useState(null);

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

   return (
      <div style={{ width: "100%", maxWidth: "400px", margin: "0" }}>
         <ReactSortable 
            tag="div" 
            list={imageList} 
            setList={handleChange} 
            animation={150} 
            onStart={handleStart}
            onEnd={handleEnd}
            style={{ display: "flex", flexDirection: "column", gap: "10px"}}
         >
            {imageList.map((elem, idx) => {
               const isDragged = draggedItemId === elem.id;
               const itemStyle = {
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  padding: "10px", 
                  width: "100%",
                  cursor: "grab",
                  opacity: isDragged ? 0.3 : 1,
                  filter: isDragged ? "grayscale(100%)" : "none",
                  transition: "opacity 0.2s ease, filter 0.2s ease"
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
                  maxWidth: "200px"
               };
               
               return (
                  <div key={elem.id} style={itemStyle}>
                     <div style={numberStyle}>{idx + 1}</div>
                     <div style={imageContainerStyle}>
                        <img 
                           src={`${process.env.PUBLIC_URL}/${elem.url}`} 
                           alt={`img-${idx}`} 
                           style={{ 
                              width: "100%", 
                              height: "auto",
                              borderRadius: "8px",
                              display: "block"
                           }} 
                        />
                     </div>
                  </div>
               );
            })}
         </ReactSortable>
      </div>
   );
};
