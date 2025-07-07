import { createElement } from "react";
import { ElementFactory, Question, Serializer } from "survey-core";
import { ReactQuestionFactory, SurveyQuestionElementBase } from "survey-react-ui";
import { LikertScaleButton } from "./LikertScaleButton";

const LIKERT_SCALE_COMPONENT = "likert-scale";

export class QuestionLikertScaleModel extends Question {
   getType() {
      return LIKERT_SCALE_COMPONENT;
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
}

export function registerLikertScale() {
   ElementFactory.Instance.registerElement(
      LIKERT_SCALE_COMPONENT,
      (name) => {
         return new QuestionLikertScaleModel(name);
      }
   );
}

Serializer.addClass(
   LIKERT_SCALE_COMPONENT,
   [{
      name: "numOfChoices",
      category: "general"
   }, {
      name: "categoryNames",
      category: "general"
   }],
   () => {
      return new QuestionLikertScaleModel("");
   },
   "question"
);

export class SurveyQuestionLikertScale extends SurveyQuestionElementBase {
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
   get numOfChoices() {
      return this.question.numOfChoices;
   }
   get categoryNames() {
      return this.question.categoryNames;
   }

   renderElement() {
      const handleSelect = (id) => {
         this.question.value = Number(id);
         console.log("Updated the question value: " + id);
      }

      const likert_element = (id) => { 
         return (
            <LikertScaleButton id={id} onClick={handleSelect} isSelected={id == this.question.value} />
         );
      };
      const likert_buttons = [];
      for (let i = 1; i <= this.numOfChoices; i++) {
         likert_buttons.push(likert_element(i));
      }

      const categoryStyle = {
         width: "15%",
         whiteSpace: "normal",
         overflowWrap: "break-word"
      }

      return (
         <div style={{ 
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#000",
            fontSize: "small"
         }}>
            <div style={categoryStyle}>
               {this.categoryNames[0]}
            </div>
            <div style={{ display: "flex" }}>
               {likert_buttons}
            </div>
            <div style={categoryStyle}>
               {this.categoryNames[1]}
            </div>
         </div>
      );
   }
}

ReactQuestionFactory.Instance.registerQuestion(
   LIKERT_SCALE_COMPONENT,
   (props) => {
      return createElement(SurveyQuestionLikertScale, props);
   }
);
