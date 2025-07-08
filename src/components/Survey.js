import 'survey-core/survey-core.css';
import { Model, Survey } from 'survey-react-ui';
import { DefaultLight, DefaultLightPanelless } from "survey-core/themes";
import { useCallback } from 'react';
import { registerSortableImages } from './QSortableImages';
import { registerImageSlider } from './QImageSlider';
import { registerImagePositioner } from './QImagePositioner';
import { registerDescriptiveText } from './QDescriptiveText';
import { registerLikertScale } from './QLikertScale';
import { registerSortableImagesReference } from './QSortableImagesReference';
import { registerImageSliderLikert } from './QImageSliderLikert';


// register custom question components
registerSortableImages();
registerSortableImagesReference();
registerImageSlider();
registerImageSliderLikert();
registerImagePositioner();
registerDescriptiveText();
registerLikertScale();


// json definition of the survey
const surveyJson = {
   title: "Subspaces for AI Image Generation Models",
   pages: [{
      name: "Introduction",
      title: "Controllability of AI Image Generation",
      elements: [{
         type: "descriptive-text",
         name: "IntroductionText",
         textSize: "large",
         heading: "Welcome to this survey!",
         caption: "test schmest"
      }, {
         type: "boolean",
         name: "AcceptParticipation",
         title: "I accept that my data will be used for scientific purposes"
      }]
   }, {
      name: "DemographicData",
      title: "Demographic Data",
      elements: [{
         type: "dropdown",
         name: "Age",
         title: "Select your age:",
         choices: ["15 or younger", "16-19", "20-24", "25-29", "30-34", "35-39", "40-44", "45-49", "50-54", "55-59", "60-64", "65 or older"]
      }, {
         type: "dropdown",
         name: "Gender",
         title: "Select your gender:",
         choices: ["Female", "Male", "Non-binary", "Prefer not to say"]
      }, {
         type: "dropdown",
         name: "Education",
         title: "Select your highest degree of education",
         description: "Completed or currently striving for",
         choices: ["Less than high school degree", "High school degree or equivalent", "Bachelor degree", "Graduate degree (Masters, PhD, M.D)"]
      }, {
         type: "likert-scale",
         name: "AiFamiliarity",
         title: "How familiar are you with AI image generation tools?",
         numOfChoices: 7,
         categoryNames: [
            "Never used before",
            "Very familiar"
         ]
      }, {
         type: "likert-scale",
         name: "ArtisticTasksExperience",
         title: "How much experience do you have with visual artistic tasks?",
         description: "Visual artistic tasks include working with visual design in a professional or personal context",
         numOfChoices: 7,
         categoryNames: [
            "No experience",
            "Very experienced"
         ]
      }, {
         type: "likert-scale",
         name: "TechincalUnderstanding",
         title: "Do you have a technical understaning of diffusion models for image generation?",
         description: "How much do you know about how the process of generating an image in a diffusion model works?",
         numOfChoices: 7,
         categoryNames: [
            "No understanding",
            "Thorough understanding"
         ]
      }]
   }, {
      name: "Page01",
      title: "Subspaces",
      elements: [{
         type: "sortable-images",
         name: "SortImages",
         title: "Sort the images according to the specified attributes",
         description: "Position images that look more \"photorealistic\" to you at the top and images you consider to be more \"stylized\" at the bottom",
         images: [
            { url: "/img/image_0000.jpg", id: "01" },
            { url: "/img/image_0001.jpg", id: "02" },
            { url: "/img/image_0002.jpg", id: "03" },
            { url: "/img/image_0003.jpg", id: "04" },
            { url: "/img/image_0004.jpg", id: "05" },
         ],
         attribute: {
            start: "photorealistic",
            end: "stylized"
         }
      }, {
         type: "sortable-images-reference",
         name: "SortImagesReference",
         title: "Sort the images by how well you think the attribute \"stylized\" is emphasized in them compared to the reference image",
         description: "Place the image you think emphasizes the attribute the most at the top, the one that emphasizes it the least at the bottom",
         images: [
            { url: "/img/image_0000.jpg", id: "01" },
            { url: "/img/image_0001.jpg", id: "02" },
            { url: "/img/image_0002.jpg", id: "03" },
            { url: "/img/image_0003.jpg", id: "04" },
            { url: "/img/image_0004.jpg", id: "05" },
         ],
         referenceImage: "/img/image_0000.jpg",
         attribute: "stylized"
      }, {
         type: "image-slider-likert",
         name: "ImageSliderLikert01",
         title: "Modify the image with the slider to get a feel for what it does",
         sliderPosition: 0.0,
         sourceImages: [
            "/img/image_0000.jpg",
            "/img/image_0001.jpg",
            "/img/image_0002.jpg",
            "/img/image_0003.jpg",
            "/img/image_0004.jpg",
         ],
         sliderAttribute: "photorealism",
         likertQuestionText: "Describe how the slider affects the image. Does the image change linearly across the range of the slider or does the rate of change vary?",
         numOfChoices: 7,
         categoryNames: [
            "Linear rate of change",
            "Varying rate of change"
         ]
      }, {
         type: "image-slider-likert",
         name: "ImageSliderLikert02",
         title: "Modify the image with the slider to get a feel for what it does",
         sliderPosition: 0.0,
         sourceImages: [
            "/img/image_0000.jpg",
            "/img/image_0001.jpg",
            "/img/image_0002.jpg",
            "/img/image_0003.jpg",
            "/img/image_0004.jpg",
         ],
         sliderAttribute: "photorealism",
         likertQuestionText: "Does the slider change the described attribute in the image?",
         numOfChoices: 7,
         categoryNames: [
            "No",
            "Yes"
         ]
      }, {
         type: "image-positioner",
         name: "ImagePositioner01",
         title: "Select the position you would place the image at in the grid",
         description: "The grid defines a 2-dimensional image space in which the attribute associated with each direction changes in the reference image (which sits at the center of the grid). Select the position at which you think the subject image should be",
         position: [0.5, 0.5],
         image: "/img/image_0004.jpg",
         referenceImage: "/img/image_0000.jpg",
         axisLabels: [
            ["photorealistic", "stylized"],
            ["warm and colorful", "cold and desaturated"]
         ]
      }, {
         type: "likert-scale",
         name: "LikertScale01",
         title: "How much do you agree with the statement blue is the best color?",
         numOfChoices: 7,
         categoryNames: [
            "Not at all",
            "Absolutely agree"
         ]
      }]
   }]
};

export default function SurveyComponent() {
   const survey = new Model(surveyJson);
   survey.applyTheme(DefaultLight);
   // survey.applyTheme(DefaultLightPanelless);
   
   const surveyComplete = useCallback(survey => {
      const userId = "";
      survey.setValue("userId", userId);
      
      saveSurveyResults(
         "https://script.google.com/macros/s/AKfycbwglW6j-GxyEho7xcoy5FTJYTbdsqw1nGOP5qAXuf_wYprUkVfIq985M8zVZ73d_XDF/exec",
         survey.data
      );
   }, []);

   survey.onComplete.add(surveyComplete);

   return <Survey model={survey}/>;
}

function saveSurveyResults(url, json) {
   fetch(url, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify(json),
      mode: 'no-cors' // check if this is necessary or needs to be removed once hosted on github pages
   })
   .then(response => {
      if (response.ok) {
         // handle success
         console.log(response);
      } else {
         // handle error
         console.log(response);
      }
   })
   .catch(error => {
      // handle error
      console.log(error);
   });
}
