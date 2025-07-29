import { ElementFactory, Question, Serializer } from "survey-core";
import { ReactQuestionFactory, SurveyQuestionElementBase } from "survey-react-ui";
import { GridSelector2D } from "./GridSelector2D";
import { createElement } from "react";
import { CustomImage } from "./CustomImage";

const IMAGE_POSITIONER_COMPONENT = "image-positioner";

export class QuestionImagePositionerModel extends Question {
   getType() {
      return IMAGE_POSITIONER_COMPONENT;
   }

   // position: stores the selected 2d position
   get position() {
      return this.getPropertyValue("position");
   }
   set position(val) {
      this.setPropertyValue("position", val);
   }

   // image: stores the url to the image
   get image() {
      return this.getPropertyValue("image");
   }
   set image(val) {
      this.setPropertyValue("image", val);
   }

   // referenceImage: stores the url to the reference image
   get referenceImage() {
      return this.getPropertyValue("referenceImage");
   }
   set referenceImage(val) {
      this.setPropertyValue("referenceImage", val);
   }

   // axisLabels: stores the labels for the two axis (two labels per axis)
   get axisLabels() {
      return this.getPropertyValue("axisLabels");
   }
   set axisLabels(val) {
      this.setPropertyValue("axisLabels", val);
   }

   // subspaceID: stores which subspace the images are pulled from - for easier data evaluation down the road
   get subspaceId() {
      return this.getPropertyValue("subspaceId");
   }
   set subspaceId(val) {
      this.setPropertyValue("subspaceId", val);
   }
}

export function registerImagePositioner() {
   ElementFactory.Instance.registerElement(
      IMAGE_POSITIONER_COMPONENT,
      (name) => {
         return new QuestionImagePositionerModel(name);
      }
   )
}

Serializer.addClass(
   IMAGE_POSITIONER_COMPONENT,
   [{
      name: "position",
      category: "general"
   }, {
      name: "image",
      category: "general"
   }, {
      name: "referenceImage",
      category: "general"
   }, {
      name: "axisLabels",
      category: "general"
   }, {
      name: "subspaceId",
      category: "general"
   }],
   () => {
      return new QuestionImagePositionerModel("");
   },
   "question"
);

export class SurveyQuestionImagePositioner extends SurveyQuestionElementBase {
   constructor(props) {
      super(props);

      // initialize value
      this.question.value = [null, this.question.subspaceId];

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
   get position() {
      return this.question.position;
   }
   get image() {
      return this.question.image;
   }
   get referenceImage() {
      return this.question.referenceImage;
   }
   get axisLabels() {
      return this.question.axisLabels;
   }
   get subspaceId() {
      return this.question.subspaceId;
   }

   renderImagePositioner(position, image, referenceImage, axisLabels) {
      const handlePositionChange = (newPosition) => {
         this.question.value = [newPosition, this.question.subspaceId];
         this.question.position = newPosition;
      };

      const textStyle = {
         color: "#8c8c8c",
         fontSize: "small",
         fontWeight: "600",
         textWrap: "wrap",
         textAlign: "left",
         marginBottom: "7px",
      }

      const mobileStyles = `
         @media (max-width: 768px) {
            .image-positioner-container {
               flex-direction: column !important;
               gap: 20px !important;
            }
            .image-positioner-images {
               align-items: center !important;
            }
            .image-positioner-images > div {
               text-align: center !important;
            }
         }
      `;

      return (
         <div>
            <style>{mobileStyles}</style>
            <div 
               className="image-positioner-container"
               style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            >
               <div>
                  <GridSelector2D
                     position={position}
                     onChange={handlePositionChange}
                     axisLabels={axisLabels}
                     size={[250, 250]}
                  />
               </div>
               <div 
                  className="image-positioner-images"
                  style={{
                     display: "flex",
                     flexDirection: "column"
                  }}
               >
                  <div style={{ marginBottom: "10px" }}>
                     <div style={textStyle}>Reference image</div>
                     <CustomImage
                        path={referenceImage}
                        width={"170px"}
                     />
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                     <div style={textStyle}>Subject image</div>
                     <CustomImage
                        path={image}
                        width={"170px"}
                     />
                  </div>
               </div>
            </div>
         </div>
      )
   }

   renderElement() {
      return (
         <div>
            {this.renderImagePositioner(this.position, this.image, this.referenceImage, this.axisLabels)}
         </div>
      )
   }
}

ReactQuestionFactory.Instance.registerQuestion(
   IMAGE_POSITIONER_COMPONENT,
   (props) => {
      return createElement(SurveyQuestionImagePositioner, props);
   }
);
