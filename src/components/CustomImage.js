import { useState } from "react"
import { FullScreenImageButton } from "./FullScreenImageButton";

export const CustomImage = ({ path, width, customStyle = {} }) => {
   const [isHover, setIsHover] = useState(false);

   const handleMouseEnter = () => {
      console.log("mouse entered")
      setIsHover(true);
   }
   const handleMouseLeave = () => {
      setIsHover(false);
   }

   return (
      <div 
         style={{
            width: width,
            position: "relative"
         }}
         onMouseEnter={handleMouseEnter}
         onMouseLeave={handleMouseLeave}
      >
         <img 
            src={`${process.env.PUBLIC_URL}/${path}`} 
            alt="reference-img" 
            style={{ 
               ...customStyle,
               width: "100%", 
               height: "auto",
               borderRadius: "8px",
               display: "block",
            }} 
         />
         <FullScreenImageButton 
            imageUrl={path}
            isVisible={isHover}
         />
      </div>
   );
}