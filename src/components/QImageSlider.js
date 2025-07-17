import { ElementFactory, Question, Serializer } from "survey-core";
import { ReactQuestionFactory, SurveyQuestionElementBase } from "survey-react-ui";
import { Slider } from "@mui/material";
import { createElement } from "react";

const IMAGE_SLIDER_COMPONENT = "image-slider";

export class QuestionImageSliderModel extends Question {
   getType() {
      return IMAGE_SLIDER_COMPONENT;
   }

   // sliderPosition: stores the position of the slider (0 - 1)
   get sliderPosition() {
      return this.getPropertyValue("sliderPosition");
   }
   set sliderPosition(val) {
      this.setPropertyValue("sliderPosition", val);
   }

   // sourceImages: stores the reference to the image sequence/gif that is displayed
   get sourceImages() {
      return this.getPropertyValue("sourceImages");
   }
   set sourceImages(val) {
      this.setPropertyValue("sourceImages", val);
   }
}

export function registerImageSlider() {
   ElementFactory.Instance.registerElement(
      IMAGE_SLIDER_COMPONENT,
      (name) => {
         return new QuestionImageSliderModel(name);
      }
   );
}

Serializer.addClass(
   IMAGE_SLIDER_COMPONENT,
   [{
      name: "sliderPosition",
      category: "general"
   }, {
      name: "sourceImages",
      category: "general"
   }],
   () => {
      return new QuestionImageSliderModel("");
   },
   "question"
);

export class SurveyQuestionImageSlider extends SurveyQuestionElementBase {
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
   get sliderPosition() {
      return this.question.sliderPosition;
   }
   get sourceImages() {
      return this.question.sourceImages;
   }

   renderImageSlider(sliderPosition, sourceImages) {
      const handleSliderPositionChange = (event, newPosition) => {
         this.question.value = newPosition / 100;
         this.question.sliderPosition = newPosition;
      };

      // figure out which image to display
      const img_id = (sliderPosition / 100) * (sourceImages.length - 1);
      const img_url_0 = sourceImages[Math.floor(img_id)];
      const img_url_1 = sourceImages[Math.ceil(img_id)];
      const interpolation_fac = img_id - Math.floor(img_id);

      const img_style = {
         position: "absolute",
         top: 0,
         left: 0,
         width: "100%",
         height: "100%",
         objectFit: "cover",
         borderRadius: "8px"
      }

      return (
         <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",
            justifyContent: "center"
         }}>
            <div style={{ 
               position: "relative", 
               width: "200px", 
               height: "200px",
               marginBottom: "20px",
               backgroundColor: "#fff" // White background instead of black
            }}>
               <img 
                  src={`${process.env.PUBLIC_URL}/${img_url_0}`} 
                  style={{
                     ...img_style,
                     opacity: (1 - interpolation_fac),
                  }} 
                  alt="subspace-attribute-0" 
               />
               <img 
                  src={`${process.env.PUBLIC_URL}/${img_url_1}`} 
                  style={{ 
                     ...img_style,
                     opacity: interpolation_fac,
                     mixBlendMode: "normal"
                  }} 
                  alt="subspace-attribute-1" 
               />
            </div>
            <div style={{ width: "80%" }}>
               <Slider 
                  value={sliderPosition}
                  onChange={handleSliderPositionChange}
                  sx={{
                     color: "#19b394"
                  }}
               />
            </div>
         </div>
      )
   }

   renderElement() {
      return (
         <div>
            {this.renderImageSlider(this.sliderPosition, this.sourceImages)}
         </div>
      )
   }
}

ReactQuestionFactory.Instance.registerQuestion(
   IMAGE_SLIDER_COMPONENT,
   (props) => {
      return createElement(SurveyQuestionImageSlider, props);
   }
);
