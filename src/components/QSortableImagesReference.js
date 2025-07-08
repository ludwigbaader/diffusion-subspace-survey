import { ElementFactory, Question, Serializer } from "survey-core";
import { ReactQuestionFactory, SurveyQuestionElementBase } from "survey-react-ui";
import { SortableImageList } from "./SortableImageList";
import { createElement } from "react";
import { CustomImage } from "./CustomImage";

const SORTABLE_IMAGES_REFERENCE_COMPONENT = "sortable-images-reference";

export class QuestionSortableImagesReferenceModel extends Question {
   getType() {
      return SORTABLE_IMAGES_REFERENCE_COMPONENT;
   }

   // the images to sort, path and id
   get images() {
      return this.getPropertyValue("images");
   }
   set images(val) {
      this.setPropertyValue("images", val);
   }

   // the reference image, just a path
   get referenceImage() {
      return this.getPropertyValue("referenceImage");
   }
   set referenceImage(val) {
      this.setPropertyValue("referenceImage", val);
   }

   // the attribute in question, a text
   get attribute() {
      return this.getPropertyValue("attribute");
   }
   set attribute(val) {
      this.setPropertyValue("attribute", val);
   }
}

export function registerSortableImagesReference() {
   ElementFactory.Instance.registerElement(
      SORTABLE_IMAGES_REFERENCE_COMPONENT,
      (name) => {
         return new QuestionSortableImagesReferenceModel(name);
      }
   );
}

Serializer.addClass(
   SORTABLE_IMAGES_REFERENCE_COMPONENT,
   [{
      name: "images",
      category: "general"
   }, {
      name: "referenceImage",
      category: "general"
   }, {
      name: "attribute",
      category: "general"
   }],
   function () {
      return new QuestionSortableImagesReferenceModel("");
   },
   "question"
);

export class SurveyQuestionSortableImagesReference extends SurveyQuestionElementBase {
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
   get images() {
      return this.question.images;
   }
   get referenceImage() {
      return this.question.referenceImage;
   }
   get attribute() {
      return this.question.attribute;
   }

   renderSortableImagesReference(images, referenceImage, attribute) {
      const handleImageOrderChange = (newOrder) => {
         this.question.value = newOrder;
      }

      const headingStyle = {
         color: "#000",
         fontSize: "small",
         fontWeight: "bold",
         marginBottom: "16px",
         maxWidth: "200px",
         textWrap: "wrap",
         textAlign: "left"
      }

      return (
         <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{
               display: "flex",
               position: "relative",
               justifyContent: "space-evenly",
               width: "100%"
            }}>
               <div style={{
                  display: "flex",
                  flexDirection: "column",
               }}>
                  <div style={headingStyle}>
                     Images emphasizing the attribute "{attribute}":
                  </div>
                  <div>
                     <SortableImageList
                        images={images}
                        onChange={handleImageOrderChange}
                     />
                  </div>
               </div>
               <div>
                  <div style={headingStyle}>
                     <br/>Reference Image:
                  </div>
                  <CustomImage path={referenceImage} width={"170px"} />
               </div>
            </div>
         </div>
      )
   }

   renderElement() {
      return (
         <div style={this.style}>
            {this.renderSortableImagesReference(this.images, this.referenceImage, this.attribute)}
         </div>
      )
   }
}

ReactQuestionFactory.Instance.registerQuestion(
   SORTABLE_IMAGES_REFERENCE_COMPONENT,
   (props) => {
      return createElement(SurveyQuestionSortableImagesReference, props);
   }
);
