import { createElement } from "react";
import { Question, ElementFactory, Serializer, createPopupViewModel } from "survey-core";
import { SurveyQuestionElementBase, ReactQuestionFactory } from "survey-react-ui";
import { ImageSorter } from "./ImageSorter";

// Custom question type SortableImages
// shows a list of images the user can rearrange to change their order

const CUSTOM_TYPE = "sortable-images";

export class QuestionSortableImagesModel extends Question {
   getType() {
      return CUSTOM_TYPE;
   }
   
   // define custom attributes this question supports

   // choices: a list of image URLs, the order determines the user's decision
   get choices() {
      return this.getPropertyValue("choices");
   }
   set choices(val) {
      this.setPropertyValue("choices", val);
   }

   // attribute: defines the axis labels for sorting (start and end values)
   get attribute() {
      return this.getPropertyValue("attribute");
   }
   set attribute(val) {
      this.setPropertyValue("attribute", val);
   }
}

export function registerSortableImages() {
   ElementFactory.Instance.registerElement(
      CUSTOM_TYPE,
      (name) => {
         return new QuestionSortableImagesModel(name);
      }
   );
}

Serializer.addClass(
   CUSTOM_TYPE,
   [{
      name: "choices",
      category: "general",
      visibleIndex: 2
   }, {
      name: "attribute",
      category: "general",
      visibleIndex: 3
   }],
   function () {
      return new QuestionSortableImagesModel("");
   },
   "question"
);

export class SurveyQuestionSortableImages extends SurveyQuestionElementBase {
   constructor(props) {
      super(props);
      this.state = { value: this.question.value };
   }

   get question() {
      return this.questionBase;
   }
   get value() {
      return this.question.value;
   }
   get choices() {
      return this.question.choices;
   }
   get attribute() {
      return this.question.attribute;
   }

   renderSortbaleImages(choices, attribute) {
      const image_urls = [];
      choices.forEach(elem => {
         image_urls.push(elem.url);
      });

      const axisStyle = {
         display: "flex",
         flexDirection: "column",
         justifyContent: "space-between",
         alignItems: "center",
         alignSelf: "stretch",
         width: "60px",
         padding: "0 10px",
         marginRight: "20px",
         borderRight: "2px solid #ddd",
         fontSize: "14px",
         fontWeight: "bold",
         color: "#555"
      };

      const axisLabelStyle = {
         writingMode: "vertical-rl",
         textOrientation: "mixed",
         textAlign: "center",
         padding: "5px"
      };
      
      return (
         <div style={{ display: "flex", alignItems: "stretch" }}>
            {attribute && (
               <div style={axisStyle}>
                  <div style={axisLabelStyle}>{attribute.start}</div>
                  <div style={{ ...axisLabelStyle, transform: "rotate(180deg)" }}>{attribute.end}</div>
               </div>
            )}
            <div style={{ flex: 1 }}>
               <ImageSorter 
                  images={choices} 
                  onChange={(order) => console.log("New order:", order)}
               />
            </div>
         </div>
      )
   }

   renderElement() {
      return (
         <div style={this.style}>
            {this.renderSortbaleImages(this.choices, this.attribute)}
         </div>
      )
   }
}

ReactQuestionFactory.Instance.registerQuestion(CUSTOM_TYPE, (props) => {
   return createElement(SurveyQuestionSortableImages, props);
});
