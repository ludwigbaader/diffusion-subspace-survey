import { ElementFactory, Question, Serializer } from "survey-core";
import { ReactQuestionFactory, SurveyQuestionElementBase } from "survey-react-ui";
import { GridSelector2D } from "./GridSelector2D";
import { createElement } from "react";

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

   // axisLabels: stores the labels for the two axis (two labels per axis)
   get axisLabels() {
      return this.getPropertyValue("axisLabels");
   }
   set axisLabels(val) {
      this.setPropertyValue("axisLabels", val);
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
      name: "axisLabels",
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
   get axisLabels() {
      return this.question.axisLabels;
   }

   renderImagePositioner(position, image, axisLabels) {
      const handlePositionChange = (newPosition) => {
         this.question.value = newPosition;
         this.question.position = newPosition;
      };

      return (
         <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
               <div>
                  <GridSelector2D
                     position={position}
                     onChange={handlePositionChange}
                     axisLabels={axisLabels}
                     size={[250, 250]}
                  />
               </div>
               <div>
                  <img
                     src={`${process.env.PUBLIC_URL}/${image}`}
                     alt="reference"
                     style={{
                        width: "200px",
                        borderRadius: "8px"
                     }}
                  />
               </div>
            </div>
         </div>
      )
   }

   renderElement() {
      return (
         <div>
            {this.renderImagePositioner(this.position, this.image, this.axisLabels)}
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
