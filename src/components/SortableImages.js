import { createElement } from "react";
import { Question, ElementFactory, Serializer } from "survey-core";
import { SurveyQuestionElementBase, ReactQuestionFactory } from "survey-react-ui";
import { SortableImageList } from "./SortableImageList";

// Custom question type SortableImages
// shows a list of images the user can rearrange to change their order

const SORTABLE_IMAGE_COMPONENT = "sortable-images";

export class QuestionSortableImagesModel extends Question {
   getType() {
      return SORTABLE_IMAGE_COMPONENT;
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
      SORTABLE_IMAGE_COMPONENT,
      (name) => {
         return new QuestionSortableImagesModel(name);
      }
   );
}

Serializer.addClass(
   SORTABLE_IMAGE_COMPONENT,
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

      const handleImageOrderChange = (newOrder) => {
         // Update the question's value with the new order
         this.question.value = newOrder;
      };

      const axisStyle = {
         display: "flex",
         flexDirection: "column",
         justifyContent: "space-between",
         alignItems: "end",
         alignSelf: "stretch",
         // width: "60px",
         height: "100%",
         padding: "0 10px",
         //marginLeft: "50px",
         //borderLeft: "2px solid #ddd",
         fontSize: "14px",
         fontWeight: "bold",
         color: "#555",
      };

      const axisLabelStyle = {
         writingMode: "vertical-rl",
         textOrientation: "mixed",
         textAlign: "left",
         padding: "10px",
         transform: "rotate(180deg)"
      };
      
      return (
         <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ display: "flex", position: "relative" }}>
               <div style={{ position: "absolute", height: "100%", left: "-60px" }}>
                  {attribute && (
                     <div style={axisStyle}>
                        <div style={axisLabelStyle}>{attribute.start}</div>
                        <div style={axisLabelStyle}>{attribute.end}</div>
                     </div>
                  )}
               </div>
               <div>
                  <SortableImageList
                     images={choices}
                     onChange={handleImageOrderChange}
                  />
               </div>
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

ReactQuestionFactory.Instance.registerQuestion(
   SORTABLE_IMAGE_COMPONENT, 
   (props) => {
      return createElement(SurveyQuestionSortableImages, props);
   }
);
