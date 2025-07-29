import { createElement } from "react";
import { Question, ElementFactory, Serializer } from "survey-core";
import { SurveyQuestionElementBase, ReactQuestionFactory } from "survey-react-ui";
import { SortableImageList } from "./SortableImageList";

// Custom question type SortableImages
// shows a list of images the user can rearrange to change their order

const SORTABLE_IMAGES_COMPONENT = "sortable-images";

export class QuestionSortableImagesModel extends Question {
   getType() {
      return SORTABLE_IMAGES_COMPONENT;
   }
   
   // define custom attributes this question supports

   // choices: a list of image URLs, the order determines the user's decision
   get images() {
      return this.getPropertyValue("images");
   }
   set images(val) {
      this.setPropertyValue("images", val);
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
      SORTABLE_IMAGES_COMPONENT,
      (name) => {
         return new QuestionSortableImagesModel(name);
      }
   );
}

Serializer.addClass(
   SORTABLE_IMAGES_COMPONENT,
   [{
      name: "images",
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

      const image_ids = [];
      this.images.forEach(img => {
         const url_split = img.url.split("/");
         image_ids.push(url_split[url_split.length - 1]);
      });
      this.question.value = [image_ids, null];

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
   get attribute() {
      return this.question.attribute;
   }

   renderSortbaleImages(images, attribute) {
      const image_urls = [];
      images.forEach(elem => {
         image_urls.push(elem.url);
      });

      const handleImageOrderChange = (newOrder) => {
         // Update the question's value with the new order
         const image_ids = [];
         images.forEach(img => {
            const url_split = img.url.split("/");
            image_ids.push(url_split[url_split.length - 1]);
         });
         this.question.value = [image_ids, newOrder];
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
         <div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
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
                        images={images}
                        onChange={handleImageOrderChange}
                     />
                  </div>
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
            {this.renderSortbaleImages(this.images, this.attribute)}
         </div>
      )
   }
}

ReactQuestionFactory.Instance.registerQuestion(
   SORTABLE_IMAGES_COMPONENT, 
   (props) => {
      return createElement(SurveyQuestionSortableImages, props);
   }
);
