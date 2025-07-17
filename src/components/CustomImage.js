import { useState } from "react"
import { FullScreenImageButton } from "./FullScreenImageButton";

export const CustomImage = ({ path, width, customStyle = {} }) => {
   const [isHover, setIsHover] = useState(false);

   const handleMouseEnter = () => {
      setIsHover(true);
   }
   const handleMouseLeave = () => {
      setIsHover(false);
   }

   const isMobile = window.innerWidth <= 768;

   return (
      <div>
         <style>{`
            @media (max-width: 768px) {
               .custom-image-mobile-button {
                  display: block !important;
                  opacity: 1 !important;
               }
            }
         `}</style>
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
               isVisible={isMobile || isHover}
               className="custom-image-mobile-button"
            />
         </div>
      </div>
   );
}