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

      // initialize question value
      const image_ids = [];
      this.question.images.forEach(img => {
         const url_split = img.url.split("/");
         image_ids.push(url_split[url_split.length - 1]);
      });
      this.question.value = {
         "image_ids": image_ids,
         "order": null,
      };

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
         const image_ids = [];
         images.forEach(img => {
            const url_split = img.url.split("/");
            image_ids.push(url_split[url_split.length - 1]);
         });
         this.question.value = {
            "image_ids": image_ids,
            "order": newOrder,
         };
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

      const mobileStyles = `
         @media (max-width: 768px) {
            .sortable-images-container {
               flex-direction: column-reverse !important;
               gap: 20px !important;
            }
            .sortable-images-section {
               align-items: center !important;
               text-align: center !important;
            }
            .reference-image-section {
               align-items: center !important;
               text-align: center !important;
               display: flex !important;
               flex-direction: column !important;
            }
            .sortable-images-section .heading-style {
               text-align: center !important;
               max-width: none !important;
            }
            .reference-image-section .heading-style {
               text-align: center !important;
               max-width: none !important;
            }
         }
      `;

      return (
         <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <style>{mobileStyles}</style>
            <div 
               className="sortable-images-container"
               style={{
                  display: "flex",
                  position: "relative",
                  justifyContent: "space-evenly",
                  width: "100%",
                  marginBottom: "20px"
               }}
            >
               <div 
                  className="sortable-images-section"
                  style={{
                     display: "flex",
                     flexDirection: "column",
                  }}
               >
                  <div className="heading-style" style={headingStyle}>
                     Images emphasizing the attribute "{attribute}":
                  </div>
                  <div style={{ position: "relative" }}>
                     <div style={{ position: "absolute", height: "100%", left: "-60px" }}>
                        <div style={axisStyle}>
                           <div style={axisLabelStyle}>emphasizes attribute the most</div>
                           <div style={axisLabelStyle}>emphasizes attribute the least</div>
                        </div>
                     </div>
                     <div>
                        <SortableImageList
                           images={images}
                           onChange={handleImageOrderChange}
                        />
                     </div>
                  </div>
               </div>
               <div className="reference-image-section">
                  <div className="heading-style" style={headingStyle}>
                     <br/>Reference Image:
                  </div>
                  <CustomImage path={referenceImage} width={"170px"} />
               </div>
            </div>
            <div style={{
               display: "flex",
               color: "#999",
               fontSize: "small",
               textWrap: "wrap",
               textAlign: "left",
               marginLeft: "52px",
               marginRight: "52px"
            }}>
               <div>
                  <img src={`${process.env.PUBLIC_URL}/info_icon.svg`} style={{
                     width: "15px",
                     marginRight: "10px",
                     marginTop: "3px",
                     opacity: 0.8
                  }} />
               </div>
               <div>
                  You can use the button that appears when hovering over one of the images to show it in full-screen view
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
