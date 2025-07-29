import { ElementFactory, Question, Serializer } from "survey-core";
import { ReactQuestionFactory, SurveyQuestionElementBase } from "survey-react-ui";
import { Slider } from "@mui/material";
import { createElement } from "react";
import { LikertScaleButton } from "./LikertScaleButton";
import { CustomImage } from "./CustomImage";

const IMAGE_SLIDER_LIKERT_COMPONENT = "image-slider-likert";

export class QuestionImageSliderLikertModel extends Question {
   getType() {
      return IMAGE_SLIDER_LIKERT_COMPONENT;
   }

   // slider properties
   get sliderPosition() {
      return this.getPropertyValue("sliderPosition");
   }
   set sliderPosition(val) {
      this.setPropertyValue("sliderPosition", val);
   }

   get sourceImages() {
      return this.getPropertyValue("sourceImages");
   }
   set sourceImages(val) {
      this.setPropertyValue("sourceImages", val);
   }

   get sliderAttribute() {
      return this.getPropertyValue("sliderAttribute");
   }
   set sliderAttribute(val) {
      this.setPropertyValue("sliderAttribute", val);
   }

   // likert properties
   get likertQuestionText() {
      return this.getPropertyValue("likertQuestionText");
   }
   set likertQuestionText(val) {
      this.setPropertyValue("likertQuestionText", val);
   }

   get numOfChoices() {
      return this.getPropertyValue("numOfChoices");
   }
   set numOfChoices(val) {
      this.setPropertyValue("numOfChoices", val);
   }

   get categoryNames() {
      return this.getPropertyValue("categoryNames");
   }
   set categoryNames(val) {
      this.setPropertyValue("categoryNames", val);
   }

   get subspaceId() {
      return this.getPropertyValue("subspaceId");
   }
   set subspaceId(val) {
      this.setPropertyValue("subspaceId", val);
   }
}

export function registerImageSliderLikert() {
   ElementFactory.Instance.registerElement(
      IMAGE_SLIDER_LIKERT_COMPONENT,
      (name) => {
         return new QuestionImageSliderLikertModel(name);
      }
   );
}

Serializer.addClass(
   IMAGE_SLIDER_LIKERT_COMPONENT,
   [{
      name: "sliderPosition",
      category: "general"
   }, {
      name: "sourceImages",
      category: "general"
   }, {
      name: "sliderAttribute",
      category: "general"
   }, {
      name: "likertQuestionText",
      category: "general"
   }, {
      name: "numOfChoices",
      category: "general"
   }, {
      name: "categoryNames",
      category: "general"
   }, {
      name: "subspaceId",
      category: "general"
   }],
   () => {
      return new QuestionImageSliderLikertModel("");
   },
   "question"
);

export class SurveyQuestionImageSliderLikert extends SurveyQuestionElementBase {
   constructor(props) {
      super(props);
      
      // initialize the value
      this.question.value = {
         "likert_value": null,
         "subspace_id": this.question.subspaceId
      }

      this.state = {
         value: this.question.value
      };
   }

   get question() {
      return this.questionBase;
   }
   get value() {
      return this.question.value;
   }
   get sliderPosition() {
      return this.question.sliderPosition;
   }
   get sourceImages() {
      return this.question.sourceImages;
   }
   get sliderAttribute() {
      return this.question.sliderAttribute;
   }
   get likertQuestionText() {
      return this.question.likertQuestionText;
   }
   get numOfChoices() {
      return this.question.numOfChoices;
   }
   get categoryNames() {
      return this.question.categoryNames;
   }
   get subspaceId() {
      return this.question.subspaceId;
   }

   renderImageSliderLikert(sliderPosition, sourceImages, sliderAttribute, likertQuestionText, numOfChoices, categoryNames) {
      const handleSliderPositionChange = (event, newPosition) => {
         this.question.sliderPosition = newPosition;
      }
      
      // image slider logic
      // const imgID = (sliderPosition / 100) * (sourceImages.length - 1);
      // const imgURL_0 = sourceImages[Math.floor(imgID)];
      // const imgURL_1 = sourceImages[Math.ceil(imgID)];
      // const interpolationFac = imgID - Math.floor(imgID);

      const imgID = (sliderPosition / 100) * (sourceImages.length - 1);
      const imgURL_0 = sourceImages[Math.round(imgID)];

      // likert scale logic
      const handleSelect = (id) => {
         this.question.value = {
            "likert_value": Number(id),
            "subspace_id": this.question.subspaceId,
         };
      }

      const likert_element = (id) => { 
         return (
            <LikertScaleButton id={id} onClick={handleSelect} isSelected={id === this.question.value.likert_value} />
         );
      };
      const likert_buttons = [];
      for (let i = 1; i <= numOfChoices; i++) {
         likert_buttons.push(likert_element(i));
      }

      const imgStyle = {
         position: "absolute",
         top: 0,
         left: 0,
         width: "100%",
         height: "100%",
         objectFit: "cover",
         borderRadius: "8px"
      }

      const likertCategoryStyle = {
         width: "15%",
         whiteSpace: "normal",
         overflowWrap: "break-word",
         fontWeight: "bold"
      }

      const mobileStyles = `
         @media (max-width: 768px) {
            .image-slider-likert-container {
               flex-direction: column !important;
               gap: 15px !important;
            }
            .image-slider-likert-category {
               width: 100% !important;
               text-align: center !important;
               font-weight: bold !important;
            }
            .image-slider-likert-buttons {
               flex-direction: column !important;
               align-items: center !important;
               gap: 8px !important;
            }
         }
      `;
      
      return (
         <div>
            <style>{mobileStyles}</style>
            <div style={{
               display: "flex",
               flexDirection: "column",
               alignItems: "center",
               justifyContent: "center",
               marginBottom: "20px"
            }}>
               <div style={{
                  position: "relative",
                  width: "300px",
                  height: "300px",
                  marginBottom: "20px"
               }}>
                  <div style={{
                     ...imgStyle,
                     backgroundColor: "#fff"
                  }}></div>
                  <CustomImage path={imgURL_0} width={"300px"} />
                  {/* <img
                     src={`${process.env.PUBLIC_URL}/${imgURL_0}`}
                     style={{
                        ...imgStyle,
                        //opacity: (1 - interpolationFac),
                     }}
                     alt="subspace-attribute-0"
                  /> */}
                  {/* <img
                     src={`${process.env.PUBLIC_URL}/${imgURL_1}`}
                     style={{
                        ...imgStyle,
                        opacity: interpolationFac,
                        mixBlendMode: "normal"
                     }}
                     alt="subspace-attribute-1"
                  /> */}
               </div>
               <div style={{ 
                  width: "80%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start"
               }}>
                  <div style={{
                     color: "#000",
                     fontSize: "small",
                     fontWeight: "600",
                     marginBottom: "10px"
                  }}>
                     {sliderAttribute}:
                  </div>
                  <Slider
                     value={sliderPosition}
                     onChange={handleSliderPositionChange}
                     sx={{
                        color: "#19b394"
                     }}
                  />
               </div>
            </div>
            <div>
               <div style={{
                  color: "#000",
                  fontSize: "medium",
                  fontWeight: "600",
                  textWrap: "wrap",
                  marginBottom: "16px"
               }}>
                  {likertQuestionText}
               </div>
               <div 
                  className="image-slider-likert-container"
                  style={{
                     display: "flex",
                     justifyContent: "space-between",
                     alignItems: "center",
                     color: "#000",
                     fontSize: "small"
                  }}
               >
                  <div className="image-slider-likert-category" style={likertCategoryStyle}>
                     {categoryNames[0]}
                  </div>
                  <div className="image-slider-likert-buttons" style={{ display: "flex" }}>
                     {likert_buttons}
                  </div>
                  <div className="image-slider-likert-category" style={likertCategoryStyle}>
                     {categoryNames[1]}
                  </div>
               </div>
            </div>
         </div>
      )
   }

   renderElement() {
      return (
         <div>
            {this.renderImageSliderLikert(
               this.sliderPosition,
               this.sourceImages,
               this.sliderAttribute,
               this.likertQuestionText,
               this.numOfChoices,
               this.categoryNames
            )}
         </div>
      )
   }
}

ReactQuestionFactory.Instance.registerQuestion(
   IMAGE_SLIDER_LIKERT_COMPONENT,
   (props) => {
      return createElement(SurveyQuestionImageSliderLikert, props);
   }
)
