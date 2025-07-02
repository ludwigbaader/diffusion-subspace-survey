import { useState } from "react";

export const GridSelector2D = ({ position, onChange, axisLabels, size }) => {
   // Convert initial position from normalized (0-1) to pixel coordinates
   const [selectorPos, setSelectorPos] = useState([
      position[0] * size[0], 
      position[1] * size[1]
   ]);
   const [isDragging, setIsDragging] = useState(false);

   const pos_x = selectorPos[0] + "px";
   const pos_y = selectorPos[1] + "px";

   const startDrag = (input) => {
      setIsDragging(true);
      updatePosition(input);
   };
   const dragging = (input) => {
      if (isDragging) {
         updatePosition(input);

      }
   };
   const endDrag = (input) => {
      setIsDragging(false);
      updatePosition(input);
   };

   const updatePosition = (input) => {
      const rect = input.currentTarget.getBoundingClientRect();
      const x = input.clientX - rect.left;
      const y = input.clientY - rect.top;

      // Clamp the position within the bounds of the container
      const clampedX = Math.max(0, Math.min(size[0], x));
      const clampedY = Math.max(0, Math.min(size[1], y));

      setSelectorPos([clampedX, clampedY]);
      onChange([clampedX / size[0], clampedY / size[1]]); // Normalize to 0-1 range
   }

   // calculate axis label positions
   const text_style = {
      color: "#333",
      fontSize: "10pt"
   }

   return (
      <div>
         <div style={{
            position: "relative",
            backgroundColor: "#efefef",
            borderRadius: "8px",
            padding: "20px",
            margin: "50px"
         }}>
            <div style={{ position: "relative" }}>
               <div
                  style={{
                     width: size[0] + "px",
                     height: size[1] + "px",
                     position: "relative",
                     cursor: isDragging ? "grabbing" : "crosshair"
                  }}
                  onMouseDown={startDrag}
                  onMouseMove={dragging}
                  onMouseUp={endDrag}
               >
                  {/* Vertical center line */}
                  <div style={{
                     position: "absolute",
                     left: "50%",
                     top: "0",
                     width: "1px",
                     height: "100%",
                     backgroundColor: "#aaa",
                     transform: "translateX(-50%)",
                     pointerEvents: "none"
                  }}></div>
                  {/* Horizontal center line */}
                  <div style={{
                     position: "absolute",
                     left: "0",
                     top: "50%",
                     width: "100%",
                     height: "1px",
                     backgroundColor: "#aaa",
                     transform: "translateY(-50%)",
                     pointerEvents: "none"
                  }}></div>
               </div>
               <div style={{
                  position: "absolute",
                  left: pos_x,
                  top: pos_y,
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  border: "2px solid #666",
                  backgroundColor: "#fff",
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "none",
                  zIndex: 10
               }}></div>
            </div>
            <div>
               <div style={{ 
                  ...text_style,
                  position: "absolute",
                  top: "0%",
                  left: "50%",
                  transform: "translate(-50%, -150%)"
               }}>
                  {axisLabels[0][0]}
               </div>
               <div style={{
                  ...text_style,
                  position: "absolute",
                  top: "100%",
                  left: "50%",
                  transform: "translate(-50%, 50%)"
               }}>
                  {axisLabels[0][1]}
               </div>
               <div style={{
                  ...text_style,
                  position: "absolute",
                  top: "50%",
                  left: "0%",
                  writingMode: "vertical-lr",
                  transform: "translate(-150%, -50%) rotate(180deg)"
               }}>
                  {axisLabels[1][0]}
               </div>
               <div style={{
                  ...text_style,
                  position: "absolute",
                  top: "50%",
                  left: "100%",
                  writingMode: "vertical-lr",
                  transform: "translate(50%, -50%)"
               }}>
                  {axisLabels[1][1]}
               </div>
            </div>
         </div>
      </div>
   )
}
