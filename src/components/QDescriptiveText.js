import { createElement } from "react";
import { ElementFactory, QuestionNonValue, Serializer }  from "survey-core";
import { ReactQuestionFactory, SurveyElementBase, SurveyQuestionElementBase } from "survey-react-ui";

const DESC_TEXT_COMPONENT = "descriptive-text"

export class QuestionDescriptiveTextModel extends QuestionNonValue {
   constructor() {
      super();
      this.createLocalizableString("caption", this);
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
      return this.getLocalizableStringText("caption");
   }
   set caption(val) {
      this.setLocalizableStringText("caption", val);
   }

   // LocalizationString object for the caption property
   get locCaption() {
      return this.getLocalizableString("caption");
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
      name: "caption:text",
      category: "general",
      serializationProperty: "locCaption"
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
      const locStr = SurveyElementBase.renderLocString(this.question.locCaption);
      
      return (
         <div style={{ color: "#000", fontSize: textSize }}>
            <div style={{ fontWeight: "bold" }}>{this.question.heading}</div>
            <div>{locStr}</div>
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
