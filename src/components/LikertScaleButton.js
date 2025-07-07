import { useState } from "react"

export const LikertScaleButton = ({ id, onClick, isSelected }) => {
   const [isHover, setIsHover] = useState(false);

   const handleMouseEnter = () => {
      setIsHover(true);
   };
   const handleMouseLeave = () => {
      setIsHover(false);
   };
   const handleClick = () => {
      onClick(id);
   }

   let style = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "10px",
      margin: "5px",
      width: "25px",
      height: "25px",
      borderRadius: "100%",
      boxShadow: "0px 2px 4px #ddd",
      background: isHover ? "#efefef" : "#fff",
      cursor: "pointer",
      transition: "100ms"
   }
   const styleSelected = {
      background: "#19b394",
      color: "#fff"
   }

   if (isSelected) {
      style = {...style, ...styleSelected};
   }

   return (
      <div 
         style={style} 
         onMouseEnter={handleMouseEnter} 
         onMouseLeave={handleMouseLeave}
         onClick={handleClick}
      >
         <div>{id}</div>
      </div>
   );
}