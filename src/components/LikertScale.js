import { createElement } from "react";
import { ElementFactory, Question, Serializer } from "survey-core";
import { ReactQuestionFactory, SurveyQuestionElementBase } from "survey-react-ui";

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
      return (
         <div></div>
      );
   }
}

ReactQuestionFactory.Instance.registerQuestion(
   LIKERT_SCALE_COMPONENT,
   (props) => {
      return createElement(SurveyQuestionLikertScale, props);
   }
);
