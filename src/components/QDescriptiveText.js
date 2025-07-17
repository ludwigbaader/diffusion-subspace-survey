import { createElement } from "react";
import { ElementFactory, QuestionNonValue, Serializer }  from "survey-core";
import { ReactQuestionFactory, SurveyElementBase, SurveyQuestionElementBase } from "survey-react-ui";

const DESC_TEXT_COMPONENT = "descriptive-text"

export class QuestionDescriptiveTextModel extends QuestionNonValue {
   constructor() {
      super();
   }

   getType() {
      return DESC_TEXT_COMPONENT;
   }

   // textSize: self explanatory
   get textSize() {
      return this.getPropertyValue("textSize");
   }
   set textSize(val) {
      this.setPropertyValue("textSize", val);
   }

   get heading() {
      return this.getPropertyValue("heading");
   }
   set heading(val) {
      this.setPropertyValue("heading", val);
   }

   // caption: the actual contents of the text field
   get caption() {
      return this.getPropertyValue("caption");
   }
   set caption(val) {
      this.setPropertyValue("caption", val);
   }
}

export function registerDescriptiveText() {
   ElementFactory.Instance.registerElement(
      DESC_TEXT_COMPONENT,
      (name) => {
         return new QuestionDescriptiveTextModel(name);
      }
   )
}

Serializer.addClass(
   DESC_TEXT_COMPONENT,
   [{
      name: "heading",
      category: "general"
   }, {
      name: "caption",
      category: "general"
   }, {
      name: "textSize",
      category: "general",
      default: "medium",
      choices: [
         { value: "small", text: "Small" },
         { value: "medium", text: "Medium" },
         { value: "large", text: "Large" },
      ]
   }],
   () => {
      return new QuestionDescriptiveTextModel("");
   },
   "question"
);

export class SurveyQuestionDescriptiveText extends SurveyQuestionElementBase {
   get question() {
      return this.questionBase;
   }
   renderElement() {
      const textSize = this.question.textSize || "medium";
      
      return (
         <div style={{ color: "#000" }}>
            <div style={{ 
               fontSize: "large",
               fontWeight: "bold",
               marginBottom: "15px",
               textAlign: "left"
            }}>{this.question.heading}</div>
            {this.question.caption.map((text, index) => (
               <div style={{
                  fontSize: textSize,
                  textAlign: "left",
                  lineHeight: 1.6,
                  textWrap: "wrap",
                  marginBottom: "15px"
               }}>{text}</div>
            ))}
         </div>
      );
   }
}

ReactQuestionFactory.Instance.registerQuestion(
   DESC_TEXT_COMPONENT,
   (props) => {
      return createElement(SurveyQuestionDescriptiveText, props);
   }
)
